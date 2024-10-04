import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [responsible, setResponsible] = useState('');
  const [contacts, setContacts] = useState([]);
  const [showContactList, setShowContactList] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Índice do contato que está sendo editado

  const handleSubmit = () => {
    const newContact = { name, phone, address, age, responsible };

    if (editingIndex !== null) {
      // Se estamos editando um contato existente
      const updatedContacts = contacts.map((contact, index) =>
        index === editingIndex ? newContact : contact
      );
      setContacts(updatedContacts);
      setEditingIndex(null); // Reseta o índice de edição
    } else {
      // Adiciona novo contato
      setContacts([...contacts, newContact]);
    }

    // Limpa os campos do formulário
    setName('');
    setPhone('');
    setAddress('');
    setAge('');
    setResponsible('');
    setShowContactList(true);
  };

  const handleLongPress = (index) => {
    Alert.alert(
      'Ação',
      'Escolha uma ação',
      [
        {
          text: 'Editar',
          onPress: () => {
            const contact = contacts[index];
            setName(contact.name);
            setPhone(contact.phone);
            setAddress(contact.address);
            setAge(contact.age);
            setResponsible(contact.responsible);
            setEditingIndex(index); // Define o índice para edição
          },
        },
        {
          text: 'Excluir',
          onPress: () => {
            const updatedContacts = contacts.filter((_, i) => i !== index);
            setContacts(updatedContacts);
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
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
        {!showContactList ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={text => setName(text)}
              keyboardType="string"
            />

            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={phone}
              onChangeText={text => setPhone(text)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Endereço"
              value={address}
              onChangeText={text => setAddress(text)}
              keyboardType="string"
            />

            <TextInput
              style={styles.input}
              placeholder="Idade"
              value={age}
              onChangeText={text => setAge(text)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Responsável"
              value={responsible}
              onChangeText={text => setResponsible(text)}
              keyboardType="default"
            />

            <TouchableOpacity style={styles.Botão} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{editingIndex !== null ? 'Atualizar' : 'Enviar'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <ScrollView style={styles.contactList}>
            {contacts.map((contact, index) => (
              <TouchableOpacity key={index} onLongPress={() => handleLongPress(index)}>
                <View style={styles.contactItem}>
                  <Text style={styles.contactText}>Nome: {contact.name}</Text>
                  <Text style={styles.contactText}>Telefone: {contact.phone}</Text>
                  <Text style={styles.contactText}>Endereço: {contact.address}</Text>
                  <Text style={styles.contactText}>Idade: {contact.age}</Text>
                  <Text style={styles.contactText}>Responsável: {contact.responsible}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
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
    fontFamily: 'OpenSans_700Bold',
    fontSize: 40,
    top: -460,
  },
  subtitulo: {
    color: 'white',
    fontFamily: 'OpenSans_400Regular',
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
    fontFamily: 'OpenSans_400Regular',
  },
  contactList: {
    marginTop: 20,
    width: '100%',
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactText: {
    fontSize: 16,
  },
});
