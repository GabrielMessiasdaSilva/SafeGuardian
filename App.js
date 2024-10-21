import React, { useEffect, useState } from 'react';
import Route from './src/routes'; // Verifique o caminho
import SplashScreen from './src/telas/Home/Splash_Screen';
import QuedaSonoro from './src/components/Queda/QuedaSonoro';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 3000); 
    return () => clearTimeout(timer); 
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? <SplashScreen /> : <Route />}

      <QuedaSonoro></QuedaSonoro>
    </NavigationContainer>
  );
};

export default App;
