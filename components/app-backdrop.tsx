import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  accent?: string;
};

export function AppBackdrop({ accent = "#7ED6A5" }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.orb, styles.orbTop, { backgroundColor: accent }]} />
      <View style={[styles.orb, styles.orbLeft]} />
      <View style={[styles.orb, styles.orbBottom, { borderColor: `${accent}35` }]} />
      <View style={styles.gridWrap}>
        {Array.from({ length: 8 }).map((_, index) => (
          <View key={index} style={styles.gridLine} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orbTop: {
    width: 260,
    height: 260,
    opacity: 0.16,
    top: -90,
    right: -50,
  },
  orbLeft: {
    width: 220,
    height: 220,
    backgroundColor: "rgba(96,165,250,0.10)",
    left: -80,
    top: 180,
  },
  orbBottom: {
    width: 320,
    height: 320,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.02)",
    bottom: -170,
    right: -90,
  },
  gridWrap: {
    position: "absolute",
    inset: 0,
    justifyContent: "space-evenly",
    opacity: 0.18,
  },
  gridLine: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 18,
  },
});
