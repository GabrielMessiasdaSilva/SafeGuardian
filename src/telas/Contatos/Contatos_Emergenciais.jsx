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
  ActivityIndicator, // Adicionado para indicar carregamento
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormularioTelefones from "../../components/Contacts/Forms_Contacts";
// Importações de Firebase e Ícones mantidas
import { db } from "../../Services/FirebaseConnection";
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // 👈 Importado

const { height } = Dimensions.get("window");

// --- 🎨 Paleta Otimizada para Consistência (Tema Escuro/Médico) ---
const COLORS = {
  BACKGROUND: "#1A1A2E", // Fundo principal
  CARD_BACKGROUND: "#2C2C44", // Fundo dos cartões
  TEXT_PRIMARY: "#FFFFFF", // Textos principais
  TEXT_SECONDARY: "#9090A0", // Textos auxiliares/labels
  ACCENT_BLUE: "#2196F3", // Azul principal (Editar/Adicionar)
  DANGER_RED: "#F44336", // Vermelho para exclusão
  GRADIENT_START: "#2196F3", // Cor inicial do gradiente
  GRADIENT_END: "#0D47A1", // Cor final do gradiente
};


export default function Telefone() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Mudado para false se houver dados
  const [telefones, setTelefones] = useState([]);
  const [telefoneSelecionado, setTelefoneSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Novo estado de carregamento

  // --- Lógica de Firebase e AsyncStorage (Mantida) ---

  const validarTelefone = (telefone) => {
    // Regex de validação mantida
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
        // Exibe o formulário se a lista estiver vazia.
        setMostrarFormulario(parsed.length === 0);
      } else {
        setMostrarFormulario(true); // Exibe se não houver nada salvo
      }
    } catch (error) {
      console.error("Erro ao recuperar telefones:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    const colecaoTelefones = collection(db, "Telefones");
    const unsubscribe = onSnapshot(colecaoTelefones, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTelefones(lista);
      salvarTelefonesNoAsyncStorage(lista);
      // Atualiza o estado do formulário se a lista for alterada
      setMostrarFormulario(lista.length === 0);
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
      // O onSnapshot cuidará da atualização do state, mas adicionamos para feedback imediato
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível adicionar o contato.");
    }
  };

  const atualizarTelefone = async (id, novosDados) => {
    try {
      const referencia = doc(db, "Telefones", id);
      await updateDoc(referencia, novosDados);
      setTelefoneSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o contato.");
    }
  };

  const removerTelefone = async (id) => {
    try {
      const referencia = doc(db, "Telefones", id);
      await deleteDoc(referencia);
      // O onSnapshot cuidará da atualização da lista
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível remover o contato.");
    }
  };

  const handleEdit = (telefone) => {
    setTelefoneSelecionado(telefone);
    setMostrarFormulario(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Contato",
      "Deseja realmente excluir este contato de emergência?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => removerTelefone(id) },
      ]
    );
  };
  
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.ACCENT_BLUE} />
      </View>
    );
  }

  // Componente do Card de Telefone
  const TelefoneCard = ({ telefone }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <MaterialIcons name="security" size={24} color={COLORS.ACCENT_BLUE} />
            <Text style={styles.cardTitle}>Contato de Emergência</Text>
        </View>

        <View style={styles.cardBody}>
            {/* Linha 1 */}
            <View style={styles.infoRow}>
                <Text style={styles.label}>
                    <Ionicons name="call-outline" size={15} color={COLORS.TEXT_SECONDARY} />
                    {" "}Tel. Principal:
                </Text>
                <Text style={styles.value}>{telefone.telefone1}</Text>
            </View>

            {/* Linha 2 e 3 (Opcional) */}
            {telefone.telefone2 && (
                <View style={styles.infoRow}>
                    <Text style={styles.label}>
                        <Ionicons name="call-outline" size={15} color={COLORS.TEXT_SECONDARY} />
                        {" "}Tel. Secundário:
                    </Text>
                    <Text style={styles.value}>{telefone.telefone2}</Text>
                </View>
            )}
             {telefone.telefone3 && (
                <View style={styles.infoRow}>
                    <Text style={styles.label}>
                        <Ionicons name="call-outline" size={15} color={COLORS.TEXT_SECONDARY} />
                        {" "}Tel. Adicional:
                    </Text>
                    <Text style={styles.value}>{telefone.telefone3}</Text>
                </View>
            )}
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(telefone)}>
                <Ionicons name="create-outline" size={20} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(telefone.id)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.GRADIENT_START} />

      {/* 💡 Header Visual com Gradiente (Igual ao Perfil) */}
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Ionicons name="people-circle-outline" size={40} color={COLORS.TEXT_PRIMARY} />
          <Text style={styles.headerTitle}>Contatos de Emergência</Text>
          <Text style={styles.headerSubtitle}>
            Esses contatos serão notificados em caso de queda.
          </Text>
        </View>
      </LinearGradient>


      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0} 
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* 💡 Botão Adicionar (só aparece se o formulário estiver oculto) */}
            {!mostrarFormulario && (
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => {
                        setTelefoneSelecionado(null);
                        setMostrarFormulario(true);
                    }}
                >
                    <Ionicons name="add-circle" size={24} color={COLORS.ACCENT_BLUE} />
                    <Text style={styles.addButtonText}>Adicionar Novo Contato</Text>
                </TouchableOpacity>
            )}

            {/* 💡 Formulário de Cadastro/Edição */}
            {mostrarFormulario && (
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>
                        {telefoneSelecionado ? "Editar Contato" : "Novo Contato"}
                    </Text>
                    {/* O componente FormularioTelefones deve ser ajustado para ter o estilo visual dark mode */}
                    <FormularioTelefones
                        adicionarTelefone={adicionarTelefone}
                        atualizarTelefone={atualizarTelefone}
                        telefonesSelecionados={telefoneSelecionado}
                        setMostrarFormulario={setMostrarFormulario}
                    />
                </View>
            )}

            {/* 💡 Lista de Contatos */}
            {telefones.length > 0 && (
                <View style={styles.listSection}>
                    {!mostrarFormulario && <Text style={styles.listTitle}>Contatos Ativos ({telefones.length})</Text>}
                    {telefones.map((telefone) => (
                        <TelefoneCard key={telefone.id} telefone={telefone} />
                    ))}
                </View>
            )}

            {telefones.length === 0 && !mostrarFormulario && (
                <View style={styles.emptyState}>
                    <Ionicons name="information-circle-outline" size={40} color={COLORS.TEXT_SECONDARY} />
                    <Text style={styles.emptyStateText}>
                        Nenhum contato cadastrado. Adicione um contato para notificação de emergência.
                    </Text>
                </View>
            )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.BACKGROUND 
  },
  // 💡 Novo Estilo: Header com Gradiente
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 25,
    borderBottomLeftRadius: 30, // Borda curva para quebrar o visual quadrado
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    marginTop: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    opacity: 0.8,
    marginTop: 4,
  },
  
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 80, 
  },
  
  // 💡 Botão Adicionar Novo Contato
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.ACCENT_BLUE,
    shadowColor: COLORS.ACCENT_BLUE,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  addButtonText: {
    color: COLORS.ACCENT_BLUE,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },

  // 💡 Formulário
  formCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: COLORS.ACCENT_BLUE, 
    marginBottom: 15 
  },
  
  // 💡 Lista
  listSection: {
    marginTop: 10,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 10,
    marginLeft: 5,
  },
  
  // 💡 Card de Contato
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: COLORS.TEXT_PRIMARY, // Título do contato mais evidente
    marginLeft: 10 
  },
  cardBody: { 
    // Removido marginBottom
  },
  
  // 💡 Linha de Informação
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: { 
    fontSize: 14, 
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
    alignSelf: 'flex-start',
  },
  value: { 
    color: COLORS.TEXT_PRIMARY, 
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },

  // 💡 Botões de Ação
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.ACCENT_BLUE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.DANGER_RED,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 6,
  },
  buttonText: { 
    color: COLORS.TEXT_PRIMARY, 
    fontWeight: "700", 
    fontSize: 14,
  },
  // 💡 Estado Vazio
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 15,
  },
  emptyStateText: {
    marginTop: 15,
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
  }
});