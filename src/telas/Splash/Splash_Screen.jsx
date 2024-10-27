// src/telas/Home.js
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { useFonts } from 'expo-font'; 

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'Gagalin-Regular': require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../Img/onda1.png')} style={[styles.Onda1, styles.onda1Position]} />
      <Image source={require('../../Img/splash.png')} style={styles.imagemSafe} />
      <Text style={styles.safeText}>Safe <Text style={styles.Guardian}>Guardian</Text></Text>
      <Text style={styles.textInfo}>Garantindo a sua segurança </Text>
      <Image source={require('../../Img/onda2.png')} style={[styles.Onda2, styles.onda2Position]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E2F6C',
    position: 'relative', 
  },
  imagemSafe: {
    width: 250,
    height: 400,
    bottom: height * 0.05,
  },
  Onda1: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  Onda2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  onda1Position: {
    width: 200, 
    height: 500, 
  },
  onda2Position: {
    width: 400, 
    height: 600, 
  },
  safeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    margin: 0,
    bottom: height * 0.07,
    alignSelf: 'center',
    fontFamily: 'Gagalin-Regular', 
  },
  Guardian: {
    color: '#6E85D9',
    fontFamily: 'Gagalin-Regular', 
  },
  textInfo: {
    color: '#EEEEEE',
    fontSize: 17,
    bottom: height * 0.07,

  },
});
