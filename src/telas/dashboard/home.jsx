import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { ref, update, onValue } from 'firebase/database';
import { db, realTimeDb } from '../../Services/FirebaseConnection';

const AssociarDispositivoScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);

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
        setDispositivos(Object.keys(data).map(key => ({
          id: key,
          enderecoMAC: data[key].enderecoMAC,
          userID: data[key].userID, // Campo já existente no dispositivo
          MEC: data[key].MEC,       // Outros campos que não devem ser sobrescritos
          Conectado: data[key].Conectado,
        })));
      }
    });
  }, []);

  const associarDispositivo = (usuarioID, dispositivoID) => {
    // Verificar se o usuário já está associado a algum dispositivo
    const dispositivoAssociado = dispositivos.find(d => d.userID === usuarioID);

    if (dispositivoAssociado) {
      Alert.alert("Erro", `O usuário já está associado ao dispositivo ${dispositivoAssociado.id}.`);
      return;
    }

    // Referência ao dispositivo específico no Realtime Database
    const dispositivoRef = ref(realTimeDb, `/Dispositivo/${dispositivoID}`);
    
    // Obter o dispositivo atual para verificar o campo userID
    const dispositivo = dispositivos.find(d => d.id === dispositivoID);
    
    if (dispositivo && !dispositivo.userID) { // Só atualiza se userID for null
      update(dispositivoRef, { userID: usuarioID })
        .then(() => {
          Alert.alert("Sucesso", `Dispositivo ${dispositivoID} associado ao usuário ${usuarioID} com sucesso!`);
        })
        .catch((error) => {
          Alert.alert("Erro", `Falha ao associar dispositivo: ${error.message}`);
        });
    } else if (dispositivo && dispositivo.userID) {
      Alert.alert("Erro", `O dispositivo ${dispositivoID} já está associado a outro usuário.`);
    } else {
      Alert.alert("Erro", "Dispositivo não encontrado ou não disponível para associação.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Associar Dispositivo</Text>
      <FlatList
        data={usuarios}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Nome: {item.nome}</Text>
            <Text>Idoso ID: {item.id}</Text>
            <Button
              title="Associar com Dispositivo"
              onPress={() => {
                const dispositivoSelecionado = dispositivos.find(d => !d.userID); // Verifica dispositivos não associados
                if (dispositivoSelecionado) {
                  associarDispositivo(item.id, dispositivoSelecionado.id);
                } else {
                  Alert.alert("Erro", "Nenhum dispositivo disponível para associação.");
                }
              }}
            />
          </View>
        )}
      />
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
});

export default AssociarDispositivoScreen;
