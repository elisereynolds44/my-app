import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const MUTED = "#CBD5E1";

export default function CompetitionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Competition</Text>
        <Text style={styles.subtitle}>
          Coming soon. (School leaderboards, challenges, and chaos.)
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Placeholder</Text>
          <Text style={styles.cardText}>
            school vs school, friends, streaks, weekly
            challenges, etc.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  content: { padding: 20, gap: 12 },
  title: { color: WHITE, fontSize: 28, fontWeight: "900" },
  subtitle: { color: MUTED, fontSize: 14, lineHeight: 20, marginBottom: 6 },

  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: { color: WHITE, fontWeight: "900", fontSize: 16, marginBottom: 6 },
  cardText: { color: "rgba(203,213,225,0.85)", fontWeight: "700", lineHeight: 20 },
});