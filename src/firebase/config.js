import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAi_sWRPJumPrrlKlmOYiJjjxfc1WJlHBg",
  authDomain: "react-auth-project-8f346.firebaseapp.com",
  projectId: "react-auth-project-8f346",
  storageBucket: "react-auth-project-8f346.firebasestorage.app",
  messagingSenderId: "859313295963",
  appId: "1:859313295963:web:dd2260186cf1a716c9657e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
