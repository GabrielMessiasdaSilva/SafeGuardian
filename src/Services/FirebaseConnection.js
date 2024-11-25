// FirebaseConnection.jsx
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';


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


const perfisCollection = collection(db, 'perfis');

// Função para adicionar um perfil ao Firestore
export const salvarPerfilFirestore = async (perfil) => {
  try {
    await addDoc(perfisCollection, perfil);
    console.log("Perfil adicionado com sucesso");
  } catch (e) {
    console.error("Erro ao adicionar perfil: ", e);
  }
};

// Função para atualizar um perfil no Firestore
export const atualizarPerfilFirestore = async (id, novosDados) => {
  const perfilRef = doc(db, 'perfis', id);
  try {
    await updateDoc(perfilRef, novosDados);
    console.log("Perfil atualizado com sucesso");
  } catch (e) {
    console.error("Erro ao atualizar perfil: ", e);
  }
};

// Função para deletar um perfil do Firestore
export const deletarPerfilFirestore = async (id) => {
  const perfilRef = doc(db, 'perfis', id);
  try {
    await deleteDoc(perfilRef);
    console.log("Perfil deletado com sucesso");
  } catch (e) {
    console.error("Erro ao deletar perfil: ", e);
  }
};

// Função para carregar perfis do Firestore
export const carregarPerfisFirestore = async () => {
  const querySnapshot = await getDocs(perfisCollection);
  const perfis = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return perfis;
};

export const realTimeDb = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);

