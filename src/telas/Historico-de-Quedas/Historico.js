import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../Services/FirebaseConnection';

const { width } = Dimensions.get('window');

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
      Alert.alert('Erro', 'Erro ao enviar dados.');
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
      Alert.alert('Erro', 'Erro ao buscar dados.');
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.topSection}>
      <FontAwesome6 name="people-group" size={50} color="white" style={styles.icon} />
      <Text style={styles.headerText}>Informações Pessoais</Text>
      <Image source={require('../../../src/Img/safe.png')} style={styles.logo} />
    </View>

    <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
        <TouchableOpacity style={styles.button} onPress={Limpar}>
          <Text style={styles.buttonText}>Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={Enviar}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    <View style={styles.bottomSection} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
