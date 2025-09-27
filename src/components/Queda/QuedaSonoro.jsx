import React, { useEffect, useState } from 'react';
import { 
  View, Text, Modal, TouchableWithoutFeedback, Vibration, 
  TouchableOpacity, StyleSheet, Dimensions 
} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const QuedaAlertPremium = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalApuracaoVisible, setModalApuracaoVisible] = useState(false);
  const [sound, setSound] = useState(null);
  const [ultimaQueda, setUltimaQueda] = useState(null);

  const fetchRealtimeData = () => {
    const reference = ref(realTimeDb, "Dispositivo/SafeGuardian/Quedas");

    const unsubscribe = onValue(reference, async (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const entries = Object.entries(val);
        const newQueda = entries.pop();
        const lastQuedaId = await AsyncStorage.getItem('lastQuedaId');

        if (newQueda && newQueda[0] !== lastQuedaId) {
          setUltimaQueda(newQueda[1]);
          setModalVisible(true);
          playSound();
          vibrateDevice();

          setTimeout(() => setModalApuracaoVisible(true), 10000);
          await AsyncStorage.setItem('lastQuedaId', newQueda[0]);
        }
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribeRealtime = fetchRealtimeData();
    return () => unsubscribeRealtime && unsubscribeRealtime();
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
        require('../../sounds/alerta-queda.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Erro ao tocar o som:', error);
    }
  };

  const vibrateDevice = () => {
    Vibration.vibrate(700);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleModalClose = async () => {
    setModalVisible(false);
    if (sound) await sound.stopAsync();
  };

  const handleModalApuracaoClose = () => setModalApuracaoVisible(false);

  return (
    <View>
      {/* Modal de alerta */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <MaterialIcons name="warning" size={80} color="#ff6b6b" style={{ marginBottom: 15 }} />
              <Text style={styles.title}>Alerta</Text>
              <Text style={styles.subtitle}>
                Uma queda foi detectada!
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de apuração */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalApuracaoVisible}
        onRequestClose={handleModalApuracaoClose}
      >
        <TouchableWithoutFeedback onPress={handleModalApuracaoClose}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: '#fdfdfd' }]}>
              <MaterialIcons name="report-problem" size={80} color="#ff6b6b" style={{ marginBottom: 15 }} />
              <Text style={[styles.title, { color: '#862727' }]}>Atenção</Text>
              <Text style={[styles.subtitle, { color: '#333', fontSize: 18 }]}>
                A queda será dada como apurada. A situação foi resolvida?
              </Text>
              <TouchableOpacity 
                style={styles.checkButton} 
                onPress={handleModalApuracaoClose}
              >
                <MaterialIcons name="check" size={50} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
  },
  checkButton: {
    backgroundColor: '#3F8CFF',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 50,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuedaAlertPremium;
