// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmAsCxLYkZwBsn7Q69e3pyP7vbK25PXMA",
  authDomain: "myappauth12345.firebaseapp.com",
  projectId: "myappauth12345",
  storageBucket: "myappauth12345.firebasestorage.app",
  messagingSenderId: "239421868374",
  appId: "1:239421868374:web:101564165b17448714aef7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
