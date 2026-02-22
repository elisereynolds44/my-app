// app/(tabs)/profile.tsx
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SchoolAutocomplete } from "../../components/SchoolAutocomplete";

type Knowledge = "Beginner" | "Intermediate" | "Advanced";

type SelectedSchool = {
  id: number;
  name: string;
  city?: string;
  state?: string;
};

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const BORDER = "#E2E8F0";
const SOFT_RED = "#F87171";

const SCORECARD_API_KEY = "5ub2ffiUSYlz3NhaHvpMRgwYWilIJlyH0yrf5fe3";

export default function ProfileSetupScreen() {
  // ✅ FIXED FORM STATE
  const [selectedSchool, setSelectedSchool] = useState<SelectedSchool | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [knowledge, setKnowledge] = useState<Knowledge>("Beginner");

  const emailIsEdu = useMemo(() => {
    const trimmed = email.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.edu$/.test(trimmed);
  }, [email]);

  // ✅ FIXED GATING
  const canEnterEmail = !!selectedSchool;
  const canEnterDetails = !!selectedSchool && emailIsEdu;

  const currentStep = useMemo(() => {
    if (!selectedSchool) return 1;
    if (!emailIsEdu) return 2;
    return 3;
  }, [selectedSchool, emailIsEdu]);

  // ---------------- Animations ----------------
  const step1Anim = useRef(new Animated.Value(0)).current;
  const step2Anim = useRef(new Animated.Value(0)).current;
  const step3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(step1Anim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [step1Anim]);

  useEffect(() => {
    if (canEnterEmail) {
      Animated.timing(step2Anim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start();
    } else {
      step2Anim.setValue(0);
    }
  }, [canEnterEmail, step2Anim]);

  useEffect(() => {
    if (canEnterDetails) {
      Animated.timing(step3Anim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start();
    } else {
      step3Anim.setValue(0);
    }
  }, [canEnterDetails, step3Anim]);

  const slideFade = (anim: Animated.Value, yFrom = 10) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [yFrom, 0],
        }),
      },
    ],
  });

  function saveProfile() {
    if (!selectedSchool) {
      Alert.alert("Select your school first.");
      return;
    }
    if (!emailIsEdu) {
      Alert.alert("Please enter a valid .edu email.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Please enter your first and last name.");
      return;
    }

    const ageNum = Number(age);
    if (!age.trim() || Number.isNaN(ageNum)) {
      Alert.alert("Please enter a valid age.");
      return;
    }

    router.replace({
      pathname: "/roadmap",
      params: {
        firstName: firstName.trim(),
        school: selectedSchool.name,
        knowledge,
        age: age.trim(),
        email: email.trim(),
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Set up your profile</Text>
      <Text style={styles.subtitle}>Quick setup, then you’re in.</Text>

      <ProgressDots currentStep={currentStep} totalSteps={3} />

      {/* Step 1 */}
      <Animated.View style={[styles.card, slideFade(step1Anim, 14)]}>
        <Text style={styles.stepLabel}>Step 1 of 3</Text>
        <Text style={styles.sectionTitle}>Select your school</Text>

        <View style={{ marginTop: 10 }}>
          <SchoolAutocomplete
            apiKey={SCORECARD_API_KEY}
            value={selectedSchool}
            onSelect={(s) => setSelectedSchool(s)}
          />
        </View>

        {!!selectedSchool && (
          <Text style={styles.selectedHint}>
            Selected: {selectedSchool.name}
            {selectedSchool.state ? `, ${selectedSchool.state}` : ""}
          </Text>
        )}
      </Animated.View>

      {/* Step 2 */}
      <Animated.View
        style={[
          styles.card,
          canEnterEmail ? slideFade(step2Anim, 14) : { opacity: 0.55 },
        ]}
      >
        <Text style={styles.stepLabel}>Step 2 of 3</Text>
        <Text style={styles.sectionTitle}>School email</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@school.edu"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, !canEnterEmail && styles.inputDisabled]}
          editable={canEnterEmail}
        />

        {!!email.trim() && (
          <Text style={[styles.validation, emailIsEdu ? styles.ok : styles.bad]}>
            {emailIsEdu ? "Looks good" : "Needs to end in .edu"}
          </Text>
        )}
      </Animated.View>

      {/* Step 3 */}
      <Animated.View
        style={[
          styles.card,
          canEnterDetails ? slideFade(step3Anim, 14) : { opacity: 0.55 },
        ]}
      >
        <Text style={styles.stepLabel}>Step 3 of 3</Text>
        <Text style={styles.sectionTitle}>About you</Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First"
              placeholderTextColor="#94A3B8"
              style={[styles.input, !canEnterDetails && styles.inputDisabled]}
              editable={canEnterDetails}
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last"
              placeholderTextColor="#94A3B8"
              style={[styles.input, !canEnterDetails && styles.inputDisabled]}
              editable={canEnterDetails}
            />
          </View>
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>Age</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="e.g., 21"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          style={[styles.input, !canEnterDetails && styles.inputDisabled]}
          editable={canEnterDetails}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Previous knowledge</Text>
        <View style={styles.knowledgeRow}>
          {(["Beginner", "Intermediate", "Advanced"] as Knowledge[]).map((level) => {
            const selected = knowledge === level;
            return (
              <TouchableOpacity
                key={level}
                onPress={() => setKnowledge(level)}
                disabled={!canEnterDetails}
                style={[
                  styles.knowledgeButton,
                  selected && styles.knowledgeButtonSelected,
                  !canEnterDetails && styles.buttonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.knowledgeText,
                    selected && styles.knowledgeTextSelected,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !canEnterDetails && styles.buttonDisabled]}
          onPress={saveProfile}
          disabled={!canEnterDetails}
        >
          <Text style={styles.saveButtonText}>Save profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

/* ---------- Progress dots ---------- */

function ProgressDots({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;

        return (
          <View
            key={stepNum}
            style={[
              styles.dot,
              (isActive || isComplete) && styles.dotActive,
              isComplete && styles.dotComplete,
            ]}
          />
        );
      })}
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY, padding: 20 },

  title: { fontSize: 28, fontWeight: "800", color: WHITE, marginBottom: 6 },
  subtitle: { color: MUTED, marginBottom: 14, fontSize: 14, lineHeight: 18 },

  dotsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.25)" },
  dotActive: { backgroundColor: GREEN },
  dotComplete: { backgroundColor: "rgba(126,214,165,0.6)" },

  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  stepLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: GREEN,
    marginBottom: 6,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: NAVY, marginBottom: 8 },

  selectedHint: { marginTop: 10, fontSize: 12, fontWeight: "700", color: "#334155" },

  label: { fontSize: 13, fontWeight: "700", color: "#334155", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: NAVY,
  },
  inputDisabled: { backgroundColor: "#F1F5F9" },

  validation: { marginTop: 8, fontSize: 13, fontWeight: "700" },
  ok: { color: "#16A34A" },
  bad: { color: SOFT_RED },

  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },

  knowledgeRow: { flexDirection: "row", gap: 8, marginTop: 6, marginBottom: 14 },
  knowledgeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  knowledgeButtonSelected: { backgroundColor: NAVY },
  knowledgeText: { fontWeight: "900", color: NAVY },
  knowledgeTextSelected: { color: WHITE },

  saveButton: {
    backgroundColor: NAVY,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: { color: WHITE, fontWeight: "900", fontSize: 16 },
  buttonDisabled: { opacity: 0.5 },
});