import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [telefone1, setTelefone1] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [telefone3, setTelefone3] = useState('');
  const [responsavel, setResponsavel] = useState('');

  const handleSubmit = () => {
    console.log('Dados salvos:', { telefone1, telefone2, telefone3, responsavel });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="call-outline" size={48} color="#fff" />
        <View style={styles.headerContainer}>
          <Text style={styles.headerTextOne}>CADASTRO</Text>
          <Text style={styles.headerTextTwo}>DE NÚMEROS</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            style={styles.input}
            placeholder="Telefone 1"
            value={telefone1}
            onChangeText={setTelefone1}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone 2"
            value={telefone2}
            onChangeText={setTelefone2}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone 3"
            value={telefone3}
            onChangeText={setTelefone3}
            keyboardType="phone-pad"
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
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2F6C',
    borderTopLeftRadius: 30,  // Arredonda a parte superior esquerda do contêiner
    borderTopRightRadius: 30, // Arredonda a parte superior direita do contêiner
    overflow: 'hidden',       // Garante que o conteúdo não ultrapasse os limites arredondados
    marginTop: -5,          // Para ajustar a sobreposição com o cabeçalho
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
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,  // Arredonda a parte superior esquerda do contêiner
    borderTopRightRadius: 30, // Arredonda a parte superior direita do contêiner
    overflow: 'hidden',       // Garante que o conteúdo não ultrapasse os limites arredondados
    marginTop: -5,          // Para ajustar a sobreposição com o cabeçalho
  },
  scrollContent: {
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
