import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
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
        // Edita o documento,caso haja a necessidade
        const docRef = doc(db, 'users', id);
        await updateDoc(docRef, {
          nome,
          telefone,
          email,
          endereco,
          idade,
          resposavel
        });
        alert('Dados atualizados com sucesso!');
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
        alert('Dados enviados com sucesso!');
      }
      Limpar();
    } catch (e) {
      console.error('Erro ao adicionar documento: ', e);
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
        alert('Documento não encontrado!');
      }
    } catch (e) {
      console.error('Erro ao buscar documento: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          <Image source={require('../../Img/safe.png')} style={styles.Logo} />
          <MaterialCommunityIcons name="badge-account-horizontal-outline" size={40} color="white" style={styles.Icones} />
          <Text style={styles.headerText}>Informações pessoais</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder='Nome'
          />
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder='Telefone' type='numeric'
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder='Email'
          />
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder='Endereço'
          />
          <TextInput
            style={styles.input}
            value={idade}
            onChangeText={setIdade}
            placeholder='Idade'
          />
          <TextInput
            style={styles.input}
            value={resposavel}
            onChangeText={setResposavel}
            placeholder='Responsável'
          />

          <TouchableOpacity style={styles.button1} onPress={() => Editar(id)}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={Enviar}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    flex:1,
    flexDirection:'column',
    width: '100%',
    backgroundColor: '#1E2F6C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Logo: {
    width: 50,
    height: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  Icones: {
    marginTop: 10,
  },
  formContainer: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    zIndex: 2,
    elevation: 10,
    flex:1,
  },
  input: {
    height: 40,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#F0F0F0',
  },
  button1: {
    backgroundColor: '#4E64B5',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 5,
  },
  button2: {
    backgroundColor: '#1E2F6C',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});