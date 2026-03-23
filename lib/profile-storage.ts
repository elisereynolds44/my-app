import { get, ref, set } from "firebase/database";

import { ProfileData } from "@/components/profile-context";
import { getFirebaseDatabase } from "@/lib/firebase";

const STORAGE_KEY = "investish.profile";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getProfileKey(email: string) {
  return email.trim().toLowerCase().replace(/[.#$\[\]/]/g, "_");
}

function parseProfile(value: string | null): ProfileData | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as ProfileData;
  } catch {
    return null;
  }
}

function loadLocalProfile() {
  if (!canUseLocalStorage()) {
    return null;
  }

  return parseProfile(window.localStorage.getItem(STORAGE_KEY));
}

function saveLocalProfile(profile: ProfileData) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export async function loadStoredProfile() {
  const localProfile = loadLocalProfile();
  const database = getFirebaseDatabase();

  if (!localProfile || !database) {
    return localProfile;
  }

  try {
    const snapshot = await get(ref(database, `profiles/${getProfileKey(localProfile.email)}`));

    if (!snapshot.exists()) {
      return localProfile;
    }

    const remoteProfile = snapshot.val() as ProfileData | null;

    if (remoteProfile) {
      saveLocalProfile(remoteProfile);
    }

    return remoteProfile ?? localProfile;
  } catch {
    return localProfile;
  }
}

export async function saveStoredProfile(profile: ProfileData) {
  saveLocalProfile(profile);

  const database = getFirebaseDatabase();

  if (!database) {
    return;
  }

  try {
    await set(ref(database, `profiles/${getProfileKey(profile.email)}`), profile);
  } catch {
    // Keep local persistence working even if remote sync fails.
  }
}
