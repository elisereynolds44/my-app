import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useProfile } from "@/components/profile-context";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";

export default function HomeScreen() {
  const { isHydrated, profile } = useProfile();
  const full = "Invest-ish";
  const [typed, setTyped] = useState("");
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setNextRoute(profile ? "/roadmap" : "/welcome");
  }, [isHydrated, profile]);

  // Typewriter animation
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 140);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typed !== full || !nextRoute) return;

    const wait = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 480,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        router.replace(nextRoute as any);
      });
    }, 1600);

    return () => clearTimeout(wait);
  }, [typed, full, opacity, nextRoute]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.center, { opacity }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ALPHA</Text>
        </View>

        <Text style={styles.title}>
          {typed}
          {typed.length < full.length ? "▍" : ""}
        </Text>
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
  badgeText: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.6,
  },

  title: {
    color: WHITE,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});
