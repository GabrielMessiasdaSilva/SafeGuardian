import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform ,Image,Dimensions} from 'react-native';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../Services/FirebaseConnection';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [idade, setIdade] = useState('');
  const [resposavel, setResposavel] = useState('');
  const { width } = Dimensions.get('window');
  const Enviar = async () => {
    try {
      if (id) {
        const docRef = doc(db, 'users', id);
        await updateDoc(docRef, {
          nome,
          telefone,
          email,
          endereco,
          idade,
          resposavel
        });
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      } else {
        await addDoc(collection(db, 'users'), {
          nome,
          telefone,
          email,
          endereco,
          idade,
          resposavel
        });
        Alert.alert('Sucesso', 'Dados enviados com sucesso!');
      }
      Limpar();
    } catch (e) {
      console.error('Erro ao adicionar documento: ', e);
      Alert.alert('Erro', 'Erro ao enviar dados. Tente novamente.');
    }
  };

  const Limpar = () => {
    setId(null);
    setNome('');
    setTelefone('');
    setEmail('');
    setEndereco('');
    setIdade('');
    setResposavel('');
  };

  const Editar = async (documentId) => {
    try {
      const docRef = doc(db, 'users', documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setId(documentId);
        setNome(data.nome);
        setTelefone(data.telefone);
        setEmail(data.email);
        setEndereco(data.endereco);
        setIdade(data.idade);
        setResposavel(data.resposavel);
      } else {
        Alert.alert('Erro', 'Documento não encontrado!');
      }
    } catch (e) {
      console.error('Erro ao buscar documento: ', e);
      Alert.alert('Erro', 'Erro ao buscar documento. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
        <Image source={require('../../../src/Img/icone-information.png')} style={styles.icon} />
        
          <Text style={styles.header}>Informações Pessoais</Text>
        </View>
        <View style={styles.bottomSection} />
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Endereço"
            value={endereco}
            onChangeText={setEndereco}
          />
          <TextInput
            style={styles.input}
            placeholder="Idade"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Responsável"
            value={resposavel}
            onChangeText={setResposavel}
          />
          <TouchableOpacity style={styles.button1} onPress={Enviar}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={Limpar}>
            <Text style={styles.buttonText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  topSection: {
    height: '40%',
    backgroundColor: '#1E2F6C',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius:15,
  },
  bottomSection: {
    height: '60%',
    backgroundColor: '#CDC8C8',
  },
  formContainer: {
    position: 'absolute',
    top: '29%',
    left: '5%',
    right: '5%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 25,
    shadowColor: '#000000',
    zIndex: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginBottom: 10,
    width:300,
    height:300,
  },
  header: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    zIndex: 1,
    position: 'absolute',
    top:'55%'
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor:'#cdc8c8',
  },
  button1: {
    backgroundColor: '#4e64b5',
    paddingVertical: 14,    // Ajustado para ser menor
    paddingHorizontal: 50, // Ajustado para ser menor
    borderRadius: 34,
    marginBottom: 10,
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#1e2f6c',
    paddingVertical: 14,    // Ajustado para ser menor
    paddingHorizontal: 50, // Ajustado para ser menor
    borderRadius: 34,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
