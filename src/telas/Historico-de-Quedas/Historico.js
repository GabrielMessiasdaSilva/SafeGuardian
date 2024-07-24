import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Historico() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Historico</Text>
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
