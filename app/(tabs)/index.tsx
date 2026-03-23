// app/(tabs)/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";

export default function HomeScreen() {
  const full = "Invest-ish";
  const [typed, setTyped] = useState("");
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  // ⬇️ This controls whether we allow the auto-route to happen.
  // If "demoResetDone" isn't true, we pause routing so you can tap the button.
  const [allowRoute, setAllowRoute] = useState(false);

  const opacity = useRef(new Animated.Value(1)).current;

  const resetApp = async () => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem("demoResetDone", "true");
      console.log("Storage cleared");

      // Re-run routing logic after reset
      setAllowRoute(true);
    } catch (e) {
      console.log("Error clearing storage", e);
    }
  };

  // Decide whether we should allow routing immediately
  useEffect(() => {
    const checkDemoFlag = async () => {
      try {
        const done = await AsyncStorage.getItem("demoResetDone");
        setAllowRoute(done === "true");
      } catch {
        setAllowRoute(false);
      }
    };
    checkDemoFlag();
  }, []);

  // Decide where to go based on setupComplete (only once allowRoute is true)
  useEffect(() => {
    if (!allowRoute) return;

    const decideRoute = async () => {
      try {
        const complete = await AsyncStorage.getItem("setupComplete");

        if (complete === "true") {
          setNextRoute("/roadmap"); // change if your main hub is different
        } else {
          setNextRoute("/(onboarding)/profile");
        }
      } catch (e) {
        setNextRoute("/(onboarding)/profile");
      }
    };

    decideRoute();
  }, [allowRoute]);

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

  // After typing + pause → fade + route (only if allowRoute is true)
  useEffect(() => {
    if (!allowRoute) return;
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
  }, [typed, full, opacity, nextRoute, allowRoute]);

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

        {/* ⬇️ Only show this when routing is paused for demo reset */}
        {!allowRoute && (
          <View style={{ marginTop: 22 }}>
            <Text style={styles.helperText}>
              Demo mode: clear saved progress before recording.
            </Text>

            <TouchableOpacity onPress={resetApp} style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>Reset Demo</Text>
            </TouchableOpacity>

            <Text style={styles.tinyText}>
              After reset, the app will route like a new user.
            </Text>
          </View>
        )}
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

  helperText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    marginBottom: 10,
  },
  resetBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  resetBtnText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 14,
  },
  tinyText: {
    marginTop: 8,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
  },
});