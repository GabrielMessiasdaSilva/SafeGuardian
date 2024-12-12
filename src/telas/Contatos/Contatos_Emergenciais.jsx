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

  const validarTelefone = (telefone) => {
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return regex.test(telefone);
  };

  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  const salvarTelefonesNoAsyncStorage = async (telefones) => {
    try {
      await AsyncStorage.setItem('telefones', JSON.stringify(telefones));
    } catch (error) {
      console.error('Erro ao salvar telefones no AsyncStorage:', error);
    }
  };

  const recuperarTelefonesDoAsyncStorage = async () => {
    try {
      const telefonesSalvos = await AsyncStorage.getItem('telefones');
      if (telefonesSalvos) {
        const telefonesParsed = JSON.parse(telefonesSalvos);
        setTelefones(telefonesParsed);
        if (telefonesParsed.length > 0) {
          setMostrarFormulario(false); // Oculta o formulário se houver telefones
        }
      }
    } catch (error) {
      console.error('Erro ao recuperar telefones do AsyncStorage:', error);
    }
  };

  useEffect(() => {
    if (!fontsLoaded) return;

    const colecaoTelefones = collection(db, 'Telefones');
    const unsubscribe = onSnapshot(colecaoTelefones, (snapshot) => {
      const listaTelefones = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTelefones(listaTelefones);
      salvarTelefonesNoAsyncStorage(listaTelefones); // Sincroniza com o AsyncStorage
    });

    recuperarTelefonesDoAsyncStorage(); // Recupera dados locais ao iniciar
    return () => unsubscribe();
  }, [fontsLoaded]);

  const adicionarTelefone = async (novoTelefone) => {
    if (!validarTelefone(novoTelefone.telefone1)) {
      Alert.alert("Erro", "Número de telefone 1 inválido.");
      return;
    }
    if (novoTelefone.telefone2 && !validarTelefone(novoTelefone.telefone2)) {
      Alert.alert("Erro", "Número de telefone 2 inválido.");
      return;
    }
    if (novoTelefone.telefone3 && !validarTelefone(novoTelefone.telefone3)) {
      Alert.alert("Erro", "Número de telefone 3 inválido.");
      return;
    }

    try {
      const colecaoTelefones = collection(db, 'Telefones');
      await addDoc(colecaoTelefones, novoTelefone);
      const novosTelefones = [...telefones, novoTelefone];
      setTelefones(novosTelefones);
      salvarTelefonesNoAsyncStorage(novosTelefones); // Sincroniza com o AsyncStorage
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao adicionar telefone:", error);
      Alert.alert("Erro", "Erro ao adicionar telefone. Tente novamente.");
    }
  };

  const atualizarTelefone = async (id, novosDados) => {
    if (!validarTelefone(novosDados.telefone1)) {
      Alert.alert("Erro", "Número de telefone 1 inválido.");
      setMostrarFormulario(true);
      return;
    }
    if (novosDados.telefone2 && !validarTelefone(novosDados.telefone2)) {
      Alert.alert("Erro", "Número de telefone 2 inválido.");
      setMostrarFormulario(true);
      return;
    }
    if (novosDados.telefone3 && !validarTelefone(novosDados.telefone3)) {
      Alert.alert("Erro", "Número de telefone 3 inválido.");
      setMostrarFormulario(true);
      return;
    }

    try {
      const referencia = doc(db, 'Telefones', id);
      await updateDoc(referencia, novosDados);
      const telefonesAtualizados = telefones.map((telefone) =>
        telefone.id === id ? { ...telefone, ...novosDados } : telefone
      );
      setTelefones(telefonesAtualizados);
      salvarTelefonesNoAsyncStorage(telefonesAtualizados); // Sincroniza com o AsyncStorage
      setTelefoneSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao atualizar telefone:", error);
      Alert.alert("Erro", "Erro ao atualizar telefone. Tente novamente.");
    }
  };

  const removerTelefone = async (id) => {
    try {
      const referencia = doc(db, 'Telefones', id);
      await deleteDoc(referencia);
      const novosTelefones = telefones.filter(telefone => telefone.id !== id);
      setTelefones(novosTelefones);
      salvarTelefonesNoAsyncStorage(novosTelefones); // Sincroniza com o AsyncStorage
      setTelefoneSelecionado(null);

      if (novosTelefones.length === 0) {
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
      { text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      { text: 'OK', onPress: () => removerTelefone(id) },
    ]);
  };

  if (!fontsLoaded) return null;

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
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
                      <Text style={styles.textButton}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(telefone.id)} style={styles.buttonDelete}>
                      <Text style={styles.textButton}>Excluir</Text>
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
    height: 100,
    alignSelf: 'center',
    bottom: height * 0.06,
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
    bottom: height * 0.30,
    margin: 0,
    padding: 0,
  },
  subtitulo: {
    fontFamily: 'Gagalin-Regular',
    fontSize: 22,
    color: "#fff",
    marginTop: 5,
    bottom: height * 0.32,
    textAlign: 'center',
  },
  ImagemLogo: {
    top: height * 0.10,
    width: width * 0.5 < 250 ? 250 : width * 0.5,
    height: height * 0.20 < 245 ? 250 : height * 0.20, 
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
  cardContent: {
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // Alinha os botões horizontalmente
justifyContent: 'flex-end',
    marginTop: 15, // Margem superior para separação
  },
  buttonEdit: {
    backgroundColor: '#4CAF50', // Azul para "Editar"
    paddingVertical: 8, // Reduz altura
    paddingHorizontal: 12, // Reduz largura
    borderRadius: 6, // Bordas levemente arredondadas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Espaço entre os botões
  },
  buttonDelete: {
    backgroundColor: '#DC3545', // Vermelho para "Excluir"
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: '#FFF', // Branco para contraste
    fontSize: 14, // Texto menor e legível
    fontWeight: '500', // Medium weight para um visual clean
    textTransform: 'none', // Mantém o texto no formato original
    letterSpacing: 0.5, // Reduz espaçamento entre letras
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