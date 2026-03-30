import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "YOUR_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "invest-ish.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "invest-ish",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "invest-ish.firebasestorage.app",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "842501804248",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "YOUR_APP_ID",
};

const hasUsableFirebaseConfig =
  firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.appId !== "YOUR_APP_ID";

const app = hasUsableFirebaseConfig ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export function getFirebaseFirestore() {
  return db;
}

export default app;
