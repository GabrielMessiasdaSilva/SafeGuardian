import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { database } from '../../Services/DatabaseConnection'; // Importe sua configuração do Realtime Database
import { ref, onValue } from 'firebase/database';

const App = () => {
  const [quedas, setQuedas] = useState(null);

  useEffect(() => {
    const reference = ref(database, 'Quedas'); // Caminho para o nó 'Quedas'

    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      setQuedas(val);
    });

    // Limpar a assinatura ao desmontar
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {quedas ? (
        Object.entries(quedas).map(([id, queda]) => (
          <View key={id} style={styles.card}>
            <Text style={styles.label}>Data: <Text style={styles.value}>{queda.data}</Text></Text>
            <Text style={styles.label}>Hora: <Text style={styles.value}>{queda.hora}</Text></Text>
          </View>
        ))
      ) : (
        <ActivityIndicator size="large" color="#1E2F6C" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F0F0',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
});

export default App;
