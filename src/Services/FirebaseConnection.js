// FirebaseConnection.jsx
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB8t7z4PqtYkN6pBRHKb1lXN14r8EPKFd4",
  authDomain: "safeguardian-49e3d.firebaseapp.com",
  projectId: "safeguardian-49e3d",
  storageBucket: "safeguardian-49e3d.appspot.com",
  messagingSenderId: "956173226076",
  appId: "1:956173226076:web:849756586537b222bd9699"
};


const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


export const db = getFirestore(firebaseApp);
export const realTimeDb = getDatabase(firebaseApp);

