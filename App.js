import React, { useEffect, useState, useCallback } from 'react';
import Rota from './src/routes';
import TelaSplash from './src/telas/Splash/Splash_Screen';
import QuedaSonoro from './src/components/Queda/QuedaSonoro';
import CarrosselOnboarding from './src/components/OnboardingCarousel/OnboardingCarousel';
import PushNotification from './src/components/PushNotification/PushNotification';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [carregando, setCarregando] = useState(true);
  const [mostrarOnboarding, setMostrarOnboarding] = useState(true);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setCarregando(false);
    }, 6000);

    return () => clearTimeout(temporizador);
  }, []);

  const concluirOnboarding = () => {
    setMostrarOnboarding(false);
  };


  const onLayoutRootView = useCallback(async () => {
    if (!carregando && !mostrarOnboarding) {
      await SplashScreen.hideAsync();
    }
  }, [carregando, mostrarOnboarding]);

  useEffect(() => {
    onLayoutRootView();
  }, [carregando, mostrarOnboarding, onLayoutRootView]);

  if (carregando) {
    return <TelaSplash />;
  }

  return (
    <NavigationContainer onLayout={onLayoutRootView}>
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
