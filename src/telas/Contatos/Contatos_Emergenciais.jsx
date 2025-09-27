import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormularioTelefones from "../../components/Contacts/Forms_Contacts";
import { db } from "../../Services/FirebaseConnection";
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const COLORS = {
  background: "#1C1E26",
  container: "#2E4A8F",
  card: "#2A2D3A",
  accent: "#3F8CFF",
  delete: "#FF4D4F",
  textLight: "#FFFFFF",
  textGray: "#AAA",
  shadow: "#00000033",
};

export default function Telefone() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [telefones, setTelefones] = useState([]);
  const [telefoneSelecionado, setTelefoneSelecionado] = useState(null);

  const validarTelefone = (telefone) => {
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return regex.test(telefone);
  };

  const salvarTelefonesNoAsyncStorage = async (telefones) => {
    try {
      await AsyncStorage.setItem("telefones", JSON.stringify(telefones));
    } catch (error) {
      console.error("Erro ao salvar telefones:", error);
    }
  };

  const recuperarTelefonesDoAsyncStorage = async () => {
    try {
      const telefonesSalvos = await AsyncStorage.getItem("telefones");
      if (telefonesSalvos) {
        const parsed = JSON.parse(telefonesSalvos);
        setTelefones(parsed);
        if (parsed.length > 0) setMostrarFormulario(false);
      }
    } catch (error) {
      console.error("Erro ao recuperar telefones:", error);
    }
  };

  useEffect(() => {
    const colecaoTelefones = collection(db, "Telefones");
    const unsubscribe = onSnapshot(colecaoTelefones, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTelefones(lista);
      salvarTelefonesNoAsyncStorage(lista);
    });
    recuperarTelefonesDoAsyncStorage();
    return () => unsubscribe();
  }, []);

  const adicionarTelefone = async (novoTelefone) => {
    if (!validarTelefone(novoTelefone.telefone1)) {
      alert("Número 1 inválido");
      return;
    }
    try {
      const colecaoTelefones = collection(db, "Telefones");
      await addDoc(colecaoTelefones, novoTelefone);
      setTelefones([...telefones, novoTelefone]);
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
    }
  };

  const atualizarTelefone = async (id, novosDados) => {
    try {
      const referencia = doc(db, "Telefones", id);
      await updateDoc(referencia, novosDados);
      setTelefones(telefones.map(t => t.id === id ? { ...t, ...novosDados } : t));
      setTelefoneSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
    }
  };

  const removerTelefone = async (id) => {
    try {
      const referencia = doc(db, "Telefones", id);
      await deleteDoc(referencia);
      const novos = telefones.filter(t => t.id !== id);
      setTelefones(novos);
      if (novos.length === 0) setMostrarFormulario(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (telefone) => {
    setTelefoneSelecionado(telefone);
    setMostrarFormulario(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Telefone",
      "Deseja realmente excluir este telefone?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => removerTelefone(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Premium */}
      <View style={styles.header}>
        <Ionicons name="call-outline" size={28} color="#FFF" />
        <Text style={styles.headerTitle}>Meus Telefones</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {mostrarFormulario && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Cadastro de Telefone</Text>
              <FormularioTelefones
                adicionarTelefone={adicionarTelefone}
                atualizarTelefone={atualizarTelefone}
                telefonesSelecionados={telefoneSelecionado}
                setMostrarFormulario={setMostrarFormulario}
              />
            </View>
          )}

          {telefones.map((telefone) => (
            <View key={telefone.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="contacts" size={24} color={COLORS.accent} />
                <Text style={styles.cardTitle}>Contato</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.label}>
                  Telefone 1: <Text style={styles.value}>{telefone.telefone1}</Text>
                </Text>
                {telefone.telefone2 && (
                  <Text style={styles.label}>
                    Telefone 2: <Text style={styles.value}>{telefone.telefone2}</Text>
                  </Text>
                )}
                {telefone.telefone3 && (
                  <Text style={styles.label}>
                    Telefone 3: <Text style={styles.value}>{telefone.telefone3}</Text>
                  </Text>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(telefone)}>
                  <Ionicons name="create-outline" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(telefone.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.container,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  headerTitle: { color: COLORS.textLight, fontSize: 24, fontWeight: "700", marginLeft: 10 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.accent, marginBottom: 15 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: COLORS.accent, marginLeft: 8 },
  cardBody: { marginBottom: 15 },
  label: { fontSize: 15, color: COLORS.textGray, marginBottom: 6 },
  value: { color: COLORS.textLight, fontWeight: "600" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.delete,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 6,
  },
  buttonText: { color: COLORS.textLight, fontWeight: "600", marginLeft: 6 },
});

