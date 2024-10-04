import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, Image, TouchableOpacity } from 'react-native';

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log(`Nome: ${name}, Email: ${email}`);
  };

  return (
    <ImageBackground
      source={require('../../Img/fundo_Teste.png')} // caminho da sua imagem
      style={styles.background}
    >
      <View style={styles.content}>
        <Image source={require('../../Img/icons-contatos.png')} style={styles.ImagemIcone} />
        <Text style={styles.Titulo}>Contatos</Text>
        <Text style={styles.subtitulo}>Emergenciais</Text>
      </View>
      
      <View style={styles.bottomContainer}>
        <TextInput
          style={styles.input}
          placeholder=" 1° Telefone"
          value={name}
          onChangeText={text => setName(text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder=" 2° Telefone"
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder=" 3° Telefone"
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.Botão} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImagemIcone: {
    zIndex: 1,
    top: -70,
    width: 300,
    height: 300,
  },
  Titulo: {
    color: 'white',
    fontFamily: 'OpenSans_700Bold', // Usando fonte Open Sans
    fontSize: 40,
    top: -460,
  },
  subtitulo: {
    color: 'white',
    fontFamily: 'OpenSans_400Regular', // Usando fonte Open Sans
    fontSize: 30,
    top: -460,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    height: '60%',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    elevation: 10,
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  Botão: {
    backgroundColor: '#1e2f6c',
    padding: 14,
    borderRadius: 25,
    elevation: 20,
    width: '70%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'OpenSans_400Regular', // Usando fonte Open Sans
  }
});
