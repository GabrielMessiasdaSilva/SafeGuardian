import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert , KeyboardAvoidingView, Platform } from 'react-native';

const Formulario = ({ adicionarPerfil, atualizarPerfil, perfilSelecionado, setMostrarFormulario }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [idade, setIdade] = useState('');
  const [responsavel, setResponsavel] = useState('');

  useEffect(() => {
    if (perfilSelecionado) {
      setNome(perfilSelecionado.nome || '');
      setTelefone(perfilSelecionado.telefone || '');
      setEndereco(perfilSelecionado.endereco || '');
      setIdade(perfilSelecionado.idade || '');
      setResponsavel(perfilSelecionado.responsavel || '');
    } else {
      setNome('');
      setTelefone('');
      setEndereco('');
      setIdade('');
      setResponsavel('');
    }
  }, [perfilSelecionado]);

  const handleSubmit = () => {
    if (
      nome.trim() === '' ||
      telefone.trim() === '' ||
      endereco.trim() === '' ||
      idade.trim() === '' ||
      responsavel.trim() === ''
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (perfilSelecionado) {
      atualizarPerfil(perfilSelecionado.id, { nome, telefone, endereco, idade, responsavel });
    } else {
      adicionarPerfil({ nome, telefone, endereco, idade, responsavel });
    }

    setNome('');
    setTelefone('');
    setEndereco('');
    setIdade('');
    setResponsavel('');
    setMostrarFormulario(false);
  };

  const handleCancel = () => {
    setNome('');
    setTelefone('');
    setEndereco('');
    setIdade('');
    setResponsavel('');
    setMostrarFormulario(false);
  };

  const formatarTelefone = (texto) => {
    const textoApenasNumeros = texto.replace(/\D/g, '').slice(0, 11);
    if (textoApenasNumeros.length <= 10) {
      return textoApenasNumeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    } else {
      return textoApenasNumeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
    }
  };

  const formatarIdade = (texto) => texto.replace(/\D/g, '').slice(0, 2);

  return (
    <View style={styles.form}>
       <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
></KeyboardAvoidingView>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#A9A9A9"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor="#A9A9A9"
        value={telefone}
        onChangeText={(text) => setTelefone(formatarTelefone(text))}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        placeholderTextColor="#A9A9A9"
        value={endereco}
        onChangeText={setEndereco}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        placeholderTextColor="#A9A9A9"
        value={idade}
        onChangeText={(text) => setIdade(formatarIdade(text))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Responsável"
        placeholderTextColor="#A9A9A9"
        value={responsavel}
        onChangeText={setResponsavel}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{perfilSelecionado ? 'Atualizar' : 'Salvar'}</Text>
      </TouchableOpacity>
      {perfilSelecionado && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 0,
    paddingTop: 0,
  },
  input: {
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

export default Formulario;
