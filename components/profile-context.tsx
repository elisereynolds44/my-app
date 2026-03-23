import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { loadStoredProfile, saveStoredProfile } from "@/lib/profile-storage";

export type CharacterOption = {
  accent: string;
  emoji: string;
  id: string;
  label: string;
};

export type ProfileData = {
  characterId: string;
  currentModuleId: string;
  email: string;
  firstName: string;
};

type ProfileContextValue = {
  characterOptions: CharacterOption[];
  completeProfile: (profile: Omit<ProfileData, "currentModuleId">) => void;
  isHydrated: boolean;
  profile: ProfileData | null;
  selectedCharacter: CharacterOption | null;
};

const CHARACTER_OPTIONS: CharacterOption[] = [
  { id: "alligator", label: "Alligator", emoji: "🐊", accent: "#34D399" },
  { id: "bear", label: "Bear", emoji: "🐻", accent: "#B45309" },
  { id: "bunny", label: "Bunny", emoji: "🐰", accent: "#F9A8D4" },
  { id: "cat", label: "Cat", emoji: "🐱", accent: "#F59E0B" },
  { id: "dolphin", label: "Dolphin", emoji: "🐬", accent: "#60A5FA" },
  { id: "elephant", label: "Elephant", emoji: "🐘", accent: "#A78BFA" },
  { id: "fox", label: "Fox", emoji: "🦊", accent: "#FB923C" },
  { id: "frog", label: "Frog", emoji: "🐸", accent: "#22C55E" },
  { id: "hamster", label: "Hamster", emoji: "🐹", accent: "#FDBA74" },
  { id: "hedgehog", label: "Hedgehog", emoji: "🦔", accent: "#A16207" },
  { id: "koala", label: "Koala", emoji: "🐨", accent: "#94A3B8" },
  { id: "lion", label: "Lion", emoji: "🦁", accent: "#FACC15" },
  { id: "octopus", label: "Octopus", emoji: "🐙", accent: "#FB7185" },
  { id: "otter", label: "Otter", emoji: "🦦", accent: "#C084FC" },
  { id: "penguin", label: "Penguin", emoji: "🐧", accent: "#F472B6" },
  { id: "raccoon", label: "Raccoon", emoji: "🦝", accent: "#64748B" },
  { id: "sloth", label: "Sloth", emoji: "🦥", accent: "#CA8A04" },
  { id: "tiger", label: "Tiger", emoji: "🐯", accent: "#F97316" },
  { id: "whale", label: "Whale", emoji: "🐋", accent: "#0EA5E9" },
];

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
    const selectedCharacter =
      CHARACTER_OPTIONS.find((character) => character.id === profile?.characterId) ?? null;

    return {
      characterOptions: CHARACTER_OPTIONS,
      completeProfile: (nextProfile) => {
        const completeData: ProfileData = {
          ...nextProfile,
          currentModuleId: "lesson-1",
        };

        setProfile(completeData);
        void saveStoredProfile(completeData);
      },
      isHydrated,
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
