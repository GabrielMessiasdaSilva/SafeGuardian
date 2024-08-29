import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

const FALLS_PATH = '/falls'; // Caminho onde os dados das quedas são armazenados

function App() {
  useEffect(() => {
    // Solicitar permissões para notificações (iOS)
    messaging()
      .requestPermission()
      .then(authStatus => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      });

    // Configurar listener para o Realtime Database
    const onValueChange = database()
      .ref(FALLS_PATH)
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          // Exibir notificação quando uma nova queda for detectada
          showNotification('Alerta de Queda', 'Uma queda foi detectada!');
        }
      });

    // Cleanup listener ao desmontar o componente
    return () => database().ref(FALLS_PATH).off('value', onValueChange);
  }, []);

  // Função para exibir notificações
  function showNotification(title, body) {
    messaging()
      .createNotification({
        title: title,
        body: body,
        android: {
          channelId: 'default',
        },
      })
      .then(() => console.log('Notificação exibida'))
      .catch(error => console.error('Erro ao exibir notificação:', error));
  }

  return null; // Ou o seu componente principal
}

export default App;
