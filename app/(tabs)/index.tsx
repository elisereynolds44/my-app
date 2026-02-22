// app/(tabs)/index.tsx
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const BORDER = "rgba(15,23,42,0.10)";

export default function HomeScreen() {
  const brands = useMemo(
    () => ["Chipotle", "Apple", "Nike", "Starbucks", "Trader Joe’s", "Spotify"],
    []
  );

  const [idx, setIdx] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

useEffect(() => {
  let isActive = true;

  const run = () => {
    // fade out
    Animated.timing(fade, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished || !isActive) return;

      // swap word while invisible
      setIdx((prev) => (prev + 1) % brands.length);

      // fade back in
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start(({ finished: finishedIn }) => {
        if (!finishedIn || !isActive) return;

        // wait a bit then repeat
        setTimeout(() => {
          if (isActive) run();
        }, 1700);
      });
    });
  };

  run();

  return () => {
    isActive = false;
    fade.stopAnimation();
  };
}, [brands.length, fade]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* TOP */}
        <View style={styles.top}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ALPHA</Text>
          </View>

          <Text style={styles.brand}>HOME INDEX FILE</Text>
          <Text style={styles.tagline}>
            Learn investing by doing the next right step.
          </Text>
        </View>

        <Text style={{ color: "white", marginTop: 8 }}>
  DEBUG: Home mounted ✅ {new Date().toLocaleTimeString()}
</Text>

        {/* MIDDLE HERO */}
        <View style={styles.middle}>
          <View style={styles.bubbleWrap}>
            <View style={styles.bubbleCard}>
              <View style={styles.bubbleTail} />

              <Text style={styles.bubbleLabel}>You’re thinking about:</Text>

              <Animated.Text style={[styles.bubbleWord, { opacity: fade }]}>
                {brands[idx]}
              </Animated.Text>

              <Text style={styles.bubbleSub}>
                Liking something is a starting point. We teach you how to think from there.
              </Text>
            </View>
          </View>
        </View>

        {/* BOTTOM */}
        <View style={styles.bottom}>
          <View style={styles.ctaWrap}>
            <Text style={styles.prompt}>What would you invest in?</Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.primary}
              onPress={() => router.push("/profile")}
            >
              <Text style={styles.primaryText}>Get started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.secondary}
              onPress={() => router.push("/roadmap")}
            >
              <Text style={styles.secondaryText}>View roadmap</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Build confidence before you build a portfolio.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 14,
  },

  top: { marginTop: 8 },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(126,214,165,0.16)",
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },

  badgeText: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.6,
  },

  brand: {
    color: WHITE,
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  tagline: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 20,
    maxWidth: 360,
    marginTop: 8,
  },

  middle: {
    flexGrow: 1,
    justifyContent: "center",
  },

  bubbleWrap: {
    marginVertical: 18,
  },

  bubbleCard: {
    backgroundColor: WHITE,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.12 : 0,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: Platform.OS === "android" ? 6 : 0,

    maxWidth: 460,
    alignSelf: "center",
    width: "100%",
  },

  bubbleTail: {
    position: "absolute",
    left: 34,
    bottom: -10,
    width: 18,
    height: 18,
    backgroundColor: WHITE,
    transform: [{ rotate: "45deg" }],
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },

  bubbleLabel: {
    color: "rgba(15,23,42,0.65)",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },

  bubbleWord: {
    color: NAVY,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginBottom: 10,
    minHeight: 36,
  },

  bubbleSub: {
    color: "rgba(15,23,42,0.72)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },

  bottom: {
    paddingTop: 8,
  },

  ctaWrap: {},

  prompt: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  primary: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryText: {
    color: NAVY,
    fontWeight: "900",
    fontSize: 16,
  },

  secondary: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  secondaryText: {
    color: WHITE,
    fontWeight: "900",
    fontSize: 16,
  },

  footer: {
    marginTop: 18,
  },

  footerText: {
    color: "rgba(203,213,225,0.75)",
    fontWeight: "700",
  },
});