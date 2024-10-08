// ListaContatos.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, Text } from 'react-native';
import { db } from '../Services/FirebaseConnection';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import FormularioContato from './FormularioContato';

const ListaContatos = ({ navigation }) => {
  const [contatos, setContatos] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [contatoEmEdicao, setContatoEmEdicao] = useState(null);

  const fetchContatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const contatosArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContatos(contatosArray);
    } catch (error) {
      console.error("Erro ao buscar contatos: ", error);
    }
  };
  

  useEffect(() => {
    fetchContatos();
  }, []);

  const handleEdit = (contato) => {
    setContatoEmEdicao(contato);
    setMostrarLista(false); // Esconde a lista para mostrar o formulário
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', id));
    fetchContatos(); // Atualiza a lista após a exclusão
  };

  const handleVoltar = () => {
    setMostrarLista(true);
    setContatoEmEdicao(null);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {mostrarLista ? (
        <View>
          <FlatList
            data={contatos}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                <Text>{item.nome}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Button title="Editar" onPress={() => handleEdit(item)} />
                  <Button title="Excluir" onPress={() => handleDelete(item.id)} />
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <FormularioContato
          contato={contatoEmEdicao} // Passando contato para o formulário
          navigation={navigation} // Passando a navegação corretamente
        />
      )}
      {/* Botão para voltar à lista, caso esteja no formulário */}
      {!mostrarLista && (
        <Button title="Voltar para a lista" onPress={handleVoltar} />
      )}
    </View>
  );
};

export default ListaContatos;
