import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { AppBackdrop } from "@/components/app-backdrop";
import { useProfile } from "@/components/profile-context";

const NAVY = "#08111F";
const WHITE = "#F8FAFC";
const MUTED = "#A8B7CC";
const GREEN = "#7ED6A5";
const GOLD = "#FFD76A";
const CORAL = "#FF9F8A";
const SKY = "#99D8FF";

export default function HomeScreen() {
  const { isHydrated, profile } = useProfile();
  const full = "Invest-ish";
  const [typed, setTyped] = useState("");
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const opacity = useRef(new Animated.Value(1)).current;
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroLift = useRef(new Animated.Value(28)).current;
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const floatC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isHydrated) return;
    setNextRoute(profile ? "/roadmap" : "/welcome");
  }, [isHydrated, profile]);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 105);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(heroLift, {
        toValue: 0,
        duration: 760,
        useNativeDriver: true,
      }),
    ]).start();

    const makeFloat = (value: Animated.Value, toValue: number, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();

    makeFloat(floatA, -10, 2200);
    makeFloat(floatB, 12, 2600);
    makeFloat(floatC, -8, 2000);
  }, [floatA, floatB, floatC, heroFade, heroLift]);

  useEffect(() => {
    if (typed !== full || !nextRoute) return;

    const wait = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        router.replace(nextRoute as any);
      });
    }, 3000);

    return () => clearTimeout(wait);
  }, [typed, full, nextRoute, opacity]);

  return (
    <SafeAreaView style={styles.container}>
      <AppBackdrop accent={GREEN} />
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY: heroLift }] }]}>
        <View style={styles.kickerBadge}>
          <Text style={styles.kickerText}>INVESTING BASICS, FIRST</Text>
        </View>

        <View style={styles.stage}>
          <Animated.View style={[styles.tile, styles.tileLearn, { transform: [{ translateY: floatA }] }]}>
            <Text style={styles.tileLabel}>Learn</Text>
          </Animated.View>
          <Animated.View style={[styles.tile, styles.tilePlay, { transform: [{ translateY: floatB }] }]}>
            <Text style={styles.tileLabel}>Play</Text>
          </Animated.View>
          <Animated.View style={[styles.tile, styles.tileGrow, { transform: [{ translateY: floatC }] }]}>
            <Text style={styles.tileLabel}>Grow</Text>
          </Animated.View>

          <Animated.View style={[styles.heroCard, { opacity: heroFade }]}>
            <View style={styles.logoOrbit}>
              <View style={[styles.logoDot, { backgroundColor: GREEN }]} />
              <View style={[styles.logoDot, styles.logoDotSmall, { backgroundColor: GOLD }]} />
              <View style={[styles.logoDot, styles.logoDotTiny, { backgroundColor: CORAL }]} />
              <View style={[styles.logoDot, styles.logoDotMini, { backgroundColor: SKY }]} />
            </View>

            <Text style={styles.title}>
              {typed}
              {typed.length < full.length ? "▍" : ""}
            </Text>
            <Text style={styles.subtitle}>Learn the basics first. Then build confidence step by step.</Text>

            <View style={styles.panelRow}>
              <View style={styles.panel}>
                <Text style={styles.panelKicker}>Start with</Text>
                <Text style={styles.panelValue}>the basics</Text>
              </View>
              <View style={styles.panel}>
                <Text style={styles.panelKicker}>Focus</Text>
                <Text style={styles.panelValue}>habits + basics</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  kickerBadge: {
    alignSelf: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  kickerText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  stage: {
    minHeight: 540,
    justifyContent: "center",
  },
  tile: {
    position: "absolute",
    zIndex: 3,
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  tileLearn: {
    top: 38,
    left: 0,
    backgroundColor: "rgba(126,214,165,0.18)",
  },
  tilePlay: {
    top: 122,
    right: 0,
    backgroundColor: "rgba(255,215,106,0.18)",
  },
  tileGrow: {
    bottom: 56,
    left: 24,
    backgroundColor: "rgba(255,159,138,0.18)",
  },
  tileLabel: {
    color: WHITE,
    fontSize: 19,
    fontWeight: "900",
  },
  heroCard: {
    borderRadius: 36,
    padding: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  logoOrbit: {
    width: 128,
    height: 128,
    alignSelf: "center",
    marginBottom: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoDot: {
    width: 28,
    height: 28,
    borderRadius: 999,
  },
  logoDotSmall: {
    position: "absolute",
    top: 22,
    right: 26,
    width: 16,
    height: 16,
  },
  logoDotTiny: {
    position: "absolute",
    bottom: 22,
    right: 32,
    width: 12,
    height: 12,
  },
  logoDotMini: {
    position: "absolute",
    top: 28,
    left: 22,
    width: 10,
    height: 10,
  },
  title: {
    color: WHITE,
    fontSize: 54,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  subtitle: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 22,
  },
  panelRow: {
    flexDirection: "row",
    gap: 12,
  },
  panel: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  panelKicker: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  panelValue: {
    color: WHITE,
    fontSize: 17,
    fontWeight: "900",
  },
});
