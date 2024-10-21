import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, Vibration } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const QuedaAlert = () => {
  const [quedas, setQuedas] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState();
  const [lastQuedaId, setLastQuedaId] = useState(null); // Estado para armazenar a última queda processada

  // Função para obter dados do Realtime Database
  const fetchRealtimeData = () => {
    const reference = ref(realTimeDb, 'Quedas'); // Caminho para o nó 'Quedas'

    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      setQuedas(val || {}); // Define como um objeto vazio se não houver dados
      
      // Exibir modal se uma nova queda for detectada
      if (val) {
        const quedaEntries = Object.entries(val);
        const newQueda = quedaEntries.pop(); // Pega a nova queda

        // Verifica se a nova queda é diferente da última queda processada
        if (newQueda && newQueda[0] !== lastQuedaId) {
          setModalVisible(true);
          playSound(); // Reproduzir som
          vibrateDevice(); // Vibrar dispositivo
          setLastQuedaId(newQueda[0]); // Atualiza a última queda processada
        }
      }
    });

    // Limpar a assinatura ao desmontar
    return () => unsubscribe();
  };

  // Função para obter dados do Firestore (se necessário)
  const fetchFirestoreData = () => {
    const reference = collection(db, 'Quedas'); // Caminho para a coleção 'Quedas'

    const unsubscribe = onSnapshot(reference, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(dados); // Aqui você pode definir o estado com os dados do Firestore
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchRealtimeData();
    fetchFirestoreData();
  }, []);

  // Função para tocar som mesmo no modo silencioso e fones de ouvido
  const playSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,

        playsInSilentModeIOS: true, 
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        require('../../sounds/alerta-queda.mp3'), 
        { isLooping: true } // Som em loop
      );
      setSound(sound);
      await sound.playAsync(); // Reproduz o som
    } catch (error) {
      console.error('Erro ao tocar o som:', error);
    }
  };

  // Função para vibrar o dispositivo
  const vibrateDevice = () => {
    Vibration.vibrate(500); // Vibração padrão de 500ms
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); // Vibração especial de alerta
  };

  const handleModalClose = async () => {
    setModalVisible(false);
    if (sound) {
      await sound.stopAsync(); // Para o som se estiver tocando
    }
  };

  return (
    <View>
  
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
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default QuedaAlert;
