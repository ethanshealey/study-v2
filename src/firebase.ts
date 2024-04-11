import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, browserLocalPersistence } from "firebase/auth";
import { getFirestore, addDoc, setDoc, getDocs, collection, query, where, doc, updateDoc, arrayRemove, arrayUnion, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, setPersistence, signInWithEmailAndPassword, browserLocalPersistence, createUserWithEmailAndPassword, onAuthStateChanged, signOut, db, addDoc, setDoc, getDocs, collection, query, where, doc, updateDoc, arrayRemove, arrayUnion, deleteDoc }