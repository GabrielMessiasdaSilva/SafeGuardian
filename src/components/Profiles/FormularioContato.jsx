import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const FloatingLabelInput = ({ label, value, onChangeText, iconName, keyboardType, isSecure }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const labelStyle = {
    position: 'absolute',
    left: 45,
    top: isFocused || value ? 10 : 20,
    fontSize: isFocused || value ? 12 : 16,
    color: isFocused ? '#2E4A8F' : '#B0B0B0',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <View style={styles.inputContainer}>
      <Animatable.Text
        animation="fadeIn"
        duration={300}
        style={labelStyle}
        useNativeDriver
      >
        {label}
      </Animatable.Text>
      <Ionicons name={iconName} size={20} color="#B0B0B0" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType={keyboardType}
        secureTextEntry={isSecure}
        selectionColor="#2E4A8F"
      />
    </View>
  );
};

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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <Text style={styles.title}>{perfilSelecionado ? 'Atualizar Perfil' : 'Novo Perfil'}</Text>
        
        <FloatingLabelInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          iconName="person-outline"
        />
        <FloatingLabelInput
          label="Telefone"
          value={telefone}
          onChangeText={(text) => setTelefone(formatarTelefone(text))}
          iconName="call-outline"
          keyboardType="phone-pad"
        />
        <FloatingLabelInput
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
          iconName="location-outline"
        />
        <FloatingLabelInput
          label="Idade"
          value={idade}
          onChangeText={(text) => setIdade(formatarIdade(text))}
          iconName="calendar-outline"
          keyboardType="numeric"
        />
        <FloatingLabelInput
          label="Responsável"
          value={responsavel}
          onChangeText={setResponsavel}
          iconName="person-add-outline"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{perfilSelecionado ? 'Atualizar' : 'Salvar'}</Text>
        </TouchableOpacity>

        {perfilSelecionado && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    backgroundColor: '#2A2C31',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    left: 15,
    top: 20,
    zIndex: 2,
  },
  input: {
    height: 55,
    borderColor: '#3E4148',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 50,
    backgroundColor: '#383A42',
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2E4A8F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#2E4A8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Formulario;