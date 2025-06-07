// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZcxX4F8tjW-wCHmJ3rlb6tYXWrJyzxY4",
  authDomain: "visvec-store.firebaseapp.com",
  projectId: "visvec-store",
  storageBucket: "visvec-store.firebasestorage.app",
  messagingSenderId: "189015916790",
  appId: "1:189015916790:web:9015629bb8cb1d16c9ecd7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
