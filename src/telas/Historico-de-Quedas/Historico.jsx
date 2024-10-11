import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection'; 
import { collection, onSnapshot } from 'firebase/firestore';

const QuedaAlert = () => {
  const [quedas, setQuedas] = useState(null);

  // Função para obter dados do Realtime Database
  const fetchRealtimeData = () => {
    const reference = ref(realTimeDb, 'Quedas'); // Caminho para o nó 'Quedas'

    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      setQuedas(val || {}); // Define como um objeto vazio se não houver dados
    });

    // Limpar a assinatura ao desmontar
    return () => unsubscribe();
  };

  // Função para obter dados do Firestore
  const fetchFirestoreData = () => {
    const reference = collection(db, 'Quedas'); // Caminho para a coleção 'Quedas'

    const unsubscribe = onSnapshot(reference, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Processar os dados conforme necessário
      console.log(dados); // Aqui você pode definir o estado com os dados do Firestore
    });

    // Limpar a assinatura ao desmontar
    return () => unsubscribe();
  };

  useEffect(() => {
    fetchRealtimeData();
    fetchFirestoreData();
  }, []);

  return (
    <View style={styles.container}>
      

      <Image source={require('../../Img/fundo_Teste.png')} style={styles.image} resizeMode="cover" />
     
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {quedas ? (
          Object.entries(quedas).map(([id, queda]) => (
            <View key={id} style={styles.quedaContainer}>
              <Text style={styles.title}>Detalhes da Queda:</Text>
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.text}>{queda.data}</Text> 
              <Text style={styles.label}>Hora da queda:</Text>
              <Text style={styles.text}>{queda.hora}</Text> 
            </View>
          ))
        ) : (
          <Text style={styles.loadingText}>Carregando...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', 
  },
  image: {
    height: '60%', 
    width: '100%',
   
  },
  scrollViewContent: {
    padding: 20,
    alignItems: 'center',
    position: 'absolute', 
    width: '100%',
    zIndex: 2, 
  },
  quedaContainer: {
    zIndex: 2,
    width: '90%', 
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default QuedaAlert;
