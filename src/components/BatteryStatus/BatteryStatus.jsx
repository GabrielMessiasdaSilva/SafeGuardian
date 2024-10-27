import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { realTimeDb } from '../../Services/FirebaseConnection'; 
import { ref, onValue, off } from 'firebase/database'; 

const { width } = Dimensions.get('window');

const BatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const batteryRef = ref(realTimeDb, '/Bateria/percentual');

    const onValueChange = onValue(batteryRef, snapshot => {
      const level = snapshot.val(); 
      console.log('Battery Level:', level); 
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

  return (
    <View style={styles.container}>
      <Ionicons 
        name={batteryLevel > 50 ? "battery-full" : batteryLevel > 20 ? "battery-half" : "battery-dead"}
        size={24} 
        color={batteryLevel > 20 ? "green" : "red"} 
      />
      <Text style={styles.text}>{batteryLevel}%</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image 
              source={require('../../Img/bateria-fraca.png')}
              style={styles.batteryImage}
            />
            <Text style={styles.modalTextTitulo}>Aviso! </Text>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 18, 
    marginLeft: 8, 
    color: '#000', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  batteryImage: {
    width: 200, 
    height: 200,
    alignSelf: 'center',
    top: 50,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20, 
    color:'#302c2c',
  },
  modalTextTitulo: {
    marginBottom: 15,
    fontSize: 50,
    textAlign: 'center',
    marginTop: 20, 
    fontWeight: 'bold',
    color: '#862727',
  },
  button: {
    backgroundColor: '#007BFF', // Cor de fundo do botão
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default BatteryStatus;
