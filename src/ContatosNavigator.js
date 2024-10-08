// App.js ou Main.js (onde você configura suas navegações)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListaContatos from '../src/components/ListaContatos';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaContatos">
        <Stack.Screen name="ListaContatos" component={ListaContatos} />
        {/* Adicione outros componentes/screens aqui */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
