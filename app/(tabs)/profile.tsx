import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Knowledge = "Beginner" | "Intermediate" | "Advanced";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const BORDER = "#E2E8F0";
const SOFT_RED = "#F87171";

export default function ProfileSetupScreen() {
  // Form state
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [knowledge, setKnowledge] = useState<Knowledge>("Beginner");

  // Minimal starter list (keep it light for Sprint 0)
  const schools = useMemo(
    () => [
      { label: "Select your school…", value: "" },
      { label: "Westmont College", value: "westmont" },
      { label: "UCLA", value: "ucla" },
      { label: "University of Texas at Austin", value: "ut-austin" },
      { label: "Stanford University", value: "stanford" },
      { label: "Other (search coming soon)", value: "other" },
    ],
    []
  );

  const emailIsEdu = useMemo(() => {
    const trimmed = email.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.edu$/.test(trimmed);
  }, [email]);

  // Gating
  const canEnterEmail = school !== "";
  const canEnterDetails = school !== "" && emailIsEdu;

  // Progress (Step 1–3)
  const currentStep = useMemo(() => {
    if (!school) return 1;
    if (!emailIsEdu) return 2;
    return 3;
  }, [school, emailIsEdu]);

  // ---------------- Animations ----------------
  const step1Anim = useRef(new Animated.Value(0)).current; // mount entrance
  const step2Anim = useRef(new Animated.Value(0)).current; // unlock entrance
  const step3Anim = useRef(new Animated.Value(0)).current; // unlock entrance

  // Mount: show step 1 nicely
  useEffect(() => {
    Animated.timing(step1Anim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [step1Anim]);

  // Unlock step 2 when school selected
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

  // Unlock step 3 when edu email valid
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

  // Helpers to turn an Animated.Value into “slide up + fade”
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
  if (school === "") {
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

router.replace("/roadmap");
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

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={school}
            onValueChange={(val) => setSchool(val)}
            mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
            style={styles.picker}
          >
            {schools.map((s) => (
              <Picker.Item
                key={String(s.value)}
                label={s.label}
                value={s.value}
              />
            ))}
          </Picker>
        </View>
      </Animated.View>

      {/* Step 2 */}
      {/* Keep it visible but “locked” until Step 1 done, then animate it in */}
      <Animated.View
        style={[
          styles.card,
          canEnterEmail ? slideFade(step2Anim, 14) : { opacity: 0.55 },
        ]}
      >
        <Text style={styles.stepLabel}>Step 2 of 3</Text>
        <Text style={styles.sectionTitle}>School email</Text>
        <Text style={styles.helper}>
          Must end in <Text style={styles.bold}>.edu</Text>
        </Text>

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
            {emailIsEdu ? "Looks good ✅" : "Needs to end in .edu"}
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

        <Text style={[styles.label, { marginTop: 12 }]}>
          Previous knowledge
        </Text>
        <View style={styles.knowledgeRow}>
          {(["Beginner", "Intermediate", "Advanced"] as Knowledge[]).map(
            (level) => {
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
            }
          )}
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

function ProgressDots({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <View style={styles.dotsRow} accessibilityLabel={`Step ${currentStep} of ${totalSteps}`}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: WHITE,
    marginBottom: 6,
  },
  subtitle: {
    color: MUTED,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 18,
  },

  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dotActive: {
    backgroundColor: GREEN,
  },
  dotComplete: {
    backgroundColor: "rgba(126,214,165,0.6)",
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  stepLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: GREEN,
    marginBottom: 6,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: NAVY,
    marginBottom: 8,
  },
  helper: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "900",
    color: NAVY,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: WHITE,
  },
  picker: {
    height: 48,
    width: "100%",
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
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
  inputDisabled: {
    backgroundColor: "#F1F5F9",
  },

  validation: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
  },
  ok: {
    color: "#16A34A",
  },
  bad: {
    color: SOFT_RED,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },

  knowledgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    marginBottom: 14,
  },
  knowledgeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  knowledgeButtonSelected: {
    backgroundColor: NAVY,
  },
  knowledgeText: {
    fontWeight: "900",
    color: NAVY,
  },
  knowledgeTextSelected: {
    color: WHITE,
  },

  saveButton: {
    backgroundColor: NAVY,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: WHITE,
    fontWeight: "900",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
