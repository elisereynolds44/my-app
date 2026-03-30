import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { getFirebaseFirestore } from "@/lib/firebase";
import { getStoredProfileOwnerKey } from "@/lib/profile-storage";

export type ProgressSnapshot = Record<string, string>;

async function loadRemoteProgress() {
  const database = getFirebaseFirestore();
  const ownerKey = await getStoredProfileOwnerKey();

  if (!database || !ownerKey) {
    return {};
  }

  try {
    const snapshot = await getDoc(doc(database, "progress", ownerKey));
    if (!snapshot.exists()) {
      return {};
    }

    return (snapshot.data() as ProgressSnapshot | undefined) ?? {};
  } catch {
    return {};
  }
}

async function saveRemoteProgress(values: ProgressSnapshot) {
  const database = getFirebaseFirestore();
  const ownerKey = await getStoredProfileOwnerKey();

  if (!database || !ownerKey) {
    return;
  }

  try {
    await setDoc(doc(database, "progress", ownerKey), values, { merge: true });
  } catch {
    // Keep local progress working even if remote sync fails.
  }
}

export async function getProgressValue(key: string) {
  const localValue = await AsyncStorage.getItem(key);
  if (localValue !== null) {
    return localValue;
  }

  const remote = await loadRemoteProgress();
  return remote[key] ?? null;
}

export async function setProgressValue(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
  await saveRemoteProgress({ [key]: value });
}

export async function removeProgressValue(key: string) {
  await AsyncStorage.removeItem(key);
  await saveRemoteProgress({ [key]: "" });
}

export async function getProgressValues(keys: string[]) {
  const localEntries = await Promise.all(keys.map(async (key) => [key, await AsyncStorage.getItem(key)] as const));
  const missingKeys = localEntries.filter(([, value]) => value === null).map(([key]) => key);

  if (missingKeys.length === 0) {
    return Object.fromEntries(localEntries) as Record<string, string | null>;
  }

  const remote = await loadRemoteProgress();
  return Object.fromEntries(
    localEntries.map(([key, value]) => [key, value ?? remote[key] ?? null])
  ) as Record<string, string | null>;
}
