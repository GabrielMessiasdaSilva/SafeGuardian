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
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Formulario from '../../components/Profiles/FormularioContato';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Services/FirebaseConnection';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function Perfil() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [mostrarAcoes, setMostrarAcoes] = useState(false);
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

      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setUsuario(userData);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Erro ao salvar dados no Firestore: ', error);
    }
  };

  const atualizarUsuario = async (id, novosDados) => {
    try {
      const usuarioRef = doc(db, 'usuarios', id);
      await updateDoc(usuarioRef, novosDados);
      setUsuario({ ...usuario, ...novosDados }); // Atualizando o estado local
      setMostrarFormulario(false);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar usuário: ', error);
    }
  };

  const removerUsuario = (id) => {
    Alert.alert('Excluir', 'Deseja apagar permanentemente seus dados?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const usuarioRef = doc(db, 'usuarios', id);
            await deleteDoc(usuarioRef);

            await AsyncStorage.removeItem('user_data');
            setUsuario(null);
            setMostrarFormulario(true);

            console.log('Usuário deletado com sucesso');
            Alert.alert('Sucesso', 'Dados apagados com sucesso!');
          } catch (error) {
            console.error('Erro ao deletar usuário: ', error);
          }
        },
      },
    ]);
  };

  const limparDadosLocalmente = async () => {
    await AsyncStorage.removeItem('user_data');
    setUsuario(null);
    setMostrarFormulario(true);
  };

  const limparDadosNoFirestore = async () => {
    if (usuario) {
      try {
        const usuarioRef = doc(db, 'usuarios', usuario.id);
        await deleteDoc(usuarioRef);
        console.log('Dados do Firestore apagados com sucesso');
      } catch (error) {
        console.error('Erro ao apagar dados do Firestore:', error);
      }
    }
  };

  const limparTudo = async () => {
    await limparDadosLocalmente();
    await limparDadosNoFirestore();
    Alert.alert('Sucesso', 'Dados apagados de forma completa!');
  };

  const handleLongPress = () => {
    setMostrarAcoes(true);
    setIdUsuarioLongPress(usuario.id);
  };

  const handleEdit = (usuario) => {
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {mostrarFormulario || !usuario ? (
            <Formulario
              adicionarPerfil={salvarCadastroNoFirestore}
              atualizarPerfil={atualizarUsuario}
              perfilSelecionado={usuarioSelecionado}
              setMostrarFormulario={setMostrarFormulario}
            />
          ) : (
            <TouchableWithoutFeedback onLongPress={handleLongPress}>
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

                {mostrarAcoes && (
                  <View style={styles.botoesContainer}>
                    <TouchableOpacity onPress={() => handleEdit(usuario)} style={styles.buttonEdit}>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removerUsuario(usuario.id)} style={styles.buttonDelete}>
                      <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={limparTudo} style={styles.buttonDelete}>
                      <Text style={styles.buttonText}>Limpar Tudo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );L
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
