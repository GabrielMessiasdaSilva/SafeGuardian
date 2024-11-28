import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import Formulario from '../../components/Profiles/FormularioContato';
import { useFonts } from 'expo-font';
import { db } from '../../Services/FirebaseConnection'; // Importando o Firebase Firestore
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, runTransaction, setDoc, increment } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function Perfil() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [usuarios, setUsuarios] = useState([]); // Alterado para 'usuarios'
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); // Alterado para 'usuario'
  const [idUsuarioLongPress, setIdUsuarioLongPress] = useState(null);
  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  // Função para carregar usuários do Firestore
  const carregarUsuarios = async () => {
    try {
      const usuariosRef = collection(db, "usuarios"); // Alterado para 'usuarios'
      const querySnapshot = await getDocs(usuariosRef);
      const usuariosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(usuariosList);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  // Checar se já existe um cadastro no dispositivo
  const verificarCadastroExistente = async () => {
    try {
      const userExists = await AsyncStorage.getItem('user_data');
      return userExists !== null;
    } catch (error) {
      console.error('Erro ao verificar cadastro existente:', error);
      return false;
    }
  };

  useEffect(() => {
    verificarCadastroExistente();
  }, []);

  // Salvar dados do usuário no dispositivo
  const salvarCadastroLocal = async (userData) => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Erro ao salvar cadastro local:', error);
    }
  };

  useEffect(() => {
    verificarCadastroExistente();
  }, []);

  useEffect(() => {
    carregarUsuarios(); // Alterado para 'carregarUsuarios'
  }, []);

  const adicionarUsuario = async (novoUsuario) => {
    try {
      const docRef = doc(collection(db, "usuarios")); // Cria uma referência de documento com ID gerado automaticamente
      await setDoc(docRef, novoUsuario);
      console.log('Usuário adicionado com ID:', docRef.id);
  
      setUsuarios([...usuarios, { ...novoUsuario, id: docRef.id }]);
      setMostrarFormulario(false);
    } catch (e) {
      console.error('Erro ao adicionar usuário:', e);
    }
  };
  
  // Função para atualizar um usuário no Firestore
  const atualizarUsuario = async (id, novosDados) => { // Alterado para 'usuario'
    try {
      const usuarioRef = doc(db, "usuarios", id); // Alterado para 'usuarios'
      await updateDoc(usuarioRef, novosDados);
      setUsuarios(usuarios.map(usuario => usuario.id === id ? { ...usuario, ...novosDados } : usuario));
      setMostrarFormulario(false);
    } catch (e) {
      console.error("Erro ao atualizar usuário: ", e);
    }
  };

  const removerUsuario = (id) => { // Alterado para 'usuario'
    Alert.alert('Excluir', 'Deseja apagar permanentemente seus dados?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const usuarioRef = doc(db, "usuarios", id); // Alterado para 'usuarios'
            await deleteDoc(usuarioRef);

            // Atualizar a lista de usuários após exclusão
            setUsuarios(usuarios.filter(usuario => usuario.id !== id));

            // Resetar estados relacionados ao formulário
            setUsuarioSelecionado(null);
            setMostrarFormulario(true);

            console.log("Usuário deletado com sucesso");
          } catch (e) {
            console.error("Erro ao deletar usuário: ", e);
          }
        },
      },
    ]);
  };

  const handleLongPress = (usuario) => { // Alterado para 'usuario'
    setIdUsuarioLongPress(usuario.id);
  };

  const handleEdit = (usuario) => { // Alterado para 'usuario'
    setUsuarioSelecionado(usuario);
    setMostrarFormulario(true);
    setIdUsuarioLongPress(null);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../Img/fundo_Teste.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <StatusBar barStyle="light-content" />

        <View style={styles.centralContainer}>
          <Image
            source={require('../../Img/logoemergenciais.png')}
            style={styles.imagemLogoTipo}
            resizeMode="contain"
          />
          <Text style={styles.titulo}>Informações</Text>
          <Text style={styles.subtitulo}>Pessoais</Text>
        </View>
      </ImageBackground>

      <View style={styles.formOverlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {mostrarFormulario ? (
            <Formulario
              adicionarPerfil={adicionarUsuario} // Alterado para 'adicionarUsuario'
              atualizarPerfil={atualizarUsuario} // Alterado para 'atualizarUsuario'
              perfilSelecionado={usuarioSelecionado} // Alterado para 'usuarioSelecionado'
              setMostrarFormulario={setMostrarFormulario}
            />
          ) : (
            usuarios.map((usuario, index) => ( // Alterado para 'usuarios'
              <View key={`${usuario.id}-${index}`} style={styles.card}>
                <TouchableOpacity onLongPress={() => handleLongPress(usuario)} style={styles.cardContent}>
                  <Text style={styles.label}>Nome: <Text style={styles.nome}>{usuario.nome}</Text></Text>
                  <Text style={styles.label}>Telefone: <Text style={styles.nome}>{usuario.telefone}</Text></Text>
                  <Text style={styles.label}>Endereço: <Text style={styles.nome}>{usuario.endereco}</Text></Text>
                  <Text style={styles.label}>Idade: <Text style={styles.nome}>{usuario.idade}</Text></Text>
                  <Text style={styles.label}>Responsável: <Text style={styles.nome}>{usuario.responsavel}</Text></Text>
                </TouchableOpacity>

                {idUsuarioLongPress === usuario.id && ( // Alterado para 'usuario'
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleEdit(usuario)} style={styles.buttonEdit}>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removerUsuario(usuario.id)} style={styles.buttonDelete}>
                      <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    imagemLogoTipo: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      bottom: height * 0.01,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    titulo: {
      fontFamily: 'Gagalin-Regular',
      fontSize: 36,
      color: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 5,
      textAlign: 'center',
      bottom: height * 0.20,
      margin: 0,
      padding: 0,
    },
    subtitulo: {
      fontFamily: 'Gagalin-Regular',
      fontSize: 30,
      color: "#fff",
      marginTop: 5,
      bottom: height * 0.21,
      textAlign: 'center',
    },
    formOverlay: {
      position: 'absolute',
      top: height * 0.3,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'flex-start',
    },
    card: {
      borderWidth: 1,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      margin: 10,
      padding: 15,
      borderColor: '#CCC',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    cardContent: {
      padding: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      position: 'absolute',
      top: 5,
      right: 5,
    },
    buttonEdit: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
    },
    buttonDelete: {
      backgroundColor: '#F44336',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    label: {
      fontSize: 16,
      color: '#000',
    },
    nome: {
      fontWeight: 'bold',
      color: '#333',
    },
  });