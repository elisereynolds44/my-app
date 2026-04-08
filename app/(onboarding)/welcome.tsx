import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppBackdrop } from "@/components/app-backdrop";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const GOLD = "#FFD76A";
const SKY = "#94D7FF";
const CORAL = "#FF9F8A";

export default function WelcomeScreen() {
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const revealCard = useRef(new Animated.Value(0)).current;
  const revealCTA = useRef(new Animated.Value(0)).current;

  const full1 = "Start with the basics.";
  const full2 = "Learn how investing works, build steady habits, and grow confidence one small step at a time.";

  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);

  useEffect(() => {
    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();

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

    makeFloat(floatA, -12, 2400);
    makeFloat(floatB, 10, 2600);
  }, [floatA, floatB, screenOpacity]);

  useEffect(() => {
    let i = 0;
    const id1 = setInterval(() => {
      i += 1;
      setLine1(full1.slice(0, i));
      if (i >= full1.length) {
        clearInterval(id1);

        setTimeout(() => {
          let j = 0;
          const id2 = setInterval(() => {
            j += 1;
            setLine2(full2.slice(0, j));
            if (j >= full2.length) {
              clearInterval(id2);
              setDoneTyping(true);
            }
          }, 34);
        }, 240);
      }
    }, 56);

    return () => clearInterval(id1);
  }, []);

  useEffect(() => {
    if (!doneTyping) return;

    const t1 = setTimeout(() => {
      Animated.timing(revealCard, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }).start();
    }, 160);

    const t2 = setTimeout(() => {
      Animated.timing(revealCTA, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }, 560);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [doneTyping, revealCard, revealCTA]);

  return (
    <SafeAreaView style={styles.container}>
      <AppBackdrop accent={GREEN} />
      <Animated.View style={[styles.content, { opacity: screenOpacity }]}>
        <TouchableOpacity style={styles.skip} onPress={() => router.replace("/profile")} activeOpacity={0.8}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.kickerBadge}>
          <Text style={styles.kickerText}>BASICS FIRST</Text>
        </View>

        <View style={styles.heroWrap}>
          <Animated.View style={[styles.planetCardLeft, { transform: [{ translateY: floatA }] }]}>
            <View style={[styles.planetDot, { backgroundColor: GOLD }]} />
            <Text style={styles.planetText}>simple ideas</Text>
          </Animated.View>
          <Animated.View style={[styles.planetCardRight, { transform: [{ translateY: floatB }] }]}>
            <View style={[styles.planetDot, { backgroundColor: SKY }]} />
            <Text style={styles.planetText}>steady habits</Text>
          </Animated.View>

          <View style={styles.constellation}>
            <View style={[styles.star, styles.starA, { backgroundColor: GREEN }]} />
            <View style={[styles.star, styles.starB, { backgroundColor: GOLD }]} />
            <View style={[styles.star, styles.starC, { backgroundColor: CORAL }]} />
          </View>

          <Text style={styles.h1}>
            {line1}
            {line1.length < full1.length ? "▍" : ""}
          </Text>
          <Text style={styles.p}>
            {line2}
            {line1.length === full1.length && line2.length < full2.length ? "▍" : ""}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.revealWrap,
            {
              opacity: revealCard,
              transform: [
                {
                  translateY: revealCard.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.label}>HOW IT FEELS</Text>
              <View style={styles.orbitRow}>
                <View style={[styles.orbitDot, { backgroundColor: GREEN }]} />
                <View style={[styles.orbitDot, { backgroundColor: GOLD }]} />
                <View style={[styles.orbitDot, { backgroundColor: SKY }]} />
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureOrb}>
                <View style={[styles.featureCore, { backgroundColor: GREEN }]} />
              </View>
              <View style={styles.featureOrb}>
                <View style={[styles.featureCore, { backgroundColor: GOLD }]} />
              </View>
              <View style={styles.featureOrb}>
                <View style={[styles.featureCore, { backgroundColor: SKY }]} />
              </View>
            </View>

            <Text style={styles.word}>Learn. Play. Grow.</Text>
            <Text style={styles.sub}>Clear basics, steady habits, growing confidence.</Text>

            <View style={styles.tileRow}>
              <View style={styles.tile}>
                <Text style={styles.tileTitle}>Learn the basics</Text>
                <Text style={styles.tileText}>Start with what investing is.</Text>
              </View>
              <View style={styles.tile}>
                <Text style={styles.tileTitle}>Stay steady</Text>
                <Text style={styles.tileText}>Less pressure, more progress.</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            {
              opacity: revealCTA,
              transform: [
                {
                  translateY: revealCTA.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.9} style={styles.primary} onPress={() => router.push("/profile")}>
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
  content: {
    flex: 1,
  },
  skip: {
    position: "absolute",
    top: 18,
    right: 0,
    padding: 10,
  },
  skipText: {
    color: "rgba(203,213,225,0.86)",
    fontWeight: "800",
  },
  kickerBadge: {
    alignSelf: "flex-start",
    marginTop: 24,
    marginBottom: 14,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  kickerText: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1,
  },
  heroWrap: {
    marginTop: 10,
    marginBottom: 18,
    minHeight: 270,
    justifyContent: "center",
  },
  planetCardLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planetCardRight: {
    position: "absolute",
    top: 40,
    right: 0,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planetDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  planetText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 13,
  },
  constellation: {
    position: "absolute",
    top: 66,
    left: "42%",
    width: 80,
    height: 40,
  },
  star: {
    position: "absolute",
    borderRadius: 999,
  },
  starA: {
    width: 12,
    height: 12,
    top: 0,
    left: 0,
  },
  starB: {
    width: 8,
    height: 8,
    top: 18,
    left: 28,
  },
  starC: {
    width: 10,
    height: 10,
    top: 6,
    left: 54,
  },
  h1: {
    color: WHITE,
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 44,
    letterSpacing: -0.5,
    marginTop: 74,
    marginBottom: 14,
  },
  p: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 560,
    fontWeight: "700",
  },
  revealWrap: {
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 18,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    color: "rgba(203,213,225,0.88)",
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  orbitRow: {
    flexDirection: "row",
    gap: 6,
  },
  orbitDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  word: {
    color: WHITE,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  sub: {
    color: "rgba(203,213,225,0.86)",
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 14,
    textAlign: "center",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 14,
  },
  featureOrb: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureCore: {
    width: 18,
    height: 18,
    borderRadius: 999,
  },
  tileRow: {
    flexDirection: "row",
    gap: 10,
  },
  tile: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  tileTitle: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  tileText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  primary: {
    backgroundColor: GREEN,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 14,
  },
  primaryText: {
    color: NAVY,
    fontWeight: "900",
    fontSize: 17,
  },
});
