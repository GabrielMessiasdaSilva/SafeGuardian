import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { db } from '../../Services/FirebaseConnection'; // Importe a configuração do Firebase
import { collection, getDocs } from 'firebase/firestore';
import FormularioContato from '../../components/FormularioContato';
import ListaContatos from '../../components/ListaContatos';

export default function App() {
  const [contatos, setContatos] = useState([]);
  const [mostrarListaContatos, setMostrarListaContatos] = useState(false);

  useEffect(() => {
    const buscarContatos = async () => {
      const querySnapshot = await getDocs(collection(db, 'contatos'));
      const listaContatos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContatos(listaContatos);
    };

    buscarContatos();
  }, []);

  return (
    <ImageBackground
      source={require('../../Img/fundo_Teste.png')}
      style={styles.background}
    >
      <View style={styles.content}>
        <FormularioContato setContatos={setContatos} setMostrarListaContatos={setMostrarListaContatos} />
        {mostrarListaContatos && <ListaContatos contatos={contatos} setContatos={setContatos} />}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
