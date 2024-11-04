import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, Vibration, Image } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection';
import { collection, onSnapshot } from 'firebase/firestore';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuedaAlert = () => {
  const [quedas, setQuedas] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState();

  const fetchRealtimeData = async () => {
    const reference = ref(realTimeDb, 'Quedas');

    const unsubscribe = onValue(reference, async (snapshot) => {
      const val = snapshot.val();
      setQuedas(val || {});

      if (val) {
        const quedaEntries = Object.entries(val);
        const newQueda = quedaEntries.pop();

        // Recupera a última queda armazenada
        const lastQuedaId = await AsyncStorage.getItem('lastQuedaId');

        if (newQueda && newQueda[0] !== lastQuedaId) {
   
          setModalVisible(true);
          playSound();
          vibrateDevice();

 
          await AsyncStorage.setItem('lastQuedaId', newQueda[0]);
        }
      }
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
        { isLooping: false }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Erro ao tocar o som:', error);
    }
  };

  const vibrateDevice = () => {
    Vibration.vibrate(500);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleModalClose = async () => {
    setModalVisible(false);
    if (sound) {
      await sound.stopAsync();
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: 300, padding: 50, backgroundColor: 'white', borderRadius: 10, height: 450 }}>
              <Image source={require('../../Img/Alerta-Icon.png')} style={{ alignSelf: 'center', width: 300, height: 300 }} />
              <Text style={{ fontWeight: 'bold', fontSize: 40, color: '#862727', alignSelf: 'center', marginTop: 0, bottom: 100 }}>Aviso</Text>
              <Text style={{ fontWeight: 'normal', fontSize: 24, alignSelf: 'center', bottom: 100, textAlign: 'center', marginTop: 20 }}>Uma queda foi detectada!</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default QuedaAlert;
