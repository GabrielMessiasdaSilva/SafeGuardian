import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';

export default function FormularioContato({ adicionarTelefones, atualizarTelefones, TelefonesSelecionado, setMostrarFormulario }) {
  const [nome, setNome] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [telefone3, setTelefone3] = useState('');

  useEffect(() => {
    if (TelefonesSelecionado) {
      setNome(TelefonesSelecionado.nome);
      setTelefone1(TelefonesSelecionado.telefones[0] || '');
      setTelefone2(TelefonesSelecionado.telefones[1] || '');
      setTelefone3(TelefonesSelecionado.telefones[2] || '');
    }
  }, [TelefonesSelecionado]);

  const handleSubmit = () => {
    const telefones = [telefone1, telefone2, telefone3].filter(tel => tel.trim() !== '');
    if (TelefonesSelecionado) {
      atualizarTelefones(TelefonesSelecionado.id, { nome, telefones });
    } else {
      adicionarTelefones({ nome, telefones });
    }
  };

  return (
    <View style={styles.container}>
   
 

      <Text style={styles.label}>Telefones:</Text>
      <TextInput
        style={styles.input}
        value={telefone1}
        onChangeText={setTelefone1}
        placeholder="Digite o telefone 1"
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        value={telefone2}
        onChangeText={setTelefone2}
        placeholder="Digite o telefone 2"
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        value={telefone3}
        onChangeText={setTelefone3}
        placeholder="Digite o telefone 3"
        keyboardType="phone-pad"
      />
      
      <Button title={TelefonesSelecionado ? "Atualizar" : "Adicionar"} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  label: {
    fontFamily: 'Gagalin-Regular',
    fontSize: 18,
    marginBottom: 5,
  },
 
  input: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
