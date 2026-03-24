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
  investedDollars: number;
  savingsDollars: number;
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
        effects: { savingsDollars: -1200, investedDollars: 1200, confidence: 7, stress: -2 },
      },
      {
        id: "all-in",
        label: "Go bigger because you already love the brand",
        reaction: "is running on vibes",
        explanation: "Loving a brand is a start, but it is not the same as sizing risk well.",
        effects: { savingsDollars: -2500, investedDollars: 2500, confidence: 4, stress: 12 },
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
        effects: { annualIncome: 1500, savingsDollars: -1000, investedDollars: 1000, confidence: 6, stress: 2 },
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
        effects: { annualIncome: 1500, savingsDollars: -1800, investedDollars: 1800, confidence: 3, stress: 10 },
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
        effects: { savingsDollars: 1000, investedDollars: -1000, confidence: -8, stress: 6 },
      },
      {
        id: "average-down-fast",
        label: "Buy more instantly without checking why profit dropped",
        reaction: "is moving too fast",
        explanation: "Speed is not the same thing as conviction.",
        effects: { savingsDollars: -1200, investedDollars: 1200, confidence: 2, stress: 10 },
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
        effects: { savingsDollars: -1000, investedDollars: 1000, confidence: 4, stress: 14 },
      },
      {
        id: "sell-noise",
        label: "Sell just because the whole thing feels chaotic",
        reaction: "is reacting emotionally",
        explanation: "Chaos can be uncomfortable, but discomfort is not a full thesis either.",
        effects: { savingsDollars: 1400, investedDollars: -1400, confidence: -2, stress: 4 },
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
        effects: { savingsDollars: 1600, investedDollars: -1600, confidence: -7, stress: 8 },
      },
      {
        id: "buy-with-thesis",
        label: "Add a little only if you still believe the business can handle the pressure",
        reaction: "is acting with conviction",
        explanation: "Buying during fear only makes sense when the reasoning is still intact.",
        effects: { savingsDollars: -1000, investedDollars: 1000, confidence: 5, stress: 5 },
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

function applyEffects(stats: Stats, effects: Partial<Stats>): Stats {
  return {
    annualIncome: clampStat(stats.annualIncome + (effects.annualIncome ?? 0)),
    investedDollars: clampStat(stats.investedDollars + (effects.investedDollars ?? 0)),
    savingsDollars: clampStat(stats.savingsDollars + (effects.savingsDollars ?? 0)),
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

  if (stats.savingsDollars >= 7500 && stats.investedDollars <= 2500) {
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

function getSimJob() {
  return "entry-level software engineer";
}

export default function SimulationOneScreen() {
  const { profile, selectedCharacter } = useProfile();
  const params = useLocalSearchParams<{ brand?: string }>();
  const [stepIndex, setStepIndex] = useState(0);
  const [brand, setBrand] = useState(params.brand ?? "");
  const [stats, setStats] = useState<Stats>({
    annualIncome: 105000,
    investedDollars: 4000,
    savingsDollars: 14000,
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
            { label: "Invested", value: formatMoney(stats.investedDollars), helper: "currently in the market" },
            { label: "Savings", value: formatMoney(stats.savingsDollars), helper: "still in cash" },
            { label: "Stress", value: `${stats.stress}/100`, helper: "how shaky you feel" },
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
            <View style={styles.timelineSection}>
              <View style={styles.timelineRail}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineLine} />
              </View>

              <View style={styles.timelineContent}>
                <View style={styles.timeChipRow}>
                  <Text style={styles.timeChip}>{step.timeLabel}</Text>
                  <Text style={styles.timeMeta}>{step.marketLabel}</Text>
                </View>

                <View style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{step.title}</Text>
                  <Text style={styles.eventBody}>{step.body(resolvedBrand, simJob)}</Text>
                </View>

                <View style={styles.newsCard}>
                  <Text style={styles.newsKicker}>{step.marketValue}</Text>
                  <Text style={styles.newsText}>{step.update(resolvedBrand)}</Text>
                </View>

                <View style={styles.choicePanel}>
                  <Text style={styles.choicePanelTitle}>What do you want to do?</Text>

                  {result ? (
                    <View style={styles.resultCard}>
                      <Text style={styles.resultTitle}>{selectedCharacter?.emoji ?? "✨"} {result.reaction}</Text>
                      <Text style={styles.resultText}>{result.explanation}</Text>
                    </View>
                  ) : (
                    <View style={styles.choices}>
                      {step.choices.map((choice) => {
                        const selected = selectedChoiceId === choice.id;
                        return (
                          <TouchableOpacity
                            key={choice.id}
                            onPress={() => setSelectedChoiceId(choice.id)}
                            style={[styles.choiceButton, selected && styles.choiceButtonSelected]}
                          >
                            <Text style={[styles.choiceButtonText, selected && styles.choiceButtonTextSelected]}>
                              {choice.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
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
  timelineSection: {
    flexDirection: "row",
    gap: 14,
  },
  timelineRail: {
    width: 22,
    alignItems: "center",
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: GREEN,
    marginTop: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timeChipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  timeChip: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.28)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: "hidden",
  },
  timeMeta: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
  },
  eventCard: {
    borderRadius: 22,
    backgroundColor: "#0D1728",
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
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
    borderRadius: 20,
    backgroundColor: "rgba(126,214,165,0.08)",
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.22)",
    padding: 14,
  },
  newsKicker: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  newsText: {
    color: WHITE,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  choicePanel: {
    marginTop: 18,
    borderRadius: 24,
    backgroundColor: "#0E1A2E",
    borderWidth: 1,
    borderColor: BORDER,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
  },
  choiceButtonSelected: {
    borderColor: "rgba(126,214,165,0.7)",
    backgroundColor: "rgba(126,214,165,0.14)",
  },
  choiceButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  choiceButtonTextSelected: {
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
