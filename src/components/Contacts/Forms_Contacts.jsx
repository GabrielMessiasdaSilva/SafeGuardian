import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image,TouchableOpacity } from 'react-native';

export default function FormularioContato({ adicionarTelefones, atualizarTelefones, TelefonesSelecionado, setMostrarFormulario }) {
  const [nome, setNome] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [telefone3, setTelefone3] = useState('');


  const handleCancel = () => {
    setTelefone1('');
    setTelefone2('');
    setTelefone3('');
  
    setMostrarFormulario(false);
  };


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
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{TelefonesSelecionado ? "Atualizar" : "Salvar"}</Text>
      </TouchableOpacity>
      {TelefonesSelecionado && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>   )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    zIndex:1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E2F6C',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
