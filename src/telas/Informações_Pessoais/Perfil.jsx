import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Alert, SafeAreaView, StatusBar, ImageBackground, View, Text, Dimensions, ScrollView } from 'react-native';
import Formulario from '../../components/Profiles/FormularioContato';
import Lista from '../../components/Profiles/ListaContato';
import { db } from '../../Services/FirebaseConnection';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Impede que o Splash Screen se oculte automaticamente
SplashScreen.preventAutoHideAsync().catch(() => {});

const { width, height } = Dimensions.get('window');

export default function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [perfis, setPerfis] = useState([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
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

    const colecaoPerfis = collection(db, 'Perfil');
    const unsubscribe = onSnapshot(colecaoPerfis, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPerfis(lista);
    }, (error) => {
      console.log("Erro ao buscar perfis:", error);
    });

    return () => unsubscribe();
  }, [appIsReady]);

  const adicionarPerfil = async (novoPerfil) => {
    try {
      const colecaoPerfis = collection(db, 'Perfil');
      await addDoc(colecaoPerfis, novoPerfil);
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
    } catch (error) {
      console.log("Erro ao remover perfil:", error);
    }
  };

  const handleLongPress = (perfil) => {
    Alert.alert(
      "Ação",
      "O que você deseja fazer?",
      [
        {
          text: "Editar",
          onPress: () => {
            setPerfilSelecionado(perfil);
            setMostrarFormulario(true);
          }
        },
        {
          text: "Excluir",
          onPress: () => removerPerfil(perfil.id),
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

  if (!appIsReady || !fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      {/* Imagem de Fundo */}
      <ImageBackground 
        source={require('../../Img/fundo_Teste.png')} 
        resizeMode="cover" 
        style={styles.backgroundImage}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.textContainer}>
          <Text style={styles.titulo}>Contatos</Text>
          <Text style={styles.subtitulo}>Emergenciais</Text>
        </View>
      </ImageBackground>

      {/* Formulário Sobreposto */}
      <View style={styles.formOverlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {mostrarFormulario ? (
            <Formulario
              adicionarPerfil={adicionarPerfil}
              atualizarPerfil={atualizarPerfil}
              perfilSelecionado={perfilSelecionado}
              setMostrarFormulario={setMostrarFormulario}
            />
          ) : (
            <Lista perfis={perfis} onLongPress={handleLongPress} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 0.4, // Aumenta a altura da imagem de fundo para 40% da tela
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    paddingBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    position:'absolute',
    top:60,
  },
  titulo: {
    fontFamily: 'Gagalin-Regular', // Fonte personalizada
    fontSize: 36,
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  subtitulo: {
    fontFamily: 'Roboto-Regular', // Fonte secundária
    fontSize: 18,
    color: "#fff",
    marginTop: 5,
  },
  formOverlay: {
    position: 'absolute',
    top: height * 0.35, // Inicia o formulário a partir de 35% da altura da tela
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    // Sombra opcional para destacar o formulário
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
