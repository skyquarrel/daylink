import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQUmasnEv3NQUe2shD7NihUN3gzERL2_A",
  authDomain: "daylink-28f8d.firebaseapp.com",
  projectId: "daylink-28f8d",
  storageBucket: "daylink-28f8d.firebasestorage.app",
  messagingSenderId: "489750535360",
  appId: "1:489750535360:web:9baba1b6056f42625fa125",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);