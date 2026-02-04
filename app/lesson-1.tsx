import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const MUTED = "#CBD5E1";

export default function Lesson1() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Module 1: The calm intro</Text>
      <Text style={styles.subtitle}>
        Placeholder screen for now — next we’ll build the first real lesson page.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY, padding: 20 },
  title: { color: WHITE, fontSize: 24, fontWeight: "900", marginBottom: 8 },
  subtitle: { color: MUTED, fontSize: 14, lineHeight: 18 },
});
