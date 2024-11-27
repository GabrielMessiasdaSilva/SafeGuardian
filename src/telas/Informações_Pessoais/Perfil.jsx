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
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, runTransaction, setDocs,increment } from 'firebase/firestore';


const { width, height } = Dimensions.get('window');

export default function Perfil() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [perfis, setPerfis] = useState([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [idPerfilLongPress, setIdPerfilLongPress] = useState(null);
  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  // Função para carregar perfis do Firestore
  const carregarPerfis = async () => {
    try {
      const perfisRef = collection(db, "perfis");
      const querySnapshot = await getDocs(perfisRef);
      const perfisList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPerfis(perfisList);
    } catch (error) {
      console.error("Erro ao carregar perfis:", error);
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

  // Salvar dados do usuário no dispositivo
  const salvarCadastroLocal = async (userData) => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Erro ao salvar cadastro local:', error);
    }
  };

  useEffect(() => {
    carregarPerfis();
  }, []);

const adicionarPerfil = async (novoPerfil) => {
  try {
    const contadorRef = doc(db, 'sistema', 'contador');

    await runTransaction(db, async (transaction) => {
      const contadorDoc = await transaction.get(contadorRef);

      if (!contadorDoc.exists()) {
   
        transaction.set(contadorRef, { numero: 1 });
      } else {
        // Aumente o contador em 1
        transaction.update(contadorRef, { numero: increment(1) });
      }

      // Obtenha o próximo número para gerar o ID do documento
      const novoNumero = (contadorDoc.exists() ? contadorDoc.data().numero : 0) + 1;
      const idDocumento = `idoso${novoNumero}`;

      // Adicione o novo perfil com o ID gerado
      const docRef = doc(db, 'perfis', idDocumento);
      transaction.set(docRef, novoPerfil);
      console.log('Perfil adicionado com ID:', idDocumento);

      setPerfis([...perfis, { ...novoPerfil, id: idDocumento }]);
      setMostrarFormulario(false);
    });
  } catch (e) {
    console.error('Erro ao adicionar perfil:', e);
  }
};

  // Função para atualizar um perfil no Firestore
  const atualizarPerfil = async (id, novosDados) => {
    try {
      const perfilRef = doc(db, "perfis", id);
      await updateDoc(perfilRef, novosDados);
      setPerfis(perfis.map(perfil => perfil.id === id ? { ...perfil, ...novosDados } : perfil));
      setMostrarFormulario(false);
    } catch (e) {
      console.error("Erro ao atualizar perfil: ", e);
    }
  };

  const removerPerfil = (id) => {
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
            const perfilRef = doc(db, "perfis", id);
            await deleteDoc(perfilRef);

            // Atualizar a lista de perfis após exclusão
            setPerfis(perfis.filter(perfil => perfil.id !== id));

            // Reexibir o formulário após a exclusão
            setMostrarFormulario(true);

            console.log("Perfil deletado com sucesso");
          } catch (e) {
            console.error("Erro ao deletar perfil: ", e);
          }
        },
      },
    ]);
  };

  const handleLongPress = (perfil) => {
    setIdPerfilLongPress(perfil.id);
  };

  const handleEdit = (perfil) => {
    setPerfilSelecionado(perfil);
    setMostrarFormulario(true);
    setIdPerfilLongPress(null);
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
                      <TouchableOpacity onPress={() => removerPerfil(perfil.id)} style={styles.buttonDelete}>
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