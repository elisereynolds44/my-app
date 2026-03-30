import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { LESSON_LIBRARY, LessonChoice } from "@/lib/lesson-content";
import { getProgressValue, removeProgressValue, setProgressValue } from "@/lib/progress-storage";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.12)";
const BAD = "#F87171";

type Props = {
  lessonNumber: number;
};

export function LessonPlayer({ lessonNumber }: Props) {
  const lesson = LESSON_LIBRARY[lessonNumber];
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<LessonChoice | null>(null);
  const [checked, setChecked] = useState(false);

  const indexKey = `lesson${lessonNumber}SlideIndex`;
  const total = lesson.steps.length;
  const step = lesson.steps[i];
  const isFirst = i === 0;
  const isLast = i === total - 1;
  const progressPct = Math.round(((i + 1) / total) * 100);

  useEffect(() => {
    const load = async () => {
      try {
        const storedIndex = await AsyncStorage.getItem(indexKey);
        const remoteIndex = storedIndex ?? (await getProgressValue(indexKey));
        if (remoteIndex !== null) {
          const parsed = Number(remoteIndex);
          if (!Number.isNaN(parsed)) {
            setI(Math.max(0, Math.min(parsed, total - 1)));
          }
        }
      } catch (e) {
        console.log(`Error loading lesson ${lessonNumber} state`, e);
      }
    };

    load();
  }, [indexKey, lessonNumber, total]);

  useEffect(() => {
    const saveIndex = async () => {
      try {
        await AsyncStorage.setItem(indexKey, String(i));
        await setProgressValue(indexKey, String(i));
      } catch (e) {
        console.log(`Error saving lesson ${lessonNumber} index`, e);
      }
    };

    saveIndex();
  }, [i, indexKey, lessonNumber]);

  const goNext = () => {
    if (step.kind === "question") {
      if (!checked || choice !== step.correct) {
        return;
      }
    }

    setChoice(null);
    setChecked(false);
    setI((prev) => Math.min(prev + 1, total - 1));
  };

  const goBack = () => {
    setChoice(null);
    setChecked(false);
    setI((prev) => Math.max(prev - 1, 0));
  };

  const completeLesson = async () => {
    await AsyncStorage.setItem(lesson.completionKey, "true");
    await setProgressValue(lesson.completionKey, "true");
    await AsyncStorage.removeItem(indexKey);
    await removeProgressValue(indexKey);
    router.replace("/roadmap");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.replace("/roadmap")} style={styles.lessonBackBtn}>
          <Text style={styles.lessonBackText}>Back to roadmap</Text>
        </TouchableOpacity>

        <View style={styles.progressMeta}>
          <Text style={styles.progressLabel}>Lesson {lesson.lessonNumber}</Text>
          <Text style={styles.progressText}>
            {i + 1}/{total}
          </Text>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.kicker}>{step.kicker}</Text>
        <Text style={styles.title}>{step.title}</Text>

        {step.kind === "info" && <Text style={styles.body}>{step.body}</Text>}

        {step.kind === "terms" && (
          <>
            <Text style={styles.body}>{step.intro}</Text>
            <View style={styles.gap} />
            <View style={styles.termStack}>
              {step.items.map((item) => (
                <View key={item.label} style={styles.termCard}>
                  <Text style={styles.termLabel}>{item.label}</Text>
                  <Text style={styles.termMeaning}>{item.meaning}</Text>
                  <Text style={styles.termWhy}>
                    <Text style={styles.termWhyLabel}>Why it matters: </Text>
                    {item.whyItMatters}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {step.kind === "example" && (
          <>
            <Text style={styles.body}>{step.scenario}</Text>
            <View style={styles.smallGap} />
            <Text style={styles.body}>
              <Text style={styles.takeawayLabel}>Takeaway: </Text>
              {step.takeaway}
            </Text>
          </>
        )}

        {step.kind === "snapshot" && (
          <>
            <Text style={styles.body}>{step.eyebrow}</Text>
            <View style={styles.snapshotCard}>
              {step.bullets.map((bullet) => (
                <View key={bullet} style={styles.snapshotRow}>
                  <View style={styles.snapshotDot} />
                  <Text style={styles.snapshotText}>{bullet}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {step.kind === "visual" && (
          <>
            <Text style={styles.body}>{step.caption}</Text>
            <View style={styles.gap} />
            {step.display === "line" && (
              <View style={styles.lineCard}>
                <View style={styles.lineGrid}>
                  <View style={styles.lineGridRule} />
                  <View style={styles.lineGridRule} />
                  <View style={styles.lineGridRule} />
                  <View style={styles.lineTrack}>
                    {step.data.map((point, index) => {
                      const leftPct =
                        step.data.length === 1 ? 0 : (index / (step.data.length - 1)) * 100;
                      const bottomPct = Math.min(92, Math.max(10, point.value));
                      const next = step.data[index + 1];
                      const nextBottomPct = next
                        ? Math.min(92, Math.max(10, next.value))
                        : null;
                      const widthPct =
                        next && step.data.length > 1 ? 100 / (step.data.length - 1) : 0;

                      return (
                        <React.Fragment key={point.label}>
                          {nextBottomPct !== null && (
                            <View
                              style={[
                                styles.lineSegment,
                                {
                                  left: `${leftPct}%`,
                                  bottom: `${bottomPct}%`,
                                  width: `${widthPct}%`,
                                  transform: [{ rotate: `${(nextBottomPct - bottomPct) * 0.55}deg` }],
                                },
                              ]}
                            />
                          )}
                          <View
                            style={[
                              styles.linePoint,
                              { left: `${leftPct}%`, bottom: `${bottomPct}%` },
                            ]}
                          />
                          <Text
                            style={[
                              styles.lineValue,
                              { left: `${leftPct}%`, bottom: `${bottomPct + 10}%` },
                            ]}
                          >
                            {point.value}
                          </Text>
                        </React.Fragment>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.lineLabels}>
                  {step.data.map((point) => (
                    <Text key={point.label} style={styles.lineLabel}>
                      {point.label}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {step.display === "metrics" && (
              <View style={styles.metricStack}>
                {step.data.map((item) => (
                  <View key={item.label} style={styles.metricRow}>
                    <View>
                      <Text style={styles.metricLabel}>{item.label}</Text>
                      <Text style={styles.metricSubtext}>
                        {item.value >= 80 ? "Very strong" : item.value >= 60 ? "Solid" : "Needs work"}
                      </Text>
                    </View>
                    <View style={styles.metricGauge}>
                      <View
                        style={[
                          styles.metricGaugeFill,
                          { width: `${Math.min(100, Math.max(0, item.value))}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.metricValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}

            {step.display === "ticker" && (
              <View style={styles.tickerCard}>
                <View style={styles.tickerHeader}>
                  <View>
                    <Text style={styles.tickerSymbol}>MARKET SNAPSHOT</Text>
                    <Text style={styles.tickerCompany}>{lesson.moduleTitle}</Text>
                  </View>
                  <Text style={styles.tickerMove}>+6.2%</Text>
                </View>

                <View style={styles.tickerMiniChart}>
                  {step.data.map((point) => (
                    <View key={point.label} style={styles.tickerCol}>
                      <View
                        style={[
                          styles.tickerBar,
                          { height: `${Math.min(100, Math.max(16, point.value))}%` },
                        ]}
                      />
                      <Text style={styles.tickerBarLabel}>{point.label}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.tickerFooter}>
                  <View>
                    <Text style={styles.tickerMetaLabel}>What changed</Text>
                    <Text style={styles.tickerMetaValue}>Expectations moved</Text>
                  </View>
                  <View>
                    <Text style={styles.tickerMetaLabel}>What to ask</Text>
                    <Text style={styles.tickerMetaValue}>What is priced in?</Text>
                  </View>
                </View>
              </View>
            )}

            {!!step.note && (
              <>
                <View style={styles.smallGap} />
                <Text style={styles.note}>{step.note}</Text>
              </>
            )}
          </>
        )}

        {step.kind === "question" && (
          <>
            <Text style={styles.body}>{step.prompt}</Text>

            <View style={styles.questionWrap}>
              {step.options.map((opt) => {
                const selected = choice === opt.key;
                const showRight = checked && opt.key === step.correct;
                const showWrong = checked && selected && opt.key !== step.correct;

                return (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.9}
                    onPress={() => {
                      setChoice(opt.key);
                      setChecked(false);
                    }}
                    style={[
                      styles.option,
                      selected && styles.optionSelected,
                      showRight && styles.optionCorrect,
                      showWrong && styles.optionWrong,
                    ]}
                  >
                    <View
                      style={[
                        styles.badge,
                        selected && styles.badgeSelected,
                        showRight && styles.badgeCorrect,
                        showWrong && styles.badgeWrong,
                      ]}
                    >
                      <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>
                        {opt.key}
                      </Text>
                    </View>

                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.checkBtn, !choice && { opacity: 0.5 }]}
              disabled={!choice}
              onPress={() => setChecked(true)}
            >
              <Text style={styles.checkBtnText}>Check</Text>
            </TouchableOpacity>

            {checked && (
              <Text style={[styles.feedback, choice === step.correct ? styles.ok : styles.bad]}>
                {choice === step.correct ? step.correctMsg : step.wrongMsg}
              </Text>
            )}
          </>
        )}

        {step.kind === "win" && <Text style={styles.body}>{step.body}</Text>}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={goBack}
          disabled={isFirst}
          style={[styles.secondaryBtn, isFirst && { opacity: 0.4 }]}
        >
          <Text style={styles.secondaryText}>Back</Text>
        </TouchableOpacity>

        {!isLast ? (
          <TouchableOpacity
            onPress={goNext}
            style={[
              styles.primaryBtn,
              step.kind === "question" && (!checked || choice !== step.correct) && { opacity: 0.5 },
            ]}
            disabled={step.kind === "question" && (!checked || choice !== step.correct)}
          >
            <Text style={styles.primaryText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={completeLesson} style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Complete lesson</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY, padding: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  lessonBackBtn: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  lessonBackText: { color: WHITE, fontWeight: "800", fontSize: 13 },
  progressMeta: { alignItems: "flex-end", gap: 4 },
  progressLabel: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  progressText: { color: MUTED, fontWeight: "900", fontSize: 12 },
  progressWrap: { marginBottom: 16 },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: GREEN, borderRadius: 999 },
  card: {
    flex: 1,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 18,
    justifyContent: "center",
  },
  kicker: {
    color: GREEN,
    fontWeight: "900",
    letterSpacing: 1.2,
    fontSize: 12,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: { color: WHITE, fontSize: 24, fontWeight: "900", marginBottom: 10 },
  body: { color: MUTED, fontSize: 15, lineHeight: 22 },
  takeawayLabel: { fontWeight: "900", color: WHITE },
  gap: { height: 14 },
  smallGap: { height: 12 },
  termStack: { gap: 10 },
  termCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    gap: 8,
  },
  termLabel: { color: WHITE, fontSize: 16, fontWeight: "900" },
  termMeaning: { color: WHITE, fontSize: 14, lineHeight: 21, fontWeight: "700" },
  termWhy: { color: MUTED, fontSize: 13, lineHeight: 19 },
  termWhyLabel: { color: GREEN, fontWeight: "900" },
  snapshotCard: {
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    gap: 12,
  },
  snapshotRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  snapshotDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: GREEN,
    marginTop: 7,
  },
  snapshotText: { flex: 1, color: WHITE, fontSize: 14, lineHeight: 21, fontWeight: "700" },
  lineCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
  },
  lineGrid: { height: 170, justifyContent: "space-between" },
  lineGridRule: { height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  lineTrack: { ...StyleSheet.absoluteFillObject, top: 8, bottom: 20, left: 8, right: 8 },
  lineSegment: { position: "absolute", height: 3, backgroundColor: GREEN, borderRadius: 999 },
  linePoint: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: WHITE,
    borderWidth: 3,
    borderColor: GREEN,
    marginLeft: -6,
    marginBottom: -6,
  },
  lineValue: { position: "absolute", color: WHITE, fontWeight: "900", fontSize: 12, marginLeft: -12 },
  lineLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  lineLabel: { color: MUTED, fontSize: 12, fontWeight: "900" },
  metricStack: { gap: 12 },
  metricRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    gap: 10,
  },
  metricLabel: { color: WHITE, fontSize: 15, fontWeight: "900" },
  metricSubtext: { color: MUTED, fontSize: 12, marginTop: 2 },
  metricGauge: {
    height: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  },
  metricGaugeFill: { height: "100%", borderRadius: 999, backgroundColor: "rgba(126,214,165,0.9)" },
  metricValue: { color: WHITE, fontWeight: "900" },
  tickerCard: {
    borderRadius: 20,
    backgroundColor: "#0A1220",
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
  },
  tickerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tickerSymbol: { color: GREEN, fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  tickerCompany: { color: WHITE, fontSize: 18, fontWeight: "900", marginTop: 6 },
  tickerMove: { color: GREEN, fontSize: 20, fontWeight: "900" },
  tickerMiniChart: { flexDirection: "row", gap: 10, alignItems: "flex-end", height: 140, marginTop: 18 },
  tickerCol: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  tickerBar: { width: "100%", maxWidth: 34, borderRadius: 999, backgroundColor: GREEN },
  tickerBarLabel: { color: MUTED, fontSize: 11, fontWeight: "800", marginTop: 8 },
  tickerFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, gap: 12 },
  tickerMetaLabel: { color: MUTED, fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  tickerMetaValue: { color: WHITE, fontSize: 13, fontWeight: "800", marginTop: 4 },
  note: { color: MUTED, fontSize: 13, lineHeight: 19 },
  questionWrap: { marginTop: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    marginBottom: 10,
  },
  optionSelected: {
    borderColor: "rgba(126,214,165,0.7)",
    backgroundColor: "rgba(126,214,165,0.08)",
  },
  optionCorrect: { borderColor: "rgba(126,214,165,0.7)" },
  optionWrong: { borderColor: "rgba(248,113,113,0.65)" },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  badgeSelected: { backgroundColor: GREEN },
  badgeCorrect: { backgroundColor: GREEN },
  badgeWrong: { backgroundColor: BAD },
  badgeText: { color: WHITE, fontWeight: "900" },
  badgeTextSelected: { color: NAVY },
  optionText: { flex: 1, color: WHITE, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  optionTextSelected: { color: WHITE },
  checkBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    borderRadius: 12,
    backgroundColor: GREEN,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  checkBtnText: { color: NAVY, fontWeight: "900", fontSize: 13 },
  feedback: { marginTop: 12, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  ok: { color: GREEN },
  bad: { color: BAD },
  controls: { flexDirection: "row", gap: 12, marginTop: 16 },
  primaryBtn: {
    flex: 1,
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: NAVY, fontWeight: "900", fontSize: 15 },
  secondaryBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  secondaryText: { color: WHITE, fontWeight: "900", fontSize: 15 },
});
