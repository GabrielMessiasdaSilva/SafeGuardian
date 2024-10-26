import React, { useEffect, useState } from 'react';
import Route from './src/routes'; // Verifique o caminho
import SplashScreen from './src/telas/Home/Splash_Screen';
import QuedaSonoro from './src/components/Queda/QuedaSonoro';
import OnboardingCarousel from './src/components/OnboardingCarousel/OnboardingCarousel'; 
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 3000); 

    return () => clearTimeout(timer); 
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboarding(false);
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : isOnboarding ? (
        <OnboardingCarousel onComplete={handleOnboardingComplete} /> // Passando a função para o carrossel
      ) : (
        <Route />
      )}

      <QuedaSonoro />
    </NavigationContainer>
  );
};

export default App;
