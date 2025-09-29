import React, { useEffect, useState, useCallback } from 'react';
import Rota from './src/routes';
import TelaSplash from './src/telas/Splash/Splash_Screen';
import QuedaSonoro from './src/components/Queda/QuedaSonoro';
import PushNotification from './src/components/PushNotification/PushNotification';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CarrosselOnboarding from './src/components/OnboardingCarousel/OnboardingCarousel'; 
// 💡 Importa o UserProvider para envolver o app e disponibilizar o contexto
import { UserProvider } from './src/contexts/UserContext'; 

// Previne o ocultamento automático do splash screen nativo
// É importante chamar esta função no início do seu App.js
SplashScreen.preventAutoHideAsync(); 

const App = () => {
  const [carregando, setCarregando] = useState(true);
  const [mostrarOnboarding, setMostrarOnboarding] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Verifica status do Onboarding
        const accepted = await AsyncStorage.getItem('termsAccepted');
        // Se accepted for 'true', mostrarOnboarding será false
        setMostrarOnboarding(!accepted); 

      } catch (e) {
        console.warn(e);
      } finally {
        // 2. Oculta o SplashScreen nativo após um pequeno delay para garantir a renderização inicial
        setTimeout(async () => {
          await SplashScreen.hideAsync();
          setCarregando(false);
        }, 2000); 
      }
    };

    initializeApp();
  }, []);

  const concluirOnboarding = async () => {
    // Salva que o onboarding foi aceito, usando 'true' como string
    await AsyncStorage.setItem('termsAccepted', 'true'); 
    setMostrarOnboarding(false);
  };

  // Se 'carregando' (que inclui o tempo do setTimeout) for true, mostra a tela de Splash
  if (carregando) {
    return <TelaSplash />;
  }

  return (
    <NavigationContainer>
      <UserProvider>
        {mostrarOnboarding ? (
          <CarrosselOnboarding onComplete={concluirOnboarding} />
        ) : (
          <Rota /> // Rota principal (Tab Navigator)
        )}
      </UserProvider>
      {/* Componentes globais que precisam rodar em segundo plano */}
      <PushNotification />
      <QuedaSonoro />
    </NavigationContainer>
  );
};

export default App;
