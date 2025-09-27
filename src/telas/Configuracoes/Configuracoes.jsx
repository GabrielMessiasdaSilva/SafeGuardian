import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  Switch, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  Share 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const Configuracoes = () => {
  const [notificacoes, setNotificacoes] = useState(true);

  const toggleNotificacoes = () => setNotificacoes(previous => !previous);

  const abrirPermissoes = () => {
    Alert.alert(
      'Permissões',
      'Esta opção abriria as configurações de permissões do app.'
    );
  };

  const compartilharApp = async () => {
    try {
      await Share.share({
        message: 'Conheça o Safe Guardian, um app de segurança para idosos!',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao compartilhar');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}>Configurações</Text>

      {/* Seção Notificações */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Ionicons name="notifications-outline" size={24} color="#2E4A8F" />
          <Text style={styles.sectionTitle}>Notificações</Text>
          <Switch
            value={notificacoes}
            onValueChange={toggleNotificacoes}
            trackColor={{ false: '#767577', true: '#2E4A8F' }}
            thumbColor={Platform.OS === 'android' ? (notificacoes ? '#2E4A8F' : '#f4f3f4') : undefined}
          />
        </View>
        <Text style={styles.sectionSub}>Ative ou desative alertas do aplicativo</Text>
      </View>

      {/* Seção Permissões */}
      <View style={styles.section}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="shield-check-outline" size={24} color="#2E4A8F" />
          <Text style={styles.sectionTitle}>Permissões</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={abrirPermissoes}>
          <Text style={styles.buttonText}>Abrir Configurações</Text>
        </TouchableOpacity>
      </View>

      {/* Seção Compartilhar */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Ionicons name="share-social-outline" size={24} color="#2E4A8F" />
          <Text style={styles.sectionTitle}>Compartilhar App</Text>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={compartilharApp}>
          <Text style={styles.buttonText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Safe Guardian v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2F',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#2A2C31',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  sectionSub: {
    fontSize: 14,
    color: '#CCCCCC',
    marginLeft: 36,
  },
  button: {
    backgroundColor: '#2E4A8F',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#888888',
    fontSize: 14,
  },
});

export default Configuracoes;
