
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB8t7z4PqtYkN6pBRHKb1lXN14r8EPKFd4",
  authDomain: "safeguardian-49e3d.firebaseapp.com",
  projectId: "safeguardian-49e3d",
  storageBucket: "safeguardian-49e3d.appspot.com",
  messagingSenderId: "956173226076",
  appId: "1:956173226076:web:849756586537b222bd9699"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
