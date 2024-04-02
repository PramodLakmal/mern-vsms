// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-vsms.firebaseapp.com",
  projectId: "mern-vsms",
  storageBucket: "mern-vsms.appspot.com",
  messagingSenderId: "401623379414",
  appId: "1:401623379414:web:058845ed18af5da6678877"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);