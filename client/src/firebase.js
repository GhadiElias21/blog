// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bloggy-f663e.firebaseapp.com",
  projectId: "bloggy-f663e",
  storageBucket: "bloggy-f663e.appspot.com",
  messagingSenderId: "827294310570",
  appId: "1:827294310570:web:0284b2e3ebbd96610b70d3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);