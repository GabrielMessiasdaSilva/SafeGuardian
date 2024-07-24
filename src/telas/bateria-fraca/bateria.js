import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Bateria() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, this is the Quedas screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
  },
});
