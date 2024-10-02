import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [idade, setIdade] = useState('');
  const [responsavel, setResponsavel] = useState('');

  const handleSubmit = () => {
    console.log('Dados salvos:', { nome, telefone, endereco, idade });
  };

  return (
 
    <View style={styles.View1}>
      <View style={styles.header}>
     
        <View style={styles.headerContainer}>
          <Text style={styles.headerTextOne}>INFORMAÇÕES</Text>
          <Text style={styles.headerTextTwo}>PESSOAIS</Text>
       
        </View>
      
      </View>


      <View style={styles.formBackground}>

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
     

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>SALVAR</Text>
          </TouchableOpacity>
        </View>
      </View>
</View>
  );
}

const styles = StyleSheet.create({
  View1:{
    backgroundColor:'#ddd'
  },
  header: {
    marginTop:40,
    backgroundColor: '#1E2F6C',
    padding: 40,
    alignItems: 'center',
    width:'100%',
    height:'20%',
  },

  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  headerTextOne: {
  
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  headerTextTwo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#d8dae1',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  formBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30, // Arredondar parte superior esquerda
    borderTopRightRadius: 30, // Arredondar parte superior direita
    marginTop:50,
    paddingVertical: 20,     // Espaçamento vertical
    alignItems: 'center',     // Centraliza horizontalmente
  },
  formContainer: {
    
    height:'100%',
    width: '100%',           // Largura do formulário
    maxWidth: 700,          // Largura máxima
    padding: 20,
 
      
  },
  input: {
    borderRadius: 30,
    padding: 17,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#1E2F6C',
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
