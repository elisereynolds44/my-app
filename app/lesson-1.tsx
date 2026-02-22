import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      kind: "example";
      kicker: string;
      title: string;
      scenario: (brand: string) => string;
      takeaway: (brand: string) => string;
    }
  | {
      kind: "visual";
      kicker: string;
      title: string;
      caption: (brand: string) => string;
      bars: { label: string; value: number }[];
      note?: string;
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

export default function LessonOneScreen() {
  const params = useLocalSearchParams<{ firstName?: string }>();
  const firstName = params.firstName ?? "friend";

  const brandOptions = useMemo(
    () => [
      "Chipotle",
      "Chick-fil-A",
      "In-N-Out",
      "Taco Bell",
      "Starbucks",
      "Whataburger",
      "McDonald’s",
    ],
    []
  );

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

    // CYCLE 1 (2–4)
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
      scenario: (brand) =>
        `You eat at ${brand} all the time. As a customer, you care about taste, convenience, and experience. As an owner, you start paying attention to revenue, costs, and growth.`,
      takeaway: () =>
        "Owning a stock changes what you pay attention to.",
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
      correctMsg:
        "Correct. A stock is partial ownership in a business.",
      wrongMsg:
        "Not quite. A stock is ownership in the business, not a product purchase or a guarantee.",
    },

    // CYCLE 2 (5–7)
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
      scenario: (brand) =>
        `If ${brand} opens successful new locations and keeps customers coming back, the business can grow. As an owner, that growth can increase the value of your shares.`,
      takeaway: () =>
        "As an owner, you benefit when the business improves.",
    },
    {
      kind: "question",
      kicker: "QUIZ",
      title: "Why ownership matters",
      prompt: "Why does ownership matter:",
      options: [
        { key: "A", text: "It makes you a customer." },
        { key: "B", text: "It links your outcome to the business." },
        { key: "C", text: "It guarantees dividends." },
      ],
      correct: "B",
      correctMsg:
        "Correct. Ownership links your outcome to business performance.",
      wrongMsg:
        "Not quite. Ownership is about your financial outcome being tied to the business, not guarantees.",
    },

    // CYCLE 3 (8–10)
    {
      kind: "info",
      kicker: "GROWTH",
      title: "Revenue growth signals demand.",
      body:
        "Revenue reflects how much money a company brings in from sales. Rising revenue often indicates customers are purchasing more over time.",
    },
    {
      kind: "example",
      kicker: "EXAMPLE",
      title: "Demand in real life.",
      scenario: (brand) =>
        `If ${brand} stores are consistently busy and the company keeps expanding into new areas, that can be a sign demand is increasing.`,
      takeaway: () =>
        "Revenue growth is often a sign that demand is rising.",
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
      correctMsg:
        "Correct. Rising revenue often reflects increasing demand.",
      wrongMsg:
        "Not quite. Revenue growth usually reflects customers buying more, which is increasing demand.",
    },

    // CYCLE 4 (11–13)
    {
      kind: "info",
      kicker: "GROWTH",
      title: "Profit growth signals efficiency.",
      body:
        "A company can grow revenue without growing profit if costs rise faster than sales. Profit growth often signals improved efficiency or stronger pricing power.",
    },
    {
      kind: "example",
      kicker: "EXAMPLE",
      title: "Sales versus profit.",
      scenario: (brand) =>
        `If ingredient and labor costs rise for ${brand}, profits can shrink even if sales stay strong. Growing sales is good, but cost control matters too.`,
      takeaway: () =>
        "Profit shows whether growth is actually translating into financial results.",
    },
    {
      kind: "question",
      kicker: "QUIZ",
      title: "Revenue and profit",
      prompt: "A company with rising revenue but falling profit is most likely:",
      options: [
        { key: "A", text: "More efficient." },
        { key: "B", text: "Less efficient." },
        { key: "C", text: "Guaranteed to outperform." },
      ],
      correct: "B",
      correctMsg:
        "Correct. Falling profit can indicate costs are rising faster than revenue.",
      wrongMsg:
        "Not quite. If profit is falling while revenue rises, costs may be growing too quickly.",
    },

    // CYCLE 5 (14–16)
    {
      kind: "info",
      kicker: "EXPECTATIONS",
      title: "Markets price expectations.",
      body:
        "Stock prices reflect what investors believe will happen in the future, not just what has happened in the past. Expectations are built into the price.",
    },
    {
      kind: "example",
      kicker: "EXAMPLE",
      title: "Expectations can already be priced in.",
      scenario: (brand) =>
        `If everyone expects ${brand} to grow rapidly for years, that optimism can already be reflected in the stock price today.`,
      takeaway: () =>
        "A strong story can be priced in before it actually happens.",
    },
    {
      kind: "question",
      kicker: "QUIZ",
      title: "What prices reflect",
      prompt: "Stock prices primarily reflect:",
      options: [
        { key: "A", text: "Past events only." },
        { key: "B", text: "Future expectations." },
        { key: "C", text: "Store popularity." },
      ],
      correct: "B",
      correctMsg:
        "Correct. Prices reflect expectations about the future.",
      wrongMsg:
        "Not quite. Prices are mainly about expectations of what will happen next.",
    },

    // CYCLE 6 (17–19)
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
      scenario: (brand) =>
        `If ${brand} grows, but not as fast as investors expected, the stock price can fall. The market reacts to the gap between expectations and reality.`,
      takeaway: () =>
        "Performance matters, but expectations set the bar.",
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
      correctMsg:
        "Correct. Prices move when expectations about the future change.",
      wrongMsg:
        "Not quite. The main driver is changing expectations about what comes next.",
    },

    // CYCLE 7 (20–22)
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
      scenario: (brand) =>
        `You can believe ${brand} is an excellent business and still decide not to buy the stock right now. The missing piece is whether the current price is reasonable for the growth you expect.`,
      takeaway: () =>
        "Business quality and purchase price are separate decisions.",
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
      correctMsg:
        "Correct. A strong business can still be overpriced.",
      wrongMsg:
        "Not quite. Even great companies can be poor investments if the price is too high.",
    },

    // CYCLE 8 (23–25)
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
      scenario: (brand) =>
        `If ${brand} stock is priced as if everything will go perfectly for years, the upside can be limited. Any slowdown can hurt returns, even if the company is still doing well.`,
      takeaway: () =>
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
      correctMsg:
        "Correct. Overpaying reduces future return potential.",
      wrongMsg:
        "Not quite. Paying too much mainly impacts how much return is left for you.",
    },

    // CYCLE 9 (26–28)
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
      scenario: (brand) =>
        `For ${brand}, you can start with three questions. Is revenue growing. Are profits improving. Is the company positioned to keep growing without weakening the business.`,
      takeaway: () =>
        "A checklist keeps your thinking consistent across different companies.",
    },
    {
      kind: "question",
      kicker: "QUIZ",
      title: "Why a checklist helps",
      prompt: "A checklist helps beginners because it:",
      options: [
        { key: "A", text: "Removes uncertainty." },
        { key: "B", text: "Creates consistency." },
        { key: "C", text: "Guarantees accuracy." },
      ],
      correct: "B",
      correctMsg:
        "Correct. A checklist creates consistent thinking and reduces noise.",
      wrongMsg:
        "Not quite. It does not remove uncertainty or guarantee outcomes, but it does create consistency.",
    },

    // CYCLE 10 (29–31)
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
      scenario: (brand) =>
        `If ${brand} executes well for years, ownership value can reflect that progress over time. Day to day price moves are noisy, but long-term business performance is the signal.`,
      takeaway: () =>
        "Long-term thinking shifts attention from daily noise to business progress.",
    },
    {
      kind: "question",
      kicker: "FINAL QUIZ",
      title: "Long-term investing",
      prompt: "Long-term investing emphasizes:",
      options: [
        { key: "A", text: "Daily price movement." },
        { key: "B", text: "Business progress over time." },
        { key: "C", text: "Perfect market timing." },
      ],
      correct: "B",
      correctMsg:
        "Correct. Long-term investing focuses on business progress over time.",
      wrongMsg:
        "Not quite. Long-term investing is mainly about business progress over time, not daily moves or perfect timing.",
    },

    // WIN (32)
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

  const [choice, setChoice] = useState<Choice>(null);
  const [checked, setChecked] = useState(false);

  const step = steps[i];
  const isFirst = i === 0;
  const isLast = i === total - 1;

  const brand = favoriteBrand ?? "your chosen brand";

  const progressPct = Math.round(((i + 1) / total) * 100);

  const canContinue =
    step.kind !== "pick" ? true : favoriteBrand !== null;

  const goNext = () => {
    if (step.kind === "pick") {
      if (!favoriteBrand) return;
    }

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {i + 1}/{total}
        </Text>
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
                  style={[
                    styles.pickOption,
                    selected && styles.pickOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.pickText,
                      selected && styles.pickTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {favoriteBrand && (
              <Text style={styles.pickHint}>
                Selected: {favoriteBrand}
              </Text>
            )}
          </>
        )}

        {step.kind === "info" && <Text style={styles.body}>{step.body}</Text>}

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

            <View style={styles.chartWrap}>
              {step.bars.map((b) => (
                <View key={b.label} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${Math.min(100, Math.max(0, b.value))}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{b.label}</Text>
                </View>
              ))}
            </View>

            {!!step.note && (
              <>
                <View style={{ height: 10 }} />
                <Text style={styles.note}>{step.note}</Text>
              </>
            )}
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
                      <Text
                        style={[
                          styles.badgeText,
                          selected && styles.badgeTextSelected,
                        ]}
                      >
                        {opt.key}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
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
              !canContinue ||
              (step.kind === "question" && (!checked || choice !== step.correct))
            }
          >
            <Text style={styles.primaryText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem("completedLesson1", "true");

              router.replace({
                pathname: "/roadmap",
                params: { completedLesson1: "true", firstName },
              });
            }}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryText}>Back to roadmap</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY, padding: 20 },

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
    marginTop: 8,
    color: MUTED,
    fontWeight: "900",
    fontSize: 12,
    alignSelf: "flex-end",
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

  chartWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 6,
    marginTop: 4,
  },
  barCol: { width: "30%", alignItems: "center" },
  barTrack: {
    width: "100%",
    height: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    backgroundColor: "rgba(126,214,165,0.85)",
  },
  barLabel: { color: MUTED, marginTop: 8, fontWeight: "900", fontSize: 12 },

  note: { color: "rgba(203,213,225,0.65)", fontSize: 12, lineHeight: 18, fontWeight: "800" },

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
  badgeWrong: { backgroundColor: "rgba(248,113,113,0.9)", borderColor: "rgba(248,113,113,0.9)" },

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
