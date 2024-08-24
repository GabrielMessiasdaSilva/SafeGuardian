import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';

const mockData = [
  { id: '1', date: '2024-08-21', time: '10:00 AM', location: 'Sala de Estar' },
  { id: '2', date: '2024-08-20', time: '03:00 PM', location: 'Cozinha' },
  { id: '3', date: '2024-08-19', time: '08:00 AM', location: 'Quarto' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Histórico de Quedas</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={mockData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>Data: {item.date}</Text>
              <Text style={styles.cardText}>Hora: {item.time}</Text>
              <Text style={styles.cardText}>Local: {item.location}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: '20%',
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
    color: '#333333',
  },
});
