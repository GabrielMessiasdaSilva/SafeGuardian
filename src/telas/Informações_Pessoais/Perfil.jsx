import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../Services/FirebaseConnection";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from '../../contexts/UserContext';

const { height } = Dimensions.get("window");

// --- 🎨 Paleta Otimizada para UI/UX Médica ---
const COLORS = {
  BACKGROUND: "#1A1A2E",
  CARD_BACKGROUND: "#2C2C44",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#9090A0",
  ACCENT_BLUE: "#2196F3",
  DANGER_RED: "#F44336",
  GRADIENT_START: "#2196F3",
  GRADIENT_END: "#0D47A1",
};

export default function Perfil() {
  const { signInUser, signOutUser } = useUser();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    idade: "",
    responsavel: "",
    problemasSaude: "", // 💡 NOVO CAMPO
  });

  useEffect(() => {
    const verificarCadastroExistente = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const parsed = JSON.parse(userData);
          // 💡 Garantir que o novo campo exista ao carregar dados antigos
          const initialData = {
            ...parsed,
            problemasSaude: parsed.problemasSaude || "",
          };
          setUsuario(initialData);
          setFormData(initialData);
          signInUser(initialData);
        }
        setMostrarFormulario(!userData);
      } catch (error) {
        console.error("Erro ao verificar cadastro existente:", error);
      } finally {
        setIsLoading(false);
      }
    };
    verificarCadastroExistente();
  }, []);

  // 💡 FUNÇÃO DE MÁSCARA DE TELEFONE
  const applyPhoneMask = (value) => {
    // Remove tudo que não for dígito
    value = value.replace(/\D/g, "");

    // Aplica a máscara (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
    if (value.length > 10) {
      // Máscara para 9 dígitos (celular)
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length > 2) {
      // Máscara para 8 dígitos (fixo)
      value = value.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length > 0) {
      value = value.replace(/^(\d{2}).*/, "($1)");
    }

    return value;
  };

  const salvarCadastroNoFirestore = async (userData) => {
    try {
      const docRef = await addDoc(collection(db, "usuarios"), userData);
      const userDataWithId = { ...userData, id: docRef.id };

      await AsyncStorage.setItem("user_data", JSON.stringify(userDataWithId));
      signInUser(userDataWithId);

      setUsuario(userDataWithId);
      setMostrarFormulario(false);
      Alert.alert("Sucesso", "Cadastro salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar dados no Firestore: ", error);
      Alert.alert("Erro", "Não foi possível salvar os dados. Verifique a conexão e permissões do Firebase.");
    }
  };

  const editarPerfil = async (userId, userData) => {
    try {
      const userDocRef = doc(db, "usuarios", userId);
      await updateDoc(userDocRef, userData);

      const updatedUser = { id: userId, ...usuario, ...userData };

      await AsyncStorage.setItem("user_data", JSON.stringify(updatedUser));
      signInUser(updatedUser);

      setUsuario(updatedUser);
      setMostrarFormulario(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados no Firestore:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil. Verifique a conexão e permissões do Firebase.");
    }
  };

  const excluirPerfil = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir todos os dados do perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // 💡 Poderia incluir aqui a exclusão no Firestore com deleteDoc(doc(db, "usuarios", usuario.id));
              await AsyncStorage.removeItem("user_data");
              signOutUser();

              setUsuario(null);
              setFormData({ nome: "", telefone: "", endereco: "", idade: "", responsavel: "", problemasSaude: "" });
              setMostrarFormulario(true);
              Alert.alert("Excluído", "Seu perfil foi removido com sucesso.");
            } catch (error) {
              console.error("Erro ao excluir cadastro:", error);
              Alert.alert("Erro", "Não foi possível excluir o perfil.");
            }
          },
        },
      ]
    );
  };

  // 💡 MUDANÇA NO MANUSEIO DE ALTERAÇÃO PARA APLICAR MÁSCARA E VALIDAÇÕES
  const handleChange = (field, value) => {
    if (field === 'telefone') {
      const maskedValue = applyPhoneMask(value);
      setFormData({ ...formData, [field]: maskedValue });
    } else if (field === 'idade') {
      // 🚨 MUDANÇA 1: Garante que a idade é apenas numérica e limita a 3 dígitos
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3); 
      setFormData({ ...formData, [field]: numericValue });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // 💡 VALIDAÇÕES DE SUBMISSÃO
  const validateForm = () => {
    if (!formData.nome || formData.nome.length < 3) {
      Alert.alert("Atenção", "O campo Nome é obrigatório e deve ter no mínimo 3 caracteres.");
      return false;
    }

    // Telefone: verifica se o formato é (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!formData.telefone || !phoneRegex.test(formData.telefone)) {
      Alert.alert("Atenção", "O campo Telefone é obrigatório e precisa ser um número válido (ex: (XX) XXXX-XXXX).");
      return false;
    }

    // Endereço: Mínimo de 5 caracteres
    if (!formData.endereco || formData.endereco.length < 5) {
      Alert.alert("Atenção", "O campo Endereço é obrigatório e deve ter no mínimo 5 caracteres.");
      return false;
    }

    // 🚨 MUDANÇA 2: Idade: Entre 1 e 120 (Bloqueia mais que 120)
    const idadeNum = parseInt(formData.idade, 10);
    if (isNaN(idadeNum) || idadeNum < 1 || idadeNum > 120) {
      Alert.alert("Atenção", "A Idade é obrigatória e deve ser um valor entre 1 e 120 anos.");
      return false;
    }

    return true;
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (usuario?.id) {
      editarPerfil(usuario.id, formData);
    } else {
      salvarCadastroNoFirestore(formData);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.ACCENT_BLUE} />
        <Text style={{ color: COLORS.TEXT_PRIMARY, marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  // --- Funções de Renderização (Mantidas) ---
  const renderInput = (iconName, placeholder, field, keyboardType = 'default', multiline = false) => (
    <View style={styles.inputGroup}>
      <Ionicons name={iconName} size={20} color={COLORS.TEXT_SECONDARY} />
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        keyboardType={keyboardType}
        value={formData[field]}
        onChangeText={(text) => handleChange(field, text)}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  const renderInfo = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Não informado"}</Text>
    </View>
  );

  const renderLongInfo = (label, value) => (
    <View style={styles.infoBlock}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valueBlock}>{value || "Nenhum problema de saúde relevante foi informado."}</Text>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.GRADIENT_START} />

      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Ionicons name="shield-checkmark" size={40} color={COLORS.TEXT_PRIMARY} />
          <Text style={styles.headerTitle}>Dados de Segurança</Text>
          <Text style={styles.headerSubtitle}>
            Seu perfil é a chave para a sua segurança.
          </Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>
            {mostrarFormulario ? "Edição de Perfil" : "Informações Pessoais"}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {mostrarFormulario ? "Preencha seus dados:" : "Detalhes registrados no sistema."}
          </Text>
        </View>


        {mostrarFormulario ? (
          // --- FORMULÁRIO (Edição/Cadastro) ---
          <View style={styles.card}>
            {renderInput("person-outline", "Nome completo*", "nome")}
            {renderInput("call-outline", "Telefone*", "telefone", "phone-pad")}
            {renderInput("home-outline", "Endereço*", "endereco")}
            {renderInput("calendar-outline", "Idade (1 a 120)*", "idade", "numeric")}
            {renderInput("people-outline", "Nome do Responsável", "responsavel")}

            {/* 💡 NOVO CAMPO: PROBLEMAS DE SAÚDE */}
            <Text style={styles.tipText}>
                Problemas de Saúde: (Ex: Labirintite, Diabetes, Medicamentos)
            </Text>
            {renderInput("medical-outline", "Informe problemas ou condições que aumentam o risco de queda...", "problemasSaude", 'default', true)}


            {/* Botão Salvar/Atualizar (com gradiente) */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <LinearGradient
                colors={[COLORS.ACCENT_BLUE, COLORS.GRADIENT_END]}
                style={styles.gradientButton}
              >
                <Text style={styles.saveButtonText}>
                  {usuario?.id ? "Atualizar Perfil" : "Salvar Cadastro"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Botão Cancelar (simples) */}
            {usuario?.id && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setMostrarFormulario(false);
                  setFormData(usuario);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar Edição</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // --- MODO VISUALIZAÇÃO ---
          <View style={styles.card}>
            {renderInfo("Nome", usuario?.nome)}
            {renderInfo("Telefone", usuario?.telefone)}
            {renderInfo("Endereço", usuario?.endereco)}
            {renderInfo("Idade", usuario?.idade)}
            {renderInfo("Responsável", usuario?.responsavel)}

            {/* 💡 NOVO: Exibe a lista de problemas */}
            {renderLongInfo("Problemas de Saúde", usuario?.problemasSaude)}

            <View style={styles.buttonContainer}>
              {/* Botão Editar */}
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: COLORS.ACCENT_BLUE }]}
                onPress={() => setMostrarFormulario(true)}
              >
                <Text style={styles.smallButtonText}>Editar</Text>
              </TouchableOpacity>

              {/* Botão Excluir */}
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: COLORS.DANGER_RED }]}
                onPress={excluirPerfil}
              >
                <Text style={styles.smallButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
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
  profileSection: {
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 5,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: COLORS.CARD_BACKGROUND,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  tipText: { // 💡 Estilo para a dica do campo Problemas de Saúde
    fontSize: 13,
    color: COLORS.ACCENT_BLUE,
    marginBottom: 5,
    marginTop: 10,
    paddingLeft: 5,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "flex-start", // Ajustado para multiline
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 0,
    // Garante alinhamento quando não é multiline
    minHeight: Platform.OS === 'ios' ? 20 : 0
  },
  inputMultiline: { // 💡 Estilo para o TextInput multiline
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  saveButton: {
    marginTop: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '600'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  label: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    flex: 2,
    textAlign: 'right',
  },
  infoBlock: { // 💡 Novo estilo para o bloco de Problemas de Saúde (multilinha)
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  valueBlock: { // 💡 Novo estilo para o valor do bloco de problemas
    fontWeight: "500",
    color: COLORS.TEXT_PRIMARY,
    fontSize: 15,
    marginTop: 5,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#444'
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "bold",
    fontSize: 15,
  },
});