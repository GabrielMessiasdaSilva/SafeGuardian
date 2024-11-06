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
import Formulario from '../../components/Profiles/FormularioContato';
import { db } from '../../Services/FirebaseConnection';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Perfil() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [perfis, setPerfis] = useState([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [idPerfilLongPress, setIdPerfilLongPress] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  useEffect(() => {
    const verificarCadastro = async () => {
      if (!fontsLoaded) return;

      try {
        const storedUserId = await AsyncStorage.getItem('idosoId');
        console.log('ID de usuário armazenado:', storedUserId); // Log para verificar o ID armazenado
        setUserId(storedUserId);

        const colecaoPerfis = collection(db, 'Perfil');
        const unsubscribe = onSnapshot(colecaoPerfis, (snapshot) => {
          const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log('Perfis recebidos do Firestore:', lista); // Log para verificar perfis recebidos

          const perfisFiltrados = lista.filter((perfil) => perfil.id === storedUserId);
          console.log('Perfis filtrados:', perfisFiltrados); // Log para verificar a filtragem
          setPerfis(perfisFiltrados);
        }, (error) => {
          console.log('Erro ao buscar perfis:', error);
        });

        return () => unsubscribe();
      } catch (error) {
        console.log('Erro ao verificar cadastro:', error);
      }
    };

    verificarCadastro();
  }, [fontsLoaded]);

  const adicionarPerfil = async (novoPerfil) => {
    try {
      // Recupera o último ID armazenado ou começa do 1 se não houver nenhum
      let ultimoId = await AsyncStorage.getItem('ultimoId');
      if (!ultimoId) {
        ultimoId = '1'; // Inicia com 1 se não houver ID registrado
      } else {
        ultimoId = (parseInt(ultimoId) + 1).toString(); // Incrementa o ID
      }
  
      // Atualiza o ID no perfil
      novoPerfil.id = `Idoso${ultimoId}`;
  
      // Atualiza o último ID no AsyncStorage
      await AsyncStorage.setItem('ultimoId', ultimoId);
  
      // Adiciona o perfil ao Firestore
      const colecaoPerfis = collection(db, 'Perfil');
      await addDoc(colecaoPerfis, novoPerfil);
      console.log('Perfil adicionado com sucesso ao Firestore');
  
      // Atualiza o AsyncStorage com a informação de que o perfil foi cadastrado
      await AsyncStorage.setItem('perfilCadastrado', 'true');
      setMostrarFormulario(false);
    } catch (error) {
      console.log('Erro ao adicionar perfil:', error);
    }
  };
  
  const atualizarPerfil = async (id, novosDados) => {
    console.log('Atualizando perfil com ID:', id, 'Novos dados:', novosDados); // Log para verificar os dados de atualização

    try {
      const referencia = doc(db, 'Perfil', id);
      const docSnap = await getDoc(referencia);
  
      if (docSnap.exists()) {
        console.log('Documento encontrado, atualizando...'); // Log para verificar se o documento foi encontrado
        await updateDoc(referencia, novosDados);
        console.log('Perfil atualizado com sucesso:', id); // Log após a atualização do perfil
      } else {
        console.log('Documento não encontrado no Firestore:', id); // Log caso o documento não exista
      }
    } catch (error) {
      console.log('Erro ao atualizar perfil:', error);
    }
  };
  

  const removerPerfil = async (id) => {
    console.log('Tentando remover perfil com ID:', id); // Log antes de remover o perfil

    try {
      const referencia = doc(db, 'Perfil', id);
      await deleteDoc(referencia);
      console.log('Documento deletado no Firestore:', id); // Log após deletar o perfil
  
      // Remover dados do AsyncStorage
      await AsyncStorage.removeItem('perfilCadastrado');
      await AsyncStorage.removeItem('idosoId');  
      console.log('idosoId removido:', await AsyncStorage.getItem('idosoId'));  // Log para verificar se o id foi removido
  
      console.log('Dados removidos do AsyncStorage');
  
      setPerfis(perfis.filter((perfil) => perfil.id !== id));
      setMostrarFormulario(true);
    } catch (error) {
      console.log('Erro ao remover perfil:', error);
    }
  };


  const handleLongPress = (perfil) => {
    console.log('Long press no perfil:', perfil); // Log para verificar o perfil ao pressionar longamente
    setIdPerfilLongPress(perfil.id);
  };

  const handleEdit = (perfil) => {
    console.log('Editando perfil:', perfil); // Log para verificar o perfil que está sendo editado
    setPerfilSelecionado(perfil);
    setMostrarFormulario(true);
    setIdPerfilLongPress(null);
  };

  const handleDelete = (id) => {
    console.log('Tentando excluir perfil com ID:', id); // Log para verificar a ID antes de excluir
    Alert.alert('Excluir', 'Deseja apagar permanentemente seus dados?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          console.log('Tentando deletar ID:', id); // Log para tentar deletar
          removerPerfil(id);
        },
      },
    ]);
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

      <KeyboardAvoidingView
        style={styles.formOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {mostrarFormulario ? (
            <Formulario
              adicionarPerfil={adicionarPerfil}
              atualizarPerfil={atualizarPerfil}
              perfilSelecionado={perfilSelecionado}
              setMostrarFormulario={setMostrarFormulario}
            />
          ) : (
            perfis.map((perfil, index) => (
              <View key={`${perfil.id}-${index}`} style={styles.card}>
                <TouchableOpacity onLongPress={() => handleLongPress(perfil)} style={styles.cardContent}>
                  <Text style={styles.label}>Nome: <Text style={styles.nome}>{perfil.nome}</Text></Text>
                  <Text style={styles.label}>Telefone: <Text style={styles.nome}>{perfil.telefone}</Text></Text>
                  <Text style={styles.label}>Endereço: <Text style={styles.nome}>{perfil.endereco}</Text></Text>
                  <Text style={styles.label}>Idade: <Text style={styles.nome}>{perfil.idade}</Text></Text>
                  <Text style={styles.label}>Responsável: <Text style={styles.nome}>{perfil.responsavel}</Text></Text>
                </TouchableOpacity>

                {idPerfilLongPress === perfil.id && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleEdit(perfil)} style={styles.buttonEdit}>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(perfil.id)} style={styles.buttonDelete}>
                      <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    right: 10,
    top: 10,
  },
  buttonEdit: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonDelete: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nome: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E2F6C',
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

