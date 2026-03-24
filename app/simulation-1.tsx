import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useProfile } from "@/components/profile-context";

const NAVY = "#08111F";
const WHITE = "#F8FAFC";
const GREEN = "#7ED6A5";
const MUTED = "#A8B7CC";
const BORDER = "rgba(255,255,255,0.10)";
const PANEL = "rgba(255,255,255,0.05)";

const LAST_BRAND_KEY = "lesson1LastBrand";
const COMPLETED_SIMULATION_KEY = "completedSimulation1";

type Stats = {
  annualIncome: number;
  amountInvestedDollars: number;
  portfolioValueDollars: number;
  cashDollars: number;
  confidence: number;
  stress: number;
};

type Choice = {
  id: string;
  label: string;
  reaction: string;
  explanation: string;
  effects: Partial<Stats>;
};

type SimulationStep = {
  id: string;
  timeLabel: string;
  title: string;
  marketLabel: string;
  marketValue: string;
  body: (brand: string, job: string) => string;
  update: (brand: string) => string;
  choices: Choice[];
};

const STEPS: SimulationStep[] = [
  {
    id: "week-1",
    timeLabel: "Week 1",
    title: "You finally make your first move.",
    marketLabel: "Starting price",
    marketValue: "Quiet week",
    body: (brand, job) =>
      `You are working as a ${job}, getting paid every two weeks, and trying to be smarter with your money. You keep coming back to ${brand} because you know the business, you eat there, and you have followed it for years.`,
    update: (brand) => `${brand} is flat this week. No huge news, just a normal market open.`,
    choices: [
      {
        id: "small-start",
        label: "Invest a small amount so you can start learning without panicking",
        reaction: "is feeling steady",
        explanation: "Small position sizes are often easier to stick with when you are still learning.",
        effects: { cashDollars: -1200, amountInvestedDollars: 1200, portfolioValueDollars: 1200, confidence: 7, stress: -2 },
      },
      {
        id: "all-in",
        label: "Go bigger because you already love the brand",
        reaction: "is running on vibes",
        explanation: "Loving a brand is a start, but it is not the same as sizing risk well.",
        effects: { cashDollars: -2500, amountInvestedDollars: 2500, portfolioValueDollars: 2500, confidence: 4, stress: 12 },
      },
      {
        id: "wait",
        label: "Wait one more week and keep watching",
        reaction: "is being patient",
        explanation: "Patience is not failure. It can be part of building conviction.",
        effects: { confidence: 3, stress: -4 },
      },
    ],
  },
  {
    id: "month-1",
    timeLabel: "Month 1",
    title: "Your paycheck hits and the stock inches up.",
    marketLabel: "1-month move",
    marketValue: "+4.2%",
    body: (brand, job) =>
      `A month passes. You get another paycheck from your ${job}, and ${brand} moves up a little. Nothing dramatic, but enough to make you wonder if you should do more.`,
    update: (brand) => `${brand} rises slowly as sales look solid and investors stay optimistic.`,
    choices: [
      {
        id: "add-small",
        label: "Add a little more from this paycheck",
        reaction: "is building confidence",
        explanation: "Regular smaller additions can feel more manageable than one giant bet.",
        effects: { annualIncome: 1500, cashDollars: -1000, amountInvestedDollars: 1000, portfolioValueDollars: 1000, confidence: 6, stress: 2 },
      },
      {
        id: "hold",
        label: "Hold and learn instead of reacting to every green week",
        reaction: "is staying calm",
        explanation: "Not every small move needs a dramatic response.",
        effects: { annualIncome: 1500, confidence: 5, stress: -3 },
      },
      {
        id: "chase",
        label: "Rush in because you are afraid the stock is getting away from you",
        reaction: "is chasing a little",
        explanation: "FOMO can make even small price moves feel bigger than they are.",
        effects: { annualIncome: 1500, cashDollars: -1800, amountInvestedDollars: 1800, portfolioValueDollars: 1800, confidence: 3, stress: 10 },
      },
    ],
  },
  {
    id: "month-2",
    timeLabel: "Month 2",
    title: "Revenue comes in strong.",
    marketLabel: "Quarterly revenue",
    marketValue: "Beat",
    body: (brand) =>
      `${brand} reports strong sales. The brand still looks popular, stores are busy, and the story sounds good on the surface.`,
    update: (brand) => `${brand} beats revenue expectations, and social media gets excited about the report.`,
    choices: [
      {
        id: "check-business",
        label: "Read past the headline and focus on what is driving the growth",
        reaction: "is thinking like an owner",
        explanation: "Revenue matters most when you understand why it is improving.",
        effects: { confidence: 6, stress: -2 },
      },
      {
        id: "celebrate",
        label: "Assume this means the stock is obviously a great buy now",
        reaction: "is getting overexcited",
        explanation: "Good business news does not automatically mean the stock is cheap.",
        effects: { confidence: 4, stress: 8 },
      },
      {
        id: "ignore-revenue",
        label: "Ignore the report because you only care about price movement",
        reaction: "is missing part of the story",
        explanation: "Price tells you what happened. Revenue helps explain why.",
        effects: { confidence: -3, stress: 5 },
      },
    ],
  },
  {
    id: "month-3",
    timeLabel: "Month 3",
    title: "Profit disappoints even though sales look good.",
    marketLabel: "Profit trend",
    marketValue: "Under pressure",
    body: (brand) =>
      `${brand} sold plenty, but costs jumped. Profit looks weaker than people expected, and the stock starts wobbling.`,
    update: (brand) => `${brand} keeps demand, but rising costs squeeze the quarter.`,
    choices: [
      {
        id: "compare-metrics",
        label: "Compare revenue and profit before doing anything",
        reaction: "is staying analytical",
        explanation: "This is exactly where investors learn that revenue and profit can tell different stories.",
        effects: { confidence: 7, stress: -4 },
      },
      {
        id: "panic-sell",
        label: "Sell because a weak profit quarter must mean the whole thesis is dead",
        reaction: "is spiraling",
        explanation: "One disappointing metric is not always the same as a broken business.",
        effects: { cashDollars: 1000, amountInvestedDollars: -1000, portfolioValueDollars: -1000, confidence: -8, stress: 6 },
      },
      {
        id: "average-down-fast",
        label: "Buy more instantly without checking why profit dropped",
        reaction: "is moving too fast",
        explanation: "Speed is not the same thing as conviction.",
        effects: { cashDollars: -1200, amountInvestedDollars: 1200, portfolioValueDollars: 1200, confidence: 2, stress: 10 },
      },
    ],
  },
  {
    id: "month-4",
    timeLabel: "Month 4",
    title: "The stock becomes a trend online.",
    marketLabel: "Hype meter",
    marketValue: "Loud",
    body: (brand) =>
      `Out of nowhere, ${brand} becomes a social-media stock. Everyone has a take, and every little move suddenly feels huge.`,
    update: (brand) => `${brand} trends hard online and jumps because attention itself becomes fuel.`,
    choices: [
      {
        id: "zoom-out",
        label: "Zoom out and remember hype is not the same as value",
        reaction: "is keeping perspective",
        explanation: "Noise can move prices, but it does not always improve the business.",
        effects: { confidence: 6, stress: -7 },
      },
      {
        id: "join-hype",
        label: "Join the hype because it looks like easy money",
        reaction: "is chasing hype",
        explanation: "When everyone is excited, expectations can get inflated fast.",
        effects: { cashDollars: -1000, amountInvestedDollars: 1000, portfolioValueDollars: 1000, confidence: 4, stress: 14 },
      },
      {
        id: "sell-noise",
        label: "Sell just because the whole thing feels chaotic",
        reaction: "is reacting emotionally",
        explanation: "Chaos can be uncomfortable, but discomfort is not a full thesis either.",
        effects: { cashDollars: 1400, amountInvestedDollars: -1400, portfolioValueDollars: -1400, confidence: -2, stress: 4 },
      },
    ],
  },
  {
    id: "month-6",
    timeLabel: "Month 6",
    title: "Bad news hits the whole fast food industry.",
    marketLabel: "Sector news",
    marketValue: "Shock",
    body: (brand) =>
      `Six months in, a scary headline drops: regulations and supply shocks might hit fast food chains broadly. Investors dump the entire category, including ${brand}.`,
    update: (brand) => `Breaking: analysts warn that fast food traffic and margins could weaken across the sector, and ${brand} sells off with everyone else.`,
    choices: [
      {
        id: "read-sector-news",
        label: "Read the news carefully before reacting",
        reaction: "is keeping a level head",
        explanation: "Sometimes a scary headline matters. Sometimes it is just broad fear hitting everything at once.",
        effects: { confidence: 7, stress: -6 },
      },
      {
        id: "sell-on-fear",
        label: "Dump the stock because the whole industry sounds doomed",
        reaction: "is panic-selling",
        explanation: "Sector fear can be real, but panic is rarely the cleanest decision tool.",
        effects: { cashDollars: 1600, amountInvestedDollars: -1600, portfolioValueDollars: -1600, confidence: -7, stress: 8 },
      },
      {
        id: "buy-with-thesis",
        label: "Add a little only if you still believe the business can handle the pressure",
        reaction: "is acting with conviction",
        explanation: "Buying during fear only makes sense when the reasoning is still intact.",
        effects: { cashDollars: -1000, amountInvestedDollars: 1000, portfolioValueDollars: 1000, confidence: 5, stress: 5 },
      },
    ],
  },
  {
    id: "month-8",
    timeLabel: "Month 8",
    title: "You realize price and business are separate questions.",
    marketLabel: "Valuation",
    marketValue: "Stretched",
    body: (brand) =>
      `The business still looks decent, but the stock price is acting like ${brand} has to be perfect. You realize that loving the company and buying the stock are not automatically the same choice.`,
    update: (brand) => `${brand} still looks like a good business, but plenty of investors worry the stock is priced for perfection.`,
    choices: [
      {
        id: "separate-ideas",
        label: "Treat company quality and stock price as two separate questions",
        reaction: "is seeing the full picture",
        explanation: "That is one of the biggest investing mindset shifts from Lesson 1.",
        effects: { confidence: 8, stress: -6 },
      },
      {
        id: "ignore-price",
        label: "Ignore price because a great company must always be a great investment",
        reaction: "is skipping valuation",
        explanation: "Overpaying can limit future upside even if the business stays solid.",
        effects: { confidence: 2, stress: 10 },
      },
      {
        id: "give-up",
        label: "Give up because investing feels more complicated than you expected",
        reaction: "is getting discouraged",
        explanation: "The complexity is real, but this is also the exact point where process starts helping.",
        effects: { confidence: -6, stress: 4 },
      },
    ],
  },
  {
    id: "month-10",
    timeLabel: "Month 10",
    title: "You start using a checklist instead of vibes.",
    marketLabel: "Your process",
    marketValue: "Getting stronger",
    body: (brand) =>
      `Ten months in, you stop asking “is ${brand} exciting?” and start asking the same three questions every time: is demand healthy, are profits improving, and does the price still make sense?`,
    update: (_brand) => "Your process is starting to matter more than your mood.",
    choices: [
      {
        id: "use-checklist",
        label: "Use the checklist before every move",
        reaction: "is building real conviction",
        explanation: "A repeatable framework beats random confidence almost every time.",
        effects: { confidence: 9, stress: -9 },
      },
      {
        id: "keep-vibes",
        label: "Keep going with gut instinct because it feels faster",
        reaction: "is trusting vibes again",
        explanation: "Fast choices can feel good but are harder to repeat well.",
        effects: { confidence: 1, stress: 8 },
      },
      {
        id: "copy-online",
        label: "Copy whoever sounds smartest online",
        reaction: "is borrowing conviction",
        explanation: "Borrowed conviction usually disappears during the next rough week.",
        effects: { confidence: -4, stress: 9 },
      },
    ],
  },
  {
    id: "year-1",
    timeLabel: "Year 1",
    title: "A year later, what kind of investor are you?",
    marketLabel: "Time horizon",
    marketValue: "One year in",
    body: (brand) =>
      `A full year passes. ${brand} has gone through boring weeks, exciting months, bad headlines, and hype cycles. The biggest change is not the stock. It is how you respond to it.`,
    update: (_brand) => "The market never stopped being noisy. You just got better at reading yourself inside it.",
    choices: [
      {
        id: "patient",
        label: "Stay patient and focus on long-term business progress",
        reaction: "looks locked in",
        explanation: "That is the mindset this first module was trying to build.",
        effects: { confidence: 10, stress: -10 },
      },
      {
        id: "flip",
        label: "Keep jumping in and out on every move",
        reaction: "is exhausted",
        explanation: "Constant reacting makes it hard to tell signal from noise.",
        effects: { confidence: -3, stress: 8 },
      },
      {
        id: "step-back",
        label: "Step back, regroup, and come back with a better process",
        reaction: "is regrouping",
        explanation: "Sometimes the smartest move is pausing until your process catches up.",
        effects: { confidence: 4, stress: -2 },
      },
    ],
  },
];

function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

function clampMoney(value: number) {
  return Math.max(0, value);
}

function applyEffects(stats: Stats, effects: Partial<Stats>): Stats {
  return {
    annualIncome: clampMoney(stats.annualIncome + (effects.annualIncome ?? 0)),
    amountInvestedDollars: clampMoney(
      stats.amountInvestedDollars + (effects.amountInvestedDollars ?? 0)
    ),
    portfolioValueDollars: clampMoney(
      stats.portfolioValueDollars + (effects.portfolioValueDollars ?? 0)
    ),
    cashDollars: clampMoney(stats.cashDollars + (effects.cashDollars ?? 0)),
    confidence: clampStat(stats.confidence + (effects.confidence ?? 0)),
    stress: clampStat(stats.stress + (effects.stress ?? 0)),
  };
}

function getEnding(stats: Stats) {
  if (stats.confidence >= 65 && stats.stress <= 40) {
    return {
      title: "Steady Investor",
      body: "You learned to slow down, think clearly, and treat investing like a process instead of a mood.",
    };
  }

  if (stats.stress >= 70) {
    return {
      title: "Hype Chaser",
      body: "You felt every swing fast and loud. The next step is learning how to pause before the market pulls you around.",
    };
  }

  if (stats.cashDollars >= 7500 && stats.amountInvestedDollars <= 2500) {
    return {
      title: "Careful Observer",
      body: "You protected yourself well, but you still have room to build conviction and act with more clarity.",
    };
  }

  return {
    title: "Thoughtful Analyst",
    body: "You asked better questions over time and started separating business quality from emotion and hype.",
  };
}

function getMood(stats: Stats) {
  if (stats.stress >= 70) return "is feeling overwhelmed";
  if (stats.confidence <= 35) return "is feeling shaken";
  if (stats.confidence >= 70) return "looks more confident";
  return "is figuring it out";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getEffectBadges(effects: Partial<Stats>) {
  const badges: string[] = [];

  if (effects.amountInvestedDollars) {
    badges.push(`${effects.amountInvestedDollars > 0 ? "+" : "-"}Invested`);
  }

  if (effects.portfolioValueDollars) {
    badges.push(`${effects.portfolioValueDollars > 0 ? "+" : "-"}Value`);
  }

  if (effects.cashDollars) {
    badges.push(`${effects.cashDollars > 0 ? "+" : "-"}Cash`);
  }

  if (effects.confidence) {
    badges.push(`${effects.confidence > 0 ? "+" : "-"}Confidence`);
  }

  if (effects.stress) {
    badges.push(`${effects.stress > 0 ? "+" : "-"}Stress`);
  }

  return badges.slice(0, 3);
}

function getSimJob() {
  return "entry-level software engineer";
}

function getMarketTone(value: string) {
  if (value.includes("-")) {
    return {
      accent: "#F87171",
      background: "rgba(248,113,113,0.10)",
      border: "rgba(248,113,113,0.25)",
      label: "Down move",
    };
  }

  if (value.includes("+") || value === "Beat") {
    return {
      accent: GREEN,
      background: "rgba(126,214,165,0.10)",
      border: "rgba(126,214,165,0.25)",
      label: "Up move",
    };
  }

  return {
    accent: "#FACC15",
    background: "rgba(250,204,21,0.10)",
    border: "rgba(250,204,21,0.25)",
    label: "Mixed move",
  };
}

function getSceneTone(step: SimulationStep) {
  const map: Record<string, { accent: string; soft: string; border: string; label: string }> = {
    "week-1": {
      accent: "#7ED6A5",
      soft: "rgba(126,214,165,0.12)",
      border: "rgba(126,214,165,0.28)",
      label: "Calm start",
    },
    "month-1": {
      accent: "#60A5FA",
      soft: "rgba(96,165,250,0.12)",
      border: "rgba(96,165,250,0.28)",
      label: "Momentum",
    },
    "month-2": {
      accent: "#34D399",
      soft: "rgba(52,211,153,0.12)",
      border: "rgba(52,211,153,0.28)",
      label: "Strong report",
    },
    "month-3": {
      accent: "#FB7185",
      soft: "rgba(251,113,133,0.12)",
      border: "rgba(251,113,133,0.28)",
      label: "Profit pressure",
    },
    "month-4": {
      accent: "#F59E0B",
      soft: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.28)",
      label: "Hype cycle",
    },
    "month-6": {
      accent: "#F87171",
      soft: "rgba(248,113,113,0.12)",
      border: "rgba(248,113,113,0.28)",
      label: "Market shock",
    },
    "month-8": {
      accent: "#A78BFA",
      soft: "rgba(167,139,250,0.12)",
      border: "rgba(167,139,250,0.28)",
      label: "Valuation check",
    },
    "month-10": {
      accent: "#22C55E",
      soft: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.28)",
      label: "Process level-up",
    },
    "year-1": {
      accent: "#FACC15",
      soft: "rgba(250,204,21,0.12)",
      border: "rgba(250,204,21,0.28)",
      label: "Final stretch",
    },
  };

  return map[step.id] ?? map["week-1"];
}

function getBrandSymbol(brand: string) {
  const normalized = brand.toLowerCase();

  if (normalized.includes("chipotle")) return "CMG";
  if (normalized.includes("mcd")) return "MCD";
  if (normalized.includes("starbucks")) return "SBUX";
  if (normalized.includes("wendy")) return "WEN";
  if (normalized.includes("yum")) return "YUM";
  if (normalized.includes("shake shack")) return "SHAK";
  if (normalized.includes("domino")) return "DPZ";

  return "FOOD";
}

function getStepMove(step: SimulationStep) {
  const raw = step.marketValue;

  if (raw.includes("+") || raw.includes("-")) {
    return raw;
  }

  switch (step.id) {
    case "week-1":
      return "+0.6%";
    case "month-2":
      return "+5.8%";
    case "month-3":
      return "-4.1%";
    case "month-4":
      return "+7.3%";
    case "month-6":
      return "-9.4%";
    case "month-8":
      return "-1.2%";
    case "month-10":
      return "+2.1%";
    case "year-1":
      return "+12.7%";
    default:
      return "+0.0%";
  }
}

function getQuoteSnapshot(step: SimulationStep, brand: string) {
  const snapshots: Record<string, { price: number; open: number; high: number; low: number; prevClose: number; volume: string }> = {
    "week-1": { price: 61.42, open: 61.08, high: 61.75, low: 60.81, prevClose: 61.05, volume: "1.8M" },
    "month-1": { price: 63.97, open: 63.4, high: 64.28, low: 63.16, prevClose: 61.39, volume: "2.1M" },
    "month-2": { price: 67.68, open: 65.7, high: 68.04, low: 65.44, prevClose: 64.0, volume: "3.4M" },
    "month-3": { price: 64.9, open: 66.82, high: 67.0, low: 64.38, prevClose: 67.68, volume: "4.2M" },
    "month-4": { price: 69.63, open: 67.2, high: 70.05, low: 66.91, prevClose: 64.9, volume: "5.1M" },
    "month-6": { price: 58.47, open: 62.03, high: 62.11, low: 58.02, prevClose: 64.54, volume: "8.6M" },
    "month-8": { price: 57.76, open: 58.5, high: 58.84, low: 57.1, prevClose: 58.46, volume: "2.9M" },
    "month-10": { price: 58.98, open: 58.14, high: 59.22, low: 57.88, prevClose: 57.76, volume: "2.4M" },
    "year-1": { price: 69.5, open: 68.73, high: 70.1, low: 68.11, prevClose: 68.01, volume: "3.2M" },
  };

  const fallback = snapshots["week-1"];
  const current = snapshots[step.id] ?? fallback;
  const symbol = getBrandSymbol(brand);

  return {
    ...current,
    symbol,
    move: getStepMove(step),
    priceLabel: formatMoney(current.price),
    rangeWidthPct:
      current.high === current.low
        ? 50
        : ((current.price - current.low) / (current.high - current.low)) * 100,
  };
}

function getWatchlist(step: SimulationStep, brand: string) {
  const mainSymbol = getBrandSymbol(brand);

  return [
    { symbol: mainSymbol, label: brand, move: getStepMove(step), active: true },
    { symbol: "SPX", label: "S&P 500", move: "+0.5%", active: false },
    { symbol: "IXIC", label: "Nasdaq", move: "+0.8%", active: false },
    { symbol: "DJI", label: "Dow Jones", move: "-0.1%", active: false },
    { symbol: "MCD", label: "McDonald's", move: "-0.8%", active: false },
    { symbol: "SBUX", label: "Starbucks", move: "+1.3%", active: false },
    { symbol: "YUM", label: "Yum! Brands", move: "-1.1%", active: false },
  ];
}

export default function SimulationOneScreen() {
  const { profile, selectedCharacter } = useProfile();
  const params = useLocalSearchParams<{ brand?: string }>();
  const [stepIndex, setStepIndex] = useState(0);
  const [brand, setBrand] = useState(params.brand ?? "");
  const [stats, setStats] = useState<Stats>({
    annualIncome: 105000,
    amountInvestedDollars: 4000,
    portfolioValueDollars: 4000,
    cashDollars: 14000,
    confidence: 44,
    stress: 34,
  });
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [result, setResult] = useState<Choice | null>(null);

  useEffect(() => {
    if (params.brand) {
      setBrand(params.brand);
      return;
    }

    Promise.all([
      AsyncStorage.getItem(LAST_BRAND_KEY),
      AsyncStorage.getItem("completedLesson1"),
    ]).then(([storedBrand, completedLesson]) => {
      if (storedBrand) {
        setBrand(storedBrand);
        return;
      }

      if (completedLesson !== "true") {
        router.replace("/lesson-1");
      }
    });
  }, [params.brand]);

  const step = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const isFinished = stepIndex >= STEPS.length;
  const ending = getEnding(stats);
  const mood = result?.reaction ?? getMood(stats);
  const progressPct = Math.round((Math.min(stepIndex + 1, STEPS.length) / STEPS.length) * 100);
  const resolvedBrand = brand || "your chosen fast food brand";
  const simJob = useMemo(() => getSimJob(), []);
  const marketTone = getMarketTone(step.marketValue);
  const sceneTone = getSceneTone(step);
  const quote = getQuoteSnapshot(step, resolvedBrand);
  const watchlist = getWatchlist(step, resolvedBrand);

  const handleChoice = () => {
    if (!selectedChoiceId) {
      return;
    }

    const selected = step.choices.find((choice) => choice.id === selectedChoiceId);

    if (!selected) {
      return;
    }

    setStats((current) => applyEffects(current, selected.effects));
    setResult(selected);
  };

  const handleContinue = async () => {
    if (stepIndex === STEPS.length - 1) {
      setStepIndex(STEPS.length);
      return;
    }

    setStepIndex((current) => current + 1);
    setSelectedChoiceId(null);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.replace("/roadmap")} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          {Math.min(stepIndex + 1, STEPS.length)}/{STEPS.length}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View
            style={[
              styles.avatarBadge,
              { backgroundColor: selectedCharacter?.accent ?? "#1E293B" },
            ]}
          >
            <Text style={styles.avatarEmoji}>{selectedCharacter?.emoji ?? "✨"}</Text>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.heroName}>
              {(profile?.firstName ?? "You") + "'s"} {selectedCharacter?.label ?? "Investor"}
            </Text>
            <Text style={styles.heroMood}>
              Current status: {selectedCharacter?.label ?? "Your character"} {mood}.
            </Text>
            <Text style={styles.heroBrand}>Your brand: {resolvedBrand}</Text>
          </View>
        </View>

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Fictional simulation</Text>
          <Text style={styles.disclaimerText}>
            This is a made-up story for learning. It is not financial advice, and the prices, headlines, and events are all fictional.
          </Text>
        </View>

        <View style={styles.lifeCard}>
          <Text style={styles.lifeKicker}>Your setup</Text>
          <Text style={styles.lifeTitle}>
            You work as a {simJob} and want to start investing with intention.
          </Text>
          <Text style={styles.lifeBody}>
            You picked {resolvedBrand} because it feels familiar, you have followed it for a while, and it is the first company story you actually understand.
          </Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: "Income", value: formatMoney(stats.annualIncome), helper: "annual pay" },
            { label: "Cash", value: formatMoney(stats.cashDollars), helper: "not invested yet" },
            { label: "Amount invested", value: formatMoney(stats.amountInvestedDollars), helper: "how much you put in" },
            { label: "Portfolio value", value: formatMoney(stats.portfolioValueDollars), helper: "what it is worth now" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statChip}>
              <Text style={styles.statChipLabel}>{stat.label}</Text>
              <Text style={styles.statChipValue}>{stat.value}</Text>
              <Text style={styles.statChipHelper}>{stat.helper}</Text>
            </View>
          ))}
        </View>

        {!isFinished ? (
          <>
            <View style={styles.marketBoard}>
              <View style={styles.watchlistColumn}>
                <Text style={styles.watchlistHeading}>Market</Text>
                {watchlist.map((item) => {
                  const tone = getMarketTone(item.move);
                  return (
                    <View
                      key={`${step.id}-${item.symbol}`}
                      style={[
                        styles.watchlistCard,
                        item.active && styles.watchlistCardActive,
                        item.active && { borderColor: tone.border, backgroundColor: tone.background },
                      ]}
                    >
                      <Text style={styles.watchlistSymbol}>{item.symbol}</Text>
                      <Text style={styles.watchlistLabel} numberOfLines={1}>
                        {item.label}
                      </Text>
                      <Text style={[styles.watchlistMove, { color: tone.accent }]}>{item.move}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.quotePanel}>
                <View style={styles.timeChipRow}>
                  <Text style={styles.timeChip}>{step.timeLabel}</Text>
                  <Text style={styles.timeMeta}>Tracking {quote.symbol}</Text>
                </View>

                <View style={styles.quoteHero}>
                  <View style={styles.quoteHeroCopy}>
                    <Text style={styles.quoteSymbol}>{quote.symbol}</Text>
                    <Text style={styles.quoteBrand}>{resolvedBrand}</Text>
                    <Text style={styles.quoteMeta}>Day view</Text>
                  </View>
                  <View style={styles.quoteValueWrap}>
                    <Text style={styles.quotePrice}>{quote.priceLabel}</Text>
                    <Text style={[styles.quoteMove, { color: marketTone.accent }]}>{quote.move}</Text>
                  </View>
                </View>

                <View style={styles.quoteRangeCard}>
                  <View style={styles.quoteRangeHeader}>
                    <Text style={styles.quoteRangeTitle}>Day range</Text>
                    <Text style={styles.quoteRangeValue}>
                      {formatMoney(quote.low)} - {formatMoney(quote.high)}
                    </Text>
                  </View>
                  <View style={styles.quoteRangeTrack}>
                    <View
                      style={[
                        styles.quoteRangeThumb,
                        {
                          left: `${Math.max(4, Math.min(96, quote.rangeWidthPct))}%`,
                          backgroundColor: marketTone.accent,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.quoteStatsGrid}>
                  {[
                    { label: "Open", value: formatMoney(quote.open) },
                    { label: "Prev close", value: formatMoney(quote.prevClose) },
                    { label: "High", value: formatMoney(quote.high) },
                    { label: "Low", value: formatMoney(quote.low) },
                    { label: "Volume", value: quote.volume },
                    { label: "Trend", value: step.marketLabel },
                  ].map((item) => (
                    <View key={item.label} style={styles.quoteStatCard}>
                      <Text style={styles.quoteStatLabel}>{item.label}</Text>
                      <Text style={styles.quoteStatValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.newsCard}>
                  <Text style={[styles.newsKicker, { color: marketTone.accent }]}>{step.marketValue}</Text>
                  <Text style={styles.newsText}>{step.update(resolvedBrand)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.scenarioSection}>
              <View
                style={[
                  styles.eventCard,
                  {
                    borderColor: sceneTone.border,
                    backgroundColor: "#0B1320",
                  },
                ]}
              >
                <View style={[styles.eventBanner, { backgroundColor: sceneTone.soft, borderColor: sceneTone.border }]}>
                  <Text style={[styles.eventBannerText, { color: sceneTone.accent }]}>{sceneTone.label}</Text>
                  <Text style={styles.eventBannerTime}>{step.timeLabel}</Text>
                </View>
                <Text style={styles.eventTitle}>{step.title}</Text>
                <Text style={styles.eventBody}>{step.body(resolvedBrand, simJob)}</Text>
              </View>

              <View
                style={[
                  styles.choicePanel,
                  {
                    borderColor: sceneTone.border,
                    backgroundColor: "#101827",
                  },
                ]}
              >
                <Text style={styles.choicePanelTitle}>What do you want to do?</Text>

                {result ? (
                  <View style={[styles.resultCard, { borderColor: sceneTone.border, backgroundColor: sceneTone.soft }]}>
                    <Text style={styles.resultTitle}>{selectedCharacter?.emoji ?? "✨"} {result.reaction}</Text>
                    <Text style={styles.resultText}>{result.explanation}</Text>
                  </View>
                ) : (
                  <View style={styles.choices}>
                    {step.choices.map((choice) => {
                      const selected = selectedChoiceId === choice.id;
                      const badges = getEffectBadges(choice.effects);
                      const actionLabel = choice.id === step.choices[0].id ? "A" : choice.id === step.choices[1].id ? "B" : "C";
                      return (
                        <TouchableOpacity
                          key={choice.id}
                          onPress={() => setSelectedChoiceId(choice.id)}
                          style={[
                            styles.choiceButton,
                            selected && styles.choiceButtonSelected,
                            selected && {
                              borderColor: sceneTone.border,
                              backgroundColor: sceneTone.soft,
                            },
                          ]}
                        >
                          <View style={styles.choiceHeader}>
                            <View
                              style={[
                                styles.choiceActionTag,
                                selected && { backgroundColor: sceneTone.accent, borderColor: sceneTone.accent },
                              ]}
                            >
                              <Text style={[styles.choiceActionTagText, selected && styles.choiceActionTagTextSelected]}>
                                {actionLabel}
                              </Text>
                            </View>
                            <Text style={[styles.choiceButtonText, selected && styles.choiceButtonTextSelected]}>
                              {choice.label}
                            </Text>
                          </View>
                          <View style={styles.choiceBadgeRow}>
                              {badges.map((badge) => (
                                <View
                                  key={badge}
                                  style={[
                                    styles.choiceBadge,
                                    selected && { backgroundColor: "rgba(255,255,255,0.12)" },
                                  ]}
                                >
                                  <Text style={[styles.choiceBadgeText, selected && styles.choiceBadgeTextSelected]}>{badge}</Text>
                                </View>
                              ))}
                            </View>
                          </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.choicePanel}>
            <Text style={styles.choicePanelTitle}>One year later</Text>
            <Text style={styles.eventTitle}>{ending.title}</Text>
            <Text style={styles.eventBody}>{ending.body}</Text>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>
                {selectedCharacter?.emoji ?? "✨"} {selectedCharacter?.label ?? "Your character"} {getMood(stats)}.
              </Text>
              <Text style={styles.resultText}>
                You made it through the first investing story. The real win is that you now have more process than panic.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          {!isFinished && !result ? (
            <TouchableOpacity
              onPress={handleChoice}
              disabled={!selectedChoiceId}
              style={[styles.primaryButton, !selectedChoiceId && styles.buttonDisabled]}
            >
              <Text style={styles.primaryButtonText}>Lock choice</Text>
            </TouchableOpacity>
          ) : !isFinished ? (
            <TouchableOpacity onPress={handleContinue} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {stepIndex === STEPS.length - 1 ? `Finish as ${ending.title}` : "Continue timeline"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.setItem(COMPLETED_SIMULATION_KEY, "true");
                router.replace("/roadmap");
              }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Complete Module 1</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
    padding: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backButtonText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 13,
  },
  progressText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "900",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: GREEN,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 14,
  },
  avatarBadge: {
    width: 84,
    height: 84,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.14)",
  },
  avatarEmoji: {
    fontSize: 38,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "900",
  },
  heroMood: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
  },
  heroBrand: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "800",
  },
  disclaimerCard: {
    borderRadius: 18,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 14,
  },
  disclaimerTitle: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  disclaimerText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
  },
  lifeCard: {
    borderRadius: 22,
    backgroundColor: "#101B30",
    padding: 18,
    marginBottom: 14,
  },
  lifeKicker: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  lifeTitle: {
    color: WHITE,
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 28,
    marginBottom: 8,
  },
  lifeBody: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  statChip: {
    width: "47%",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
  },
  statChipLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  statChipValue: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 6,
  },
  statChipHelper: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 6,
  },
  marketBoard: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    alignItems: "stretch",
    backgroundColor: "#05070B",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 10,
  },
  watchlistColumn: {
    width: 104,
    gap: 6,
  },
  watchlistHeading: {
    color: "#7F8A9A",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 2,
  },
  watchlistCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0B0E13",
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 2,
  },
  watchlistCardActive: {
    backgroundColor: "#11151C",
  },
  watchlistSymbol: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
  },
  watchlistLabel: {
    color: "#8B96A8",
    fontSize: 10,
    lineHeight: 13,
  },
  watchlistMove: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4,
  },
  quotePanel: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#0B0E13",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 14,
  },
  timeChipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  timeChip: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.18)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: "hidden",
    backgroundColor: "rgba(126,214,165,0.08)",
  },
  timeMeta: {
    color: "#7F8A9A",
    fontSize: 11,
    fontWeight: "800",
  },
  quoteHero: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  quoteHeroCopy: {
    flex: 1,
    gap: 2,
  },
  quoteSymbol: {
    color: WHITE,
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 34,
  },
  quoteBrand: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  quoteMeta: {
    color: "#7F8A9A",
    fontSize: 11,
    marginTop: 3,
  },
  quoteValueWrap: {
    alignItems: "flex-end",
    gap: 2,
  },
  quotePrice: {
    color: WHITE,
    fontSize: 26,
    fontWeight: "900",
  },
  quoteMove: {
    fontSize: 14,
    fontWeight: "900",
  },
  quoteRangeCard: {
    borderRadius: 8,
    backgroundColor: "#080B10",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 12,
    marginBottom: 12,
  },
  quoteRangeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  quoteRangeTitle: {
    color: "#7F8A9A",
    fontSize: 11,
    fontWeight: "800",
  },
  quoteRangeValue: {
    color: WHITE,
    fontSize: 11,
    fontWeight: "800",
  },
  quoteRangeTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    position: "relative",
    overflow: "visible",
  },
  quoteRangeThumb: {
    position: "absolute",
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 999,
    marginLeft: -5,
  },
  quoteStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  quoteStatCard: {
    width: "48%",
    borderRadius: 6,
    backgroundColor: "#080B10",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  quoteStatLabel: {
    color: "#7F8A9A",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quoteStatValue: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 5,
  },
  scenarioSection: {
    gap: 14,
  },
  eventCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  eventBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 14,
  },
  eventBannerText: {
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  eventBannerTime: {
    color: WHITE,
    fontSize: 11,
    fontWeight: "800",
  },
  eventTitle: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: 10,
  },
  eventBody: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
  },
  newsCard: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: "#0A0D12",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 12,
  },
  newsKicker: {
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  newsText: {
    color: "#DDE5EF",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  choicePanel: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  choicePanelTitle: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 12,
  },
  choices: {
    gap: 10,
  },
  choiceButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#131D2D",
    padding: 14,
  },
  choiceButtonSelected: {
    transform: [{ translateY: -1 }],
  },
  choiceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  choiceActionTag: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  choiceActionTagText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "900",
  },
  choiceActionTagTextSelected: {
    color: NAVY,
  },
  choiceButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    flex: 1,
  },
  choiceButtonTextSelected: {
    color: WHITE,
  },
  choiceBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  choiceBadge: {
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  choiceBadgeText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "900",
  },
  choiceBadgeTextSelected: {
    color: WHITE,
  },
  resultCard: {
    borderRadius: 18,
    backgroundColor: "rgba(126,214,165,0.09)",
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.2)",
    padding: 14,
    gap: 8,
  },
  resultTitle: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
  },
  resultText: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    marginTop: 18,
  },
  primaryButton: {
    backgroundColor: GREEN,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: NAVY,
    fontSize: 15,
    fontWeight: "900",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});
