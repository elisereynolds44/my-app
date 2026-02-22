// app/(tabs)/index.tsx
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, StyleSheet, Text, View } from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";

export default function HomeScreen() {
  const full = "Invest-ish";
  const [typed, setTyped] = useState("");

  const opacity = useRef(new Animated.Value(1)).current;

  // Typewriter
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 90);

    return () => clearInterval(id);
  }, []);

  // After typing finishes -> wait -> dissolve -> go to welcome
  useEffect(() => {
    if (typed !== full) return;

    const wait = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        router.replace("/welcome");
      });
    }, 900);

    return () => clearTimeout(wait);
  }, [typed, full, opacity]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.center, { opacity }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ALPHA</Text>
        </View>

        <Text style={styles.title}>{typed}</Text>
        <Text style={styles.cursor}>{typed.length < full.length ? "▍" : ""}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center" },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(126,214,165,0.16)",
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: { color: GREEN, fontWeight: "900", fontSize: 12, letterSpacing: 0.6 },

  title: { color: WHITE, fontSize: 48, fontWeight: "900", letterSpacing: 0.2 },
  cursor: { color: "rgba(255,255,255,0.85)", fontSize: 34, marginTop: -6 },
});