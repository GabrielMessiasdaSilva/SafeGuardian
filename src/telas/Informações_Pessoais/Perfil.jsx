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
  getDocs,
} from 'firebase/firestore';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Perfil() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [perfis, setPerfis] = useState([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [idPerfilLongPress, setIdPerfilLongPress] = useState(null);

  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  useEffect(() => {
    const verificarCadastro = async () => {
      if (!fontsLoaded) {
        return;
      }

      try {
        const perfilCadastrado = await AsyncStorage.getItem('perfilCadastrado');
        if (perfilCadastrado === 'true') {
          setMostrarFormulario(false); // Se perfil já existe, não mostrar formulário
        } else {
          setMostrarFormulario(true); // Se não existe, mostrar formulário
        }

        const colecaoPerfis = collection(db, 'Perfil');
        const unsubscribe = onSnapshot(colecaoPerfis, (snapshot) => {
          const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPerfis(lista.filter(perfil => perfil.nome && perfil.nome.trim()));
        }, (error) => {
          console.log("Erro ao buscar perfis:", error);
        });

        return () => unsubscribe();
      } catch (error) {
        console.log("Erro ao verificar cadastro:", error);
      }
    };

    verificarCadastro();
  }, [fontsLoaded]);

  const adicionarPerfil = async (novoPerfil) => {
    try {
      const colecaoPerfis = collection(db, 'Perfil');

      // Obtém todos os perfis da coleção
      const snapshot = await getDocs(colecaoPerfis);
      const quantidadePerfis = snapshot.size; // Contagem dos perfis existentes

      // Gera um novo ID
      const novoId = `Idoso${quantidadePerfis + 1}`;

      // Adiciona o novo perfil com o ID gerado
      await addDoc(colecaoPerfis, { ...novoPerfil, id: novoId });

      // Armazenar estado de perfil cadastrado no AsyncStorage
      await AsyncStorage.setItem('perfilCadastrado', 'true');
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao adicionar perfil:", error);
    }
  };

  const atualizarPerfil = async (id, novosDados) => {
    try {
      const referencia = doc(db, 'Perfil', id);
      await updateDoc(referencia, novosDados);
      setPerfilSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
    }
  };

  const removerPerfil = async (id) => {
    try {
      const referencia = doc(db, 'Perfil', id);
      await deleteDoc(referencia);

      // Remover o status de cadastro do AsyncStorage após exclusão do perfil
      await AsyncStorage.removeItem('perfilCadastrado');
      setMostrarFormulario(true);
    } catch (error) {
      console.log("Erro ao remover perfil:", error);
    }
  };

  const handleLongPress = (perfil) => {
    setIdPerfilLongPress(perfil.id);
  };

  const handleEdit = (perfil) => {
    setPerfilSelecionado(perfil);
    setMostrarFormulario(true);
    setIdPerfilLongPress(null);
  };

  const handleDelete = (id) => {
    Alert.alert('Excluir', 'Deseja apagar permanentemente seus dados?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          removerPerfil(id);
          if (perfis.length === 1) {
            setMostrarFormulario(true);
          }
          setIdPerfilLongPress(null);
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
            perfis.map((perfil) => (
              <View key={perfil.id} style={styles.card}>
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
    margin:10,
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
  telefone: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E2F6C',
  },
  endereco: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E2F6C',
  },
  idade: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E2F6C',
  },
  responsavel: {
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
