import { initializeApp } from "firebase/app";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import {createUserwithEmailandPassword, signInwithEmailandPassword} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {getAuth} from "firebase/auth";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyBCGzpGOs09eelzku7saVWASTW_dl11gYQ",
  authDomain: "smart-quizzer-46bd7.firebaseapp.com",
  projectId: "smart-quizzer-46bd7",
  storageBucket: "smart-quizzer-46bd7.firebasestorage.app",
  messagingSenderId: "483333387526",
  appId: "1:483333387526:web:af5aab9305a69c0795da87",
  measurementId: "G-3KG6K2DWCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // Firebase Storage initialization

export { Auth, db, storage };