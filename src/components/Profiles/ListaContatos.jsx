// components/Lista.js
import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import ItemCard from './Item'; // Atualizado para ItemCard

const Lista = ({ perfis = [], onLongPress }) => { // Adicionando um valor padrão para perfis
  if (perfis.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum perfil cadastrado.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={perfis}
      keyExtractor={perfil => perfil.id}
      renderItem={({ item }) => (
        <ItemCard perfil={item} onLongPress={() => onLongPress(item)} />
      )}
      contentContainerStyle={styles.list}
    />
  );
};


const styles = StyleSheet.create({
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
  list: {
    paddingBottom: 20,
  },
});

export default Lista;
