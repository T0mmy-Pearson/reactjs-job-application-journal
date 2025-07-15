// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1D1WvxT9Jc4bFBLU28I_F4s5M2nkWbjM",
  authDomain: "jobwebapp-6f83d.firebaseapp.com",
  projectId: "jobwebapp-6f83d",
  storageBucket: "jobwebapp-6f83d.firebasestorage.app",
  messagingSenderId: "984524534785",
  appId: "1:984524534785:web:103c61263284a540457c00",
  measurementId: "G-BX44ZT6JR9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);