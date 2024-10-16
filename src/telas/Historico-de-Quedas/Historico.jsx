import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection';
import { collection, onSnapshot } from 'firebase/firestore';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

const QuedaAlert = () => {
  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  const [quedas, setQuedas] = useState(null);

  const fetchRealtimeData = () => {
    const reference = ref(realTimeDb, 'Quedas');
    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      setQuedas(val || {});
    });
    return () => unsubscribe();
  };

  const fetchFirestoreData = () => {
    const reference = collection(db, 'Quedas');
    const unsubscribe = onSnapshot(reference, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(dados);
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    fetchRealtimeData();
    fetchFirestoreData();
  }, []);

  
  

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Histórico de</Text>
      <Text style={styles.SubTitle}>Quedas</Text>
      <Image source={require('../../Img/fundo_Teste.png')} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {quedas ? (
          Object.entries(quedas).map(([id, queda]) => (
            <View key={id} style={styles.quedaContainer}>
              <Text style={styles.title}>Alerta de Queda</Text>
              <Text style={styles.label}>Data: {queda.data || 'Data não achada'}</Text>
              <Text style={styles.label}>Hora: {queda.hora || 'Hora não disponível'}</Text>
            </View>
          ))
        ) : (
          <ActivityIndicator size="large" color="#1E2F6C" style={styles.loading} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    top: 40,
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#FFF',
    zIndex: 10,
  },
  SubTitle: {
    top: 40,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 300,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  overlay: {
    position: 'absolute',
    height: 300,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    top: 0,
  },
  scrollViewContent: {
    padding: 20,
    alignItems: 'center',
    marginTop: 200,
  },
  quedaContainer: {
    borderColor: '#333',
    borderWidth: 1,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    top: -20,
    zIndex: 10,
  },
  title: {
    fontFamily: 'Gagalin-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1E2F6C',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#666',
  },
  loading: {
    marginTop: 50,
  },
});

export default QuedaAlert;
