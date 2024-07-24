import React, { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function App() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');

  const Enviar = () => {
    alert('Números cadastrados:\n Telefone 1: ' + num1 + '\n Telefone 2: ' + num2 + '\n Telefone 3: ' + num3);
  };

  const Limpar = () => {
    setNum1('');
    setNum2('');
    setNum3('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
      <FontAwesome6 name="people-group" size={50} color="white" style={styles.Icones} />
        <Text style={styles.headerText}>Contatos Emergenciais</Text>
        <Image source={require('../../../src/Img/safe.png')} style={styles.Logo} />
      </View>
      <View style={styles.bottomSection} />
      <View style={styles.formContainer}>
        <View style={styles.Cabecalho}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={num1}
            onChangeText={setNum1}
            placeholder='1º - Telefone'
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={num2}
            onChangeText={setNum2}
            placeholder='2º - Telefone'
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={num3}
            onChangeText={setNum3}
            placeholder='3º - Telefone'
          />
          <TouchableOpacity style={styles.button1} onPress={Limpar}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={Enviar}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
    top:130,
  },
  Icones: {
    top:80,
    position: 'absolute',
  },

  Logo: {
    bottom:110,
    right: 149,
    width: 50,
    height: 50,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#CDC8C8',
  },
  formContainer: {
    position: 'absolute',
    top: '30%', // Ajuste conforme a altura do header e o espaço que você deseja
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#CDC8C8',
  },
  button1: {
    backgroundColor: '#4E64B5',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  button2: {
    backgroundColor: '#1E2F6C',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
