import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppBackdrop } from "@/components/app-backdrop";
import {
  BananaRound,
  CoinCompareRound,
  ConsistencyRound,
  FruitRound,
  GAME_LIBRARY,
  GameChoice,
  GameDefinition,
  GoalRound,
  MoveRound,
  MoveSignalCard,
  OwnerRound,
  OwnerSignalCard,
  PaycheckRound,
  QuizRound,
  ShelfRound,
  StrategyRound,
} from "@/lib/game-content";
import { getProgressValue, setProgressValue } from "@/lib/progress-storage";

const NAVY = "#08111F";
const WHITE = "#F8FAFC";
const MUTED = "#A8B7CC";
const GREEN = "#7ED6A5";
const BORDER = "rgba(255,255,255,0.10)";
const PANEL = "rgba(255,255,255,0.05)";
const BAD = "#FCA5A5";
const BANANA_IMAGE = require("@/assets/images/games/banana.svg");
const BASKET_IMAGE = require("@/assets/images/games/basket.svg");
const BROKEN_BASKET_IMAGE = require("@/assets/images/games/basket-broken.svg");
const APPLE_IMAGE = require("@/assets/images/games/apple.svg");
const ORANGE_IMAGE = require("@/assets/images/games/orange.svg");
const BERRY_IMAGE = require("@/assets/images/games/berry.svg");
const COIN_IMAGE = require("@/assets/images/games/coin.svg");
const JAR_SOON_IMAGE = require("@/assets/images/games/jar-soon.svg");
const JAR_LATER_IMAGE = require("@/assets/images/games/jar-later.svg");
const PAYCHECK_IMAGE = require("@/assets/images/games/paycheck.svg");
const BUCKET_SPEND_IMAGE = require("@/assets/images/games/bucket-spend.svg");
const BUCKET_SAVE_IMAGE = require("@/assets/images/games/bucket-save.svg");
const BUCKET_FUTURE_IMAGE = require("@/assets/images/games/bucket-future.svg");
const BUCKET_MATCH_IMAGE = require("@/assets/images/games/bucket-match.svg");
const BLOCK_BLUE_IMAGE = require("@/assets/images/games/block-blue.svg");
const BLOCK_GREEN_IMAGE = require("@/assets/images/games/block-green.svg");
const BLOCK_PURPLE_IMAGE = require("@/assets/images/games/block-purple.svg");
const SHELF_IMAGE = require("@/assets/images/games/shelf.svg");
const PLANT_IMAGE = require("@/assets/images/games/plant.svg");
const RAIN_IMAGE = require("@/assets/images/games/rain.svg");
const SUN_IMAGE = require("@/assets/images/games/sun.svg");
const WATERING_CAN_IMAGE = require("@/assets/images/games/watering-can.svg");
const SHINY_THING_IMAGE = require("@/assets/images/games/shiny-thing.svg");
const OWNER_ASSETS = {
  customers: require("@/assets/images/games/owner-customers.svg"),
  logo: require("@/assets/images/games/owner-logo.svg"),
  price: require("@/assets/images/games/owner-price.svg"),
  profit: require("@/assets/images/games/owner-profit.svg"),
  stores: require("@/assets/images/games/owner-stores.svg"),
  surprise: require("@/assets/images/games/owner-surprise.svg"),
} as const;
const MOVE_ASSETS = {
  company: require("@/assets/images/games/move-company.svg"),
  sector: require("@/assets/images/games/move-sector.svg"),
  market: require("@/assets/images/games/move-market.svg"),
} as const;

const DEFAULT_THEMES: Record<number, { accent: string; glow: string; panel: string }> = {
  1: { accent: "#7ED6A5", glow: "rgba(126,214,165,0.18)", panel: "rgba(126,214,165,0.08)" },
  2: { accent: "#60A5FA", glow: "rgba(96,165,250,0.18)", panel: "rgba(96,165,250,0.08)" },
  3: { accent: "#FACC15", glow: "rgba(250,204,21,0.20)", panel: "rgba(250,204,21,0.09)" },
  4: { accent: "#C084FC", glow: "rgba(192,132,252,0.18)", panel: "rgba(192,132,252,0.08)" },
  5: { accent: "#FB923C", glow: "rgba(251,146,60,0.18)", panel: "rgba(251,146,60,0.08)" },
  6: { accent: "#38BDF8", glow: "rgba(56,189,248,0.18)", panel: "rgba(56,189,248,0.08)" },
  7: { accent: "#F472B6", glow: "rgba(244,114,182,0.18)", panel: "rgba(244,114,182,0.08)" },
  8: { accent: "#34D399", glow: "rgba(52,211,153,0.18)", panel: "rgba(52,211,153,0.08)" },
  9: { accent: "#A78BFA", glow: "rgba(167,139,250,0.18)", panel: "rgba(167,139,250,0.08)" },
  10: { accent: "#F43F5E", glow: "rgba(244,63,94,0.18)", panel: "rgba(244,63,94,0.08)" },
};

type Props = {
  lessonNumber: number;
};

type BananaResult = {
  body: string;
  brokenCount: number;
  remainingCount: number;
  success: boolean;
  title: string;
};

type SimpleResult = {
  body: string;
  success: boolean;
  title: string;
};

export function GamePlayer({ lessonNumber }: Props) {
  const game = GAME_LIBRARY[lessonNumber] as GameDefinition;
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<GameChoice | null>(null);
  const [score, setScore] = useState(0);
  const [bananaPlacements, setBananaPlacements] = useState<Record<string, number>>({});
  const [bananaResult, setBananaResult] = useState<BananaResult | null>(null);
  const [fruitPlacements, setFruitPlacements] = useState<Record<string, string[]>>({});
  const [fruitResult, setFruitResult] = useState<SimpleResult | null>(null);
  const [goalIndex, setGoalIndex] = useState(0);
  const [goalResult, setGoalResult] = useState<SimpleResult | null>(null);
  const [paycheckPlacements, setPaycheckPlacements] = useState<Record<string, number>>({});
  const [paycheckResult, setPaycheckResult] = useState<SimpleResult | null>(null);
  const [shelfPlacements, setShelfPlacements] = useState<Record<string, number>>({});
  const [shelfResult, setShelfResult] = useState<SimpleResult | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAccess() {
      const lessonDone = await getProgressValue(`completedLesson${lessonNumber}`);

      if (!isMounted) {
        return;
      }

      if (lessonDone !== "true") {
        router.replace("/roadmap");
        return;
      }

      setIsReady(true);
    }

    void loadAccess();

    return () => {
      isMounted = false;
    };
  }, [lessonNumber]);

  useEffect(() => {
    setSelectedChoice(null);
    setBananaPlacements({});
    setBananaResult(null);
    setFruitPlacements({});
    setFruitResult(null);
    setGoalIndex(0);
    setGoalResult(null);
    setPaycheckPlacements({});
    setPaycheckResult(null);
    setShelfPlacements({});
    setShelfResult(null);
  }, [roundIndex, lessonNumber]);

  const theme = game.theme ?? DEFAULT_THEMES[lessonNumber] ?? DEFAULT_THEMES[1];
  const introConcept = game.intro?.concept ?? game.skill;
  const introInstruction =
    game.intro?.instruction ??
    (game.mechanicType === "bananas" ||
    game.mechanicType === "fruit-basket" ||
    game.mechanicType === "paycheck-buckets"
      ? "Tap to place."
      : "Choose the best move.");
  const totalRounds = game.rounds.length;
  const isFinished = roundIndex >= totalRounds;
  const isBananaGame = game.mechanicType === "bananas";
  const isFruitGame = game.mechanicType === "fruit-basket";
  const isStrategyGame = game.mechanicType === "strategy-bags";
  const isGoalGame = game.mechanicType === "goal-sort";
  const isCoinGame = game.mechanicType === "coin-compare";
  const isPaycheckGame = game.mechanicType === "paycheck-buckets";
  const isShelfGame = game.mechanicType === "shelf-build";
  const isConsistencyGame = game.mechanicType === "consistency-scene";
  const isMoveBoardGame = game.mechanicType === "move-board";
  const isOwnerBoardGame = game.mechanicType === "owner-board";
  const quizRound =
    !isBananaGame &&
    !isOwnerBoardGame &&
    !isMoveBoardGame &&
    !isFruitGame &&
    !isStrategyGame &&
    !isGoalGame &&
    !isCoinGame &&
    !isPaycheckGame &&
    !isShelfGame &&
    !isConsistencyGame
      ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as QuizRound)
      : null;
  const bananaRound = (isBananaGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as BananaRound) : null);
  const fruitRound = (isFruitGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as FruitRound) : null);
  const strategyRound =
    isStrategyGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as StrategyRound) : null;
  const goalRound = (isGoalGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as GoalRound) : null);
  const coinRound = (isCoinGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as CoinCompareRound) : null);
  const paycheckRound =
    isPaycheckGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as PaycheckRound) : null;
  const shelfRound = (isShelfGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as ShelfRound) : null);
  const consistencyRound =
    isConsistencyGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as ConsistencyRound) : null;
  const ownerRound =
    isOwnerBoardGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as OwnerRound) : null;
  const moveRound =
    isMoveBoardGame ? (game.rounds[Math.min(roundIndex, totalRounds - 1)] as MoveRound) : null;

  const resultLabel = useMemo(() => {
    if (score >= totalRounds) {
      return game.resultLabels.strong;
    }

    if (score >= Math.ceil(totalRounds / 2)) {
      return game.resultLabels.solid;
    }

    return game.resultLabels.needsWork;
  }, [game.resultLabels, score, totalRounds]);

  const topMeta = !hasStarted ? "Intro" : isFinished ? "Done" : `${roundIndex + 1}/${totalRounds}`;
  const progressPct = !hasStarted
    ? 0
    : Math.round((Math.min(roundIndex + 1, totalRounds) / totalRounds) * 100);

  async function finishGame() {
    await setProgressValue(game.completionKey, "true");
    router.replace("/roadmap");
  }

  function choose(choice: GameChoice) {
    if (selectedChoice) {
      return;
    }

    setSelectedChoice(choice);
    if (choice.isBest) {
      setScore((current) => current + 1);
    }
  }

  function chooseOwnerCard(card: OwnerSignalCard) {
    if (selectedChoice) {
      return;
    }

    setSelectedChoice({
      id: card.id,
      label: card.label,
      result: card.result,
      feedback: card.feedback,
      isBest: card.isBest,
    });

    if (card.isBest) {
      setScore((current) => current + 1);
    }
  }

  function chooseMoveCard(card: MoveSignalCard) {
    if (selectedChoice) {
      return;
    }

    setSelectedChoice({
      id: card.id,
      label: card.label,
      result: card.result,
      feedback: card.feedback,
      isBest: card.isBest,
    });

    if (card.isBest) {
      setScore((current) => current + 1);
    }
  }

  function placeFruit(basketId: string) {
    if (!fruitRound || fruitResult) {
      return;
    }

    const placedCount = Object.values(fruitPlacements).reduce((sum, items) => sum + items.length, 0);
    if (placedCount >= fruitRound.totalItems.length) {
      return;
    }

    const nextItem = fruitRound.totalItems[placedCount];
    setFruitPlacements((current) => ({
      ...current,
      [basketId]: [...(current[basketId] ?? []), nextItem.kind],
    }));
  }

  function undoFruit() {
    if (!fruitRound || fruitResult) {
      return;
    }

    const lastFilledBasket = [...fruitRound.baskets]
      .reverse()
      .find((basket) => (fruitPlacements[basket.id] ?? []).length > 0);

    if (!lastFilledBasket) {
      return;
    }

    setFruitPlacements((current) => ({
      ...current,
      [lastFilledBasket.id]: (current[lastFilledBasket.id] ?? []).slice(0, -1),
    }));
  }

  function chooseGoal(bucket: "soon" | "later") {
    if (!goalRound || goalResult) {
      return;
    }

    const card = goalRound.cards[goalIndex];
    const success = card.correctBucket === bucket;
    if (success) {
      setScore((current) => current + 1);
    }

    const isLast = goalIndex === goalRound.cards.length - 1;
    if (isLast) {
      setGoalResult({
        success,
        title: success ? "Nice match" : "One more look",
        body: success ? "You matched the timing to the goal." : "That goal belongs in the other jar.",
      });
      return;
    }

    setGoalIndex((current) => current + 1);
  }

  function chooseCoin(side: "left" | "right") {
    if (!coinRound || selectedChoice) {
      return;
    }

    const leftNet = coinRound.leftCoins - coinRound.leftTax;
    const rightNet = coinRound.rightCoins - coinRound.rightTax;
    const correct = leftNet >= rightNet ? "left" : "right";
    const isBest = side === correct;
    setSelectedChoice({
      id: side,
      label: side,
      result: isBest ? "+Best move" : "Not quite",
      feedback: isBest
        ? "Yes. After-tax coins are what really matter."
        : "Look at what is left after tax removes some coins.",
      isBest,
    });

    if (isBest) {
      setScore((current) => current + 1);
    }
  }

  function placePaycheckCoin(bucketId: string) {
    if (!paycheckRound || paycheckResult) {
      return;
    }

    const placedCount = Object.values(paycheckPlacements).reduce((sum, value) => sum + value, 0);
    if (placedCount >= paycheckRound.totalCoins) {
      return;
    }

    setPaycheckPlacements((current) => ({
      ...current,
      [bucketId]: (current[bucketId] ?? 0) + 1,
    }));
  }

  function undoPaycheckCoin() {
    if (!paycheckRound || paycheckResult) {
      return;
    }

    const lastFilledBucket = [...paycheckRound.buckets]
      .reverse()
      .find((bucket) => (paycheckPlacements[bucket.id] ?? 0) > 0);

    if (!lastFilledBucket) {
      return;
    }

    setPaycheckPlacements((current) => ({
      ...current,
      [lastFilledBucket.id]: Math.max(0, (current[lastFilledBucket.id] ?? 0) - 1),
    }));
  }

  function placeShelfBlock(shelfId: string) {
    if (!shelfRound || shelfResult) {
      return;
    }

    const placedCount = Object.values(shelfPlacements).reduce((sum, value) => sum + value, 0);
    if (placedCount >= shelfRound.totalBlocks.length) {
      return;
    }

    setShelfPlacements((current) => ({
      ...current,
      [shelfId]: (current[shelfId] ?? 0) + 1,
    }));
  }

  function undoShelfBlock() {
    if (!shelfRound || shelfResult) {
      return;
    }

    const lastFilledShelf = [...shelfRound.shelves]
      .reverse()
      .find((shelf) => (shelfPlacements[shelf.id] ?? 0) > 0);

    if (!lastFilledShelf) {
      return;
    }

    setShelfPlacements((current) => ({
      ...current,
      [lastFilledShelf.id]: Math.max(0, (current[lastFilledShelf.id] ?? 0) - 1),
    }));
  }

  function nextRound() {
    if (!selectedChoice && !bananaResult && !fruitResult && !goalResult && !paycheckResult && !shelfResult) {
      return;
    }

    setRoundIndex((current) => current + 1);
  }

  function placeBanana(basketId: string) {
    if (!bananaRound || bananaResult) {
      return;
    }

    const placedCount = Object.values(bananaPlacements).reduce((sum, value) => sum + value, 0);

    if (placedCount >= bananaRound.totalBananas) {
      return;
    }

    setBananaPlacements((current) => ({
      ...current,
      [basketId]: (current[basketId] ?? 0) + 1,
    }));
  }

  function undoBanana() {
    if (!bananaRound || bananaResult) {
      return;
    }

    const lastFilledBasket = [...bananaRound.baskets]
      .reverse()
      .find((basket) => (bananaPlacements[basket.id] ?? 0) > 0);

    if (!lastFilledBasket) {
      return;
    }

    setBananaPlacements((current) => ({
      ...current,
      [lastFilledBasket.id]: Math.max(0, (current[lastFilledBasket.id] ?? 0) - 1),
    }));
  }

  useEffect(() => {
    if (!bananaRound || bananaResult) {
      return;
    }

    const placedCount = Object.values(bananaPlacements).reduce((sum, value) => sum + value, 0);

    if (placedCount !== bananaRound.totalBananas) {
      return;
    }

    const evaluation = evaluateBananaRound(bananaRound, bananaPlacements);
    setBananaResult(evaluation);

    if (evaluation.success) {
      setScore((current) => current + 1);
    }
  }, [bananaPlacements, bananaResult, bananaRound]);

  useEffect(() => {
    if (!fruitRound || fruitResult) {
      return;
    }

    const placedCount = Object.values(fruitPlacements).reduce((sum, items) => sum + items.length, 0);
    if (placedCount !== fruitRound.totalItems.length) {
      return;
    }

    const evaluation = evaluateFruitRound(fruitRound, fruitPlacements);
    setFruitResult(evaluation);
    if (evaluation.success) {
      setScore((current) => current + 1);
    }
  }, [fruitPlacements, fruitResult, fruitRound]);

  useEffect(() => {
    if (!paycheckRound || paycheckResult) {
      return;
    }

    const placedCount = Object.values(paycheckPlacements).reduce((sum, value) => sum + value, 0);
    if (placedCount !== paycheckRound.totalCoins) {
      return;
    }

    const evaluation = evaluatePaycheckRound(paycheckRound, paycheckPlacements);
    setPaycheckResult(evaluation);
    if (evaluation.success) {
      setScore((current) => current + 1);
    }
  }, [paycheckPlacements, paycheckResult, paycheckRound]);

  useEffect(() => {
    if (!shelfRound || shelfResult) {
      return;
    }

    const placedCount = Object.values(shelfPlacements).reduce((sum, value) => sum + value, 0);
    if (placedCount !== shelfRound.totalBlocks.length) {
      return;
    }

    const evaluation = evaluateShelfRound(shelfRound, shelfPlacements);
    setShelfResult(evaluation);
    if (evaluation.success) {
      setScore((current) => current + 1);
    }
  }, [shelfPlacements, shelfResult, shelfRound]);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBackdrop accent={theme.accent} />
        <View style={styles.loadingCard}>
          <View style={[styles.loadingOrb, { backgroundColor: theme.glow }]} />
          <Text style={styles.loadingTitle}>Loading game...</Text>
          <Text style={styles.loadingText}>Getting your lesson progress ready.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppBackdrop accent={theme.accent} />
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.replace("/roadmap")} style={styles.backButton}>
          <Text style={styles.backText}>Back to roadmap</Text>
        </TouchableOpacity>
        <Text style={styles.topMeta}>
          Game {lessonNumber} • {topMeta}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: theme.accent }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!hasStarted ? (
          <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
            <Text style={[styles.kicker, { color: theme.accent }]}>LESSON GAME</Text>
            <View style={styles.introArtRow}>
              <View style={[styles.introArtCard, { borderColor: theme.glow, backgroundColor: "rgba(255,255,255,0.06)" }]}>
                <View style={[styles.introArtCircle, { backgroundColor: theme.accent }]} />
                <Text style={styles.introArtLabel}>Play</Text>
              </View>
              <View style={[styles.introArtCard, { borderColor: theme.glow, backgroundColor: "rgba(255,255,255,0.03)" }]}>
                <View style={styles.introArtBars}>
                  <View style={[styles.introBarShort, { backgroundColor: theme.accent }]} />
                  <View style={styles.introBarLong} />
                  <View style={styles.introBarMedium} />
                </View>
                <Text style={styles.introArtLabel}>Goal</Text>
              </View>
            </View>
            <Text style={styles.title}>{game.gameTitle}</Text>
            <Text style={styles.summary}>{game.summary}</Text>

            <View style={styles.introInfoRow}>
              <View style={styles.infoChip}>
                <Text style={styles.infoChipLabel}>You&apos;ll practice</Text>
                <Text style={[styles.infoChipValue, { color: theme.accent }]}>{introConcept}</Text>
              </View>
              <View style={styles.infoChip}>
                <Text style={styles.infoChipLabel}>How to play</Text>
                <Text style={styles.infoChipValue}>{introInstruction}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setHasStarted(true)}
              style={[styles.primaryButton, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.primaryButtonText}>Start game</Text>
            </TouchableOpacity>
          </View>
        ) : !isFinished ? (
          <>
            {isOwnerBoardGame && ownerRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{ownerRound.title}</Text>
                  <Text style={styles.summary}>{ownerRound.prompt}</Text>

                  <View style={styles.ownerBoard}>
                    <View style={styles.ownerHeadlineRow}>
                      <View style={[styles.ownerHeadlineDot, { backgroundColor: theme.accent }]} />
                      <Text style={styles.ownerHeadlineText}>{ownerRound.headline}</Text>
                    </View>

                    <View style={styles.ownerChart}>
                      {ownerRound.chartBars.map((bar, index) => (
                        <View key={index} style={styles.ownerChartCol}>
                          <View
                            style={[
                              styles.ownerChartBar,
                              {
                                height: 16 + bar * 8,
                                backgroundColor: index === ownerRound.chartBars.length - 1 ? theme.accent : "rgba(255,255,255,0.18)",
                              },
                            ]}
                          />
                        </View>
                      ))}
                    </View>

                    <View style={styles.ownerMiniStats}>
                      <View style={styles.ownerMiniStat}>
                        <Text style={styles.ownerMiniStatLabel}>Revenue</Text>
                        <Text style={styles.ownerMiniStatValue}>Up</Text>
                      </View>
                      <View style={styles.ownerMiniStat}>
                        <Text style={styles.ownerMiniStatLabel}>Stores</Text>
                        <Text style={styles.ownerMiniStatValue}>Growing</Text>
                      </View>
                      <View style={styles.ownerMiniStat}>
                        <Text style={styles.ownerMiniStatLabel}>Price</Text>
                        <Text style={styles.ownerMiniStatValue}>Moving</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.ownerCardGrid}>
                  {ownerRound.cards.map((card) => {
                    const isSelected = selectedChoice?.id === card.id;
                    const showBest = !!selectedChoice && card.isBest;
                    const showWrong = !!selectedChoice && isSelected && !card.isBest;

                    return (
                      <TouchableOpacity
                        key={card.id}
                        onPress={() => chooseOwnerCard(card)}
                        disabled={!!selectedChoice}
                        style={[
                          styles.ownerCard,
                          isSelected && styles.choiceCardSelected,
                          showBest && styles.choiceCardBest,
                          showWrong && styles.choiceCardWrong,
                        ]}
                      >
                        <View style={styles.ownerCardVisual}>{renderOwnerCardVisual(card)}</View>
                        <Text style={styles.ownerCardLabel}>{card.label}</Text>
                        <Text style={[styles.ownerCardValue, { color: theme.accent }]}>{card.value}</Text>
                        {selectedChoice ? (
                          <Text
                            style={[
                              styles.choiceResult,
                              showBest ? styles.choiceResultBest : showWrong ? styles.choiceResultWrong : null,
                            ]}
                          >
                            {card.result}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.feedbackCard}>
                  {selectedChoice ? (
                    <>
                      <Text style={[styles.feedbackTitle, { color: selectedChoice.isBest ? theme.accent : BAD }]}>
                        {selectedChoice.isBest ? "That is owner thinking" : "That is more customer thinking"}
                      </Text>
                      <Text style={styles.feedbackText}>{selectedChoice.feedback}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.feedbackTitle, { color: theme.accent }]}>Watch the board</Text>
                      <Text style={styles.feedbackText}>
                        Check the chart, the headline, and the business cards. Then tap what matters most.
                      </Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  onPress={nextRound}
                  disabled={!selectedChoice}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: theme.accent },
                    !selectedChoice && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.primaryButtonText}>Next round</Text>
                </TouchableOpacity>
              </>
            ) : isMoveBoardGame && moveRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{moveRound.title}</Text>
                  <Text style={styles.summary}>{moveRound.prompt}</Text>

                  <View style={styles.moveBoard}>
                    <View style={styles.moveScannerTop}>
                      <Text style={styles.moveScannerLabel}>Move splash</Text>
                      <View style={styles.moveScannerPill}>
                        <Text style={[styles.moveScannerPillText, { color: theme.accent }]}>1 / MANY / ALL</Text>
                      </View>
                    </View>

                    <View style={styles.moveHeadlineCard}>
                      <Text style={styles.moveHeadline}>{moveRound.headline}</Text>
                    </View>

                    <View style={styles.moveSplashCard}>
                      <View style={styles.moveStockMetaRow}>
                        <Text style={styles.moveTicker}>Who moved?</Text>
                        <Text style={[styles.moveDelta, { color: theme.accent }]}>Look wide</Text>
                      </View>

                      <View style={styles.moveChart}>
                        {moveRound.chartBars.map((bar, index) => (
                          <View key={index} style={styles.moveChartCol}>
                            <View
                              style={[
                                styles.moveChartBar,
                                {
                                  height: 16 + bar * 8,
                                  backgroundColor:
                                    index === moveRound.chartBars.length - 1
                                      ? theme.accent
                                      : "rgba(255,255,255,0.15)",
                                },
                              ]}
                            />
                          </View>
                        ))}
                      </View>

                      <View style={styles.moveMiniTickerRow}>
                        {["A", "B", "C", "D", "E", "F"].map((item, index) => (
                          <View key={item} style={[styles.moveMiniTicker, index > 2 && styles.moveMiniTickerFaded]}>
                            <Text style={styles.moveMiniTickerText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.moveClueRow}>
                      <View style={styles.moveClueCard}>
                        <Text style={styles.moveClueTitle}>Clue 1</Text>
                        <Text style={styles.moveClueValue}>How big was the splash?</Text>
                      </View>
                      <View style={styles.moveClueCard}>
                        <Text style={styles.moveClueTitle}>Clue 2</Text>
                        <Text style={styles.moveClueValue}>One, many, or all?</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.moveChoiceGrid}>
                  {moveRound.cards.map((card) => {
                    const isSelected = selectedChoice?.id === card.id;
                    const showBest = !!selectedChoice && card.isBest;
                    const showWrong = !!selectedChoice && isSelected && !card.isBest;

                    return (
                      <TouchableOpacity
                        key={card.id}
                        onPress={() => chooseMoveCard(card)}
                        disabled={!!selectedChoice}
                        style={[
                          styles.moveChoiceCard,
                          isSelected && styles.choiceCardSelected,
                          showBest && styles.choiceCardBest,
                          showWrong && styles.choiceCardWrong,
                        ]}
                      >
                        <View style={styles.moveChoiceVisual}>{renderMoveCardVisual(card)}</View>
                        <Text style={styles.moveChoiceLabel}>{card.label}</Text>
                        <Text style={styles.moveChoiceHint}>{card.value}</Text>
                        <View style={styles.moveChoiceDotsRow}>{renderMoveScopePreview(card.kind, theme.accent)}</View>
                        {selectedChoice ? (
                          <Text
                            style={[
                              styles.choiceResult,
                              showBest ? styles.choiceResultBest : showWrong ? styles.choiceResultWrong : null,
                            ]}
                          >
                            {card.result}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.feedbackCard}>
                  {selectedChoice ? (
                    <>
                      <Text style={[styles.feedbackTitle, { color: selectedChoice.isBest ? theme.accent : BAD }]}>
                        {selectedChoice.isBest ? "That matches the move" : "That is the wrong size move"}
                      </Text>
                      <Text style={styles.feedbackText}>{selectedChoice.feedback}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.feedbackTitle, { color: theme.accent }]}>Scan the market</Text>
                      <Text style={styles.feedbackText}>
                        Decide whether the move belongs to one company, a whole sector, or the whole market.
                      </Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  onPress={nextRound}
                  disabled={!selectedChoice}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: theme.accent },
                    !selectedChoice && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.primaryButtonText}>Next round</Text>
                </TouchableOpacity>
              </>
            ) : isFruitGame && fruitRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{fruitRound.title}</Text>
                  <Text style={styles.summary}>{fruitRound.prompt}</Text>
                  <Text style={styles.fruitWarning}>Spoiled fruit: {fruitRound.spoiledKind}</Text>

                  <View style={styles.bananaStrip}>
                    {fruitRound.totalItems.map((item, index) => {
                      const placedCount = Object.values(fruitPlacements).reduce((sum, items) => sum + items.length, 0);
                      const isPlaced = index < placedCount;
                      return (
                        <View key={item.id} style={[styles.bananaToken, isPlaced && styles.bananaTokenUsed]}>
                          <Image source={getFruitAsset(item.kind)} style={styles.bananaImage} contentFit="contain" />
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.basketGrid}>
                  {fruitRound.baskets.map((basket) => {
                    const count = (fruitPlacements[basket.id] ?? []).length;
                    return (
                      <TouchableOpacity
                        key={basket.id}
                        onPress={() => placeFruit(basket.id)}
                        disabled={!!fruitResult}
                        style={[
                          styles.basketCard,
                          { backgroundColor: `${basket.accent}16`, borderColor: `${basket.accent}AA` },
                        ]}
                      >
                        <Image source={BASKET_IMAGE} style={styles.basketImage} contentFit="contain" />
                        <Text style={styles.basketTitle}>{basket.label}</Text>
                        <Text style={[styles.basketCount, { color: basket.accent }]}>{count} fruits</Text>
                        <Text style={styles.basketHint}>{fruitResult ? "Locked in" : "Tap to add"}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View
                  style={[
                    styles.feedbackCard,
                    fruitResult ? (fruitResult.success ? styles.feedbackCardGood : styles.feedbackCardBad) : null,
                  ]}
                >
                  <Text style={[styles.feedbackTitle, { color: fruitResult ? (fruitResult.success ? theme.accent : BAD) : theme.accent }]}>
                    {fruitResult ? fruitResult.title : "Mix the basket"}
                  </Text>
                  <Text style={styles.feedbackText}>
                    {fruitResult
                      ? fruitResult.body
                      : "Spread the fruit so one spoiled type does not wipe out a whole basket."}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={undoFruit} disabled={!!fruitResult} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Undo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={nextRound}
                    disabled={!fruitResult}
                    style={[styles.primaryButton, { backgroundColor: theme.accent }, !fruitResult && styles.disabledButton]}
                  >
                    <Text style={styles.primaryButtonText}>Next round</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : isStrategyGame && strategyRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{strategyRound.title}</Text>
                  <Text style={styles.summary}>{strategyRound.prompt}</Text>

                  <View style={styles.strategyHero}>
                    <View style={styles.strategyKidCard}>
                      <View style={styles.strategyKidVisual}>{renderStrategyKidVisual(strategyRound.kidKind)}</View>
                      <Text style={styles.strategyTripLabel}>{strategyRound.tripLabel}</Text>
                      <Text style={styles.strategyMood}>{strategyRound.mood}</Text>
                    </View>
                    <View style={[styles.strategyHintCard, { borderColor: `${theme.accent}55` }]}>
                      <Text style={[styles.strategyHintKicker, { color: theme.accent }]}>LOOK FOR</Text>
                      <Text style={styles.strategyHintText}>A bag this kid can actually carry.</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.strategyChoiceGrid}>
                  {strategyRound.choices.map((choice) => {
                    const isSelected = selectedChoice?.id === choice.id;
                    const showBest = !!selectedChoice && choice.isBest;
                    const showWrong = !!selectedChoice && isSelected && !choice.isBest;

                    return (
                      <TouchableOpacity
                        key={choice.id}
                        onPress={() => choose({ ...choice })}
                        disabled={!!selectedChoice}
                        style={[
                          styles.strategyChoiceCard,
                          isSelected && styles.choiceCardSelected,
                          showBest && styles.choiceCardBest,
                          showWrong && styles.choiceCardWrong,
                        ]}
                      >
                        <View style={styles.strategyChoiceVisual}>{renderStrategyBagVisual(choice.kind, theme.accent)}</View>
                        <Text style={styles.strategyChoiceLabel}>{choice.label}</Text>
                        <Text style={styles.strategyChoiceValue}>{choice.value}</Text>
                        {selectedChoice ? (
                          <Text
                            style={[
                              styles.choiceResult,
                              showBest ? styles.choiceResultBest : showWrong ? styles.choiceResultWrong : null,
                            ]}
                          >
                            {choice.result}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.feedbackCard}>
                  {selectedChoice ? (
                    <>
                      <Text style={[styles.feedbackTitle, { color: selectedChoice.isBest ? theme.accent : BAD }]}>
                        {selectedChoice.isBest ? "Nice fit" : "Try a better fit"}
                      </Text>
                      <Text style={styles.feedbackText}>{selectedChoice.feedback}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.feedbackTitle, { color: theme.accent }]}>Match the bag</Text>
                      <Text style={styles.feedbackText}>The best plan should feel carryable for that person.</Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  onPress={nextRound}
                  disabled={!selectedChoice}
                  style={[styles.primaryButton, { backgroundColor: theme.accent }, !selectedChoice && styles.disabledButton]}
                >
                  <Text style={styles.primaryButtonText}>Next round</Text>
                </TouchableOpacity>
              </>
            ) : isGoalGame && goalRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{goalRound.title}</Text>
                  <Text style={styles.summary}>{goalRound.prompt}</Text>
                  <View style={styles.goalCard}>
                    <Text style={styles.goalCardLabel}>{goalRound.cards[goalIndex]?.label}</Text>
                  </View>
                </View>
                <View style={styles.jarRow}>
                  <TouchableOpacity style={styles.jarCard} onPress={() => chooseGoal("soon")} disabled={!!goalResult}>
                    <Image source={JAR_SOON_IMAGE} style={styles.jarImage} contentFit="contain" />
                    <Text style={styles.jarLabel}>Soon</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.jarCard} onPress={() => chooseGoal("later")} disabled={!!goalResult}>
                    <Image source={JAR_LATER_IMAGE} style={styles.jarImage} contentFit="contain" />
                    <Text style={styles.jarLabel}>Later</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.feedbackCard,
                    goalResult ? (goalResult.success ? styles.feedbackCardGood : styles.feedbackCardBad) : null,
                  ]}
                >
                  <Text style={[styles.feedbackTitle, { color: goalResult ? (goalResult.success ? theme.accent : BAD) : theme.accent }]}>
                    {goalResult ? goalResult.title : `Card ${goalIndex + 1} of ${goalRound.cards.length}`}
                  </Text>
                  <Text style={styles.feedbackText}>
                    {goalResult ? goalResult.body : "Short goals go in Soon. Far-away goals go in Later."}
                  </Text>
                </View>
                {goalResult ? (
                  <TouchableOpacity onPress={nextRound} style={[styles.primaryButton, { backgroundColor: theme.accent }]}>
                    <Text style={styles.primaryButtonText}>Next round</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : isCoinGame && coinRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{coinRound.title}</Text>
                  <Text style={styles.summary}>{coinRound.prompt}</Text>
                </View>
                <View style={styles.coinCompareRow}>
                  <TouchableOpacity style={styles.coinSide} onPress={() => chooseCoin("left")} disabled={!!selectedChoice}>
                    <Text style={styles.coinSideTitle}>Left</Text>
                    <View style={styles.coinStack}>{renderCoins(coinRound.leftCoins)}</View>
                    <Text style={styles.coinTax}>Tax takes {coinRound.leftTax}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.coinSide} onPress={() => chooseCoin("right")} disabled={!!selectedChoice}>
                    <Text style={styles.coinSideTitle}>Right</Text>
                    <View style={styles.coinStack}>{renderCoins(coinRound.rightCoins)}</View>
                    <Text style={styles.coinTax}>Tax takes {coinRound.rightTax}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.feedbackCard}>
                  {selectedChoice ? (
                    <>
                      <Text style={[styles.feedbackTitle, { color: selectedChoice.isBest ? theme.accent : BAD }]}>
                        {selectedChoice.isBest ? "Keep more" : "Look after tax"}
                      </Text>
                      <Text style={styles.feedbackText}>{selectedChoice.feedback}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.feedbackTitle, { color: theme.accent }]}>Compare net coins</Text>
                      <Text style={styles.feedbackText}>Pick the side that keeps more after tax removes some coins.</Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  onPress={nextRound}
                  disabled={!selectedChoice}
                  style={[styles.primaryButton, { backgroundColor: theme.accent }, !selectedChoice && styles.disabledButton]}
                >
                  <Text style={styles.primaryButtonText}>Next round</Text>
                </TouchableOpacity>
              </>
            ) : isShelfGame && shelfRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{shelfRound.title}</Text>
                  <Text style={styles.summary}>{shelfRound.prompt}</Text>

                  <View style={styles.bananaStrip}>
                    {shelfRound.totalBlocks.map((block, index) => {
                      const placedCount = Object.values(shelfPlacements).reduce((sum, value) => sum + value, 0);
                      const isPlaced = index < placedCount;
                      return (
                        <View key={block.id} style={[styles.bananaToken, isPlaced && styles.bananaTokenUsed]}>
                          <Image source={getBlockAsset(block.kind)} style={styles.bananaImage} contentFit="contain" />
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.basketGrid}>
                  {shelfRound.shelves.map((shelf) => {
                    const count = shelfPlacements[shelf.id] ?? 0;
                    return (
                      <TouchableOpacity
                        key={shelf.id}
                        onPress={() => placeShelfBlock(shelf.id)}
                        disabled={!!shelfResult}
                        style={[
                          styles.basketCard,
                          { backgroundColor: `${shelf.accent}16`, borderColor: `${shelf.accent}AA` },
                        ]}
                      >
                        <Image source={SHELF_IMAGE} style={styles.bucketImage} contentFit="contain" />
                        <Text style={styles.basketTitle}>{shelf.label}</Text>
                        <View style={styles.shelfPreviewRow}>
                          {Array.from({ length: count }).map((_, index) => {
                            const block = shelfRound.totalBlocks[index % shelfRound.totalBlocks.length];
                            return (
                              <View key={`${shelf.id}-${index}`} style={styles.shelfPreviewBlock}>
                                <Image source={getBlockAsset(block.kind)} style={styles.shelfPreviewImage} contentFit="contain" />
                              </View>
                            );
                          })}
                        </View>
                        <Text style={[styles.basketCount, { color: shelf.accent }]}>{count} blocks</Text>
                        <Text style={styles.basketHint}>{shelfResult ? "Locked in" : "Tap to add"}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View
                  style={[
                    styles.feedbackCard,
                    shelfResult ? (shelfResult.success ? styles.feedbackCardGood : styles.feedbackCardBad) : null,
                  ]}
                >
                  <Text style={[styles.feedbackTitle, { color: shelfResult ? (shelfResult.success ? theme.accent : BAD) : theme.accent }]}>
                    {shelfResult ? shelfResult.title : "Keep it balanced"}
                  </Text>
                  <Text style={styles.feedbackText}>
                    {shelfResult
                      ? shelfResult.body
                      : "A starter portfolio should feel balanced, not overloaded in one place."}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={undoShelfBlock} disabled={!!shelfResult} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Undo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={nextRound}
                    disabled={!shelfResult}
                    style={[styles.primaryButton, { backgroundColor: theme.accent }, !shelfResult && styles.disabledButton]}
                  >
                    <Text style={styles.primaryButtonText}>Next round</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : isConsistencyGame && consistencyRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{consistencyRound.title}</Text>
                  <Text style={styles.summary}>{consistencyRound.prompt}</Text>
                  <View style={styles.consistencyScene}>
                    <Image
                      source={consistencyRound.scene === "rain" ? RAIN_IMAGE : SUN_IMAGE}
                      style={styles.sceneImage}
                      contentFit="contain"
                    />
                    <View style={styles.plantStageWrap}>
                      <View style={styles.plantProgressRow}>
                        {Array.from({ length: 3 }).map((_, index) => (
                          <View
                            key={index}
                            style={[
                              styles.plantProgressDot,
                              { backgroundColor: index <= roundIndex ? theme.accent : "rgba(255,255,255,0.12)" },
                            ]}
                          />
                        ))}
                      </View>
                      <Image source={PLANT_IMAGE} style={styles.plantImage} contentFit="contain" />
                      <View style={styles.plantGround} />
                    </View>
                    <View style={styles.consistencySideAsset}>
                      <Image source={WATERING_CAN_IMAGE} style={styles.consistencyMiniAsset} contentFit="contain" />
                    </View>
                  </View>
                </View>

                <View style={styles.consistencyChoiceRow}>
                  {consistencyRound.choices.map((choice) => {
                    const isSelected = selectedChoice?.id === choice.id;
                    const showBest = !!selectedChoice && choice.isBest;
                    const showWrong = !!selectedChoice && isSelected && !choice.isBest;
                    return (
                      <TouchableOpacity
                        key={choice.id}
                        onPress={() => choose({ ...choice })}
                        disabled={!!selectedChoice}
                        style={[
                          styles.consistencyChoiceCard,
                          isSelected && styles.choiceCardSelected,
                          showBest && styles.choiceCardBest,
                          showWrong && styles.choiceCardWrong,
                        ]}
                      >
                        <Image
                          source={choice.kind === "plan" ? WATERING_CAN_IMAGE : SHINY_THING_IMAGE}
                          style={styles.consistencyAsset}
                          contentFit="contain"
                        />
                        <Text style={styles.moveChoiceLabel}>{choice.label}</Text>
                        {selectedChoice ? (
                          <Text
                            style={[
                              styles.choiceResult,
                              showBest ? styles.choiceResultBest : showWrong ? styles.choiceResultWrong : null,
                            ]}
                          >
                            {choice.result}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.feedbackCard}>
                  {selectedChoice ? (
                    <>
                      <Text style={[styles.feedbackTitle, { color: selectedChoice.isBest ? theme.accent : BAD }]}>
                        {selectedChoice.isBest ? "Stay steady" : "Too reactive"}
                      </Text>
                      <Text style={styles.feedbackText}>{selectedChoice.feedback}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.feedbackTitle, { color: theme.accent }]}>Same plant, new weather</Text>
                      <Text style={styles.feedbackText}>The scene changes. The steady action stays the same.</Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  onPress={nextRound}
                  disabled={!selectedChoice}
                  style={[styles.primaryButton, { backgroundColor: theme.accent }, !selectedChoice && styles.disabledButton]}
                >
                  <Text style={styles.primaryButtonText}>Next round</Text>
                </TouchableOpacity>
              </>
            ) : isPaycheckGame && paycheckRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{paycheckRound.title}</Text>
                  <Text style={styles.summary}>{paycheckRound.prompt}</Text>
                  <Image source={PAYCHECK_IMAGE} style={styles.paycheckImage} contentFit="contain" />

                  <View style={styles.bananaStrip}>
                    {Array.from({ length: paycheckRound.totalCoins }).map((_, index) => {
                      const placedCount = Object.values(paycheckPlacements).reduce((sum, value) => sum + value, 0);
                      const isPlaced = index < placedCount;
                      return (
                        <View key={index} style={[styles.bananaToken, isPlaced && styles.bananaTokenUsed]}>
                          <Image source={COIN_IMAGE} style={styles.coinTokenImage} contentFit="contain" />
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.basketGrid}>
                  {paycheckRound.buckets.map((bucket) => {
                    const count = paycheckPlacements[bucket.id] ?? 0;
                    return (
                      <TouchableOpacity
                        key={bucket.id}
                        onPress={() => placePaycheckCoin(bucket.id)}
                        disabled={!!paycheckResult}
                        style={[
                          styles.basketCard,
                          { backgroundColor: `${bucket.accent}16`, borderColor: `${bucket.accent}AA` },
                        ]}
                      >
                        <Image source={getPaycheckBucketAsset(bucket.id)} style={styles.bucketImage} contentFit="contain" />
                        <Text style={styles.basketTitle}>{bucket.label}</Text>
                        <Text style={[styles.basketCount, { color: bucket.accent }]}>{count} coins</Text>
                        <Text style={styles.basketHint}>
                          {paycheckRound.matchBucketId === bucket.id ? "Bonus bucket" : paycheckResult ? "Locked in" : "Tap to add"}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View
                  style={[
                    styles.feedbackCard,
                    paycheckResult ? (paycheckResult.success ? styles.feedbackCardGood : styles.feedbackCardBad) : null,
                  ]}
                >
                  <Text style={[styles.feedbackTitle, { color: paycheckResult ? (paycheckResult.success ? theme.accent : BAD) : theme.accent }]}>
                    {paycheckResult ? paycheckResult.title : "Build the paycheck"}
                  </Text>
                  <Text style={styles.feedbackText}>
                    {paycheckResult
                      ? paycheckResult.body
                      : "Future and match buckets should get real attention, not just the spend bucket."}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={undoPaycheckCoin} disabled={!!paycheckResult} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Undo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={nextRound}
                    disabled={!paycheckResult}
                    style={[styles.primaryButton, { backgroundColor: theme.accent }, !paycheckResult && styles.disabledButton]}
                  >
                    <Text style={styles.primaryButtonText}>Next round</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : isBananaGame && bananaRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{bananaRound.title}</Text>
                  <Text style={styles.summary}>{bananaRound.prompt}</Text>

                  <View style={styles.bananaHeader}>
                    <View style={[styles.monkeyBadge, { borderColor: theme.glow }]}>
                      <Text style={styles.monkeyBadgeText}>Risk</Text>
                    </View>
                    <View style={styles.bananaCounter}>
                      <Text style={styles.bananaCounterLabel}>Bananas left</Text>
                      <Text style={[styles.bananaCounterValue, { color: theme.accent }]}>
                        {bananaRound.totalBananas -
                          Object.values(bananaPlacements).reduce((sum, value) => sum + value, 0)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bananaStrip}>
                    {Array.from({ length: bananaRound.totalBananas }).map((_, index) => {
                      const placedCount = Object.values(bananaPlacements).reduce((sum, value) => sum + value, 0);
                      const isPlaced = index < placedCount;

                      return (
                        <View
                          key={index}
                          style={[styles.bananaToken, isPlaced && styles.bananaTokenUsed]}
                        >
                          <Image source={BANANA_IMAGE} style={styles.bananaImage} contentFit="contain" />
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.basketGrid}>
                  {bananaRound.baskets.map((basket) => {
                    const basketCount = bananaPlacements[basket.id] ?? 0;
                    const broke = bananaResult?.brokenCount && basket.id === bananaRound.breakBasketId;

                    return (
                      <TouchableOpacity
                        key={basket.id}
                        onPress={() => placeBanana(basket.id)}
                        disabled={!!bananaResult}
                        style={[
                          styles.basketCard,
                          {
                            backgroundColor: `${basket.accent}16`,
                            borderColor: broke ? BAD : `${basket.accent}AA`,
                          },
                        ]}
                      >
                        <Image
                          source={broke ? BROKEN_BASKET_IMAGE : BASKET_IMAGE}
                          style={styles.basketImage}
                          contentFit="contain"
                        />
                        <Text style={styles.basketTitle}>{basket.label}</Text>
                        <Text style={[styles.basketCount, { color: basket.accent }]}>
                          {basketCount} banana{basketCount === 1 ? "" : "s"}
                        </Text>
                        <Text style={styles.basketHint}>{bananaResult ? "Locked in" : "Tap to add"}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {bananaResult ? (
                  <>
                    {bananaResult.success ? (
                      <View style={[styles.roundWinBanner, { backgroundColor: theme.accent }]}>
                        <Text style={styles.roundWinBannerText}>YOU WON THIS ROUND</Text>
                      </View>
                    ) : null}
                    <View
                      style={[
                        styles.feedbackCard,
                        bananaResult.success ? styles.feedbackCardGood : styles.feedbackCardBad,
                      ]}
                    >
                      <Text
                        style={[
                          styles.feedbackTitle,
                          { color: bananaResult.success ? theme.accent : BAD },
                        ]}
                      >
                        {bananaResult.title}
                      </Text>
                      <Text style={styles.feedbackText}>{bananaResult.body}</Text>
                      <Text style={styles.feedbackMini}>
                        Broken basket lost {bananaResult.brokenCount}. Safe bananas left: {bananaResult.remainingCount}.
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.feedbackCard}>
                    <Text style={[styles.feedbackTitle, { color: theme.accent }]}>Spread them out</Text>
                    <Text style={styles.feedbackText}>
                      One basket will break. Try not to let one basket hold too many bananas.
                    </Text>
                  </View>
                )}

                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={undoBanana} disabled={!!bananaResult} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Undo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={nextRound}
                    disabled={!bananaResult}
                    style={[
                      styles.primaryButton,
                      { backgroundColor: theme.accent },
                      !bananaResult && styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.primaryButtonText}>Next round</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : quizRound ? (
              <>
                <View style={[styles.heroCard, { backgroundColor: theme.panel, borderColor: theme.glow }]}>
                  <Text style={[styles.kicker, { color: theme.accent }]}>ROUND {roundIndex + 1}</Text>
                  <Text style={styles.title}>{quizRound.title}</Text>
                  <Text style={styles.summary}>{quizRound.prompt}</Text>
                  <View style={styles.clueRow}>
                    {quizRound.clues.map((clue) => (
                      <View key={clue} style={styles.clueCard}>
                        <Text style={styles.clueText}>{clue}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.choicesWrap}>
                  {quizRound.choices.map((choice) => {
                    const isSelected = selectedChoice?.id === choice.id;
                    const showBest = !!selectedChoice && choice.isBest;
                    const showWrong = !!selectedChoice && isSelected && !choice.isBest;

                    return (
                      <TouchableOpacity
                        key={choice.id}
                        onPress={() => choose(choice)}
                        disabled={!!selectedChoice}
                        style={[
                          styles.choiceCard,
                          isSelected && styles.choiceCardSelected,
                          showBest && styles.choiceCardBest,
                          showWrong && styles.choiceCardWrong,
                        ]}
                      >
                        <Text style={styles.choiceLabel}>{choice.label}</Text>
                        {selectedChoice ? (
                          <Text
                            style={[
                              styles.choiceResult,
                              showBest ? styles.choiceResultBest : showWrong ? styles.choiceResultWrong : null,
                            ]}
                          >
                            {choice.result}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.feedbackCard}>
                  {selectedChoice ? (
                    <>
                      <Text style={[styles.feedbackTitle, { color: selectedChoice.isBest ? theme.accent : BAD }]}>
                        {selectedChoice.isBest ? "Nice read" : "Try again next round"}
                      </Text>
                      <Text style={styles.feedbackText}>{selectedChoice.feedback}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.feedbackTitle, { color: theme.accent }]}>Pick your move</Text>
                      <Text style={styles.feedbackText}>Choose the answer that best matches the lesson.</Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  onPress={nextRound}
                  disabled={!selectedChoice}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: theme.accent },
                    !selectedChoice && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.primaryButtonText}>Next round</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </>
        ) : (
          <View style={[styles.finishCard, { borderColor: theme.glow, backgroundColor: theme.panel }]}>
            <Text style={[styles.kicker, { color: theme.accent }]}>GAME COMPLETE</Text>
            <View style={styles.finishArtRow}>
              <View style={[styles.finishPill, { backgroundColor: theme.accent }]} />
              <View style={styles.finishPillGhost} />
              <View style={styles.finishPillGhostShort} />
            </View>
            <Text style={styles.finishTitle}>{game.win?.title ?? resultLabel}</Text>
            <Text style={[styles.finishScore, { color: theme.accent }]}>
              {score}/{totalRounds} strong rounds
            </Text>
            <Text style={styles.finishText}>
              {game.win?.takeaway ?? `You practiced the core idea from Lesson ${lessonNumber}.`}
            </Text>
            <Text style={styles.finishSubtext}>{resultLabel}</Text>

            <TouchableOpacity
              onPress={finishGame}
              style={[styles.primaryButton, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.primaryButtonText}>Back to roadmap</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function evaluateBananaRound(round: BananaRound, placements: Record<string, number>): BananaResult {
  const basketCounts = round.baskets.map((basket) => placements[basket.id] ?? 0);
  const brokenCount = placements[round.breakBasketId] ?? 0;
  const remainingCount = round.totalBananas - brokenCount;
  const maxCount = Math.max(...basketCounts);
  const minCount = Math.min(...basketCounts);
  const balancedEnough = maxCount - minCount <= 1;
  const success = balancedEnough && brokenCount <= round.totalBananas / 2;

  if (success) {
    return {
      success: true,
      title: "Nice spread",
      body: "The monkey still has plenty left after one basket breaks.",
      brokenCount,
      remainingCount,
    };
  }

  return {
    success: false,
    title: "Too many in one basket",
    body: "When one basket breaks, too many bananas disappear at once.",
    brokenCount,
    remainingCount,
  };
}

function evaluateFruitRound(round: FruitRound, placements: Record<string, string[]>): SimpleResult {
  const basketCounts = round.baskets.map((basket) => (placements[basket.id] ?? []).length);
  const maxCount = Math.max(...basketCounts);
  const minCount = Math.min(...basketCounts);
  const spoiledByBasket = round.baskets.map(
    (basket) => (placements[basket.id] ?? []).filter((item) => item === round.spoiledKind).length
  );
  const spoiledMax = Math.max(...spoiledByBasket);
  const success = maxCount - minCount <= 1 && spoiledMax < 2;

  return success
    ? {
        success: true,
        title: "Nice mix",
        body: "One spoiled fruit type did not take down the whole setup.",
      }
    : {
        success: false,
        title: "Too clumped",
        body: "Too many of the same fruit ended up together. Spread the mix out more.",
      };
}

function evaluatePaycheckRound(round: PaycheckRound, placements: Record<string, number>): SimpleResult {
  const futureish = (placements.future ?? 0) + (placements.match ?? 0);
  const spend = placements.spend ?? 0;
  const success = futureish >= spend;

  return success
    ? {
        success: true,
        title: "Nice build",
        body: round.matchBucketId
          ? "You gave real weight to future money and matching."
          : "You helped future-you, not just current-you.",
      }
    : {
        success: false,
        title: "Too now-heavy",
        body: "Too many coins stayed in the spend bucket. Give future buckets more room.",
      };
}

function evaluateShelfRound(round: ShelfRound, placements: Record<string, number>): SimpleResult {
  const counts = round.shelves.map((shelf) => placements[shelf.id] ?? 0);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  const success = maxCount - minCount <= 1;

  return success
    ? {
        success: true,
        title: "Nice balance",
        body: "The shelf feels simple and steady, not overloaded in one spot.",
      }
    : {
        success: false,
        title: "Too stacked",
        body: "One shelf is doing too much work. Spread the blocks more evenly.",
      };
}

function getFruitAsset(kind: FruitRound["totalItems"][number]["kind"]) {
  if (kind === "apple") return APPLE_IMAGE;
  if (kind === "orange") return ORANGE_IMAGE;
  return BERRY_IMAGE;
}

function getPaycheckBucketAsset(bucketId: string) {
  if (bucketId === "spend") return BUCKET_SPEND_IMAGE;
  if (bucketId === "save") return BUCKET_SAVE_IMAGE;
  if (bucketId === "match") return BUCKET_MATCH_IMAGE;
  return BUCKET_FUTURE_IMAGE;
}

function getBlockAsset(kind: "blue" | "green" | "purple") {
  if (kind === "blue") return BLOCK_BLUE_IMAGE;
  if (kind === "green") return BLOCK_GREEN_IMAGE;
  return BLOCK_PURPLE_IMAGE;
}

function renderCoins(count: number) {
  return Array.from({ length: count }).map((_, index) => (
    <Image key={index} source={COIN_IMAGE} style={styles.coinImage} contentFit="contain" />
  ));
}

function renderOwnerCardVisual(card: OwnerSignalCard) {
  return <Image source={OWNER_ASSETS[card.kind]} style={styles.ownerAssetImage} contentFit="contain" />;
}

function renderMoveCardVisual(card: MoveSignalCard) {
  return <Image source={MOVE_ASSETS[card.kind]} style={styles.ownerAssetImage} contentFit="contain" />;
}

function renderMoveScopePreview(kind: MoveSignalCard["kind"], accent: string) {
  const activeCount = kind === "company" ? 1 : kind === "sector" ? 3 : 6;
  return Array.from({ length: 6 }).map((_, index) => (
    <View
      key={`${kind}-${index}`}
      style={[
        styles.moveScopeDot,
        { backgroundColor: index < activeCount ? accent : "rgba(255,255,255,0.12)" },
      ]}
    />
  ));
}

function renderStrategyKidVisual(kind: StrategyRound["kidKind"]) {
  if (kind === "beginner") {
    return (
      <>
        <View style={[styles.strategyFace, { backgroundColor: "#FBCDB2" }]}>
          <View style={[styles.strategyHair, { backgroundColor: "#7C3AED" }]} />
          <View style={styles.strategyEyesRow}>
            <View style={styles.strategyEye} />
            <View style={styles.strategyEye} />
          </View>
          <View style={styles.strategySmile} />
        </View>
        <View style={[styles.strategyShirt, { backgroundColor: "#C084FC" }]} />
      </>
    );
  }

  if (kind === "long") {
    return (
      <>
        <View style={[styles.strategyFace, { backgroundColor: "#FBCDB2" }]}>
          <View style={[styles.strategyHair, { backgroundColor: "#10B981" }]} />
          <View style={styles.strategyEyesRow}>
            <View style={styles.strategyEye} />
            <View style={styles.strategyEye} />
          </View>
          <View style={styles.strategySmile} />
        </View>
        <View style={[styles.strategyTrail, { borderColor: "#34D399" }]} />
      </>
    );
  }

  return (
    <>
      <View style={[styles.strategyFace, { backgroundColor: "#FBCDB2" }]}>
        <View style={[styles.strategyHair, { backgroundColor: "#F59E0B" }]} />
        <View style={styles.strategySleepEyes}>
          <View style={styles.strategySleepEyeLine} />
          <View style={styles.strategySleepEyeLine} />
        </View>
        <View style={styles.strategySmile} />
      </View>
      <View style={styles.strategyMoon} />
    </>
  );
}

function renderStrategyBagVisual(kind: "fast" | "safe" | "simple", accent: string) {
  if (kind === "simple") {
    return (
      <View style={[styles.strategyBag, { backgroundColor: "#A78BFA" }]}>
        <View style={[styles.strategyBagHandle, { borderColor: "#6D28D9" }]} />
        <View style={styles.strategyBagPocket} />
        <View style={[styles.strategyBagTag, { backgroundColor: accent }]} />
      </View>
    );
  }

  if (kind === "safe") {
    return (
      <View style={[styles.strategyBag, { backgroundColor: "#34D399" }]}>
        <View style={[styles.strategyBagHandle, { borderColor: "#047857" }]} />
        <View style={styles.strategyShield}>
          <View style={styles.strategyShieldCheckA} />
          <View style={styles.strategyShieldCheckB} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.strategyBag, { backgroundColor: "#FB7185" }]}>
      <View style={[styles.strategyBagHandle, { borderColor: "#BE123C" }]} />
      <View style={styles.strategyClock} />
      <View style={styles.strategyClockHandLong} />
      <View style={styles.strategyClockHandShort} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
    padding: 20,
  },
  loadingCard: {
    marginTop: 80,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: BORDER,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  loadingOrb: {
    width: 56,
    height: 56,
    borderRadius: 999,
    marginBottom: 12,
  },
  loadingTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  loadingText: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    borderColor: BORDER,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backText: {
    color: WHITE,
    fontWeight: "800",
  },
  topMeta: {
    color: MUTED,
    fontWeight: "700",
  },
  progressTrack: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    height: 10,
    marginBottom: 18,
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: 999,
    height: "100%",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 18,
    padding: 22,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  summary: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 22,
  },
  introArtRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  introArtCard: {
    flex: 1,
    minHeight: 104,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  introArtCircle: {
    width: 42,
    height: 42,
    borderRadius: 999,
  },
  introArtBars: {
    gap: 8,
  },
  introBarShort: {
    width: 36,
    height: 10,
    borderRadius: 999,
  },
  introBarLong: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  introBarMedium: {
    width: "72%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  introArtLabel: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
  },
  introInfoRow: {
    gap: 12,
    marginTop: 18,
    marginBottom: 18,
  },
  roundWinBanner: {
    alignItems: "center",
    borderRadius: 18,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  roundWinBannerText: {
    color: NAVY,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  infoChip: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  infoChipLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  infoChipValue: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "800",
  },
  ownerBoard: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    gap: 14,
  },
  ownerHeadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ownerHeadlineDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  ownerHeadlineText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "800",
  },
  ownerChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    minHeight: 98,
  },
  ownerChartCol: {
    flex: 1,
    justifyContent: "flex-end",
  },
  ownerChartBar: {
    borderRadius: 14,
    width: "100%",
  },
  ownerMiniStats: {
    flexDirection: "row",
    gap: 10,
  },
  ownerMiniStat: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 12,
  },
  ownerMiniStatLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  ownerMiniStatValue: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
  },
  ownerCardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
  },
  ownerCard: {
    width: "31%",
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  ownerCardVisual: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
  },
  ownerCardLabel: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18,
  },
  ownerCardValue: {
    fontSize: 13,
    fontWeight: "900",
  },
  ownerAssetImage: {
    width: 44,
    height: 44,
  },
  strategyHero: {
    marginTop: 18,
    gap: 12,
  },
  strategyKidCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  strategyKidVisual: {
    width: "100%",
    minHeight: 112,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  strategyTripLabel: {
    color: WHITE,
    fontSize: 20,
    fontWeight: "900",
  },
  strategyMood: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },
  strategyHintCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  strategyHintKicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  strategyHintText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
  },
  strategyChoiceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
  },
  strategyChoiceCard: {
    width: "31%",
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    alignItems: "center",
    gap: 8,
  },
  strategyChoiceVisual: {
    width: 86,
    height: 86,
    alignItems: "center",
    justifyContent: "center",
  },
  strategyChoiceLabel: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  strategyChoiceValue: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  strategyFace: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  strategyHair: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 34,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  strategyEyesRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  strategyEye: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: NAVY,
  },
  strategySleepEyes: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  strategySleepEyeLine: {
    width: 10,
    height: 3,
    borderRadius: 999,
    backgroundColor: NAVY,
  },
  strategySmile: {
    width: 18,
    height: 8,
    borderBottomWidth: 3,
    borderColor: NAVY,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
  },
  strategyShirt: {
    width: 84,
    height: 28,
    borderRadius: 14,
    marginTop: 8,
  },
  strategyTrail: {
    width: 88,
    height: 18,
    borderWidth: 5,
    borderRadius: 999,
    marginTop: 12,
  },
  strategyMoon: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "#FDE68A",
    marginTop: 10,
    marginLeft: 54,
  },
  strategyBag: {
    width: 62,
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  strategyBagHandle: {
    position: "absolute",
    top: 4,
    width: 34,
    height: 18,
    borderWidth: 5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  strategyBagPocket: {
    width: 36,
    height: 22,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.82)",
    marginTop: 12,
  },
  strategyBagTag: {
    position: "absolute",
    right: 10,
    top: 24,
    width: 10,
    height: 18,
    borderRadius: 999,
  },
  strategyShield: {
    width: 34,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  strategyShieldCheckA: {
    position: "absolute",
    width: 8,
    height: 4,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#10B981",
    transform: [{ rotate: "-45deg" }],
    left: 11,
    top: 19,
  },
  strategyShieldCheckB: {
    position: "absolute",
    width: 14,
    height: 4,
    borderBottomWidth: 3,
    borderColor: "#10B981",
    transform: [{ rotate: "45deg" }],
    left: 16,
    top: 16,
  },
  strategyClock: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
  },
  strategyClockHandLong: {
    position: "absolute",
    width: 3,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#FB7185",
    top: 26,
  },
  strategyClockHandShort: {
    position: "absolute",
    width: 10,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#FB7185",
    top: 36,
    left: 34,
    transform: [{ rotate: "35deg" }],
  },
  fruitWarning: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 14,
    textTransform: "capitalize",
  },
  goalCard: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  goalCardLabel: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 30,
  },
  jarRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  jarCard: {
    flex: 1,
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  jarImage: {
    width: 96,
    height: 96,
  },
  jarLabel: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
  },
  coinCompareRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  coinSide: {
    flex: 1,
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  coinSideTitle: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
  },
  coinStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    minHeight: 110,
  },
  coinImage: {
    width: 28,
    height: 28,
  },
  coinTax: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "800",
  },
  consistencyScene: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  sceneImage: {
    width: 86,
    height: 86,
  },
  plantImage: {
    width: 96,
    height: 96,
  },
  plantStageWrap: {
    alignItems: "center",
    gap: 8,
  },
  plantProgressRow: {
    flexDirection: "row",
    gap: 8,
  },
  plantProgressDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  plantGround: {
    width: 92,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  consistencySideAsset: {
    width: 86,
    height: 86,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  consistencyMiniAsset: {
    width: 60,
    height: 60,
  },
  consistencyChoiceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  consistencyChoiceCard: {
    flex: 1,
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  consistencyAsset: {
    width: 72,
    height: 72,
  },
  paycheckImage: {
    width: 112,
    height: 112,
    alignSelf: "center",
    marginTop: 16,
  },
  coinTokenImage: {
    width: 24,
    height: 24,
  },
  bucketImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  moveBoard: {
    marginTop: 18,
    gap: 14,
  },
  moveScannerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moveScannerLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  moveScannerPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  moveScannerPillText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  moveHeadline: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
  },
  moveHeadlineCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  moveSplashCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    gap: 14,
  },
  moveStockMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moveTicker: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
  },
  moveDelta: {
    fontSize: 15,
    fontWeight: "900",
  },
  moveChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 100,
  },
  moveChartCol: {
    flex: 1,
    justifyContent: "flex-end",
  },
  moveChartBar: {
    width: "100%",
    borderRadius: 12,
  },
  moveMiniTickerRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  moveMiniTicker: {
    minWidth: 42,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  moveMiniTickerFaded: {
    opacity: 0.55,
  },
  moveMiniTickerText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "800",
  },
  moveClueRow: {
    flexDirection: "row",
    gap: 10,
  },
  moveClueCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
  },
  moveClueTitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  moveClueValue: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
  },
  moveChoiceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
  },
  moveChoiceCard: {
    width: "31%",
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  moveChoiceVisual: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  moveChoiceLabel: {
    color: WHITE,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  moveChoiceHint: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  moveChoiceDotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    minHeight: 14,
  },
  moveScopeDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  clueRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  clueCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: BORDER,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  clueText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
  },
  choicesWrap: {
    gap: 12,
    marginBottom: 14,
  },
  choiceCard: {
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  choiceCardSelected: {
    borderColor: "rgba(248,250,252,0.3)",
  },
  choiceCardBest: {
    backgroundColor: "rgba(126,214,165,0.10)",
    borderColor: "rgba(126,214,165,0.35)",
  },
  choiceCardWrong: {
    backgroundColor: "rgba(252,165,165,0.10)",
    borderColor: "rgba(252,165,165,0.35)",
  },
  choiceLabel: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
  },
  choiceResult: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
  },
  choiceResultBest: {
    color: GREEN,
  },
  choiceResultWrong: {
    color: BAD,
  },
  bananaHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
  },
  monkeyBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  monkeyBadgeText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
  },
  bananaCounter: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: BORDER,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  bananaCounterLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  bananaCounterValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  bananaStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  bananaToken: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  bananaTokenUsed: {
    opacity: 0.28,
  },
  bananaImage: {
    width: 34,
    height: 34,
  },
  basketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  basketCard: {
    flexGrow: 1,
    minWidth: "30%",
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  basketImage: {
    width: 64,
    height: 64,
    marginBottom: 10,
  },
  basketTitle: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 6,
  },
  basketCount: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  basketHint: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  shelfPreviewRow: {
    minHeight: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginBottom: 6,
  },
  shelfPreviewBlock: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  shelfPreviewImage: {
    width: 18,
    height: 18,
  },
  feedbackCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: BORDER,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
  },
  feedbackCardGood: {
    borderColor: "rgba(126,214,165,0.35)",
    backgroundColor: "rgba(126,214,165,0.10)",
  },
  feedbackCardBad: {
    borderColor: "rgba(252,165,165,0.35)",
    backgroundColor: "rgba(252,165,165,0.10)",
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },
  feedbackText: {
    color: WHITE,
    fontSize: 15,
    lineHeight: 22,
  },
  feedbackMini: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 18,
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: BORDER,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  secondaryButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: NAVY,
    fontSize: 16,
    fontWeight: "900",
  },
  finishCard: {
    borderRadius: 28,
    borderWidth: 1,
    marginTop: 20,
    padding: 24,
  },
  finishArtRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  finishPill: {
    width: 56,
    height: 14,
    borderRadius: 999,
  },
  finishPillGhost: {
    width: 28,
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  finishPillGhostShort: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  finishTitle: {
    color: WHITE,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 8,
  },
  finishScore: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  finishText: {
    color: WHITE,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 8,
  },
  finishSubtext: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
});
