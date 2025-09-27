import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ref, update, onValue } from 'firebase/database';
import { realTimeDb } from '../../Services/FirebaseConnection';
import { useUser } from '../../contexts/UserContext'; 

// 🎨 Paleta de cores para consistência
const PRIMARY_BLUE = '#1E2F6C'; 
const BACKGROUND_COLOR = '#f0f0f0';
const CARD_COLOR = '#fff';

const AssociateEsp32 = () => {
  // 💡 Obtém o usuário e o status de carregamento do contexto (AsyncStorage é a Source of Truth do Perfil)
  const { currentUser, isLoadingContext } = useUser(); 
  const userId = currentUser?.id;
  
  const [dispositivos, setDispositivos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dispositivosNaoAssociados, setDispositivosNaoAssociados] = useState([]);
  const [isFetchingRTDB, setIsFetchingRTDB] = useState(false); // Para o Realtime Database

  // Carrega os dados dos dispositivos do Realtime Database
  useEffect(() => {
    setIsFetchingRTDB(true);
    // Listener do Realtime Database para dispositivos
    const dispositivosRef = ref(realTimeDb, '/Dispositivo');
    const unsubscribe = onValue(dispositivosRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Dados dos dispositivos:", data);
      if (data) {
        const dispositivosArray = Object.keys(data).map(key => ({
          id: key,
          userID: data[key].userID || null,
        }));
        setDispositivos(dispositivosArray);
        const naoAssociados = dispositivosArray.filter(d => !d.userID);
        setDispositivosNaoAssociados(naoAssociados);
      } else {
        setDispositivos([]);
      }
      setIsFetchingRTDB(false);
    }, (error) => {
      console.error("Erro ao carregar dispositivos do RTDB:", error);
      setIsFetchingRTDB(false);
    });
    return () => unsubscribe();
  }, []); 

  // 💡 REMOVIDO: A função fetchUsuarios foi removida. O status do perfil agora
  // é checado diretamente pelo objeto 'currentUser' do contexto.


  // Função para associar um dispositivo ao usuário logado
  const associarDispositivo = (dispositivoId) => {
    if (!userId) {
      Alert.alert('Atenção', 'Seu perfil não está completo. Por favor, cadastre-se primeiro.');
      return;
    }
    const dispositivosRef = ref(realTimeDb, `/Dispositivo/${dispositivoId}`);
    update(dispositivosRef, { userID: userId })
      .then(() => {
        Alert.alert('Sucesso', `Dispositivo ${dispositivoId} associado ao seu perfil (${currentUser.nome}) com sucesso!`);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Erro ao associar dispositivo:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao associar o dispositivo.');
      });
  };

  // 💡 Novo: Verifica se o cadastro está completo (tem ID e Nome)
  const isProfileComplete = currentUser && currentUser.id && currentUser.nome;

  if (isLoadingContext || isFetchingRTDB) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        <Text style={styles.loadingText}> Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Associar Dispositivo</Text>
      <Text style={styles.subtitle}>Verifique corretamente o número do dispositivo localizado na case</Text>
      
      {isProfileComplete ? ( // 💡 Usa a nova verificação de status do perfil
        <View style={styles.item}>
          {/* 💡 Agora usa diretamente o nome e ID do usuário logado */}
          <Text style={styles.itemTitle}>Nome: {currentUser.nome}</Text>
          <Text style={styles.itemText}>Seu ID: {currentUser.id}</Text>
          
          {dispositivos.some(d => d.userID === currentUser.id) ? (
            <Text style={styles.itemTextSucesso}>✅ Dispositivo já associado.</Text>
          ) : (
            <>
            <Text style={styles.itemTextAlerta}>Nenhum dispositivo associado. Associe um para iniciar o monitoramento.</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Ver Dispositivos Disponíveis</Text>
            </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.item}>
            <Text style={styles.loadingText}> ⚠️ Realize o cadastro completo na página Perfil para associar um dispositivo.</Text>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dispositivos Disponíveis</Text>
            {dispositivosNaoAssociados.length > 0 ? (
              <FlatList
                data={dispositivosNaoAssociados}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.deviceItem}
                    onPress={() => associarDispositivo(item.id)} // 💡 Passa apenas o ID do dispositivo
                  >
                    <Text style={styles.deviceItemText}>Dispositivo ID: {item.id}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.modalText}>Nenhum dispositivo disponível. Verifique se estão ligados.</Text>
            )}
            <Button
              title="Fechar"
              onPress={() => setModalVisible(false)}
              color={PRIMARY_BLUE}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#666',
  },
  item: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: CARD_COLOR,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemText: {
    fontSize: 16,
    color: '#666',
  },
  itemTextSucesso: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemTextAlerta: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    paddingVertical:12, 
    paddingHorizontal: 20, 
    marginTop: 20, 
    backgroundColor: PRIMARY_BLUE, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: 0.5, 
  },
  
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: CARD_COLOR,
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: PRIMARY_BLUE,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  deviceItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_BLUE,
    alignItems: 'center',
  },
  deviceItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default AssociateEsp32;
