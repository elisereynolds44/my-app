import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBackdrop } from "@/components/app-backdrop";
import { getProgressValues } from "@/lib/progress-storage";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const MUTED = "#CBD5E1";
const GREEN = "#7ED6A5";
const PANEL = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.10)";

const MODULES = [
  {
    id: "lesson-1",
    route: "/lesson-1",
    title: "Module 1: Foundations",
    description: "Stocks, money, and what investing actually means.",
  },
  {
    id: "lesson-2",
    route: "/lesson-2",
    title: "Module 2: Markets & movements",
    description: "Why prices change, and why it’s not random.",
  },
  {
    id: "lesson-3",
    route: "/lesson-3",
    title: "Module 3: Risk & reality",
    description: "How things go wrong, and how people manage that.",
  },
  {
    id: "lesson-4",
    route: "/lesson-4",
    title: "Module 4: Your first strategy",
    description: "Making choices that actually fit you.",
  },
  {
    id: "lesson-5",
    route: "/lesson-5",
    title: "Module 5: ETFs & diversification",
    description: "The simplest way to not bet everything on one stock.",
  },
  {
    id: "lesson-6",
    route: "/lesson-6",
    title: "Module 6: Time horizon",
    description: "When you need the money changes everything.",
  },
  {
    id: "lesson-7",
    route: "/lesson-7",
    title: "Module 7: Tax basics",
    description: "The stuff nobody explains until it hurts.",
  },
  {
    id: "lesson-8",
    route: "/lesson-8",
    title: "Module 8: Roth IRA & 401(k)",
    description: "Future-you accounts and how they work.",
  },
  {
    id: "lesson-9",
    route: "/lesson-9",
    title: "Module 9: Starter portfolio",
    description: "A simple structure you can understand and explain.",
  },
  {
    id: "lesson-10",
    route: "/lesson-10",
    title: "Module 10: Staying consistent",
    description: "Habits that beat hype, even when markets are weird.",
  },
];

export default function RoadmapScreen() {
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({});
  const [completedGames, setCompletedGames] = useState<Record<number, boolean>>({});

  // Refresh when returning to this screen
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const progress = await getProgressValues([
            ...Array.from({ length: 10 }, (_, index) => `completedLesson${index + 1}`),
            ...Array.from({ length: 10 }, (_, index) => `completedGame${index + 1}`),
          ]);

          setCompletedLessons(
            Array.from({ length: 10 }, (_, index) => index + 1).reduce<Record<number, boolean>>((acc, lessonNumber) => {
              acc[lessonNumber] = progress[`completedLesson${lessonNumber}`] === "true";
              return acc;
            }, {})
          );
          setCompletedGames(
            Array.from({ length: 10 }, (_, index) => index + 1).reduce<Record<number, boolean>>((acc, lessonNumber) => {
              acc[lessonNumber] = progress[`completedGame${lessonNumber}`] === "true";
              return acc;
            }, {})
          );
        } catch (e) {
          console.log("Error loading roadmap progress", e);
        }
      };

      load();
    }, [])
  );

  const unlockedIndex = useMemo(() => {
    let unlocked = 0;

    for (let lessonNumber = 1; lessonNumber <= 9; lessonNumber += 1) {
      if (completedLessons[lessonNumber]) {
        unlocked += 1;
      } else {
        break;
      }
    }

    return unlocked;
  }, [completedLessons]);

  const completedCount = useMemo(
    () => Object.values(completedGames).filter(Boolean).length,
    [completedGames]
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppBackdrop accent={GREEN} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>ROADMAP</Text>
          <Text style={styles.title}>Your learning path</Text>
          <Text style={styles.subtitle}>
            Lessons unlock in order. Finish a lesson, then play its mini game.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatLabel}>Lessons open</Text>
              <Text style={styles.heroStatValue}>{unlockedIndex + 1}</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatLabel}>Games done</Text>
              <Text style={styles.heroStatValue}>{completedCount}</Text>
            </View>
          </View>
        </View>

        {MODULES.map((module, i) => {
          const isReady = i <= unlockedIndex && Boolean(module.route);
          const lessonNumber = Number(module.id.replace("lesson-", ""));
          const isLessonDone = completedLessons[lessonNumber];
          const isGameDone = completedGames[lessonNumber];
          const lessonLabel = isLessonDone ? "Review lesson" : lessonNumber === 1 ? "Start lesson 1" : "Start lesson";

          return (
            <View key={module.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{module.title}</Text>

                {isGameDone ? (
                  <Text style={[styles.badge, styles.badgeComplete]}>
                    Completed
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.badge,
                      isReady ? styles.badgeReady : styles.badgeLocked,
                    ]}
                  >
                    {isReady ? "Ready" : "Locked"}
                  </Text>
                )}
              </View>

              <Text style={styles.cardDescription}>
                {module.description}
              </Text>

              {isLessonDone && !isGameDone ? (
                <Text style={styles.helperText}>
                  Lesson complete. Review it anytime, then play the mini game to lock the concept in.
                </Text>
              ) : isGameDone ? (
                <Text style={styles.helperText}>
                  Lesson and game complete. You can review the lesson or replay the game anytime.
                </Text>
              ) : isReady ? (
                <Text style={styles.helperText}>
                  Finish the lesson first. The mini game unlocks right after.
                </Text>
              ) : null}

              {isLessonDone ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => router.push(module.route as any)}
                  >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>{lessonLabel}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.button}
                    onPress={() => router.push(`/game-${lessonNumber}` as any)}
                  >
                    <Text style={styles.buttonText}>
                      {isGameDone ? "Replay game" : "Play game"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : isReady ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.button}
                  onPress={() => router.push(module.route as any)}
                >
                  <Text style={styles.buttonText}>{lessonLabel}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.lockedButton}>
                  <Text style={styles.lockedButtonText}>
                    Unlock by finishing previous module
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 14,
  },
  heroCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 22,
    marginBottom: 4,
  },
  kicker: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: WHITE,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
  heroStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  heroStatLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroStatValue: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "900",
  },
  card: {
    backgroundColor: PANEL,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: WHITE,
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
  },
  badgeReady: {
    color: NAVY,
    backgroundColor: GREEN,
  },
  badgeLocked: {
    color: MUTED,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  badgeComplete: {
    color: WHITE,
    backgroundColor: "rgba(96,165,250,0.24)",
  },
  cardDescription: {
    color: WHITE,
    fontSize: 14,
    lineHeight: 20,
  },
  helperText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  secondaryButtonText: {
    color: WHITE,
  },
  buttonText: {
    color: NAVY,
    fontWeight: "900",
  },
  lockedButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  lockedButtonText: {
    color: MUTED,
    fontWeight: "700",
  },
});
