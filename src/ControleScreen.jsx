import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../Services/FirebaseConnection';
import { doc, deleteDoc } from 'firebase/firestore';

// Verifica se o usuário já está registrado
export const verificarCadastroExistente = async () => {
  try {
    const userExists = await AsyncStorage.getItem('user_data');
    return userExists !== null;
  } catch (error) {
    console.error('Erro ao verificar cadastro existente:', error);
    return false;
  }
};

// Salva os dados do usuário no AsyncStorage
export const salvarCadastroLocal = async (userData) => {
  try {
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
  } catch (error) {
    console.error('Erro ao salvar cadastro local:', error);
  }
};

// Limpa os dados do usuário do AsyncStorage
export const limparCadastroLocal = async () => {
  try {
    await AsyncStorage.removeItem('user_data');
  } catch (error) {
    console.error('Erro ao limpar cadastro local:', error);
  }
};

// Função para excluir um usuário do Firestore e do AsyncStorage
export const removerUsuario = async (id) => {
  try {
    const usuarioRef = doc(db, "usuarios", id);
    await deleteDoc(usuarioRef);

    // Limpa os dados do usuário do AsyncStorage após a exclusão
    await limparCadastroLocal();

    console.log("Usuário deletado com sucesso");
  } catch (e) {
    console.error("Erro ao deletar usuário: ", e);
  }
};
