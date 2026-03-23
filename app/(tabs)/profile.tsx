import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CharacterOption, Knowledge, useProfile } from "@/components/profile-context";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const BORDER = "#E2E8F0";
const SOFT_RED = "#F87171";
const PANEL = "#F8FAFC";

export default function ProfileSetupScreen() {
  const { characterOptions, completeProfile, isHydrated, profile, selectedCharacter } = useProfile();

  const [email, setEmail] = useState(profile?.email ?? "");
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [knowledge, setKnowledge] = useState<Knowledge>(profile?.knowledge ?? "Beginner");
  const [characterId, setCharacterId] = useState(profile?.characterId ?? "");
  const [isEditing, setIsEditing] = useState(!profile);

  const emailLooksValid = useMemo(() => {
    const trimmed = email.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }, [email]);

  const canChooseCharacter = firstName.trim().length > 0 && emailLooksValid;
  const canChooseExperience = canChooseCharacter && characterId !== "";

  const currentStep = useMemo(() => {
    if (!firstName.trim() || !emailLooksValid) return 1;
    if (!characterId) return 2;
    return 3;
  }, [characterId, emailLooksValid, firstName]);

  const step1Anim = useRef(new Animated.Value(0)).current;
  const step2Anim = useRef(new Animated.Value(0)).current;
  const step3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(step1Anim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [step1Anim]);

  useEffect(() => {
    if (canChooseCharacter) {
      Animated.timing(step2Anim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start();
    } else {
      step2Anim.setValue(0);
    }
  }, [canChooseCharacter, step2Anim]);

  useEffect(() => {
    if (canChooseExperience) {
      Animated.timing(step3Anim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start();
    } else {
      step3Anim.setValue(0);
    }
  }, [canChooseExperience, step3Anim]);

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

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingState}>
          <Text style={styles.loadingTitle}>Loading your profile…</Text>
          <Text style={styles.loadingSubtitle}>Pulling in your saved progress now.</Text>
        </View>
      </SafeAreaView>
    );
  }

  function saveProfile() {
    if (!firstName.trim()) {
      Alert.alert("Please add your first name.");
      return;
    }

    if (!emailLooksValid) {
      Alert.alert("Please enter a valid email.");
      return;
    }

    if (!characterId) {
      Alert.alert("Please choose a character.");
      return;
    }

    completeProfile({
      characterId,
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      knowledge,
    });

    setIsEditing(false);
    router.replace("/roadmap");
  }

  if (profile && !isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Your profile</Text>
          <Text style={styles.subtitle}>Everything here should help your learning journey feel personal.</Text>

          <View style={styles.summaryCard}>
            <CharacterBadge character={selectedCharacter} size="large" />
            <Text style={styles.summaryName}>{profile.firstName}</Text>
            <Text style={styles.summaryEmail}>{profile.email}</Text>
            <Text style={styles.summaryMeta}>Starting level: {profile.knowledge}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.secondaryButtonText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>We only ask for what you’ll actually use as you learn.</Text>

        <ProgressDots currentStep={currentStep} totalSteps={3} />

        <Animated.View style={[styles.card, slideFade(step1Anim, 14)]}>
          <Text style={styles.stepLabel}>Step 1 of 3</Text>
          <Text style={styles.sectionTitle}>Basics you’ll use</Text>
          <Text style={styles.helper}>
            Your name personalizes the app, and your email helps identify your account later.
          </Text>

          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="What should we call you?"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />

          <Text style={[styles.label, styles.spacedLabel]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          {!!email.trim() && (
            <Text style={[styles.validation, emailLooksValid ? styles.ok : styles.bad]}>
              {emailLooksValid ? "Looks good ✅" : "Please use a valid email address"}
            </Text>
          )}
        </Animated.View>

        <Animated.View
          style={[styles.card, canChooseCharacter ? slideFade(step2Anim, 14) : styles.lockedCard]}
        >
          <Text style={styles.stepLabel}>Step 2 of 3</Text>
          <Text style={styles.sectionTitle}>Pick your character</Text>
          <Text style={styles.helper}>
            Inspired by the playful animal-avatar idea you mentioned, this character will follow you on
            your profile and roadmap.
          </Text>

          <View style={styles.characterGrid}>
            {characterOptions.map((character) => {
              const selected = character.id === characterId;

              return (
                <TouchableOpacity
                  key={character.id}
                  onPress={() => setCharacterId(character.id)}
                  disabled={!canChooseCharacter}
                  style={[
                    styles.characterCard,
                    { borderColor: selected ? character.accent : BORDER },
                    selected && { backgroundColor: `${character.accent}18` },
                    !canChooseCharacter && styles.buttonDisabled,
                  ]}
                >
                  <CharacterBadge character={character} size="small" />
                  <Text style={styles.characterLabel}>{character.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.card, canChooseExperience ? slideFade(step3Anim, 14) : styles.lockedCard]}
        >
          <Text style={styles.stepLabel}>Step 3 of 3</Text>
          <Text style={styles.sectionTitle}>Where are you starting?</Text>
          <Text style={styles.helper}>This helps us pace the roadmap and lessons appropriately.</Text>

          <View style={styles.knowledgeRow}>
            {(["Beginner", "Intermediate", "Advanced"] as Knowledge[]).map((level) => {
              const selected = knowledge === level;
              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => setKnowledge(level)}
                  disabled={!canChooseExperience}
                  style={[
                    styles.knowledgeButton,
                    selected && styles.knowledgeButtonSelected,
                    !canChooseExperience && styles.buttonDisabled,
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
            style={[styles.saveButton, !canChooseExperience && styles.buttonDisabled]}
            onPress={saveProfile}
            disabled={!canChooseExperience}
          >
            <Text style={styles.saveButtonText}>Save profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CharacterBadge({
  character,
  size,
}: {
  character: CharacterOption | null;
  size: "small" | "large";
}) {
  if (!character) {
    return null;
  }

  const badgeSize = size === "large" ? 96 : 64;
  const fontSize = size === "large" ? 42 : 28;

  return (
    <View
      style={[
        styles.characterBadge,
        {
          backgroundColor: character.accent,
          height: badgeSize,
          width: badgeSize,
        },
      ]}
    >
      <Text style={[styles.characterEmoji, { fontSize }]}>{character.emoji}</Text>
    </View>
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
  },
  contentContainer: {
    padding: 20,
    gap: 14,
  },
  title: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "800",
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
    marginBottom: 2,
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
    gap: 10,
  },
  lockedCard: {
    opacity: 0.55,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: GREEN,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: NAVY,
  },
  helper: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
  spacedLabel: {
    marginTop: 8,
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
  validation: {
    fontSize: 13,
    fontWeight: "700",
  },
  ok: {
    color: "#16A34A",
  },
  bad: {
    color: SOFT_RED,
  },
  characterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  characterCard: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: PANEL,
    alignItems: "center",
    gap: 10,
  },
  characterBadge: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  characterEmoji: {
    textAlign: "center",
  },
  characterLabel: {
    color: NAVY,
    fontSize: 14,
    fontWeight: "800",
  },
  knowledgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
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
    marginTop: 4,
    color: NAVY,
  },
  knowledgeTextSelected: {
    color: WHITE,
  },
  saveButton: {
    backgroundColor: NAVY,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: WHITE,
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: NAVY,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 8,
  },
  loadingTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "800",
  },
  loadingSubtitle: {
    color: MUTED,
    fontSize: 14,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  summaryName: {
    color: NAVY,
    fontSize: 24,
    fontWeight: "900",
  },
  summaryEmail: {
    color: "#475569",
    fontSize: 14,
  },
  summaryMeta: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
  },
});