import { initializeApp } from "firebase/app";
<<<<<<< HEAD
import { getStorage } from "firebase/storage";
=======
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
>>>>>>> e21e889a364af2b57d90422cb8eeacde0e123907
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-vsms.firebaseapp.com",
  projectId: "mern-vsms",
  storageBucket: "mern-vsms.appspot.com",
  messagingSenderId: "401623379414",
  appId: "1:401623379414:web:058845ed18af5da6678877"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { app ,storage};