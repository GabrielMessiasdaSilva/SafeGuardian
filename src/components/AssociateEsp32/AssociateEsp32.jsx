import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { ref, update, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection';

const AssociateEsp32 = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dispositivosNaoAssociados, setDispositivosNaoAssociados] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // Carrega os dados dos usuários e dispositivos
  useEffect(() => {
    fetchUsuarios();
    const dispositivosRef = ref(realTimeDb, '/Dispositivo');
    const unsubscribe = onValue(dispositivosRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Dados dos dispositivos:", data);
      if (data) {
        const dispositivosArray = Object.keys(data).map(key => ({
          id: key,
          userID: data[key].userID || null,
        }));
        console.log("Dispositivos array:", dispositivosArray);
        setDispositivos(dispositivosArray);
        const naoAssociados = dispositivosArray.filter(d => !d.userID);
        console.log("Dispositivos não associados:", naoAssociados);
        setDispositivosNaoAssociados(naoAssociados);
      } else {
        console.log("Nenhum dispositivo encontrado no Realtime Database.");
      }
    });
    return () => unsubscribe();
  }, []);

  // Busca os usuários do Firestore
  const fetchUsuarios = async () => {
    try {
      const usuariosCollection = collection(db, 'usuarios');
      const snapshot = await getDocs(usuariosCollection);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Usuários carregados do Firestore:", data);
      setUsuarios(data);
      // Defina um usuário selecionado, por exemplo, o primeiro da lista, se necessário
      if (data.length > 0) {
        setSelectedUsuario(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários do Firestore:', error);
    }
  };

  // Função para associar um dispositivo a um usuário
  const associarDispositivo = (usuarioId, dispositivoId) => {
    const dispositivosRef = ref(realTimeDb, `/Dispositivo/${dispositivoId}`);
    update(dispositivosRef, { userID: usuarioId })
      .then(() => {
        console.log(`Dispositivo ${dispositivoId} associado ao usuário ${usuarioId}`);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Erro ao associar dispositivo:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao associar o dispositivo.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Associar Dispositivo</Text>
      <Text style={styles.subtitle}>Verifique corretamente o número do dispositivo localizado na case</Text>
      {selectedUsuario ? (
        <View style={styles.item}>
          <Text style={styles.itemTitle}>Nome: {selectedUsuario.nome}</Text>
          <Text style={styles.itemText}>Idoso ID: {selectedUsuario.id}</Text>
          {dispositivos.some(d => d.userID === selectedUsuario.id) ? (
            <Text style={styles.itemText}>Você já possui um dispositivo associado.</Text>
          ) : (
            <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Ver Dispositivos Disponíveis</Text>
          </TouchableOpacity>
          
          )}
        </View>
      ) : (
        <Text style={styles.loadingText}> Realize o cadastro na pagina perfil...</Text>
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
                    onPress={() => associarDispositivo(selectedUsuario.id, item.id)}
                  >
                    <Text style={styles.deviceItemText}>Dispositivo ID: {item.id}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.modalText}>Nenhum dispositivo disponível.</Text>
            )}
            <Button
              title="Fechar"
              onPress={() => setModalVisible(false)}
              style={styles.button}
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
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',

    color: '#333',
  },
  subtitle: {
    fontSize: 19,
    fontWeight: 'italic',
    marginBottom: 20,
    color: '#333',
  },
  item: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  button: {
    paddingVertical:10, 
    paddingHorizontal: 5, 
    marginTop: 15, 
    backgroundColor: '#1E2F6C', 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
  },
  
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
  },
  deviceItem: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceItemText: {
    fontSize: 16,
    color: '#666',

  },
});

export default AssociateEsp32;
