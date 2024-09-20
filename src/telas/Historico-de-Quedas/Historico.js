import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const mockData = [
  { id: '1', Nome: 'Carlos Alberto', date: '17/05/2024 às 14h21pm', Contato: '(87) 12345-6789', Endereco: 'Rua da Jabuticabeira, 345 - Jardim Bahia '},
  { id: '2', Nome: 'Carlos Alberto', date: '17/05/2024 às 14h21pm', Contato: '(87) 12345-6789', Endereco: 'Rua da Jabuticabeira, 345 - Jardim Bahia '},
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="id-badge" size={50} color="#fff" />
        <Text style={styles.headerText}>Histórico de Quedas</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={mockData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Nome: </Text>
                <Text style={styles.data}>{item.Nome}</Text>
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Horário: </Text>
                <Text style={styles.data}>{item.date}</Text>
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Contato Responsável: </Text>
                <Text style={styles.data}>{item.Contato}</Text>
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Endereço: </Text>
                <Text style={styles.data}>{item.Endereco}</Text>
              </Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.dismissButton}>
          <Text style={styles.dismissButtonText}>Dispensar Aviso</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CDC8C8',
  },
  header: {
    height: '40%',
    backgroundColor: '#1E2F6C',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  label: {
    color: '#1E2F6C', // Cor preta para o rótulo
    fontWeight: 'bold',
  },
  data: {
    color: '#333', // Cor azul para os dados
  },
  dismissButton: {
    backgroundColor: '#862727',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  dismissButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
