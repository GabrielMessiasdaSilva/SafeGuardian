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
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Formulario from '../../components/Profiles/FormularioContato';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../Services/FirebaseConnection';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function Perfil() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [idUsuarioLongPress, setIdUsuarioLongPress] = useState(null);

  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  const verificarCadastroExistente = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        setUsuario(JSON.parse(userData));
        setMostrarFormulario(false);
      } else {
        setMostrarFormulario(true);
      }
    } catch (error) {
      console.error('Erro ao verificar cadastro existente:', error);
    }
  };

  useEffect(() => {
    verificarCadastroExistente();
  }, []);

  const salvarCadastroNoFirestore = async (userData) => {
    try {
      const docRef = await addDoc(collection(db, 'usuarios'), userData);
      console.log('Documento escrito com ID: ', docRef.id);
  
      // Armazenando o ID do usuário junto com os dados do usuário
      userData.id = docRef.id;
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setUsuario(userData);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Erro ao salvar dados no Firestore: ', error);
    }
  };
  const editarPerfil = async (userId, userData) => {
    try {
      // Referência ao documento do Firestore
      const userRef = doc(db, 'usuarios', userId);
  
      // Atualiza os dados do usuário no Firestore
      await updateDoc(userRef, userData);
      console.log('Dados atualizados com sucesso no Firestore');
  
      // Atualizando os dados localmente
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        ...userData,
      }));
    } catch (error) {
      console.error('Erro ao atualizar dados no Firestore:', error);
    }
  };
  
  

  const excluirPerfil = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
      setUsuario(null);
      setMostrarFormulario(true);
      console.log('Cadastro excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir cadastro:', error);
    }
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {mostrarFormulario || !usuario ? (
            <Formulario
              adicionarPerfil={salvarCadastroNoFirestore}
              atualizarPerfil={editarPerfil} // Passe a função de edição para o componente
              perfilSelecionado={usuario}
              setMostrarFormulario={setMostrarFormulario}
            />
          ) : (
            <TouchableWithoutFeedback>
              <View style={styles.card}>
                <Text style={styles.label}>
                  Nome: <Text style={styles.nome}>{usuario?.nome}</Text>
                </Text>
                <Text style={styles.label}>
                  Telefone: <Text style={styles.nome}>{usuario?.telefone}</Text>
                </Text>
                <Text style={styles.label}>
                  Endereço: <Text style={styles.nome}>{usuario?.endereco}</Text>
                </Text>
                <Text style={styles.label}>
                  Idade: <Text style={styles.nome}>{usuario?.idade}</Text>
                </Text>
                <Text style={styles.label}>
                  Responsável: <Text style={styles.nome}>{usuario?.responsavel}</Text>
                </Text>
                <View style={styles.botoesContainer}>
                  <TouchableOpacity style={styles.buttonEdit} onPress={() => setMostrarFormulario(true)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonDelete} onPress={excluirPerfil}>
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
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
    color: '#fff',
    shadowColor: '#000',
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
    color: '#fff',
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
    shadowColor: '#000',
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
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 20,
  },
  buttonEdit: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
    elevation: 3,
  },
  buttonDelete: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
    elevation: 3,
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
  botoesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
});
