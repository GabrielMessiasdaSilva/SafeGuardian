import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions,Image } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { realTimeDb } from '../../Services/FirebaseConnection';

const { width } = Dimensions.get('window');

const BatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const batteryRef = ref(realTimeDb, '/Bateria/percentual');

    const onValueChange = onValue(batteryRef, snapshot => {
      const level = snapshot.val();
      if (level !== null) {
        setBatteryLevel(level);
        if (level <= 20) {
          setModalVisible(true);
        }
      }
    });

    return () => off(batteryRef, onValueChange);
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

 
  const progressBarColor = batteryLevel <= 20 ? '#ff4d4d' : '#76c7c0'; 

  return (
    <View style={styles.container}>
      <View style={styles.batteryInfo}>
        <View style={styles.batteryContainer}>
          <View style={styles.batteryCap} />
          <View style={styles.batteryBody}>
            <View style={[styles.progressBar, { width: `${batteryLevel}%`, backgroundColor: progressBarColor }]} />
          </View>
        </View>
        <Text style={styles.text}>{batteryLevel}%</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTextTitulo}>Aviso!</Text>
 <Image source={require('../../Img/bateria-fraca.png')} style={styles.bateriaImageModal}/>  
            <Text style={styles.modalText}>O dispositivo se encontra com a bateria baixa.</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.button} activeOpacity={0.7}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'flex-start',
  },
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  batteryContainer: {
    width: 35,  
    height: 18,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 3,
    position: 'relative',
    backgroundColor: '#fff',
  },
  batteryCap: {
    position: 'absolute',
    top: -3,
    left: 8,
    width: 10,
    height: 4,
    backgroundColor: '#ccc',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  batteryBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },

  bateriaImageModal: {
    width: 250,
    height:250,
    left:10,
    top:50,

  
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  text: {
    fontSize: 16,
    marginLeft: 6,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignSelf:'center',
    width: width * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 22,
    fontWeight:'bold',
    textAlign: 'center',
  
    bottom:50,
    color: '#302c2c',
  },
  modalTextTitulo: {
    marginBottom: 15,
    fontSize: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#862727',
  },
  button: {
    backgroundColor: '#1E2F6C',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom:20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default BatteryStatus;
