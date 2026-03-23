import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const INVEST = "invest";
const ISH = "-ish";
const TAGLINE = "learn it gently";

const INVEST_SPEED = 220;   // slower typing for "invest"
const ISH_SPEED = 240;      // even slower for "-ish" (feels deliberate)
const TAGLINE_SPEED = 120;  // gentle, readable tagline
const PAUSE_BEFORE_ISH = 1500; // dramatic pause before finishing the title

const PAUSE_BEFORE_TAGLINE = 500;
const SPLASH_TOTAL_TIME = 10000;

export default function Splash({ onDone }: { onDone: () => void }) {
  const [investText, setInvestText] = useState("");
  const [ishText, setIshText] = useState("");
  const [taglineText, setTaglineText] = useState("");
  const [phase, setPhase] = useState<
    "invest" | "pause" | "ish" | "tagline"
  >("invest");

  const [cursorVisible, setCursorVisible] = useState(true);

  // blinking cursor
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);

    return () => clearInterval(blink);
  }, []);

  // typing logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (phase === "invest") {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setInvestText(INVEST.slice(0, i));
        if (i === INVEST.length) {
          clearInterval(interval!);
          setPhase("pause");
        }
      }, INVEST_SPEED);
    }

    if (phase === "pause") {
      timeout = setTimeout(() => setPhase("ish"), PAUSE_BEFORE_ISH);
    }

    if (phase === "ish") {
      let j = 0;
      interval = setInterval(() => {
        j++;
        setIshText(ISH.slice(0, j));
        if (j === ISH.length) {
          clearInterval(interval!);
          setTimeout(() => setPhase("tagline"), PAUSE_BEFORE_TAGLINE);
        }
      }, ISH_SPEED);
    }

    if (phase === "tagline") {
      let k = 0;
      interval = setInterval(() => {
        k++;
        setTaglineText(TAGLINE.slice(0, k));
        if (k === TAGLINE.length) {
          clearInterval(interval!);
        }
      }, TAGLINE_SPEED);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [phase]);

  // exit splash
  useEffect(() => {
    const done = setTimeout(onDone, SPLASH_TOTAL_TIME);
    return () => clearTimeout(done);
  }, [onDone]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {investText}
        {ishText}
        {cursorVisible && "|"}
      </Text>

      <Text style={styles.tagline}>{taglineText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1C2D", // navy
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  tagline: {
    marginTop: 12,
    fontSize: 16,
    color: "#7ED9A8", // soft green
    letterSpacing: 0.4,
  },
});
