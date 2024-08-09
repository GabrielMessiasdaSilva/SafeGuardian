import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../Services/FirebaseConnection';

export default function App() {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [idade, setIdade] = useState('');
  const [resposavel, setResposavel] = useState('');

  const Enviar = async () => {
    try {
      if (id) {
        // Edita o documento, caso haja a necessidade
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
        // Adiciona ao documento
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.topSection}></View>
      <View style={styles.bottomSection} />
      <Text style={styles.header}>Formulário de Usuário</Text>
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
        <TouchableOpacity style={styles.button} onPress={Enviar}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={Limpar}>
          <Text style={styles.buttonText}>Limpar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  topSection:{
    flex:1,
    backgroundColor: '#1E2F6C',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000000',
    zIndex: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
