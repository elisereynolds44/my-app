import AsyncStorage from "@react-native-async-storage/async-storage";
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

import { getProgressValues } from "@/lib/progress-storage";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const MUTED = "#CBD5E1";

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
  const [completedLesson1, setCompletedLesson1] = useState(false);
  const [completedSimulation1, setCompletedSimulation1] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({});
  const [lastBrand, setLastBrand] = useState<string | null>(null);

  // Refresh when returning to this screen
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const progress = await getProgressValues([
            "completedLesson1",
            "completedSimulation1",
            ...Array.from({ length: 9 }, (_, index) => `completedLesson${index + 2}`),
          ]);

          const storedBrand = await AsyncStorage.getItem("lesson1LastBrand");
          const lessonDone = progress.completedLesson1;
          const simulationDone = progress.completedSimulation1;
          const otherLessons = Array.from({ length: 9 }, (_, index) => progress[`completedLesson${index + 2}`]);
          setCompletedLesson1(lessonDone === "true");
          setCompletedSimulation1(simulationDone === "true");
          setLastBrand(storedBrand);
          setCompletedLessons(
            otherLessons.reduce<Record<number, boolean>>((acc, value, index) => {
              acc[index + 2] = value === "true";
              return acc;
            }, {})
          );
        } catch (e) {
          console.log("Error loading completedLesson1", e);
        }
      };

      load();
    }, [])
  );

  const unlockedIndex = useMemo(() => {
    if (!completedSimulation1) {
      return 0;
    }

    let unlocked = 1;

    for (let lessonNumber = 2; lessonNumber <= 9; lessonNumber += 1) {
      if (completedLessons[lessonNumber]) {
        unlocked += 1;
      } else {
        break;
      }
    }

    return unlocked;
  }, [completedLessons, completedSimulation1]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your learning roadmap</Text>
        <Text style={styles.subtitle}>
          Start with Module 1. New modules unlock as you progress.
        </Text>

        {MODULES.map((module, i) => {
          const isReady = i <= unlockedIndex && Boolean(module.route);
          const isModuleOne = module.id === "lesson-1";
          const lessonNumber = Number(module.id.replace("lesson-", ""));
          const isCompleted = isModuleOne && completedSimulation1;
          const isLessonDone = isModuleOne && completedLesson1;
          const isStandardLessonCompleted = !isModuleOne && completedLessons[lessonNumber];
          const actionLabel = isModuleOne
            ? isCompleted
              ? "Review lesson"
              : isLessonDone
                ? "Review lesson"
                : "Start lesson 1"
            : isStandardLessonCompleted
              ? "Review module"
              : "Start module";

          return (
            <View key={module.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{module.title}</Text>

                {isCompleted || isStandardLessonCompleted ? (
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

              {isModuleOne && isLessonDone && !completedSimulation1 ? (
                <Text style={styles.helperText}>
                  Lesson complete. You can review it anytime, and the simulation is ready too.
                </Text>
              ) : isModuleOne && !isLessonDone ? (
                <Text style={styles.helperText}>
                  Complete Lesson 1 first, then the simulation opens immediately after.
                </Text>
              ) : isModuleOne && isCompleted ? (
                <Text style={styles.helperText}>
                  Module 1 is complete. You can revisit the lesson or replay the simulation.
                </Text>
              ) : !isModuleOne && isStandardLessonCompleted ? (
                <Text style={styles.helperText}>
                  Lesson complete. You can review it anytime.
                </Text>
              ) : null}

              {isModuleOne && isLessonDone ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => router.push("/lesson-1")}
                  >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>{actionLabel}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.button}
                    onPress={() =>
                      router.push({
                        pathname: "/simulation-1",
                        params: lastBrand ? { brand: lastBrand } : undefined,
                      } as any)
                    }
                  >
                    <Text style={styles.buttonText}>
                      {isCompleted ? "Replay simulation" : "Play simulation"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : isReady ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.button}
                  onPress={() => router.push(module.route as any)}
                >
                  <Text style={styles.buttonText}>{actionLabel}</Text>
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
    gap: 14,
  },
  title: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    color: MUTED,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: NAVY,
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
    color: "#065F46",
    backgroundColor: "#D1FAE5",
  },
  badgeLocked: {
    color: "#6B7280",
    backgroundColor: "#E5E7EB",
  },
  badgeComplete: {
    color: "#1D4ED8",
    backgroundColor: "#DBEAFE",
  },
  cardDescription: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
  },
  helperText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: "#E2E8F0",
  },
  secondaryButtonText: {
    color: NAVY,
  },
  buttonText: {
    color: WHITE,
    fontWeight: "900",
  },
  lockedButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  lockedButtonText: {
    color: "#64748B",
    fontWeight: "700",
  },
});
