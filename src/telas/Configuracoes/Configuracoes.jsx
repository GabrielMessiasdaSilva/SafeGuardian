import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Switch, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  Share, 
  Modal, 
  Linking 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // para navegação

const Configuracoes = () => {
  const navigation = useNavigation();

  const [notificacoes, setNotificacoes] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleNotificacoes = () => setNotificacoes(prev => !prev);

  // Abrir configurações do app no celular
  const abrirPermissoes = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const compartilharApp = async () => {
    try {
      await Share.share({
        message: 'Conheça o Safe Guardian, um app de segurança para idosos!',
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
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

      {/* Seção Termos de Uso */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Ionicons name="document-text-outline" size={24} color="#2E4A8F" />
          <Text style={styles.sectionTitle}>Termos de Uso</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Ver Termos</Text>
        </TouchableOpacity>
      </View>

   
      {/* Modal Termos de Uso */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Termos de Uso</Text>
            <ScrollView>
              <Text style={styles.modalText}>
                Bem-vindo ao Safe Guardian. Ao utilizar este aplicativo, você concorda com os seguintes termos:
                {"\n\n"}1. O app não substitui acompanhamento médico profissional.
                {"\n"}2. Dados coletados são usados para melhorar sua experiência.
                {"\n"}3. O usuário é responsável por manter suas informações atualizadas.
                {"\n\n"}Ao continuar utilizando, você confirma que leu e concorda com os termos.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2A2C31',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
});

export default Configuracoes;
