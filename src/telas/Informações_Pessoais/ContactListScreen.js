// ContactListScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ContactListScreen = ({ route, navigation }) => {
  const { contacts } = route.params; // Recebendo os contatos da tela anterior
  const handleDelete = (index) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir este contato?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
            const newContacts = contacts.filter((_, i) => i !== index);
            navigation.navigate('ContactList', { contacts: newContacts }); // Atualiza a lista
          }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contactList}>
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactItem}>
            <Text style={styles.contactText}>Nome: {contact.name}</Text>
            <Text style={styles.contactText}>Telefone: {contact.phone}</Text>
            <Text style={styles.contactText}>Endereço: {contact.address}</Text>
            <Text style={styles.contactText}>Idade: {contact.age}</Text>
            <Text style={styles.contactText}>Responsável: {contact.responsible}</Text>

            <TouchableOpacity onPress={() => handleDelete(index)} style={styles.iconButton}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contactList: {
    width: '100%',
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'relative',
  },
  contactText: {
    fontSize: 16,
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default ContactListScreen;
