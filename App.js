import React, { useEffect, useState, useCallback } from 'react';
import Rota from './src/routes';
import TelaSplash from './src/telas/Splash/Splash_Screen';
import QuedaSonoro from './src/components/Queda/QuedaSonoro';
import PushNotification from './src/components/PushNotification/PushNotification';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CarrosselOnboarding from './src/components/OnboardingCarousel/OnboardingCarousel'; 

const App = () => {
  const [carregando, setCarregando] = useState(true);
  const [mostrarOnboarding, setMostrarOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const accepted = await AsyncStorage.getItem('termsAccepted');
      setMostrarOnboarding(!accepted); // Mostra o onboarding se o usuário não aceitou os termos
    };

    checkOnboardingStatus();
    
    // Oculta o SplashScreen
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
      setCarregando(false);
    };

    hideSplash();
  }, []);

  const concluirOnboarding = async () => {
    await AsyncStorage.setItem('termsAccepted', 'true'); // Salva que o onboarding foi aceito
    setMostrarOnboarding(false);
  };

  if (carregando) {
    return <TelaSplash />;
  }

  return (
    <NavigationContainer>
      {mostrarOnboarding ? (
        <CarrosselOnboarding onComplete={concluirOnboarding} />
      ) : (
        <Rota />
      )}
      <PushNotification />
      <QuedaSonoro />
    </NavigationContainer>
  );
};

export default App;
