import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, SafeAreaView, StatusBar, ImageBackground, View,Text } from 'react-native';
import Formulario from '../../components/Profiles/FormularioContato';
import Lista from '../../components/Profiles/ListaContatos';
import { db } from '../../Services/FirebaseConnection';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [perfis, setPerfis] = useState([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  const colecaoPerfis = collection(db, 'Perfil');

  useEffect(() => {
    const unsubscribe = onSnapshot(colecaoPerfis, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPerfis(lista);
    }, (error) => {
      console.log("Erro ao buscar perfis:", error);
    });

    return () => unsubscribe();
  }, []);

  const adicionarPerfil = async (novoPerfil) => {
    try {
      await addDoc(colecaoPerfis, novoPerfil);
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao adicionar perfil:", error);
    }
  };

  const atualizarPerfil = async (id, novosDados) => {
    try {
      const referencia = doc(db, 'Perfil', id);
      await updateDoc(referencia, novosDados);
      setPerfilSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
    }
  };

  const removerPerfil = async (id) => {
    try {
      const referencia = doc(db, 'Perfil', id);
      await deleteDoc(referencia);
    } catch (error) {
      console.log("Erro ao remover perfil:", error);
    }
  };

  const handleLongPress = (perfil) => {
    Alert.alert(
      "Ação",
      "O que você deseja fazer?",
      [
        {
          text: "Editar",
          onPress: () => {
            setPerfilSelecionado(perfil);
            setMostrarFormulario(true);
          }
        },
        {
          text: "Excluir",
          onPress: () => removerPerfil(perfil.id),
          style: "destructive"
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    
      <ImageBackground source={require('../../Img/fundo_Teste.png')} resizeMode="cover" style={styles.image}>

        <StatusBar barStyle="dark-content" />
      </ImageBackground>
      <Text style={styles.textinho}>Contatos Emergenciais</Text>
      <View style={styles.formContainer}>
        {mostrarFormulario ? (
          <Formulario
            adicionarPerfil={adicionarPerfil}
            atualizarPerfil={atualizarPerfil}
            perfilSelecionado={perfilSelecionado}
            setMostrarFormulario={setMostrarFormulario}
          />
        ) : (
          <Lista perfis={perfis} onLongPress={handleLongPress} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textinho:{
    fontWeight: 'bold',
      fontSize:28,
      color:"#fff",
      fontFamily: 'Cochin',
      alignSelf:'center',
      top:-350,
  },
  container: {
    flex: 1,
  },
  image: {
    height: '50%', // Ajustado para 50% para criar mais espaço na parte inferior
    width: '100%',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -250, 
    borderTopEndRadius: 30, 
    borderTopStartRadius: 30, 
    padding: 20, 
  },
});
