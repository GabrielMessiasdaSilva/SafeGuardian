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
import FormularioTelefones from '../../components/Contacts/Forms_Contacts';
import { db } from '../../Services/FirebaseConnection';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function Telefone() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [telefones, setTelefones] = useState([]);
  const [telefoneSelecionado, setTelefoneSelecionado] = useState(null);
  const [idTelefoneLongPress, setIdTelefoneLongPress] = useState(null);

  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    const colecaoTelefones = collection(db, 'Telefones'); 
    const unsubscribe = onSnapshot(colecaoTelefones, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTelefones(lista);
    }, (error) => {
      console.log("Erro ao buscar telefones:", error);
    });

    return () => unsubscribe();
  }, [fontsLoaded]);

  const adicionarTelefone = async (novoTelefone) => {
    try {
      const colecaoTelefones = collection(db, 'Telefones');
      await addDoc(colecaoTelefones, novoTelefone);
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao adicionar telefone:", error);
    }
  };

  const atualizarTelefone = async (id, novosDados) => {
    try {
      const referencia = doc(db, 'Telefones', id);
      await updateDoc(referencia, novosDados);
      setTelefoneSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao atualizar telefone:", error);
    }
  };

  const removerTelefone = async (id) => {
    try {
      const referencia = doc(db, 'Telefones', id);
      await deleteDoc(referencia);

      if (telefones.length === 1) {
        setMostrarFormulario(true);
      }
    } catch (error) {
      console.log("Erro ao remover telefone:", error);
    }
  };

  const handleLongPress = (telefone) => {
    setIdTelefoneLongPress(telefone.id);
  };

  const handleEdit = (telefone) => {
    setTelefoneSelecionado(telefone);
    setMostrarFormulario(true);
    setIdTelefoneLongPress(null);
  };

  const handleDelete = (id) => {
    Alert.alert('Excluir', 'Deseja apagar permanentemente este telefone?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          removerTelefone(id);
          if (telefones.length === 1) {
            setMostrarFormulario(true);
          }
          setIdTelefoneLongPress(null);
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
          <Image source={require('../../Img/icons-contatos.png')} style={styles.ImagemLogo} />
          <Text style={styles.titulo}>Contatos</Text>
          <Text style={styles.subtitulo}>Emergenciais</Text>
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
           <FormularioTelefones
           adicionarTelefone={adicionarTelefone} 
           atualizarTelefone={atualizarTelefone}
           telefonesSelecionados={telefoneSelecionado}
           setMostrarFormulario={setMostrarFormulario}
         />
         
          ) : (
            telefones.map((telefone) => (
              <View key={telefone.id} style={styles.card}>
                <TouchableOpacity onLongPress={() => handleLongPress(telefone)} style={styles.cardContent}>
                  <Text style={styles.nomeLabel}>Telefone 1: <Text style={styles.nomeValue}>{telefone.telefone1}</Text></Text>
                  <Text style={styles.nomeLabel}>Telefone 2: <Text style={styles.nomeValue}>{telefone.telefone2}</Text></Text>
                  <Text style={styles.nomeLabel}>Telefone 3: <Text style={styles.nomeValue}>{telefone.telefone3}</Text></Text>
                </TouchableOpacity>

                {idTelefoneLongPress === telefone.id && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleEdit(telefone)} style={styles.buttonEdit}>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(telefone.id)} style={styles.buttonDelete}>
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
    fontSize: 50,
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    textAlign: 'center',
    bottom: height * 0.28,
    margin: 0,
    padding: 0,
  },
  subtitulo: {
    fontFamily: 'Gagalin-Regular',
    fontSize: 22,
    color: "#fff",
    marginTop: 5,
    bottom: height * 0.30,
    textAlign: 'center',
  },
  ImagemLogo: {
    top: height * 0.09,
    width: width * 0.5 < 250 ? 250 : width * 0.5,
    height: height * 0.20 < 250 ? 250 : height * 0.20, 
    resizeMode: 'contain',
    zIndex:1,
  },
  formOverlay: {
    position: 'absolute',
    top: height * 0.30,
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
    padding: 20,
    paddingTop:40,
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
    right:5,
    top: 10,
    marginLeft:50,

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
  nomeLabel: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E2F6C',
  },
  nomeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
