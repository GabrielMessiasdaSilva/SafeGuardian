import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { realTimeDb } from '../../Services/FirebaseConnection';

const { width } = Dimensions.get('window');

const BatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // Novo estado para conexão com a internet

  useEffect(() => {
    const batteryRef = ref(realTimeDb, '/Bateria/percentual');
    const connectionRef = ref(realTimeDb, 'Dispositivo/SafeGuardian/conectado'); // Referência para o status da conexão

    // Escutando mudanças no status da bateria
    const onBatteryValueChange = onValue(batteryRef, snapshot => {
      const level = snapshot.val();
      if (level !== null) {
        setBatteryLevel(level);
        if (level <= 20) {
          setModalVisible(true);
        }
      }
    });

    // Escutando mudanças no status da conexão
    const onConnectionValueChange = onValue(connectionRef, snapshot => {
      const connected = snapshot.val();
      setIsConnected(connected); // Atualiza o estado de conexão
    });

    // Limpando os listeners quando o componente for desmontado
    return () => {
      off(batteryRef, onBatteryValueChange);
      off(connectionRef, onConnectionValueChange);
    };
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const progressBarColor = batteryLevel <= 20 ? '#ff4d4d' : '#1E2F6C'; 

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

      {/* Exibindo o ícone de WiFi no canto oposto */}
      <View style={styles.connectionInfo}>
        {isConnected ? (
          <Image source={require('../../Img/wi-fi.png')} style={styles.wifiIcon} />
        ) : (
          <Image source={require('../../Img/desconectado.png')} style={styles.wifiIcon} />
        )}
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
            <Image source={require('../../Img/bateria-fraca.png')} style={styles.bateriaImageModal} />
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
    backgroundColor: '#1E1E2F',
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
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  text: {
    fontSize: 16,
    marginLeft: 6,
    color: '#ffffffff',
  },
  connectionInfo: {
    position: 'absolute',  // Para fixar a posição
    right: 10,             // Alinha à direita
    top: 10,               // Alinha um pouco abaixo do topo
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionText: {
    fontSize: 16,
    color: '#000',
  },
  wifiIcon: {
    width: 20,
    height: 20,
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
  bateriaImageModal: {
    width: 250,
    height:250,
    left:10,
    top:50,
  },
});

export default BatteryStatus;
