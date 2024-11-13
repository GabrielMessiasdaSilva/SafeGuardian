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

  const [perfil, setPerfil] = useState([]);
  const [quedas, setQuedas] = useState([]);

  const fetchRealtimeData = () => {
    const reference = ref(realTimeDb, 'Quedas');
    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      setQuedas(val ? Object.entries(val).map(([id, queda]) => ({ id, ...queda })) : []);
    });
    return () => unsubscribe();
  };

  const fetchFirestoreData = () => {
    const reference = collection(db, 'Perfil');
    const unsubscribe = onSnapshot(reference, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPerfil(dados);
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    fetchRealtimeData();
    fetchFirestoreData();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#1E2F6C" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Histórico de</Text>
      <Text style={styles.subTitle}>Quedas</Text>
      <Image source={require('../../Img/fundo_Teste.png')} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {quedas.length > 0 ? (
          quedas.map((queda) => (
            <View key={queda.id} style={styles.quedaContainer}>
              <Text style={styles.label}>Nome: <Text style={styles.data}>{perfil[0]?.nome || 'Carlos Alberto'}</Text></Text>
              <Text style={styles.label}>Data: <Text style={styles.data}>{queda.data || 'Data não achada'}</Text></Text>
              <Text style={styles.label}>Hora: <Text style={styles.data}>{queda.hora || 'hora não achada'}</Text></Text>
              <Text style={styles.label}>Contato responsável: <Text style={styles.data}>{perfil[0]?.telefone || '(11) 12345-6789'}</Text></Text>
              <Text style={styles.label}>Endereço: <Text style={styles.data}>{perfil[0]?.endereco || 'endereco não encontrado'}</Text></Text>
            </View>
          ))
        ) : (
          <View style={styles.noQuedasContainer}>
            <Text style={styles.noQuedasText}>Não há registros de quedas.</Text>
            <Text style={styles.subMessage}>Fique tranquilo, ainda não ocorreu nenhum incidente.</Text>
          </View>
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
  data: {
    color: '#333',
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
    fontFamily: 'Gagalin-Regular', 
  },
  subTitle: {
    top: 5,
    fontFamily: 'Gagalin-Regular', 
    alignSelf: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#FFF',
    zIndex: 10,
  },
  image: {
    position: 'absolute',
    width: width,
    height: height * 0.3,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollViewContent: {
    padding: 20,
    alignItems: 'center',
  },
  quedaContainer: {
    borderColor: '#333',
    borderWidth: 1,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 9,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    top: -20,
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#1e2f6c',
    fontWeight:'bold',
  },
  loading: {
    marginTop: 50,
  },
  noQuedasContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  noQuedasText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#607D8B',
    marginTop: 20,
  },
  subMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#B0BEC5',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default QuedaAlert;
