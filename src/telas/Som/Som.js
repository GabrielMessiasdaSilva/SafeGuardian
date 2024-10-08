import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import { database } from '../../Services/FirebaseConnection'; // Importe sua configuração do Realtime Database
import { ref, onValue } from 'firebase/database';
import { Audio } from 'expo-av';

const App = () => {
  const [quedas, setQuedas] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    const reference = ref(database, 'Quedas'); // Caminho para o nó 'Quedas'

    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      setQuedas(val);
      
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
  }, []);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../sounds/alerta-queda.mp3'), // Substitua pelo caminho do seu arquivo de som
      { isLooping: true } // Configura o som para tocar em loop
    );
    setSound(sound);
    await sound.playAsync(); // Reproduz o som
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (sound) {
      sound.stopAsync(); // Para o som se estiver tocando
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

export default App;
