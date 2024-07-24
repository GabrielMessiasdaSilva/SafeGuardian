import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from 'react-native';

export default function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [idade, setIdade] = useState('');
  const [resposavel, setResposavel] = useState('');


  const Enviar = () => {

  };


  const Limpar = () => {
    setNome('');
    setTelefone('');
    setEmail('');
    setEndereco('');
    setIdade('');
    setResposavel('');
  };

  return (
    <View style={styles.container}>

      <View style={styles.topSection}>
      <Image source={require('../../../src/Img/safe.png')} style={styles.Logo} />
        <MaterialCommunityIcons name="badge-account-horizontal-outline" size={40} color="white" style={styles.Icones} />
        <Text style={styles.headerText}>Informações pessoais</Text>

      </View>
  
      <View style={styles.bottomSection} />


      <View style={styles.formContainer}>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={nome}
          onChangeText={setNome}
          placeholder='Nome '
        />


        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={telefone}
          onChangeText={setTelefone}
          placeholder='Telefone '
        />


        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={email}
          onChangeText={setEmail}
          placeholder='Email '
        />


        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={endereco}
          onChangeText={setEndereco}
          placeholder='Endereço '
        />


        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={idade}
          onChangeText={setIdade}
          placeholder='Idade:  '
        />


        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={resposavel}
          onChangeText={setResposavel}
          placeholder='Resposável: '
        />


        <TouchableOpacity style={styles.button1} onPress={Limpar}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={Enviar}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  Logo: {
    bottom:110,
    right: 149,
    width: 50,
    height: 50,
  },
  topSection: {
    flex: 1,
    backgroundColor: '#1E2F6C',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    position: 'absolute',
    top: 90,
  },
  Icones: {
    top: 45,
    position: 'absolute',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#CDC8C8',
  },
  formContainer: {
    flex: 1,
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '15%',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    zIndex: 1,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#CDC8C8'
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
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
