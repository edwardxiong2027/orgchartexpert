import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXKiyVV189xX8lzV5FezMmRaFTqjxv-wE",
  authDomain: "orgchartexpert.firebaseapp.com",
  projectId: "orgchartexpert",
  storageBucket: "orgchartexpert.firebasestorage.app",
  messagingSenderId: "681100660850",
  appId: "1:681100660850:web:22a20f8f4c4b3fc82f32eb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
