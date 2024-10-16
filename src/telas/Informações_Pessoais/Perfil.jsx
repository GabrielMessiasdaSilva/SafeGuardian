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
  Alert, 
  Image, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import Formulario from '../../components/Profiles/FormularioContato';
import Lista from '../../components/Profiles/ListaContato';
import { db } from '../../Services/FirebaseConnection';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function Perfil() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [perfis, setPerfis] = useState([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) {
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
  }, [fontsLoaded]);

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

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Imagem de Fundo */}
      <ImageBackground 
        source={require('../../Img/fundo_Teste.png')} 
        resizeMode="cover" 
        style={styles.backgroundImage}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Container Centralizado */}
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

      {/* Formulário Sobreposto */}
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
            <Lista perfis={perfis} onLongPress={handleLongPress} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundImage: '../../',
  },
  imagemLogoTipo: {
    width: 270, 
    height: 270, 
    alignSelf: 'center',
    top:10,
  },
  backgroundImage: {
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: height * 0.1,
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
    top:-130,
    margin:0,
    padding:0,
  },
  subtitulo: {
    fontFamily: 'Gagalin-Regular',
    fontSize: 30,
    color: "#fff",
    marginTop: 5,
    top:-130,
    textAlign: 'center', // Centraliza o subtítulo abaixo do título
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
});
