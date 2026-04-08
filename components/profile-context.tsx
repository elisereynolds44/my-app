import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { CHARACTER_OPTIONS, CharacterOption, normalizeCharacterId } from "@/lib/character-options";
import { clearLocalProgressValues, clearProgressValuesForEmail } from "@/lib/progress-storage";
import { clearStoredProfile, loadStoredProfile, saveStoredProfile } from "@/lib/profile-storage";

export type ProfileData = {
  characterId: string;
  currentModuleId: string;
  email: string;
  firstName: string;
};

type ProfileContextValue = {
  characterOptions: CharacterOption[];
  completeProfile: (profile: Omit<ProfileData, "currentModuleId">) => Promise<void>;
  isHydrated: boolean;
  logOutProfile: () => Promise<void>;
  profile: ProfileData | null;
  selectedCharacter: CharacterOption | null;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateProfile() {
      const storedProfile = await loadStoredProfile();

      if (!isMounted) {
        return;
      }

      setProfile(storedProfile);
      setIsHydrated(true);
    }

    void hydrateProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<ProfileContextValue>(() => {
    const normalizedCharacterId = normalizeCharacterId(profile?.characterId);
    const selectedCharacter =
      CHARACTER_OPTIONS.find((character) => character.id === normalizedCharacterId) ?? null;

    return {
      characterOptions: CHARACTER_OPTIONS,
      completeProfile: async (nextProfile) => {
        const normalizedEmail = nextProfile.email.trim().toLowerCase();
        const completeData: ProfileData = {
          ...nextProfile,
          characterId: normalizeCharacterId(nextProfile.characterId),
          currentModuleId: "lesson-1",
          email: normalizedEmail,
        };

        setProfile(completeData);
        const previousEmail = profile?.email?.trim().toLowerCase() ?? null;
        const isFreshProfile = !profile;
        const switchedAccount = previousEmail !== null && previousEmail !== normalizedEmail;

        if (isFreshProfile || switchedAccount) {
          const lessonKeys = Array.from({ length: 10 }, (_, index) => `completedLesson${index + 1}`);
          const gameKeys = Array.from({ length: 10 }, (_, index) => `completedGame${index + 1}`);
          const slideKeys = Array.from({ length: 10 }, (_, index) => `lesson${index + 1}SlideIndex`);

          await clearProgressValuesForEmail([
            ...lessonKeys,
            ...gameKeys,
            ...slideKeys,
            "completedSimulation1",
            "lesson1Brand",
            "lesson1LastBrand",
          ], normalizedEmail);
        }

        await saveStoredProfile(completeData);
      },
      isHydrated,
      logOutProfile: async () => {
        const lessonKeys = Array.from({ length: 10 }, (_, index) => `completedLesson${index + 1}`);
        const gameKeys = Array.from({ length: 10 }, (_, index) => `completedGame${index + 1}`);
        const slideKeys = Array.from({ length: 10 }, (_, index) => `lesson${index + 1}SlideIndex`);

        await clearLocalProgressValues([
          ...lessonKeys,
          ...gameKeys,
          ...slideKeys,
          "completedSimulation1",
          "lesson1Brand",
          "lesson1LastBrand",
        ]);
        await clearStoredProfile();
        setProfile(null);
      },
      profile,
      selectedCharacter,
    };
  }, [isHydrated, profile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }

  return context;
}
