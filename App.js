import React, { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import Route from './src/routes'; // Verifique o caminho
import PopUp from './src/components/PopUp'; // Verifique o caminho para o seu componente PopUp

const App = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    // Solicitar permissão para receber notificações (iOS)
    if (Platform.OS === 'ios') {
      messaging().requestPermission();
    }

    // Obtém o token do dispositivo para receber notificações
    messaging()
      .getToken()
      .then(token => {
        console.log('FCM Token:', token);
        // Enviar esse token para o seu servidor para futuras notificações
      });

    // Configura o handler para notificações em primeiro plano
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      // Quando uma mensagem é recebida, exibe o pop-up
      setDialogMessage(remoteMessage.notification.body || 'Uma queda foi detectada!');
      setIsDialogVisible(true);
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  const handleDialogClose = () => {
    setIsDialogVisible(false);
  };

  return (
    <NavigationContainer>
      <Route />
      <PopUp visible={isDialogVisible} onClose={handleDialogClose} message={dialogMessage} />
    </NavigationContainer>
  );
};

export default App;
