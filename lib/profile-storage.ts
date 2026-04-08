import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { ProfileData } from "@/components/profile-context";
import { getFirebaseFirestore } from "@/lib/firebase";

const STORAGE_KEY = "investish.profile";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getProfileKey(email: string) {
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

async function loadDeviceProfile() {
  const browserProfile = loadLocalProfile();
  if (browserProfile) {
    return browserProfile;
  }

  try {
    const nativeValue = await AsyncStorage.getItem(STORAGE_KEY);
    return parseProfile(nativeValue);
  } catch {
    return null;
  }
}

async function saveDeviceProfile(profile: ProfileData) {
  saveLocalProfile(profile);

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore native persistence failures and fall back to browser storage when available.
  }
}

export async function clearStoredProfile() {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore local persistence cleanup failures.
  }
}

export async function getStoredProfileOwnerKey() {
  const profile = await loadDeviceProfile();
  return profile?.email ? getProfileKey(profile.email) : null;
}

export async function loadStoredProfile() {
  const localProfile = await loadDeviceProfile();
  const database = getFirebaseFirestore();

  if (!localProfile || !database) {
    return localProfile;
  }

  try {
    const snapshot = await getDoc(doc(database, "profiles", getProfileKey(localProfile.email)));

    if (!snapshot.exists()) {
      return localProfile;
    }

    const remoteProfile = snapshot.data() as ProfileData | null;

    if (remoteProfile) {
      await saveDeviceProfile(remoteProfile);
    }

    return remoteProfile ?? localProfile;
  } catch (error) {
    console.warn("Could not load Firebase profile.", error);
    return localProfile;
  }
}

export async function saveStoredProfile(profile: ProfileData) {
  await saveDeviceProfile(profile);

  const database = getFirebaseFirestore();

  if (!database) {
    return;
  }

  try {
    await setDoc(doc(database, "profiles", getProfileKey(profile.email)), profile, { merge: true });
  } catch (error) {
    console.warn("Could not save Firebase profile.", error);
  }
}
