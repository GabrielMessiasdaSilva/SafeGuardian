// TermsOfUse.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TermsOfUse = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Termos de Uso</Text>
      <Text style={styles.body}>
        Estes Termos de Uso descrevem as condições para utilização do aplicativo Safe Guardian. Ao utilizar este aplicativo, você concorda com os termos abaixo:
      </Text>
      <Text style={styles.body}>
        1. Aceitação dos Termos: Ao acessar ou usar o aplicativo, você concorda em estar vinculado a estes Termos de Uso.
      </Text>
      <Text style={styles.body}>
        2. Uso do Aplicativo: O aplicativo é destinado ao uso de cuidadores e familiares de idosos. É proibido o uso do aplicativo para qualquer finalidade ilegal.
      </Text>
      <Text style={styles.body}>
        3. Limitação de Responsabilidade: O desenvolvedor do aplicativo não se responsabiliza por quaisquer danos decorrentes do uso do aplicativo.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E2F6C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: '#d1d1d1',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1E2F6C',
    fontSize: 16,
  },
});

export default TermsOfUse;
