// app/(tabs)/profile.tsx
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";

export default function ProfileTab() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>
        Coming soon. For now, you can re-run setup if you want.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(onboarding)/profile")}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>Edit setup</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY, padding: 20 },
  title: { color: WHITE, fontSize: 28, fontWeight: "900", marginTop: 8 },
  sub: { color: MUTED, marginTop: 10, lineHeight: 20, fontWeight: "700" },
  button: { marginTop: 18, backgroundColor: GREEN, paddingVertical: 12, borderRadius: 14, alignItems: "center" },
  buttonText: { color: NAVY, fontWeight: "900", fontSize: 16 },
});