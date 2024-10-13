// Lista_contact.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListaContatos({ Telefones, onLongPress }) {
  return (
    <FlatList
      data={Telefones}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onLongPress={() => onLongPress(item)} style={styles.item}>
          <Text style={styles.nome}>{item.nome}</Text>
          {item.telefones && item.telefones.map((tel, index) => (
            <Text key={index} style={styles.telefone}>{`Telefone ${index + 1}: ${tel}`}</Text>
          ))}
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1, 
  },
  nome: {
    fontFamily: 'Gagalin-Regular',
    fontSize: 20,
    color: '#333',
  },
  telefone: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
});
