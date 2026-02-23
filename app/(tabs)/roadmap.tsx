import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const MUTED = "#CBD5E1";

/**
 * 🔓 Which module is unlocked up to
 * 0 = only first
 * 1 = first two
 * etc
 */
const unlockedIndex = 0;

const MODULES = [
  {
    id: "lesson-1",
    title: "Module 1: Foundations",
    description: "Stocks, money, and what investing actually means.",
  },
  {
    id: "lesson-2",
    title: "Module 2: Markets & movements",
    description: "Why prices change, and why it’s not random.",
  },
  {
    id: "lesson-3",
    title: "Module 3: Risk & reality",
    description: "How things go wrong, and how people manage that.",
  },
  {
    id: "lesson-4",
    title: "Module 4: Your first strategy",
    description: "Making choices that actually fit you.",
  },
  {
    id: "lesson-5",
    title: "Module 5: ETFs & diversification",
    description: "The simplest way to not bet everything on one stock.",
  },
  {
    id: "lesson-6",
    title: "Module 6: Time horizon",
    description: "When you need the money changes everything.",
  },
  {
    id: "lesson-7",
    title: "Module 7: Tax basics",
    description: "The stuff nobody explains until it hurts.",
  },
  {
    id: "lesson-8",
    title: "Module 8: Roth IRA & 401(k)",
    description: "Future-you accounts and how they work.",
  },
  {
    id: "lesson-9",
    title: "Module 9: Starter portfolio",
    description: "A simple structure you can understand and explain.",
  },
  {
    id: "lesson-10",
    title: "Module 10: Staying consistent",
    description: "Habits that beat hype, even when markets are weird.",
  },
];

export default function RoadmapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your learning roadmap</Text>
        <Text style={styles.subtitle}>
          Start with Module 1. New modules unlock as you progress.
        </Text>

        {MODULES.map((module, i) => {
          const isReady = i <= unlockedIndex;

          return (
            <View key={module.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{module.title}</Text>
                <Text style={[styles.badge, isReady ? styles.badgeReady : styles.badgeLocked]}>
                  {isReady ? "Ready" : "Locked"}
                </Text>
              </View>

              <Text style={styles.cardDescription}>{module.description}</Text>

              {isReady ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.button}
onPress={() => router.push("/lesson-1")}                >
                  <Text style={styles.buttonText}>Start module</Text>
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
  badgeReady: {
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