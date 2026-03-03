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

      // CYCLE 1 — Q1
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Ownership",
        prompt: "Buying a stock is best described as:",
        options: [
          { key: "A", text: "Buying partial ownership in a business." },
          { key: "B", text: "Buying a product you like from a company." },
          { key: "C", text: "Getting a guaranteed return." },
        ],
        correct: "A",
        correctMsg: "Correct. A stock represents partial ownership in a business.",
        wrongMsg:
          "Not quite. Stocks are ownership, not a product purchase, and returns are never guaranteed.",
      },

      // CYCLE 2 — Q2
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why ownership matters",
        prompt: "Why does ownership matter:",
        options: [
          { key: "A", text: "It guarantees profits." },
          { key: "B", text: "It links your outcome to the business." },
          { key: "C", text: "It makes you a customer with perks." },
        ],
        correct: "B",
        correctMsg: "Correct. Ownership ties your results to business performance.",
        wrongMsg:
          "Not quite. Ownership does not guarantee profits or perks. It connects your outcome to the business.",
      },

      // CYCLE 3 — Q3
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Revenue growth",
        prompt: "Revenue growth typically indicates:",
        options: [
          { key: "A", text: "Increasing demand." },
          { key: "B", text: "The company is automatically profitable." },
          { key: "C", text: "Lower competition." },
        ],
        correct: "A",
        correctMsg: "Correct. Rising revenue often reflects increasing demand.",
        wrongMsg:
          "Not quite. Revenue can grow without profitability, and it does not necessarily mean competition is lower.",
      },

      // CYCLE 4 — Q4
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Revenue and profit",
        prompt: "A company with rising revenue but falling profit is most likely:",
        options: [
          { key: "A", text: "Guaranteed to outperform later." },
          { key: "B", text: "Becoming more efficient." },
          { key: "C", text: "Facing rising costs or shrinking margins." },
        ],
        correct: "C",
        correctMsg:
          "Correct. Falling profit alongside rising revenue often means costs are rising faster or margins are shrinking.",
        wrongMsg:
          "Not quite. This pattern usually points to cost pressure or weaker margins, not guaranteed outperformance or improved efficiency.",
      },

      // CYCLE 5 — Q5
      {
        kind: "question",
        kicker: "QUIZ",
        title: "What prices reflect",
        prompt: "Stock prices primarily reflect:",
        options: [
          { key: "A", text: "How popular the brand is today." },
          { key: "B", text: "What investors expect to happen in the future." },
          { key: "C", text: "Only what happened last quarter." },
        ],
        correct: "B",
        correctMsg: "Correct. Prices mainly reflect expectations about the future.",
        wrongMsg:
          "Not quite. Popularity and past events matter, but prices are mostly about future expectations.",
      },

      // CYCLE 6 — Q6
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why prices move",
        prompt: "Stock prices often move most when:",
        options: [
          { key: "A", text: "New information changes expectations." },
          { key: "B", text: "The company releases a new logo." },
          { key: "C", text: "The CEO posts on social media." },
        ],
        correct: "A",
        correctMsg: "Correct. Big moves happen when expectations shift.",
        wrongMsg:
          "Not quite. Markets react most to information that changes future expectations, not cosmetic changes.",
      },

      // CYCLE 7 — Q7
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Company versus investment",
        prompt: "Which statement is most accurate:",
        options: [
          { key: "A", text: "Price does not matter if the company is great." },
          { key: "B", text: "A great company can still be overpriced." },
          { key: "C", text: "A strong brand always means strong returns." },
        ],
        correct: "B",
        correctMsg: "Correct. A great business can be a bad investment at the wrong price.",
        wrongMsg:
          "Not quite. Business quality helps, but the price you pay is a huge part of the outcome.",
      },

      // CYCLE 8 — Q8
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Overpaying",
        prompt: "Overpaying primarily affects:",
        options: [
          { key: "A", text: "The company’s management team." },
          { key: "B", text: "Whether the product tastes good." },
          { key: "C", text: "Your future return potential." },
        ],
        correct: "C",
        correctMsg: "Correct. Overpaying reduces the return you can reasonably expect.",
        wrongMsg:
          "Not quite. Paying too much does not change the product or management. It mainly changes your potential return.",
      },

      // CYCLE 9 — Q9
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why a checklist helps",
        prompt: "A checklist helps beginners because it:",
        options: [
          { key: "A", text: "Creates consistent thinking across companies." },
          { key: "B", text: "Guarantees you will pick winners." },
          { key: "C", text: "Eliminates risk." },
        ],
        correct: "A",
        correctMsg: "Correct. A checklist builds consistency and reduces noise.",
        wrongMsg:
          "Not quite. It does not remove risk or guarantee winners. It helps you evaluate consistently.",
      },

      // CYCLE 10 — Q10
      {
        kind: "question",
        kicker: "FINAL QUIZ",
        title: "Long-term investing",
        prompt: "Long-term investing emphasizes:",
        options: [
          { key: "A", text: "Perfectly timing the market." },
          { key: "B", text: "Daily price movement." },
          { key: "C", text: "Business progress over time." },
        ],
        correct: "C",
        correctMsg: "Correct. Long-term investing focuses on business progress over time.",
        wrongMsg:
          "Not quite. Long-term investing is less about daily moves or perfect timing and more about business progress over years.",
      },

      // WIN
      {
        kind: "win",
        kicker: "MODULE COMPLETE",
        title: "You finished Module 1.",
        body:
          "You now understand the basics of ownership, revenue, profit, expectations, and price vs value. Module 2 will introduce how markets actually move.",
      },
    ],
    []
  );

  const total = steps.length;
  const [i, setI] = useState(0);

  // ---- Lesson 1 progress persistence (step index) ----
  useEffect(() => {
    const loadSavedIndex = async () => {
      try {
        const stored = await AsyncStorage.getItem("lesson1SlideIndex");
        if (stored !== null) {
          const parsed = Number(stored);
          if (!Number.isNaN(parsed)) {
            const clamped = Math.max(0, Math.min(parsed, total - 1));
            setI(clamped);
          }
        }
      } catch (e) {
        console.log("Error loading lesson1SlideIndex", e);
      }
    };

    loadSavedIndex();
  }, [total]);

  useEffect(() => {
    const saveIndex = async () => {
      try {
        await AsyncStorage.setItem("lesson1SlideIndex", String(i));
      } catch (e) {
        console.log("Error saving lesson1SlideIndex", e);
      }
    };

    saveIndex();
  }, [i]);

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
                  style={[styles.pickOption, selected && styles.pickOptionSelected]}
                >
                  <Text style={[styles.pickText, selected && styles.pickTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
            {favoriteBrand && <Text style={styles.pickHint}>Selected: {favoriteBrand}</Text>}
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
              await AsyncStorage.removeItem("lesson1SlideIndex");
              router.replace("/roadmap");
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
  barFill: { width: "100%", backgroundColor: "rgba(126,214,165,0.85)" },
  barLabel: { color: MUTED, marginTop: 8, fontWeight: "900", fontSize: 12 },

  note: {
    color: "rgba(203,213,225,0.65)",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
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