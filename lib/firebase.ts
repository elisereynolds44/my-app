import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";

type FirebaseConfig = {
  apiKey: string;
  appId: string;
  authDomain?: string;
  databaseURL: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket?: string;
};

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

const firebaseConfig: FirebaseConfig = {
  apiKey: readEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  appId: readEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
  authDomain: readEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN") || undefined,
  databaseURL: readEnv("EXPO_PUBLIC_FIREBASE_DATABASE_URL"),
  messagingSenderId: readEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  projectId: readEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET") || undefined,
};

const requiredConfigKeys: Array<keyof FirebaseConfig> = [
  "apiKey",
  "appId",
  "databaseURL",
  "messagingSenderId",
  "projectId",
];

export function isFirebaseConfigured() {
  return requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]));
}

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
}

export function getFirebaseDatabase(): Database | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  return getDatabase(app);
}
