// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet,View,Text } from 'react-native';
import Home from './src/telas/Home';



const App = () => {
  return (
    <View style={styles.header}>
      <Home />

    </View>
    
  );
};








const styles = StyleSheet.create({
    header: {
      flex: 5,
  
    }   });
export default App;
