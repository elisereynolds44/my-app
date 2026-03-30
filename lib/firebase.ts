import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAIBAn-...",
  authDomain: "invest-ish.firebaseapp.com",
  projectId: "invest-ish",
  storageBucket: "invest-ish.firebasestorage.app",
  messagingSenderId: "842501804248",
  appId: "1:842501804248:web:..."
};

const app = initializeApp(firebaseConfig);

export default app;