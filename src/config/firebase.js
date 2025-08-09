/* src/config/firebase.js */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const useFirebase = 
  import.meta.env.VITE_USE_FIREBASE === 'true' &&
  firebaseConfig.apiKey &&
  firebaseConfig.projectId;

const app = useFirebase ? initializeApp(firebaseConfig) : null;
export const auth = useFirebase ? getAuth(app) : null;
export const db = useFirebase ? getFirestore(app) : null;

export { useFirebase };