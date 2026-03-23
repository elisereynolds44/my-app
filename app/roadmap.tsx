import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useProfile } from "@/components/profile-context";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const MUTED = "#CBD5E1";
const PANEL = "#F8FAFC";

type Module = {
  description: string;
  id: string;
  status: "Current" | "Locked";
  title: string;
};

const MODULES: Module[] = [
  {
    id: "lesson-1",
    title: "Module 1: The calm intro",
    description: "A short warm-up to get comfortable before we go deeper.",
    status: "Current",
  },
  {
    id: "coming-soon",
    title: "Module 2: Your first strategy",
    description: "Coming next: a practical lesson you can use immediately.",
    status: "Locked",
  },
];

function RoadmapScreen() {
  const { isHydrated, profile, selectedCharacter } = useProfile();


  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingState}>
          <Text style={styles.loadingTitle}>Loading roadmap…</Text>
          <Text style={styles.loadingSubtitle}>Syncing your saved profile and progress.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your learning roadmap</Text>
        <Text style={styles.subtitle}>Follow your character to see exactly where you are right now.</Text>

        <View style={styles.heroCard}>
          <View style={[styles.avatarShell, { backgroundColor: selectedCharacter?.accent ?? "#1E293B" }]}>
            <Text style={styles.avatarEmoji}>{selectedCharacter?.emoji ?? "✨"}</Text>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>
              {profile ? `${profile.firstName}, you’re on Module 1.` : "You’re ready to start Module 1."}
            </Text>
            <Text style={styles.heroText}>
              {profile
                ? `${selectedCharacter?.label ?? "Your character"} will follow your progress as you move through the roadmap.`
                : "Finish your profile to personalize this roadmap."}
            </Text>
          </View>
        </View>

        {MODULES.map((module) => {
          const isCurrent = module.id === profile?.currentModuleId || (!profile && module.id === "lesson-1");
          const isReady = module.id === "lesson-1";

          return (
            <View key={module.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{module.title}</Text>
                <Text style={[styles.badge, isCurrent ? styles.badgeCurrent : styles.badgeLocked]}>
                  {module.status}
                </Text>
              </View>

              <Text style={styles.cardDescription}>{module.description}</Text>

              {isCurrent && selectedCharacter ? (
                <View style={styles.youAreHereRow}>
                  <View style={[styles.inlineAvatar, { backgroundColor: selectedCharacter.accent }]}>
                    <Text style={styles.inlineAvatarEmoji}>{selectedCharacter.emoji}</Text>
                  </View>
                  <Text style={styles.youAreHereText}>You are here</Text>
                </View>
              ) : null}

              {isReady ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.button}
                  onPress={() => router.push("/lesson-1")}
                >
                  <Text style={styles.buttonText}>Start module</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.lockedButton}>
                  <Text style={styles.lockedButtonText}>Unlock by finishing Module 1</Text>
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
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  loadingTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "800",
  },
  loadingSubtitle: {
    color: MUTED,
    fontSize: 14,
    textAlign: "center",
  },
  heroCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  avatarShell: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 34,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: NAVY,
    fontSize: 18,
    fontWeight: "900",
  },
  heroText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
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
    gap: 8,
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
  badgeCurrent: {
    color: "#065F46",
    backgroundColor: "#D1FAE5",
  },
  badgeLocked: {
    color: "#6B7280",
    backgroundColor: "#E5E7EB",
  },
  cardDescription: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
  },
  youAreHereRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: PANEL,
  },
  inlineAvatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineAvatarEmoji: {
    fontSize: 18,
  },
  youAreHereText: {
    color: NAVY,
    fontSize: 14,
    fontWeight: "800",
  },
  button: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
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

export default RoadmapScreen;
