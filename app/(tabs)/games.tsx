import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppBackdrop } from "@/components/app-backdrop";
import { GAME_LIBRARY } from "@/lib/game-content";
import { getProgressValue, getProgressValues } from "@/lib/progress-storage";

const NAVY = "#08111F";
const WHITE = "#F8FAFC";
const MUTED = "#A8B7CC";
const GREEN = "#7ED6A5";
const BORDER = "rgba(255,255,255,0.10)";
const PANEL = "rgba(255,255,255,0.05)";

export default function GamesScreen() {
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({});
  const [completedGames, setCompletedGames] = useState<Record<number, boolean>>({});
  const [lastBrand, setLastBrand] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const progress = await getProgressValues([
          ...Array.from({ length: 10 }, (_, index) => `completedLesson${index + 1}`),
          ...Array.from({ length: 10 }, (_, index) => `completedGame${index + 1}`),
        ]);

        const savedBrand = await getProgressValue("lesson1LastBrand");

        setCompletedLessons(
          Array.from({ length: 10 }, (_, index) => index + 1).reduce<Record<number, boolean>>(
            (acc, lessonNumber) => {
              acc[lessonNumber] = progress[`completedLesson${lessonNumber}`] === "true";
              return acc;
            },
            {}
          )
        );

        setCompletedGames(
          Array.from({ length: 10 }, (_, index) => index + 1).reduce<Record<number, boolean>>(
            (acc, lessonNumber) => {
              acc[lessonNumber] = progress[`completedGame${lessonNumber}`] === "true";
              return acc;
            },
            {}
          )
        );

        setLastBrand(savedBrand);
      };

      void load();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppBackdrop accent={GREEN} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>PLAY ZONE</Text>
          <Text style={styles.title}>Games</Text>
          <Text style={styles.subtitle}>
            Big simulation up top. Tiny lesson games below.
          </Text>
        </View>

        <View style={styles.simCard}>
          <Text style={styles.kicker}>SIMULATION HUB</Text>
          <Text style={styles.simTitle}>Market World</Text>
          <Text style={styles.simText}>
            This is the bigger ongoing investing simulation. It is where multiple lessons come together in one place.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              router.push({
                pathname: "/simulation-1",
                params: lastBrand ? { brand: lastBrand } : undefined,
              } as any)
            }
          >
            <Text style={styles.primaryButtonText}>Open simulation</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Lesson Games</Text>

        {Object.values(GAME_LIBRARY).map((game) => {
          const lessonDone = completedLessons[game.lessonNumber];
          const gameDone = completedGames[game.lessonNumber];

          return (
            <View key={game.lessonNumber} style={styles.gameCard}>
              <View style={styles.row}>
                <View style={styles.lessonBadge}>
                  <Text style={styles.lessonBadgeText}>L{game.lessonNumber}</Text>
                </View>
                <View style={styles.grow}>
                  <Text style={styles.gameTitle}>{game.gameTitle}</Text>
                  <Text style={styles.gameSkill}>{game.skill}</Text>
                </View>
                <Text style={[styles.status, gameDone ? styles.complete : lessonDone ? styles.ready : styles.locked]}>
                  {gameDone ? "Done" : lessonDone ? "Ready" : "Locked"}
                </Text>
              </View>

              <Text style={styles.gameSummary}>{game.summary}</Text>

              <TouchableOpacity
                disabled={!lessonDone}
                style={[styles.secondaryButton, !lessonDone && styles.disabledButton]}
                onPress={() => router.push(`/game-${game.lessonNumber}` as any)}
              >
                <Text style={styles.secondaryButtonText}>
                  {gameDone ? "Replay game" : "Play game"}
                </Text>
              </TouchableOpacity>
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
    paddingBottom: 110,
  },
  heroCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  title: {
    color: WHITE,
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
  },
  simCard: {
    backgroundColor: "rgba(126,214,165,0.10)",
    borderColor: "rgba(126,214,165,0.22)",
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 24,
    padding: 22,
  },
  kicker: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },
  simTitle: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  simText: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: GREEN,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: NAVY,
    fontSize: 16,
    fontWeight: "900",
  },
  sectionTitle: {
    color: WHITE,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  gameCard: {
    backgroundColor: PANEL,
    borderColor: BORDER,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
    padding: 18,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  lessonBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  lessonBadgeText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "900",
  },
  grow: {
    flex: 1,
  },
  gameTitle: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 2,
  },
  gameSkill: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
  },
  status: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  complete: {
    color: GREEN,
  },
  ready: {
    color: WHITE,
  },
  locked: {
    color: "#64748B",
  },
  gameSummary: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.38,
  },
});
