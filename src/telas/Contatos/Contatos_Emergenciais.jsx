import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import Formulario from '../../components/Contacts/Forms_Contacts';
import Lista from '../../components/Contacts/Lista_contact';
import { db } from '../../Services/FirebaseConnection';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [Telefones, setTelefones] = useState([]);
  const [TelefonesSelecionado, setTelefonesSelecionado] = useState(null);

  // Carregando fontes personalizadas
  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  useEffect(() => {
    const colecaoTelefones = collection(db, 'Telefones');
    const unsubscribe = onSnapshot(colecaoTelefones, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTelefones(lista);
    }, (error) => {
      console.log("Erro ao buscar Telefones:", error);
    });

    return () => unsubscribe();
  }, []);

  const adicionarTelefones = async (novoTelefone) => {
    try {
      const colecaoTelefones = collection(db, 'Telefones');
      await addDoc(colecaoTelefones, novoTelefone);
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao adicionar Telefone:", error);
    }
  };

  const atualizarTelefones = async (id, novosDados) => {
    try {
      const referencia = doc(db, 'Telefones', id);
      await updateDoc(referencia, novosDados);
      setTelefonesSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao atualizar Telefone:", error);
    }
  };

  const removerTelefones = async (id) => {
    try {
      const referencia = doc(db, 'Telefones', id);
      await deleteDoc(referencia);
    } catch (error) {
      console.log("Erro ao remover Telefone:", error);
    }
  };

  const handleLongPress = (telefone) => {
    Alert.alert(
      "Ação",
      "O que você deseja fazer?",
      [
        {
          text: "Editar",
          onPress: () => {
            setTelefonesSelecionado(telefone);
            setMostrarFormulario(true);
          }
        },
        {
          text: "Excluir",
          onPress: () => removerTelefones(telefone.id),
          style: "destructive"
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Seção Superior: Imagem de Fundo, Título, Subtítulo e Logo */}
      <ImageBackground
        source={require('../../Img/fundo_Teste.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.textContainer}>
          <Text style={styles.titulo}>Contatos</Text>
          <Text style={styles.subtitulo}>Emergenciais</Text>
          <Image source={require('../../Img/icons-contatos.png')} style={styles.ImagemLogo} />
        </View>
      </ImageBackground>

      {/* Seção Inferior: Formulário */}
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {mostrarFormulario ? (
            <Formulario
              adicionarTelefones={adicionarTelefones}
              atualizarTelefones={atualizarTelefones}
              TelefonesSelecionado={TelefonesSelecionado}
              setMostrarFormulario={setMostrarFormulario}
            />
          ) : (
            <Lista Telefones={Telefones} onLongPress={handleLongPress} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.35 < 250 ? 250 : height * 0.35, // Garante altura mínima de 250
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:70,
  },
  titulo: {
    fontFamily: 'Gagalin-Regular',
    fontSize: width * 0.10, 
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  subtitulo: {
    fontFamily: 'Gagalin-Regular',
    fontSize: width * 0.05,
    color: "#fff",
    marginTop: height * 0.01, 
    textAlign: 'center',
  },
  ImagemLogo: {
    width: width * 0.5 < 250 ? 250 : width * 0.5,
    height: height * 0.15 < 250 ? 250 : height * 0.15, 
    resizeMode: 'contain',
    zIndex:1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginTop: -30, 
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
});
