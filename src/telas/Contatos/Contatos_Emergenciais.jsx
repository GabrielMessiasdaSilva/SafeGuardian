// App.js
import React, { useState, useEffect, useCallback } from 'react';
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
  onSnapshot,
} from 'firebase/firestore';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Impede que o Splash Screen se oculte automaticamente
SplashScreen.preventAutoHideAsync().catch(() => {});

const { width, height } = Dimensions.get('window');

export default function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [Telefones, setTelefones] = useState([]);
  const [TelefonesSelecionado, setTelefonesSelecionado] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);

  // Carregando fontes personalizadas
  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!appIsReady) {
      return;
    }

    const colecaoTelefones = collection(db, 'Telefones');
    const unsubscribe = onSnapshot(
      colecaoTelefones,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTelefones(lista);
      },
      (error) => {
        console.log('Erro ao buscar Telefones:', error);
      }
    );

    return () => unsubscribe();
  }, [appIsReady]);

  const adicionarTelefones = async (novoTelefone) => {
    try {
      const colecaoTelefones = collection(db, 'Telefones');
      await addDoc(colecaoTelefones, novoTelefone);
      setMostrarFormulario(false);
    } catch (error) {
      console.log('Erro ao adicionar Telefone:', error);
    }
  };

  const atualizarTelefones = async (id, novosDados) => {
    try {
      const referencia = doc(db, 'Telefones', id);
      await updateDoc(referencia, novosDados);
      setTelefonesSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.log('Erro ao atualizar Telefone:', error);
    }
  };

  const removerTelefones = async (id) => {
    try {
      const referencia = doc(db, 'Telefones', id);
      await deleteDoc(referencia);
    } catch (error) {
      console.log('Erro ao remover Telefone:', error);
    }
  };

  const handleLongPress = (telefone) => {
    Alert.alert(
      'Ação',
      'O que você deseja fazer?',
      [
        {
          text: 'Editar',
          onPress: () => {
            setTelefonesSelecionado(telefone);
            setMostrarFormulario(true);
          },
        },
        {
          text: 'Excluir',
          onPress: () => removerTelefones(telefone.id),
          style: 'destructive',
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar barStyle="light-content" />
      {/* Imagem de Fundo */}
      <ImageBackground
        source={require('../../Img/fundo_Teste.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.headerContainer}>
          <Image
            source={require('../../Img/logoemergenciais.png')}
            style={styles.logoImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.titulo}>Contatos</Text>
            <Text style={styles.subtitulo}>Emergenciais</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Formulário Sobreposto */}
      <View style={styles.formOverlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoImage: {
    width: width * 0.5,
    height: height * 0.15,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Gagalin-Regular',
  },
  subtitulo: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'Gagalin-Regular',
  },
  formOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // White with transparency
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -40, // to overlap the background image
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
