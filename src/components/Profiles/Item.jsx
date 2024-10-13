// components/ItemCard.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const ItemCard = ({ perfil, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.card} // Card abaixo do título
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <Text style={styles.nome}>Nome: {perfil.nome}</Text>
      <Text style={styles.telefone}>Telefone: {perfil.telefone}</Text>
      <Text style={styles.endereco}>Endereço: {perfil.endereco}</Text>
      <Text style={styles.idade}>Idade: {perfil.idade}</Text>
      <Text style={styles.responsavel}>Responsável: {perfil.responsavel}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, 
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    border:10,
    borderColor:'#333',
    borderRadius: 8,
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  telefone: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  endereco: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  idade: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  responsavel: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
});

export default ItemCard;
