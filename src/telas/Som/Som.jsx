import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { Audio } from 'expo-av';

const QuedaAlert = () => {
  const [quedas, setQuedas] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState();

  // Função para obter dados do Realtime Database
  const fetchRealtimeData = () => {
    const reference = ref(realTimeDb, 'Quedas'); // Caminho para o nó 'Quedas'

    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      setQuedas(val || {}); // Define como um objeto vazio se não houver dados
      
      // Exibir modal se uma nova queda for detectada
      if (val) {
        const lastQueda = Object.entries(val).pop()[1]; // Pega a última queda
        if (lastQueda) {
          setModalVisible(true);
          playSound(); // Reproduzir som
        }
      }
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

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../sounds/alerta-queda.mp3'), 
        { isLooping: true } 
      );
      setSound(sound);
      await sound.playAsync(); // Reproduz o som
    } catch (error) {
      console.error('Erro ao tocar o som:', error);
    }
  };

  const handleModalClose = async () => {
    setModalVisible(false);
    if (sound) {
      await sound.stopAsync(); // Para o som se estiver tocando
    }
  };

  return (
    <View>
      {quedas ? (
        Object.entries(quedas).map(([id, queda]) => (
          <View key={id}>
          
          </View>
        ))
      ) : (
        <Text>Carregando...</Text>
      )}

      {/* Modal para exibir o alerta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose} // Para dispositivos Android
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Alerta de Queda Detectada!</Text>
              {/* Removido o botão de fechar */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default QuedaAlert;
