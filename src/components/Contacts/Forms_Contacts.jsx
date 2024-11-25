import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';

const FormularioTelefones = ({ adicionarTelefone, atualizarTelefone, telefonesSelecionados, setMostrarFormulario }) => {
  const [telefone1, setTelefone1] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [telefone3, setTelefone3] = useState('');

  useEffect(() => {
    if (telefonesSelecionados) {
      setTelefone1(telefonesSelecionados.telefone1 || '');
      setTelefone2(telefonesSelecionados.telefone2 || '');
      setTelefone3(telefonesSelecionados.telefone3 || '');
    } else {
      setTelefone1('');
      setTelefone2('');
      setTelefone3('');
    }
  }, [telefonesSelecionados]);

  const handleSubmit = () => {
    if (telefone1.trim() === '' && telefone2.trim() === '' && telefone3.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha pelo menos um número de telefone.');
      return;
    }

    if (telefonesSelecionados) {
      atualizarTelefone(telefonesSelecionados.id, { telefone1, telefone2, telefone3 });
    } else {
      adicionarTelefone({ telefone1, telefone2, telefone3 });
    }

    setTelefone1('');
    setTelefone2('');
    setTelefone3('');
    setMostrarFormulario(false);
  };

  const handleCancel = () => {
    setTelefone1('');
    setTelefone2('');
    setTelefone3('');
    setMostrarFormulario(false);
  };


  const formatarTelefone = (texto) => {
    const textoApenasNumeros = texto.replace(/\D/g, '').slice(0,11); 
    if (textoApenasNumeros.length <= 10) {
      return textoApenasNumeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    } else {
      return textoApenasNumeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
    }
  };
  

  return (
    <View style={styles.form}>
    <TextInput
  style={styles.input}
  placeholder="Telefone 1"
  placeholderTextColor="#A9A9A9"
  value={telefone1}
  onChangeText={text => setTelefone1(formatarTelefone(text))}
  keyboardType="phone-pad"
/>
<TextInput
  style={styles.input}
  placeholder="Telefone 2"
  placeholderTextColor="#A9A9A9"
  value={telefone2}
  onChangeText={text => setTelefone2(formatarTelefone(text))}
  keyboardType="phone-pad"
/>
<TextInput
  style={styles.input}
  placeholder="Telefone 3"
  placeholderTextColor="#A9A9A9"
  value={telefone3}
  onChangeText={text => setTelefone3(formatarTelefone(text))}
  keyboardType="phone-pad"
/>


      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{telefonesSelecionados ? "Atualizar" : "Salvar"}</Text>
      </TouchableOpacity>

      {telefonesSelecionados && (
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
    marginBottom:60,
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

export default FormularioTelefones;
