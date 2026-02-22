// app/(tabs)/welcome.tsx
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
const MUTED = "#CBD5E1";
const BORDER = "rgba(255,255,255,0.14)";

export default function WelcomeScreen() {
  const brands = useMemo(
    () => [
      "Chipotle",
      "Apple",
      "Nike",
      "Spotify",
      "Trader Joe’s",
      "Target",
      "Netflix",
      "Lululemon",
    ],
    []
  );

  // dissolve in
  const screenOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, [screenOpacity]);

  // typewriter welcome copy
  const full1 = "Welcome to Invest-ish.";
  const full2 =
    "A personal finance app for college students. We make investing feel simple, not scary. Start with what feels familiar, explore how companies grow, and slowly build the confidence to invest in your future.";

  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    const id1 = setInterval(() => {
      i += 1;
      setLine1(full1.slice(0, i));
      if (i >= full1.length) {
        clearInterval(id1);

        // small pause then start line 2
        setTimeout(() => {
          let j = 0;
          const id2 = setInterval(() => {
            j += 1;
            setLine2(full2.slice(0, j));
            if (j >= full2.length) {
              clearInterval(id2);
              setDoneTyping(true);
            }
          }, 58);
        }, 350);
      }
    }, 100);

    return () => clearInterval(id1);
  }, []);

  // reveal timing
  const revealCard = useRef(new Animated.Value(0)).current;
  const revealCTA = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!doneTyping) return;

    // show carousel card shortly after typing
    const t1 = setTimeout(() => {
      Animated.timing(revealCard, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start();
    }, 350);

    // show CTA ~5s after carousel begins
    const t2 = setTimeout(() => {
      Animated.timing(revealCTA, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }).start();
    }, 350 + 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [doneTyping, revealCard, revealCTA]);

  // carousel animation
  const [idx, setIdx] = useState(0);
  const wordFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!doneTyping) return;

    const id = setInterval(() => {
      wordFade.setValue(0);
      setIdx((p) => (p + 1) % brands.length);
      Animated.timing(wordFade, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearInterval(id);
  }, [doneTyping, brands.length, wordFade]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: screenOpacity }]}>
        {/* Skip */}
        <TouchableOpacity
          style={styles.skip}
          onPress={() => router.replace("/profile")}
          activeOpacity={0.8}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Kicker */}
        <View style={styles.kickerWrap}>
          <Text style={styles.kicker}>WELCOME</Text>
        </View>

        {/* Headline */}
        <Text style={styles.h1}>
          {line1}
          {line1.length < full1.length ? "▍" : ""}
        </Text>

        {/* Body */}
        <Text style={styles.p}>
          {line2}
          {line1.length === full1.length && line2.length < full2.length ? "▍" : ""}
        </Text>

        {/* Carousel reveal */}
        <Animated.View
          style={[
            styles.revealWrap,
            {
              opacity: revealCard,
              transform: [
                {
                  translateY: revealCard.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Start with something familiar:</Text>
            <Animated.Text style={[styles.word, { opacity: wordFade }]}>
              {brands[idx]}
            </Animated.Text>
            <Text style={styles.sub}>
              The brands you love are the best place to start learning.
            </Text>
          </View>
        </Animated.View>

        {/* CTA reveal (delayed) */}
        <Animated.View
          style={[
            {
              opacity: revealCTA,
              transform: [
                {
                  translateY: revealCTA.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.primary}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.primaryText}>Get started</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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
  content: { flex: 1 },

  kickerWrap: { marginTop: 22 },
  kicker: {
    color: "rgba(126,214,165,0.9)",
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1.1,
  },

  skip: { position: "absolute", top: 18, right: 0, padding: 10 },
  skipText: { color: "rgba(203,213,225,0.85)", fontWeight: "800" },

  h1: {
    color: WHITE,
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -0.2,
    marginTop: 10,
    lineHeight: 44,
  },

  p: { color: MUTED, fontSize: 15, lineHeight: 21, marginTop: 14, maxWidth: 520 },

  revealWrap: { marginTop: 22, gap: 12 },

  card: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 16,
  },
  label: {
    color: "rgba(203,213,225,0.9)",
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  word: { color: WHITE, fontSize: 28, fontWeight: "900", marginTop: 10 },
  sub: {
    color: "rgba(203,213,225,0.85)",
    marginTop: 8,
    fontWeight: "700",
    lineHeight: 20,
  },

  primary: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12, // little spacing after card
  },
  primaryText: { color: NAVY, fontWeight: "900", fontSize: 16 },
});