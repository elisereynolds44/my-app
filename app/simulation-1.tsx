import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useProfile } from "@/components/profile-context";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.12)";

const LAST_BRAND_KEY = "lesson1LastBrand";
const COMPLETED_SIMULATION_KEY = "completedSimulation1";

type Stats = {
  cash: number;
  confidence: number;
  conviction: number;
  risk: number;
};

type Choice = {
  id: string;
  label: string;
  reaction: string;
  explanation: string;
  effects: Partial<Stats>;
};

type SimulationRound = {
  id: string;
  title: string;
  kicker: string;
  body: (brand: string) => string;
  marketLabel: string;
  marketValue: string;
  headline: (brand: string) => string;
  choices: Choice[];
};

const ROUNDS: SimulationRound[] = [
  {
    id: "start",
    kicker: "ROUND 1",
    title: "You finally decide to start.",
    body: (brand) =>
      `You have been watching ${brand} for a while. The business seems familiar, but the stock still feels intimidating. You decide what kind of first move to make.`,
    marketLabel: "Starting move",
    marketValue: "Decision day",
    headline: (brand) => `${brand} stays steady as investors wait for the next quarter.`,
    choices: [
      {
        id: "small",
        label: "Start small and learn as you go",
        reaction: "is feeling steady",
        explanation: "Starting small lowers pressure and keeps you thinking clearly.",
        effects: { cash: -10, confidence: 6, conviction: 4, risk: -2 },
      },
      {
        id: "all-in",
        label: "Go big because you already love the brand",
        reaction: "is riding pure vibes",
        explanation: "Liking a brand is not the same as evaluating the stock.",
        effects: { cash: -30, confidence: 4, conviction: 2, risk: 12 },
      },
      {
        id: "wait",
        label: "Wait and read more first",
        reaction: "is being patient",
        explanation: "Patience can be useful when you still need more evidence.",
        effects: { confidence: 3, conviction: 6, risk: -4 },
      },
    ],
  },
  {
    id: "revenue",
    kicker: "ROUND 2",
    title: "Revenue is climbing.",
    body: (brand) =>
      `${brand} reports another strong quarter of sales growth. Stores are busy, expansion is working, and people are paying attention.`,
    marketLabel: "Revenue trend",
    marketValue: "Up +14%",
    headline: (brand) => `${brand} beats sales expectations for the second quarter in a row.`,
    choices: [
      {
        id: "check-why",
        label: "Dig into why revenue is growing",
        reaction: "is thinking like an owner",
        explanation: "You are checking whether demand is real and repeatable.",
        effects: { confidence: 5, conviction: 10, risk: -3 },
      },
      {
        id: "celebrate",
        label: "Celebrate and assume the stock must keep going up",
        reaction: "is getting overexcited",
        explanation: "Strong revenue helps, but price and expectations still matter.",
        effects: { confidence: 7, conviction: 1, risk: 8 },
      },
      {
        id: "ignore",
        label: "Ignore revenue because only price matters",
        reaction: "is missing the signal",
        explanation: "Revenue helps explain whether customer demand is improving.",
        effects: { confidence: -2, conviction: -6, risk: 5 },
      },
    ],
  },
  {
    id: "profit",
    kicker: "ROUND 3",
    title: "Profit lags behind sales.",
    body: (brand) =>
      `Even though ${brand} is selling more, labor and ingredient costs jump. Profit comes in weaker than expected.`,
    marketLabel: "Profit pressure",
    marketValue: "Margins down",
    headline: (brand) => `${brand} grows sales, but higher costs squeeze profitability.`,
    choices: [
      {
        id: "compare",
        label: "Compare revenue growth with profit growth",
        reaction: "stays analytical",
        explanation: "You are separating a good business story from a messy quarter.",
        effects: { confidence: 6, conviction: 8, risk: -4 },
      },
      {
        id: "panic",
        label: "Panic because weaker profit must mean the story is dead",
        reaction: "is spiraling a little",
        explanation: "One weak metric does not erase the full business picture.",
        effects: { confidence: -8, conviction: -6, risk: 6 },
      },
      {
        id: "double",
        label: "Buy more instantly without checking anything else",
        reaction: "is moving too fast",
        explanation: "Conviction should come from evidence, not urgency.",
        effects: { cash: -20, confidence: 2, conviction: 2, risk: 10 },
      },
    ],
  },
  {
    id: "hype",
    kicker: "ROUND 4",
    title: "The internet turns your stock into a trend.",
    body: (brand) =>
      `${brand} starts trending online. Everyone suddenly has a hot take, and the stock pops hard in a few days.`,
    marketLabel: "Mood",
    marketValue: "Hype spike",
    headline: (brand) => `Social buzz sends ${brand} sharply higher as traders pile in.`,
    choices: [
      {
        id: "zoom-out",
        label: "Zoom out and remember hype is not the same as value",
        reaction: "is keeping perspective",
        explanation: "You are resisting the urge to confuse excitement with fundamentals.",
        effects: { confidence: 5, conviction: 7, risk: -6 },
      },
      {
        id: "chase",
        label: "Chase the spike because you are afraid to miss out",
        reaction: "is chasing hype",
        explanation: "FOMO often pushes people to buy after expectations are already inflated.",
        effects: { cash: -15, confidence: 4, conviction: -2, risk: 14 },
      },
      {
        id: "sell-all",
        label: "Sell everything just because it feels loud",
        reaction: "is reacting emotionally",
        explanation: "Noise alone is not a full investing thesis either.",
        effects: { cash: 18, confidence: -2, conviction: -5, risk: 4 },
      },
    ],
  },
  {
    id: "expectations",
    kicker: "ROUND 5",
    title: "Expectations get dangerous.",
    body: (brand) =>
      `Analysts now expect ${brand} to be nearly perfect next quarter. The business is good, but the stock price looks stretched.`,
    marketLabel: "Valuation",
    marketValue: "Expensive",
    headline: (brand) => `${brand} remains strong, but investors debate whether the stock is priced for perfection.`,
    choices: [
      {
        id: "separate",
        label: "Separate a great company from an expensive stock",
        reaction: "is seeing the full picture",
        explanation: "This is the core lesson: great company does not always mean great buy right now.",
        effects: { confidence: 6, conviction: 9, risk: -5 },
      },
      {
        id: "ignore-price",
        label: "Ignore price because quality is all that matters",
        reaction: "is ignoring valuation",
        explanation: "Overpaying can shrink your future return even if the business stays strong.",
        effects: { confidence: 2, conviction: 1, risk: 12 },
      },
      {
        id: "bail",
        label: "Bail immediately because expensive always means bad",
        reaction: "is oversimplifying",
        explanation: "Price matters, but context and time horizon matter too.",
        effects: { confidence: -1, conviction: -4, risk: 2 },
      },
    ],
  },
  {
    id: "drop",
    kicker: "ROUND 6",
    title: "Then the stock drops.",
    body: (brand) =>
      `The next report is only okay, not amazing. Because expectations were sky-high, ${brand} falls sharply anyway.`,
    marketLabel: "Price move",
    marketValue: "-11%",
    headline: (brand) => `${brand} slips after results fail to clear elevated investor expectations.`,
    choices: [
      {
        id: "understand",
        label: "Remind yourself that expectations moved the price",
        reaction: "is staying calm",
        explanation: "The market is reacting to the gap between hype and reality, not just the company itself.",
        effects: { confidence: 8, conviction: 7, risk: -8 },
      },
      {
        id: "rage-sell",
        label: "Sell in frustration because the stock betrayed you",
        reaction: "is panic-selling",
        explanation: "Emotional exits usually happen when people confuse volatility with failure.",
        effects: { cash: 8, confidence: -9, conviction: -8, risk: 8 },
      },
      {
        id: "average",
        label: "Buy more instantly without checking your reason",
        reaction: "is forcing the issue",
        explanation: "Buying the dip only helps if your thesis still makes sense.",
        effects: { cash: -15, confidence: 1, conviction: 2, risk: 10 },
      },
    ],
  },
  {
    id: "checklist",
    kicker: "ROUND 7",
    title: "You build a checklist.",
    body: (brand) =>
      `Instead of reacting to every swing, you write a simple three-part checklist for ${brand}: demand, profit quality, and whether the price feels justified.`,
    marketLabel: "Framework",
    marketValue: "3 checks",
    headline: (_brand) => "Your process starts getting stronger than your emotions.",
    choices: [
      {
        id: "process",
        label: "Use the checklist before every move",
        reaction: "is building real conviction",
        explanation: "A process gives you something better than vibes when the market gets noisy.",
        effects: { confidence: 7, conviction: 12, risk: -8 },
      },
      {
        id: "wing-it",
        label: "Keep winging it because intuition feels faster",
        reaction: "is trusting vibes again",
        explanation: "Fast decisions feel exciting, but they are harder to repeat well.",
        effects: { confidence: 1, conviction: -4, risk: 7 },
      },
      {
        id: "copy",
        label: "Copy whatever someone online says",
        reaction: "is borrowing conviction",
        explanation: "Borrowed conviction usually disappears the moment the stock gets rough.",
        effects: { confidence: -4, conviction: -8, risk: 9 },
      },
    ],
  },
  {
    id: "finish",
    kicker: "ROUND 8",
    title: "You choose what kind of investor to become.",
    body: (brand) =>
      `A few months later, ${brand} is still moving around, but you understand the story better. Now the question is not whether the stock is noisy. It is how you want to respond to noise.`,
    marketLabel: "Mindset",
    marketValue: "Long term",
    headline: (_brand) => "The market stays noisy. Your job is to get steadier.",
    choices: [
      {
        id: "patient",
        label: "Stay patient and focus on business progress",
        reaction: "looks locked in",
        explanation: "That is long-term thinking: less obsession with noise, more attention to business quality.",
        effects: { confidence: 10, conviction: 10, risk: -10 },
      },
      {
        id: "flip",
        label: "Keep jumping in and out based on every move",
        reaction: "is exhausted",
        explanation: "Constant reacting makes it hard to learn what actually matters.",
        effects: { confidence: -2, conviction: -5, risk: 8 },
      },
      {
        id: "quit",
        label: "Quit because investing feels too emotional",
        reaction: "needs a reset",
        explanation: "That feeling is common, but process and patience usually help more than quitting.",
        effects: { confidence: -6, conviction: -7, risk: 2 },
      },
    ],
  },
];

function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

function applyEffects(stats: Stats, effects: Partial<Stats>): Stats {
  return {
    cash: clampStat(stats.cash + (effects.cash ?? 0)),
    confidence: clampStat(stats.confidence + (effects.confidence ?? 0)),
    conviction: clampStat(stats.conviction + (effects.conviction ?? 0)),
    risk: clampStat(stats.risk + (effects.risk ?? 0)),
  };
}

function getEnding(stats: Stats) {
  if (stats.confidence >= 65 && stats.conviction >= 65 && stats.risk <= 45) {
    return {
      title: "Steady Investor",
      body: "You stayed grounded, used evidence, and kept your emotions from running the whole show.",
    };
  }

  if (stats.risk >= 70) {
    return {
      title: "Hype Chaser",
      body: "You felt the market's energy fast, but you gave excitement a little too much control.",
    };
  }

  if (stats.confidence <= 35) {
    return {
      title: "Panic Seller",
      body: "You felt every swing deeply. The next step is building a process that helps you stay calm.",
    };
  }

  return {
    title: "Thoughtful Analyst",
    body: "You were curious, careful, and increasingly process-driven even when the story got messy.",
  };
}

function getMood(stats: Stats) {
  if (stats.risk >= 70) return "is getting reckless";
  if (stats.confidence <= 35) return "is looking rattled";
  if (stats.conviction >= 70) return "looks dialed in";
  return "is figuring it out";
}

export default function SimulationOneScreen() {
  const { profile, selectedCharacter } = useProfile();
  const params = useLocalSearchParams<{ brand?: string }>();
  const [roundIndex, setRoundIndex] = useState(0);
  const [brand, setBrand] = useState(params.brand ?? "");
  const [stats, setStats] = useState<Stats>({
    cash: 70,
    confidence: 50,
    conviction: 45,
    risk: 35,
  });
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [result, setResult] = useState<Choice | null>(null);

  useEffect(() => {
    if (params.brand) {
      setBrand(params.brand);
      return;
    }

    AsyncStorage.getItem(LAST_BRAND_KEY).then((value) => {
      if (value) {
        setBrand(value);
      }
    });
  }, [params.brand]);

  const round = ROUNDS[Math.min(roundIndex, ROUNDS.length - 1)];
  const progressPct = Math.round((Math.min(roundIndex + 1, ROUNDS.length) / ROUNDS.length) * 100);
  const ending = getEnding(stats);
  const mood = result?.reaction ?? getMood(stats);
  const isFinished = roundIndex >= ROUNDS.length;
  const resolvedBrand = brand || "your chosen fast food brand";

  const handleChoice = () => {
    if (!selectedChoiceId) {
      return;
    }

    const choice = round.choices.find((item) => item.id === selectedChoiceId);

    if (!choice) {
      return;
    }

    setStats((current) => applyEffects(current, choice.effects));
    setResult(choice);
  };

  const handleContinue = async () => {
    if (roundIndex === ROUNDS.length - 1) {
      setRoundIndex(ROUNDS.length);
      return;
    }

    setRoundIndex((current) => current + 1);
    setSelectedChoiceId(null);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.replace("/roadmap")} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to roadmap</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>{roundIndex + 1}/{ROUNDS.length}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroBackdrop} />
          <View
            style={[
              styles.avatarBadge,
              { backgroundColor: selectedCharacter?.accent ?? "#1E293B" },
            ]}
          >
            <Text style={styles.avatarEmoji}>{selectedCharacter?.emoji ?? "✨"}</Text>
          </View>
          <View style={styles.avatarCopy}>
            <Text style={styles.avatarName}>
              {(profile?.firstName ?? "You") + "'s"} {selectedCharacter?.label ?? "Investor"}
            </Text>
            <Text style={styles.avatarMood}>
              {selectedCharacter?.label ?? "Your character"} {mood}.
            </Text>
            <Text style={styles.avatarBrand}>Tracking: {resolvedBrand}</Text>
          </View>
        </View>

        <View style={styles.tickerRow}>
          {[
            `${round.kicker}`,
            `${resolvedBrand}`,
            `Cash ${stats.cash}`,
            `Confidence ${stats.confidence}`,
            `Conviction ${stats.conviction}`,
            `Risk ${stats.risk}`,
          ].map((item) => (
            <View key={item} style={styles.tickerPill}>
              <Text style={styles.tickerPillText}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={styles.storyStage}>
          {!isFinished ? (
            <>
              <Text style={styles.kicker}>{round.kicker}</Text>
              <Text style={styles.title}>{round.title}</Text>
              <Text style={styles.body}>{round.body(resolvedBrand)}</Text>

              <View style={styles.marketCard}>
                <View style={styles.marketHeader}>
                  <View>
                    <Text style={styles.marketLabel}>{round.marketLabel}</Text>
                    <Text style={styles.marketValue}>{round.marketValue}</Text>
                  </View>
                  <Text style={styles.marketChip}>LIVE STORY</Text>
                </View>
                <Text style={styles.marketHeadline}>{round.headline(resolvedBrand)}</Text>
              </View>

              <View style={styles.decisionPanel}>
                <Text style={styles.panelTitle}>What do you do?</Text>
                {result ? (
                  <View style={styles.resultCard}>
                    <Text style={styles.resultReaction}>{selectedCharacter?.emoji ?? "✨"} {result.reaction}</Text>
                    <Text style={styles.resultExplanation}>{result.explanation}</Text>
                  </View>
                ) : (
                  <View style={styles.choices}>
                    {round.choices.map((choice, index) => {
                      const selected = selectedChoiceId === choice.id;
                      const choiceLabel = String.fromCharCode(65 + index);
                      return (
                        <TouchableOpacity
                          key={choice.id}
                          onPress={() => setSelectedChoiceId(choice.id)}
                          style={[styles.choiceCard, selected && styles.choiceCardSelected]}
                        >
                          <View style={styles.choiceTag}>
                            <Text style={styles.choiceTagText}>{choiceLabel}</Text>
                          </View>
                          <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
                            {choice.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.kicker}>SIMULATION COMPLETE</Text>
              <Text style={styles.title}>{ending.title}</Text>
              <Text style={styles.body}>{ending.body}</Text>

              <View style={styles.marketCard}>
                <View style={styles.marketHeader}>
                  <View>
                    <Text style={styles.marketLabel}>Final read</Text>
                    <Text style={styles.marketValue}>{resolvedBrand}</Text>
                  </View>
                  <Text style={styles.marketChip}>WRAP-UP</Text>
                </View>
                <Text style={styles.marketHeadline}>
                  You finished the first simulation by learning how demand, profit, expectations, and emotion all collide.
                </Text>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultReaction}>
                  {selectedCharacter?.emoji ?? "✨"} {selectedCharacter?.label ?? "Your character"} {getMood(stats)}.
                </Text>
                <Text style={styles.resultExplanation}>
                  Best next move: keep using a simple checklist before reacting to price swings.
                </Text>
              </View>
            </>
          )}
        </View>

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
                {roundIndex === ROUNDS.length - 1 ? `Finish as ${ending.title}` : "Next round"}
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
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: GREEN,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroCard: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "#13233D",
    borderRadius: 28,
    padding: 18,
    marginBottom: 12,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  heroBackdrop: {
    position: "absolute",
    right: -30,
    top: -20,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(126,214,165,0.12)",
  },
  avatarBadge: {
    width: 92,
    height: 92,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.18)",
  },
  avatarEmoji: {
    fontSize: 40,
  },
  avatarCopy: {
    flex: 1,
    gap: 4,
  },
  avatarName: {
    color: WHITE,
    fontSize: 19,
    fontWeight: "900",
  },
  avatarMood: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
  },
  avatarBrand: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
  },
  tickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  tickerPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  tickerPillText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "800",
  },
  storyStage: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 28,
    padding: 18,
    overflow: "hidden",
  },
  kicker: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    color: WHITE,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 10,
  },
  body: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
  },
  decisionPanel: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  panelTitle: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },
  marketCard: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: "rgba(126,214,165,0.08)",
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.2)",
    padding: 14,
    gap: 10,
  },
  marketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  marketLabel: {
    color: "rgba(203,213,225,0.8)",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  marketValue: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },
  marketChip: {
    color: NAVY,
    backgroundColor: GREEN,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
  },
  marketHeadline: {
    color: WHITE,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
  },
  choices: {
    gap: 10,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(15,23,42,0.55)",
    padding: 14,
  },
  choiceCardSelected: {
    borderColor: "rgba(126,214,165,0.65)",
    backgroundColor: "rgba(126,214,165,0.14)",
  },
  choiceTag: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  choiceTagText: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 12,
  },
  choiceText: {
    flex: 1,
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  choiceTextSelected: {
    color: WHITE,
  },
  resultCard: {
    borderRadius: 18,
    backgroundColor: "rgba(126,214,165,0.08)",
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.2)",
    padding: 14,
    gap: 8,
  },
  resultReaction: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
  },
  resultExplanation: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 15,
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
