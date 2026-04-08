import { Image } from "expo-image";
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

import { AppBackdrop } from "@/components/app-backdrop";
import { CharacterOption, useProfile } from "@/components/profile-context";

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";
const GREEN = "#7ED6A5";
const MUTED = "#CBD5E1";
const BORDER = "#E2E8F0";
const SOFT_RED = "#F87171";

export default function ProfileSetupScreen() {
  const { characterOptions, completeProfile, isHydrated, logOutProfile, profile, selectedCharacter } =
    useProfile();

  const [email, setEmail] = useState(profile?.email ?? "");
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [characterId, setCharacterId] = useState(selectedCharacter?.id ?? profile?.characterId ?? "");
  const [isEditing, setIsEditing] = useState(!profile);

  useEffect(() => {
    setEmail(profile?.email ?? "");
    setFirstName(profile?.firstName ?? "");
    setCharacterId(selectedCharacter?.id ?? profile?.characterId ?? "");
    setIsEditing(!profile);
  }, [profile, selectedCharacter]);

  const emailLooksValid = useMemo(() => {
    const trimmed = email.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }, [email]);

  const canChooseCharacter = firstName.trim().length > 0 && emailLooksValid;

  const currentStep = useMemo(() => {
    if (!firstName.trim() || !emailLooksValid) return 1;
    return 2;
  }, [emailLooksValid, firstName]);

  const step1Anim = useRef(new Animated.Value(0)).current;
  const step2Anim = useRef(new Animated.Value(0)).current;

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
        <AppBackdrop accent={GREEN} />
        <View style={styles.loadingState}>
          <View style={styles.loadingPulse} />
          <Text style={styles.loadingTitle}>Loading your profile…</Text>
          <Text style={styles.loadingSubtitle}>Pulling in your saved progress now.</Text>
        </View>
      </SafeAreaView>
    );
  }

  async function saveProfile() {
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

    await completeProfile({
      characterId,
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
    });

    setIsEditing(false);
    router.replace("/roadmap");
  }

  async function handleLogOut() {
    await logOutProfile();
    setIsEditing(true);
    router.replace("/welcome");
  }

  if (profile && !isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBackdrop accent={GREEN} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Your profile</Text>
          <Text style={styles.subtitle}>Everything here should help your learning journey feel personal.</Text>

          <View style={styles.summaryCard}>
            <CharacterBadge character={selectedCharacter} size="large" />
            <Text style={styles.summaryName}>{profile.firstName}</Text>
            <Text style={styles.summaryEmail}>{profile.email}</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.secondaryButtonText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logOutButton} onPress={handleLogOut}>
              <Text style={styles.logOutButtonText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppBackdrop accent={GREEN} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>We only ask for what you’ll actually use as you learn.</Text>

        <ProgressDots currentStep={currentStep} totalSteps={2} />

        <Animated.View style={[styles.card, slideFade(step1Anim, 14)]}>
          <Text style={styles.stepLabel}>Step 1 of 2</Text>
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
              {emailLooksValid ? "Looks good" : "Please use a valid email address"}
            </Text>
          )}
        </Animated.View>

        <Animated.View
          style={[styles.card, canChooseCharacter ? slideFade(step2Anim, 14) : styles.lockedCard]}
        >
          <Text style={styles.stepLabel}>Step 2 of 2</Text>
          <Text style={styles.sectionTitle}>Pick your character</Text>
          <Text style={styles.helper}>
            Pick one of the six starter avatars. You can change it later.
          </Text>
          <View style={styles.avatarPill}>
            <Text style={styles.avatarPillText}>6 clean starter avatars</Text>
          </View>

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

          <TouchableOpacity
            style={[styles.saveButton, (!canChooseCharacter || !characterId) && styles.buttonDisabled]}
            onPress={saveProfile}
            disabled={!canChooseCharacter || !characterId}
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
  const imageSize = size === "large" ? 88 : 56;

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
      <Image
        source={character.imageSource}
        style={{ width: imageSize, height: imageSize }}
        contentFit="contain"
      />
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
    paddingBottom: 110,
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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 18,
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
    color: WHITE,
  },
  helper: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: WHITE,
    marginBottom: 6,
  },
  spacedLabel: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: WHITE,
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
    marginTop: 2,
  },
  avatarPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 4,
  },
  avatarPillText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "800",
  },
  characterCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    gap: 10,
  },
  characterBadge: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  characterLabel: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: GREEN,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: NAVY,
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  secondaryButtonText: {
    color: WHITE,
    fontWeight: "800",
  },
  logOutButton: {
    marginTop: 2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.34)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "rgba(248,113,113,0.10)",
  },
  logOutButtonText: {
    color: SOFT_RED,
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
  loadingPulse: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: "rgba(126,214,165,0.16)",
    borderWidth: 1,
    borderColor: "rgba(126,214,165,0.30)",
    marginBottom: 6,
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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  summaryName: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "900",
  },
  summaryEmail: {
    color: MUTED,
    fontSize: 14,
  },
});
