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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Formulario from '../../components/Profiles/FormularioContato';
import { db } from '../../Services/FirebaseConnection';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useFonts } from 'expo-font';

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
    if (!fontsLoaded) {
      return;
    }

    const colecaoPerfis = collection(db, 'Perfil');

    // Carregar perfis armazenados no AsyncStorage ao iniciar
    const carregarPerfis = async () => {
      try {
        const perfisArmazenados = await AsyncStorage.getItem('perfis');
        if (perfisArmazenados !== null) {
          setPerfis(JSON.parse(perfisArmazenados));
        } else {
          // Se não houver perfis armazenados, escutar mudanças no Firebase
          const unsubscribe = onSnapshot(colecaoPerfis, (snapshot) => {
            const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPerfis(lista);

            // Atualizar o AsyncStorage com os novos perfis
            AsyncStorage.setItem('perfis', JSON.stringify(lista));
          });

          return () => unsubscribe(); // Limpar o listener ao desmontar o componente
        }
      } catch (error) {
        console.log("Erro ao carregar perfis do AsyncStorage:", error);
      }
    };

    carregarPerfis(); // Carregar perfis ao iniciar o componente
  }, [fontsLoaded]);

  const adicionarPerfil = async (novoPerfil) => {
    try {
      const colecaoPerfis = collection(db, 'Perfil');
      await addDoc(colecaoPerfis, novoPerfil);
      setMostrarFormulario(false);
      
      // Atualizar perfis no AsyncStorage após adicionar
      const perfisAtualizados = [...perfis, novoPerfil]; // Adiciona o novo perfil à lista
      await AsyncStorage.setItem('perfis', JSON.stringify(perfisAtualizados));
      setPerfis(perfisAtualizados);
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
      
      // Atualizar perfis no AsyncStorage após atualizar
      const novosPerfis = perfis.map(perfil => perfil.id === id ? { ...perfil, ...novosDados } : perfil);
      await AsyncStorage.setItem('perfis', JSON.stringify(novosPerfis));
      setPerfis(novosPerfis);
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
    }
  };

  const removerPerfil = async (id) => {
    try {
      const referencia = doc(db, 'Perfil', id);
      await deleteDoc(referencia);

      // Atualizar perfis no AsyncStorage após remover
      const novosPerfis = perfis.filter(perfil => perfil.id !== id);
      await AsyncStorage.setItem('perfis', JSON.stringify(novosPerfis));
      setPerfis(novosPerfis);

      // Mostrar o formulário se não houver mais perfis
      if (novosPerfis.length === 0) {
        setMostrarFormulario(true);
      }
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
                  <Text style={styles.nomeLabel}>Nome: <Text style={styles.nomeValue}>{perfil.nome}</Text> </Text>
                  <Text style={styles.nomeLabel}>Telefone: <Text style={styles.nomeValue}>{perfil.telefone}</Text> </Text>
                  <Text style={styles.nomeLabel}>Endereço: <Text style={styles.nomeValue}>{perfil.endereco}</Text> </Text>
                  <Text style={styles.nomeLabel}>Idade: <Text style={styles.nomeValue}>{perfil.idade}</Text></Text>
                  <Text style={styles.nomeLabel}>Responsável: <Text style={styles.nomeValue}>{perfil.responsavel}</Text></Text>
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
    top: height * 0.27,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    padding: 10,
  },
  cardContent: {
    padding: 10,
  },
  nomeLabel: {
    fontSize: 18,
    color: '#000',
  },
  nomeValue: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  buttonEdit: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
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
});
