import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.12)";
const BAD = "#F87171";

type Choice = "A" | "B" | "C" | null;

type LessonStep =
  | { kind: "pick"; kicker: string; title: string; prompt: string; options: string[] }
  | { kind: "info"; kicker: string; title: string; body: string }
  | {
      kind: "terms";
      kicker: string;
      title: string;
      intro: string;
      items: { label: string; meaning: string; whyItMatters: string }[];
    }
  | {
      kind: "example";
      kicker: string;
      title: string;
      scenario: (brand: string) => string;
      takeaway: (brand: string) => string;
    }
  | {
      kind: "visual";
      display: "line" | "metrics" | "ticker";
      kicker: string;
      title: string;
      caption: (brand: string) => string;
      data: { label: string; value: number }[];
      note?: string;
    }
  | {
      kind: "snapshot";
      kicker: string;
      title: string;
      eyebrow: string;
      bullets: string[];
    }
  | {
      kind: "question";
      kicker: string;
      title: string;
      prompt: string;
      options: { key: "A" | "B" | "C"; text: string }[];
      correct: "A" | "B" | "C";
      correctMsg: string;
      wrongMsg: string;
    }
  | { kind: "win"; kicker: string; title: string; body: string };

const BRAND_KEY = "lesson1Brand";
const INDEX_KEY = "lesson1SlideIndex";
const LAST_BRAND_KEY = "lesson1LastBrand";

export default function LessonOneScreen() {
  const params = useLocalSearchParams<{ firstName?: string }>();
  const firstName = params.firstName ?? "friend";

  const [favoriteBrand, setFavoriteBrand] = useState<string | null>(null);

  const steps: LessonStep[] = useMemo(
    () => [
      // 1) PICK BRAND
      {
        kind: "pick",
        kicker: "SETUP",
        title: "Choose your favorite fast food brand.",
        prompt:
          "We will use your choice as the running example for this lesson. This only applies to Lesson 1.",
        options: [
          "Chipotle",
          "Chick-fil-A",
          "In-N-Out",
          "Taco Bell",
          "Starbucks",
          "Whataburger",
          "McDonald’s",
        ],
      },

      // CYCLE 1
      {
        kind: "info",
        kicker: "OWNERSHIP",
        title: "A stock represents ownership.",
        body:
          "When you buy a stock, you purchase a small ownership stake in a company. Ownership links your financial outcome to the company’s performance over time.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Customer versus owner.",
        scenario: (brand: string) =>
          `You eat at ${brand} all the time. As a customer, you care about taste, convenience, and experience. As an owner, you start paying attention to revenue, costs, and growth.`,
        takeaway: (_brand: string) => "Owning a stock changes what you pay attention to.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Ownership",
        prompt: "Buying a stock is best described as:",
        options: [
          { key: "A", text: "Buying a product you like." },
          { key: "B", text: "Buying partial ownership in a business." },
          { key: "C", text: "A guaranteed return." },
        ],
        correct: "B",
        correctMsg: "Correct. A stock is partial ownership in a business.",
        wrongMsg:
          "Not quite. A stock is ownership in the business, not a product purchase or a guarantee.",
      },

      // CYCLE 2
      {
        kind: "info",
        kicker: "OWNERSHIP",
        title: "Ownership creates alignment.",
        body:
          "Owners benefit when the business improves. Strong operations, expansion, and profitability can increase the value of ownership over time.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "When the business improves.",
        scenario: (brand: string) =>
          `If ${brand} opens successful new locations and keeps customers coming back, the business can grow. As an owner, that growth can increase the value of your shares.`,
        takeaway: (_brand: string) => "As an owner, you benefit when the business improves.",
      },
      {
        kind: "snapshot",
        kicker: "TOOL",
        title: "What Yahoo Finance is trying to show you.",
        eyebrow: "A stock page is a dashboard of clues, not a crystal ball.",
        bullets: [
          "The price chart shows how the stock has moved over time.",
          "Revenue and earnings help you judge whether the business is actually growing.",
          "News headlines tell you what new information might be changing expectations.",
          "Valuation metrics help you ask whether the stock already looks expensive.",
        ],
      },
      {
        kind: "terms",
        kicker: "STOCK SCREEN",
        title: "What the main stock words mean.",
        intro:
          "When you open a stock screen, you are usually seeing a quick summary of today's trading session. These labels help you understand what happened before you decide what it means.",
        items: [
          {
            label: "Open",
            meaning: "The price where the stock started trading when the market opened.",
            whyItMatters: "It gives you a baseline for how the day began.",
          },
          {
            label: "Prev Close",
            meaning: "The stock's closing price from the previous trading day.",
            whyItMatters: "It helps you compare today with yesterday.",
          },
          {
            label: "High",
            meaning: "The highest price the stock reached during the day.",
            whyItMatters: "It shows how far buyers were willing to push it.",
          },
          {
            label: "Low",
            meaning: "The lowest price the stock hit during the day.",
            whyItMatters: "It shows how much downside pressure showed up.",
          },
        ],
      },
      {
        kind: "terms",
        kicker: "STOCK SCREEN",
        title: "A few more labels you will keep seeing.",
        intro:
          "These are the other clues from the stock board that beginners often see first. You do not need to memorize them instantly, but you should know what each one is trying to tell you.",
        items: [
          {
            label: "Day Range",
            meaning: "The span between the day's low price and high price.",
            whyItMatters: "It tells you how calm or volatile the stock was today.",
          },
          {
            label: "Volume",
            meaning: "How many shares traded hands during the day.",
            whyItMatters: "Higher volume can mean more attention, conviction, or panic.",
          },
          {
            label: "Trend",
            meaning: "A short summary of the current story, like hype, profit pressure, or sector news.",
            whyItMatters: "It gives context for why the stock might be moving.",
          },
          {
            label: "Move %",
            meaning: "How much the stock is up or down compared with a reference price, usually the previous close.",
            whyItMatters: "It helps you see the size of the move fast, not just the direction.",
          },
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Reading a stock screen",
        prompt: "If volume jumps and the day range gets much wider, that usually means:",
        options: [
          { key: "A", text: "More trading activity and a bigger move than usual." },
          { key: "B", text: "The company guaranteed a profit." },
          { key: "C", text: "The stock screen is broken." },
        ],
        correct: "A",
        correctMsg: "Correct. Bigger volume and a wider range usually mean a more active, more dramatic trading day.",
        wrongMsg:
          "Not quite. Volume and day range are clues about how active and volatile the stock was, not guarantees.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why ownership matters",
        prompt: "Why does ownership matter:",
        options: [
          { key: "A", text: "It makes you a customer." },
          { key: "B", text: "It guarantees dividends." },
          { key: "C", text: "It links your outcome to the business." },
        ],
        correct: "C",
        correctMsg: "Correct. Ownership links your outcome to business performance.",
        wrongMsg:
          "Not quite. Ownership is about your financial outcome being tied to the business, not guarantees.",
      },

      // CYCLE 3
      {
        kind: "info",
        kicker: "GROWTH",
        title: "Revenue growth signals demand.",
        body:
          "Revenue reflects how much money a company brings in from sales. Rising revenue often indicates customers are purchasing more over time.",
      },
      {
        kind: "visual",
        display: "line",
        kicker: "GRAPH",
        title: "This is the kind of revenue trend you want to notice.",
        caption: (brand: string) =>
          `If ${brand} looked like this over four quarters on Yahoo Finance, you would say demand appears to be rising.`,
        data: [
          { label: "Q1", value: 40 },
          { label: "Q2", value: 54 },
          { label: "Q3", value: 71 },
          { label: "Q4", value: 88 },
        ],
        note: "The point is not to memorize numbers. It is to notice direction and consistency.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Demand in real life.",
        scenario: (brand: string) =>
          `If ${brand} stores are consistently busy and the company keeps expanding into new areas, that can be a sign demand is increasing.`,
        takeaway: (_brand: string) => "Revenue growth is often a sign that demand is rising.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Revenue growth",
        prompt: "Revenue growth typically indicates:",
        options: [
          { key: "A", text: "Fewer customers." },
          { key: "B", text: "Increasing demand." },
          { key: "C", text: "Revenue does not matter." },
        ],
        correct: "B",
        correctMsg: "Correct. Rising revenue often reflects increasing demand.",
        wrongMsg:
          "Not quite. Revenue growth usually reflects customers buying more, which is increasing demand.",
      },

      // CYCLE 4
      {
        kind: "info",
        kicker: "GROWTH",
        title: "Profit growth signals efficiency.",
        body:
          "A company can grow revenue without growing profit if costs rise faster than sales. Profit growth often signals improved efficiency or stronger pricing power.",
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "GRAPH",
        title: "Revenue and profit are not the same picture.",
        caption: (brand: string) =>
          `A ${brand} chart could show strong sales while profit stays weaker because costs are eating into the gains.`,
        data: [
          { label: "Revenue", value: 90 },
          { label: "Profit", value: 46 },
          { label: "Costs", value: 72 },
        ],
        note: "This is why investors look past the top-line headline and into the business details.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Sales versus profit.",
        scenario: (brand: string) =>
          `If ingredient and labor costs rise for ${brand}, profits can shrink even if sales stay strong. Growing sales is good, but cost control matters too.`,
        takeaway: (_brand: string) =>
          "Profit shows whether growth is actually translating into financial results.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Revenue and profit",
        prompt: "A company with rising revenue but falling profit is most likely:",
        options: [
          { key: "A", text: "Less efficient." },
          { key: "B", text: "More efficient." },
          { key: "C", text: "Guaranteed to outperform." },
        ],
        correct: "A",
        correctMsg: "Correct. Falling profit can indicate costs are rising faster than revenue.",
        wrongMsg:
          "Not quite. If profit is falling while revenue rises, costs may be growing too quickly.",
      },

      // CYCLE 5
      {
        kind: "info",
        kicker: "EXPECTATIONS",
        title: "Markets price expectations.",
        body:
          "Stock prices reflect what investors believe will happen in the future, not just what has happened in the past. Expectations are built into the price.",
      },
      {
        kind: "visual",
        display: "ticker",
        kicker: "GRAPH",
        title: "The chart can move before the report comes out.",
        caption: (brand: string) =>
          `If investors expect ${brand} to post a huge quarter, the stock can already rise before earnings day arrives.`,
        data: [
          { label: "Last report", value: 36 },
          { label: "Expectation", value: 82 },
          { label: "Current price", value: 74 },
        ],
        note: "Price reacts to changing expectations, not just old information.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Expectations can already be priced in.",
        scenario: (brand: string) =>
          `If everyone expects ${brand} to grow rapidly for years, that optimism can already be reflected in the stock price today.`,
        takeaway: (_brand: string) => "A strong story can be priced in before it actually happens.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "What prices reflect",
        prompt: "Stock prices primarily reflect:",
        options: [
          { key: "A", text: "Future expectations." },
          { key: "B", text: "Past events only." },
          { key: "C", text: "Store popularity." },
        ],
        correct: "A",
        correctMsg: "Correct. Prices reflect expectations about the future.",
        wrongMsg: "Not quite. Prices are mainly about expectations of what will happen next.",
      },

      // CYCLE 6
      {
        kind: "info",
        kicker: "EXPECTATIONS",
        title: "Surprises move markets.",
        body:
          "Prices often change when reality differs from expectations. New information matters most when it changes what investors believe about the future.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Good news can still disappoint.",
        scenario: (brand: string) =>
          `If ${brand} grows, but not as fast as investors expected, the stock price can fall. The market reacts to the gap between expectations and reality.`,
        takeaway: (_brand: string) => "Performance matters, but expectations set the bar.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why prices move",
        prompt: "Stock prices often move most when:",
        options: [
          { key: "A", text: "Expectations change." },
          { key: "B", text: "The menu changes." },
          { key: "C", text: "A store gets renovated." },
        ],
        correct: "A",
        correctMsg: "Correct. Prices move when expectations about the future change.",
        wrongMsg: "Not quite. The main driver is changing expectations about what comes next.",
      },

      // CYCLE 7
      {
        kind: "info",
        kicker: "PRICE AND VALUE",
        title: "Great company does not equal great investment.",
        body:
          "Investment outcomes depend on both company quality and the price you pay. A great business can still be a poor investment at the wrong price.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Two separate questions.",
        scenario: (brand: string) =>
          `You can believe ${brand} is an excellent business and still decide not to buy the stock right now. The missing piece is whether the current price is reasonable for the growth you expect.`,
        takeaway: (_brand: string) => "Business quality and purchase price are separate decisions.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Company versus investment",
        prompt: "Which statement is most accurate:",
        options: [
          { key: "A", text: "Great company always means great investment." },
          { key: "B", text: "A great company can still be overpriced." },
          { key: "C", text: "Price does not matter." },
        ],
        correct: "B",
        correctMsg: "Correct. A strong business can still be overpriced.",
        wrongMsg:
          "Not quite. Even great companies can be poor investments if the price is too high.",
      },

      // CYCLE 8
      {
        kind: "info",
        kicker: "PRICE AND VALUE",
        title: "Overpaying limits upside.",
        body:
          "Even strong businesses can deliver weak returns if purchased at excessive valuations. Paying too much can reduce future return potential.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Priced for perfection.",
        scenario: (brand: string) =>
          `If ${brand} stock is priced as if everything will go perfectly for years, the upside can be limited. Any slowdown can hurt returns, even if the company is still doing well.`,
        takeaway: (_brand: string) =>
          "The price you pay shapes the return you can reasonably expect.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Overpaying",
        prompt: "Overpaying primarily affects:",
        options: [
          { key: "A", text: "Business quality." },
          { key: "B", text: "Future return potential." },
          { key: "C", text: "Brand strength." },
        ],
        correct: "B",
        correctMsg: "Correct. Overpaying reduces future return potential.",
        wrongMsg: "Not quite. Paying too much mainly impacts how much return is left for you.",
      },

      // CYCLE 9
      {
        kind: "info",
        kicker: "FRAMEWORK",
        title: "A simple checklist reduces noise.",
        body:
          "Beginners benefit from consistent evaluation criteria rather than intuition alone. A checklist helps you focus on the same fundamentals across any company.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "A beginner checklist.",
        scenario: (brand: string) =>
          `For ${brand}, you can start with three questions. Is revenue growing. Are profits improving. Is the company positioned to keep growing without weakening the business.`,
        takeaway: (_brand: string) =>
          "A checklist keeps your thinking consistent across different companies.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why a checklist helps",
        prompt: "A checklist helps beginners because it:",
        options: [
          { key: "A", text: "Creates consistency." },
          { key: "B", text: "Reduces noise." },
          { key: "C", text: "Guarantees accuracy." },
        ],
        correct: "A",
        correctMsg: "Correct. A checklist creates consistent thinking and reduces noise.",
        wrongMsg:
          "Not quite. It does not remove uncertainty or guarantee outcomes, but it does create consistency.",
      },

      // CYCLE 10
      {
        kind: "info",
        kicker: "TIME HORIZON",
        title: "Long-term thinking matters.",
        body:
          "Short-term price movements are unpredictable, but business progress unfolds over longer periods. Long-term investing emphasizes the business trajectory, not daily volatility.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Zooming out.",
        scenario: (brand: string) =>
          `If ${brand} executes well for years, ownership value can reflect that progress over time. Day to day price moves are noisy, but long-term business performance is the signal.`,
        takeaway: (_brand: string) =>
          "Long-term thinking shifts attention from daily noise to business progress.",
      },
      {
        kind: "question",
        kicker: "FINAL QUIZ",
        title: "Long-term investing",
        prompt: "Long-term investing emphasizes:",
        options: [
          { key: "A", text: "Daily price movement." },
          { key: "B", text: "Future expectations." },
          { key: "C", text: "Business progress over time." },
        ],
        correct: "C",
        correctMsg: "Correct. Long-term investing focuses on business progress over time.",
        wrongMsg:
          "Not quite. Long-term investing is mainly about business progress over time, not daily moves or perfect timing.",
      },

      // WIN
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 1 complete.",
        body:
          "You now have a basic investing framework: ownership, demand and profit, expectations, and price versus value. Next, we will cover risk, diversification, and how to start responsibly.",
      },
    ],
    []
  );

  const total = steps.length;
  const [i, setI] = useState(0);

  // Load saved brand + saved index.
  // Critical behavior: if there is no saved brand yet, force i = 0 so the pick screen shows.
  useEffect(() => {
    const load = async () => {
      try {
        const storedBrand = await AsyncStorage.getItem(BRAND_KEY);
        if (storedBrand) setFavoriteBrand(storedBrand);

        const storedIndex = await AsyncStorage.getItem(INDEX_KEY);
        if (storedIndex !== null) {
          const parsed = Number(storedIndex);
          if (!Number.isNaN(parsed)) {
            const clamped = Math.max(0, Math.min(parsed, total - 1));

            // If brand is not chosen yet, always start at pick.
            if (!storedBrand) {
              setI(0);
            } else {
              setI(clamped);
            }
          }
        } else {
          // No saved index
          setI(storedBrand ? 0 : 0);
        }
      } catch (e) {
        console.log("Error loading lesson 1 state", e);
        setI(0);
      }
    };

    load();
  }, [total]);

  // Persist index
  useEffect(() => {
    const saveIndex = async () => {
      try {
        await AsyncStorage.setItem(INDEX_KEY, String(i));
      } catch (e) {
        console.log("Error saving lesson1SlideIndex", e);
      }
    };
    saveIndex();
  }, [i]);

  // Persist brand
  useEffect(() => {
    const saveBrand = async () => {
      try {
        if (favoriteBrand) {
          await AsyncStorage.setItem(BRAND_KEY, favoriteBrand);
          await AsyncStorage.setItem(LAST_BRAND_KEY, favoriteBrand);
        }
      } catch (e) {
        console.log("Error saving lesson1Brand", e);
      }
    };
    saveBrand();
  }, [favoriteBrand]);

  const [choice, setChoice] = useState<Choice>(null);
  const [checked, setChecked] = useState(false);

  const step = steps[i];
  const isFirst = i === 0;
  const isLast = i === total - 1;

  const brand = favoriteBrand ?? "your chosen brand";
  const progressPct = Math.round(((i + 1) / total) * 100);

  const canContinue = step.kind !== "pick" ? true : favoriteBrand !== null;

  const goNext = () => {
    if (step.kind === "pick" && !favoriteBrand) return;

    if (step.kind === "question") {
      if (!checked) return;
      if (choice !== step.correct) return;
    }

    setChoice(null);
    setChecked(false);
    setI((prev) => Math.min(prev + 1, total - 1));
  };

  const goBack = () => {
    setChoice(null);
    setChecked(false);
    setI((prev) => Math.max(prev - 1, 0));
  };

  const exitLesson = () => {
    router.replace("/roadmap");
  };

  const resetLesson = async () => {
    try {
      await AsyncStorage.multiRemove([INDEX_KEY, BRAND_KEY]);
      await AsyncStorage.setItem(INDEX_KEY, "0");
      setFavoriteBrand(null);
      setChoice(null);
      setChecked(false);
      setI(0);
    } catch (e) {
      console.log("Error resetting lesson 1", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={exitLesson} style={styles.lessonBackBtn}>
          <Text style={styles.lessonBackText}>Back to roadmap</Text>
        </TouchableOpacity>

        <View style={styles.progressMeta}>
          <Text style={styles.progressLabel}>Lesson 1</Text>
          <Text style={styles.progressText}>
            {i + 1}/{total}
          </Text>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.kicker}>{step.kicker}</Text>
        <Text style={styles.title}>{step.title}</Text>

        {step.kind === "pick" && (
          <>
            <Text style={styles.body}>{step.prompt}</Text>
            <View style={{ height: 14 }} />
            {step.options.map((opt) => {
              const selected = favoriteBrand === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.9}
                  onPress={() => setFavoriteBrand(opt)}
                  style={[styles.pickOption, selected && styles.pickOptionSelected]}
                >
                  <Text style={[styles.pickText, selected && styles.pickTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
            {favoriteBrand && <Text style={styles.pickHint}>Selected: {favoriteBrand}</Text>}

            <TouchableOpacity onPress={resetLesson} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset Lesson 1</Text>
            </TouchableOpacity>
          </>
        )}

        {step.kind === "info" && <Text style={styles.body}>{step.body}</Text>}

        {step.kind === "terms" && (
          <>
            <Text style={styles.body}>{step.intro}</Text>
            <View style={{ height: 14 }} />
            <View style={styles.termStack}>
              {step.items.map((item) => (
                <View key={item.label} style={styles.termCard}>
                  <Text style={styles.termLabel}>{item.label}</Text>
                  <Text style={styles.termMeaning}>{item.meaning}</Text>
                  <Text style={styles.termWhy}>
                    <Text style={styles.termWhyLabel}>Why it matters: </Text>
                    {item.whyItMatters}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {step.kind === "example" && (
          <>
            <Text style={styles.body}>{step.scenario(brand)}</Text>
            <View style={{ height: 12 }} />
            <Text style={styles.body}>
              <Text style={styles.takeawayLabel}>Takeaway: </Text>
              {step.takeaway(brand)}
            </Text>
          </>
        )}

        {step.kind === "visual" && (
          <>
            <Text style={styles.body}>{step.caption(brand)}</Text>
            <View style={{ height: 14 }} />
            {step.display === "line" && (
              <View style={styles.lineCard}>
                <View style={styles.lineGrid}>
                  <View style={styles.lineGridRule} />
                  <View style={styles.lineGridRule} />
                  <View style={styles.lineGridRule} />
                  <View style={styles.lineTrack}>
                    {step.data.map((point, index) => {
                      const leftPct =
                        step.data.length === 1 ? 0 : (index / (step.data.length - 1)) * 100;
                      const bottomPct = Math.min(92, Math.max(10, point.value));
                      const next = step.data[index + 1];
                      const nextBottomPct = next
                        ? Math.min(92, Math.max(10, next.value))
                        : null;
                      const widthPct =
                        next && step.data.length > 1 ? 100 / (step.data.length - 1) : 0;

                      return (
                        <React.Fragment key={point.label}>
                          {nextBottomPct !== null && (
                            <View
                              style={[
                                styles.lineSegment,
                                {
                                  left: `${leftPct}%`,
                                  bottom: `${bottomPct}%`,
                                  width: `${widthPct}%`,
                                  transform: [
                                    {
                                      rotate: `${(nextBottomPct - bottomPct) * 0.55}deg`,
                                    },
                                  ],
                                },
                              ]}
                            />
                          )}
                          <View
                            style={[
                              styles.linePoint,
                              {
                                left: `${leftPct}%`,
                                bottom: `${bottomPct}%`,
                              },
                            ]}
                          />
                          <Text
                            style={[
                              styles.lineValue,
                              {
                                left: `${leftPct}%`,
                                bottom: `${bottomPct + 10}%`,
                              },
                            ]}
                          >
                            {point.value}
                          </Text>
                        </React.Fragment>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.lineLabels}>
                  {step.data.map((point) => (
                    <Text key={point.label} style={styles.lineLabel}>
                      {point.label}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {step.display === "metrics" && (
              <View style={styles.metricStack}>
                {step.data.map((item) => (
                  <View key={item.label} style={styles.metricRow}>
                    <View>
                      <Text style={styles.metricLabel}>{item.label}</Text>
                      <Text style={styles.metricSubtext}>
                        {item.value >= 80
                          ? "Very strong"
                          : item.value >= 60
                            ? "Solid"
                            : "Needs work"}
                      </Text>
                    </View>
                    <View style={styles.metricGauge}>
                      <View
                        style={[
                          styles.metricGaugeFill,
                          { width: `${Math.min(100, Math.max(0, item.value))}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.metricValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}

            {step.display === "ticker" && (
              <View style={styles.tickerCard}>
                <View style={styles.tickerHeader}>
                  <View>
                    <Text style={styles.tickerSymbol}>MKT SNAPSHOT</Text>
                    <Text style={styles.tickerCompany}>{brand}</Text>
                  </View>
                  <Text style={styles.tickerMove}>+8.4%</Text>
                </View>

                <View style={styles.tickerMiniChart}>
                  {step.data.map((point, index) => (
                    <View key={point.label} style={styles.tickerCol}>
                      <View
                        style={[
                          styles.tickerBar,
                          { height: `${Math.min(100, Math.max(16, point.value))}%` },
                        ]}
                      />
                      <Text style={styles.tickerBarLabel}>{point.label}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.tickerFooter}>
                  <View>
                    <Text style={styles.tickerMetaLabel}>Expectation</Text>
                    <Text style={styles.tickerMetaValue}>Very high</Text>
                  </View>
                  <View>
                    <Text style={styles.tickerMetaLabel}>What to watch</Text>
                    <Text style={styles.tickerMetaValue}>Can reality beat hype?</Text>
                  </View>
                </View>
              </View>
            )}

            {!!step.note && (
              <>
                <View style={{ height: 10 }} />
                <Text style={styles.note}>{step.note}</Text>
              </>
            )}
          </>
        )}

        {step.kind === "snapshot" && (
          <>
            <Text style={styles.body}>{step.eyebrow}</Text>
            <View style={styles.snapshotCard}>
              {step.bullets.map((bullet) => (
                <View key={bullet} style={styles.snapshotRow}>
                  <View style={styles.snapshotDot} />
                  <Text style={styles.snapshotText}>{bullet}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {step.kind === "question" && (
          <>
            <Text style={styles.body}>{step.prompt}</Text>

            <View style={{ marginTop: 12 }}>
              {step.options.map((opt) => {
                const selected = choice === opt.key;

                const showRight = checked && opt.key === step.correct;
                const showWrong = checked && selected && opt.key !== step.correct;

                return (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.9}
                    onPress={() => {
                      setChoice(opt.key);
                      setChecked(false);
                    }}
                    style={[
                      styles.option,
                      selected && styles.optionSelected,
                      showRight && styles.optionCorrect,
                      showWrong && styles.optionWrong,
                    ]}
                  >
                    <View
                      style={[
                        styles.badge,
                        selected && styles.badgeSelected,
                        showRight && styles.badgeCorrect,
                        showWrong && styles.badgeWrong,
                      ]}
                    >
                      <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>
                        {opt.key}
                      </Text>
                    </View>

                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.checkBtn, !choice && { opacity: 0.5 }]}
              disabled={!choice}
              onPress={() => setChecked(true)}
            >
              <Text style={styles.checkBtnText}>Check</Text>
            </TouchableOpacity>

            {checked && (
              <Text style={[styles.feedback, choice === step.correct ? styles.ok : styles.bad]}>
                {choice === step.correct ? step.correctMsg : step.wrongMsg}
              </Text>
            )}
          </>
        )}

        {step.kind === "win" && <Text style={styles.body}>{step.body}</Text>}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={goBack}
          disabled={isFirst}
          style={[styles.secondaryBtn, isFirst && { opacity: 0.4 }]}
        >
          <Text style={styles.secondaryText}>Back</Text>
        </TouchableOpacity>

        {!isLast ? (
          <TouchableOpacity
            onPress={goNext}
            style={[
              styles.primaryBtn,
              !canContinue && { opacity: 0.5 },
              step.kind === "question" &&
                (!checked || choice !== step.correct) && { opacity: 0.5 },
            ]}
            disabled={
              !canContinue || (step.kind === "question" && (!checked || choice !== step.correct))
            }
          >
            <Text style={styles.primaryText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem("completedLesson1", "true");
              await AsyncStorage.removeItem(INDEX_KEY);
              await AsyncStorage.removeItem(BRAND_KEY);
              if (favoriteBrand) {
                await AsyncStorage.setItem(LAST_BRAND_KEY, favoriteBrand);
              }
              router.replace({
                pathname: "/simulation-1",
                params: favoriteBrand ? { brand: favoriteBrand } : undefined,
              });
            }}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryText}>Start simulation</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY, padding: 20 },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  lessonBackBtn: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  lessonBackText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 13,
  },
  progressMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  progressLabel: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  progressWrap: { marginBottom: 16 },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: GREEN,
    borderRadius: 999,
  },
  progressText: {
    color: MUTED,
    fontWeight: "900",
    fontSize: 12,
  },

  card: {
    flex: 1,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 18,
    justifyContent: "center",
  },

  kicker: {
    color: GREEN,
    fontWeight: "900",
    letterSpacing: 1.2,
    fontSize: 12,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: { color: WHITE, fontSize: 24, fontWeight: "900", marginBottom: 10 },
  body: { color: MUTED, fontSize: 15, lineHeight: 22 },

  takeawayLabel: { fontWeight: "900", color: WHITE },

  pickOption: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  pickOptionSelected: {
    borderColor: "rgba(126,214,165,0.7)",
    backgroundColor: "rgba(126,214,165,0.10)",
  },
  pickText: { color: MUTED, fontWeight: "900" },
  pickTextSelected: { color: WHITE },
  pickHint: { marginTop: 6, color: MUTED, fontWeight: "900", fontSize: 12 },

  resetBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  resetText: { color: WHITE, fontWeight: "900", fontSize: 12 },

  lineCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
  },
  lineGrid: {
    height: 170,
    justifyContent: "space-between",
  },
  lineGridRule: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  lineTrack: {
    ...StyleSheet.absoluteFillObject,
    top: 8,
    bottom: 20,
    left: 8,
    right: 8,
  },
  lineSegment: {
    position: "absolute",
    height: 3,
    backgroundColor: GREEN,
    borderRadius: 999,
  },
  linePoint: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: WHITE,
    borderWidth: 3,
    borderColor: GREEN,
    marginLeft: -6,
    marginBottom: -6,
  },
  lineValue: {
    position: "absolute",
    color: WHITE,
    fontWeight: "900",
    fontSize: 12,
    marginLeft: -12,
  },
  lineLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  lineLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "900",
  },
  metricStack: {
    gap: 12,
  },
  termStack: {
    gap: 10,
  },
  termCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    gap: 8,
  },
  termLabel: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
  },
  termMeaning: {
    color: WHITE,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  termWhy: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
  },
  termWhyLabel: {
    color: GREEN,
    fontWeight: "900",
  },
  metricRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    gap: 10,
  },
  metricLabel: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "900",
  },
  metricSubtext: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  metricGauge: {
    height: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  },
  metricGaugeFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(126,214,165,0.9)",
  },
  metricValue: {
    color: WHITE,
    fontWeight: "900",
    fontSize: 20,
  },
  tickerCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.24)",
    backgroundColor: "rgba(126,214,165,0.07)",
    padding: 14,
    gap: 14,
  },
  tickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tickerSymbol: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  tickerCompany: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },
  tickerMove: {
    color: GREEN,
    fontSize: 22,
    fontWeight: "900",
  },
  tickerMiniChart: {
    height: 88,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  tickerCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  tickerBar: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "rgba(126,214,165,0.85)",
    minHeight: 18,
  },
  tickerBarLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  tickerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  tickerMetaLabel: {
    color: "rgba(203,213,225,0.72)",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  tickerMetaValue: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  note: {
    color: "rgba(203,213,225,0.65)",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
  },
  snapshotCard: {
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: "rgba(126,214,165,0.08)",
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.2)",
    padding: 14,
    gap: 10,
  },
  snapshotRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  snapshotDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: GREEN,
    marginTop: 6,
  },
  snapshotText: {
    flex: 1,
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "rgba(126,214,165,0.10)",
    borderColor: "rgba(126,214,165,0.55)",
  },
  optionCorrect: { borderColor: "rgba(126,214,165,0.75)" },
  optionWrong: { borderColor: "rgba(248,113,113,0.7)" },

  badge: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badgeSelected: { backgroundColor: GREEN, borderColor: GREEN },
  badgeCorrect: { backgroundColor: GREEN, borderColor: GREEN },
  badgeWrong: {
    backgroundColor: "rgba(248,113,113,0.9)",
    borderColor: "rgba(248,113,113,0.9)",
  },

  badgeText: { color: WHITE, fontWeight: "900" },
  badgeTextSelected: { color: NAVY },

  optionText: { flex: 1, color: MUTED, fontSize: 14, fontWeight: "800", lineHeight: 18 },
  optionTextSelected: { color: WHITE },

  checkBtn: {
    marginTop: 6,
    backgroundColor: WHITE,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  checkBtnText: { color: NAVY, fontWeight: "900", fontSize: 14 },

  feedback: { marginTop: 10, fontWeight: "900", fontSize: 13 },
  ok: { color: GREEN },
  bad: { color: BAD },

  controls: { flexDirection: "row", marginTop: 16 },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginRight: 12,
  },
  secondaryText: { color: WHITE, fontWeight: "900" },
  primaryBtn: {
    flex: 1,
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: NAVY, fontWeight: "900" },
});
