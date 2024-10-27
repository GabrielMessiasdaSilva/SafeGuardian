// Lista_contact.js
import React, { useState } from 'react'; // Importando useState
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importando useNavigation

export default function ListaContatos({ Telefones, onLongPress }) {
  const navigation = useNavigation();
  const [telefoneSelecionado, setTelefoneSelecionado] = useState(null); // Estado para telefone selecionado

  const voltarParaCadastro = () => {
    navigation.navigate('Contatos_Emergenciais'); 
  };

  const selecionarTelefone = (item) => {
    setTelefoneSelecionado(item); // Armazenar o telefone selecionado
    // Você pode adicionar lógica adicional aqui, como navegar para outra tela
    console.log('Telefone selecionado:', item);
  };

  // Verifique se a lista de Telefones está vazia
  if (Telefones.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum telefone cadastrado.</Text>
        <Button title="Voltar para Cadastro" onPress={voltarParaCadastro} />
      </View>
    );
  }

  return (
    <FlatList
      data={Telefones}
      keyExtractor={(item) => item.id.toString()} // Garantindo que o id seja uma string
      renderItem={({ item }) => (
        <TouchableOpacity 
          onLongPress={() => onLongPress(item)} 
          onPress={() => selecionarTelefone(item)} // Chamando a função ao pressionar
          style={styles.item}
        >
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
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 10,
  },
});
