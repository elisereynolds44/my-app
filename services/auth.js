import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../lib/firebase";

const auth = app ? getAuth(app) : null;

// SIGN UP
export const signUp = async (email, password) => {
  if (!auth) {
    throw new Error("Firebase is not configured yet. Add your Expo public Firebase environment variables first.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

// LOGIN
export const login = async (email, password) => {
  if (!auth) {
    throw new Error("Firebase is not configured yet. Add your Expo public Firebase environment variables first.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
