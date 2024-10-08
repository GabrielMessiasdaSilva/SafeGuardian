// FormularioContato.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import { db } from '../Services/FirebaseConnection';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';

const FormularioContato = ({ contato, navigation }) => { // Certifique-se de que 'contato' é recebido como prop
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [idade, setIdade] = useState('');
  const [responsavel, setResponsavel] = useState('');

  useEffect(() => {
    if (contato) {
      setNome(contato.nome);
      setTelefone(contato.telefone);
      setEndereco(contato.endereco);
      setIdade(contato.idade);
      setResponsavel(contato.responsavel);
    }
  }, [contato]);

  const handleSubmit = async () => {
    const novoContato = { nome, telefone, endereco, idade, responsavel };

    try {
      if (contato) {
        const contatoRef = doc(db, 'users', contato.id);
        await updateDoc(contatoRef, novoContato);
      } else {
        const docRef = await addDoc(collection(db, 'users'), novoContato);
        console.log('Contato adicionado com ID: ', docRef.id);
      }

      // Limpa os campos do formulário
      setNome('');
      setTelefone('');
      setEndereco('');
      setIdade('');
      setResponsavel('');
      navigation.goBack(); // Volta para a lista de contatos
    } catch (error) {
      console.error("Erro ao enviar os dados: ", error);
    }
  };

  return (
    <View style={styles.bottomContainer}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        keyboardType="default"
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
        keyboardType="default"
      />
      <TouchableOpacity style={styles.Botão} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{contato ? 'Atualizar' : 'Enviar'}</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
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
  },
});

export default FormularioContato;
