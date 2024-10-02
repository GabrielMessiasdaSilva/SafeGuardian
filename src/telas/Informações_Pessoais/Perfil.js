import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [idade, setIdade] = useState('');
  const [responsavel, setResponsavel] = useState('');

  const handleSubmit = () => {
    console.log('Dados salvos:', { nome, telefone, endereco, idade, responsavel });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-outline" size={48} color="#fff" />
        <View style={styles.headerContainer}>
          <Text style={styles.headerTextOne}>INFORMAÇÕES</Text>
          <Text style={styles.headerTextTwo}>PESSOAIS</Text>
        </View>
      </View>

      {/* Container que envolve o formulário */}
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
          <TextInput
            style={styles.input}
            placeholder="Responsável"
            value={responsavel}
            onChangeText={setResponsavel}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>SALVAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1E2F6C',
    padding: 40,
    alignItems: 'center',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    marginTop: -10,          // Para sobrepor ao header
    paddingVertical: 20,     // Espaçamento vertical
    alignItems: 'center',     // Centraliza horizontalmente
  },
  formContainer: {
    width: '90%',           // Largura do formulário
    maxWidth: 400,          // Largura máxima
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
