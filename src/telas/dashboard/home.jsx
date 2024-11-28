import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { ref, update, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection';

const AssociarDispositivoScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dispositivosNaoAssociados, setDispositivosNaoAssociados] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  useEffect(() => {
    // Buscar usuários do Firestore
    const usuariosCollection = collection(db, 'usuarios');
    getDocs(usuariosCollection).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsuarios(data);
    });

    // Buscar dispositivos do Realtime Database
    const dispositivosRef = ref(realTimeDb, '/Dispositivo');
    onValue(dispositivosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dispositivosArray = Object.keys(data).map(key => ({
          id: key,
          userID: data[key].userID || null, // Garantir que userID seja null se não existir
        }));
        setDispositivos(dispositivosArray);

        // Filtrar dispositivos não associados (userID === null)
        const naoAssociados = dispositivosArray.filter(d => !d.userID);
        setDispositivosNaoAssociados(naoAssociados);
      }
    });
  }, []);

  const associarDispositivo = (usuarioID, dispositivoID) => {
    const dispositivoRef = ref(realTimeDb, `/Dispositivo/${dispositivoID}`);

    // Verificar se o usuário já está associado a um dispositivo
    const dispositivoAssociado = dispositivos.find(d => d.userID === usuarioID);
    if (dispositivoAssociado) {
      Alert.alert("Erro", `O usuário já está associado ao dispositivo ${dispositivoAssociado.id}.`);
      return;
    }

    update(dispositivoRef, { userID: usuarioID })
      .then(() => {
        Alert.alert("Sucesso", `Dispositivo ${dispositivoID} associado ao usuário ${usuarioID} com sucesso!`);
        setModalVisible(false);
      })
      .catch((error) => {
        Alert.alert("Erro", `Falha ao associar dispositivo: ${error.message}`);
      });
  };





  return (
    <View style={styles.container}>
      <Text style={styles.title}>Associar Dispositivo</Text>
      <FlatList
        data={usuarios}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const dispositivoAssociado = dispositivos.find(d => d.userID === item.id);

          return (
            <View style={styles.item}>
              <Text>Nome: {item.nome}</Text>
              <Text>Idoso ID: {item.id}</Text>
              {dispositivoAssociado ? (
                <Text>Dispositivo associado: {dispositivoAssociado.id}</Text>
              ) : (
                <Button
                  title="Ver Dispositivos Disponíveis"
                  onPress={() => {
                    setSelectedUsuario(item); // Define o usuário selecionado
                    setModalVisible(true); // Mostra o modal
                  }}
                />
              )}
            </View>
          );
        }}
      />

      {/* Modal para exibir dispositivos disponíveis */}
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
                    <Text>Dispositivo ID: {item.id}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text>Nenhum dispositivo disponível.</Text>
            )}
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deviceItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',

    alignItems: 'center',
  },
});

export default AssociarDispositivoScreen;
