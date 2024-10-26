import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet,Image,Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { realTimeDb } from '../../Services/FirebaseConnection'; // Importe a conexão do Realtime Database
import { ref, onValue, off } from 'firebase/database'; // Importa funções do Firebase

const { width, height } = Dimensions.get('window');
const BatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);

  useEffect(() => {
    const batteryRef = ref(realTimeDb, '/Bateria/percentual');

    const onValueChange = onValue(batteryRef, snapshot => {
      const level = snapshot.val(); 
      if (level !== null) {
        setBatteryLevel(level); 

        if (level <= 20) {
          Alert.alert("Alerta de Bateria", "A bateria está baixa! Por favor, carregue o dispositivo.");
        }
      }
    });

    return () => off(batteryRef, onValueChange); // Limpa o listener ao desmontar
  }, []);

  return (
    
    <View style={styles.container}>
   
      <Ionicons 
        name={batteryLevel > 50 ? "battery-full" : batteryLevel > 20 ? "battery-half" : "battery-dead"}
        size={24} 
        color={batteryLevel > 20 ? "green" : "red"} 
      />
      <Text style={styles.text}>{batteryLevel}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap:'wrap',
  
  },
  text: {
    fontSize: 18, 
    marginLeft: 8, 
    color: '#000', 
  },
});

export default BatteryStatus;
