import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { realTimeDb } from '../../Services/FirebaseConnection';
import { ref, onValue, off } from 'firebase/database';

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const projectId = '80d4cb23-2c0f-46e9-85ae-41aa101dcb03'; 

  useEffect(() => {
    registrarParaNotificacoesPushAsync();

    const referenciaQueda = ref(realTimeDb, '/Quedas');
    const unsubscribe = onValue(referenciaQueda, (snapshot) => {
      const dadosQueda = snapshot.val();
      console.log('Dados de Queda do Firebase:', dadosQueda);

   
      if (dadosQueda) {
        Object.keys(dadosQueda).forEach((key) => {

          for (let i = 0; i < 3; i++) {
            enviarNotificacaoQueda(expoPushToken);
          }
        });
      }
    });

    return () => unsubscribe(); 
  }, [expoPushToken]);

  const registrarParaNotificacoesPushAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        icon: 'https://www.flaticon.com/br/icone-gratis/perfil_3135768', 
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Ative as notificações para receber alertas de queda.');
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    console.log('Token de Push:', tokenData.data);
    setExpoPushToken(tokenData.data);
  };

  const enviarNotificacaoQueda = async (expoPushToken) => {
    if (!expoPushToken) return;

    const mensagem = {
      to: expoPushToken,
      sound: 'default',
      title: 'Queda Detectada!',
      body: 'Uma queda ocorreu. Clique para mais detalhes.',
      data: { action: 'fall_detected' },
    };

    try {
      const resposta = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mensagem),
      });
      

      const dados = await resposta.json();
      console.log('Resposta da notificação:', dados);
      if (dados.errors) {
        console.error('Erros na notificação:', dados.errors);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  };

 
};

export default App;
