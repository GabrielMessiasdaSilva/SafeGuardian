import React from 'react';
import { FlatList, StyleSheet, View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import ItemCard from './Item';

const Lista = ({ perfis = [], onLongPress }) => { 
  const navigation = useNavigation(); 


  const voltarParaCadastro = () => {
    navigation.navigate('Perfil'); 
};


  if (perfis.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum perfil cadastrado.</Text>
        <Button title="Voltar para Cadastro" onPress={voltarParaCadastro} />
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
    marginBottom: 20, // Adiciona espaço para o botão
  },
  list: {
    paddingBottom: 20,
  },
});

export default Lista;
