import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../Services/FirebaseConnection";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function Perfil() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    idade: "",
    responsavel: "",
  });

  useEffect(() => {
    const verificarCadastroExistente = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const parsed = JSON.parse(userData);
          setUsuario(parsed);
          setMostrarFormulario(false);
          setFormData(parsed);
        } else {
          setMostrarFormulario(true);
        }
      } catch (error) {
        console.error("Erro ao verificar cadastro existente:", error);
      }
    };
    verificarCadastroExistente();
  }, []);

  const salvarCadastroNoFirestore = async (userData) => {
    try {
      const docRef = await addDoc(collection(db, "usuarios"), userData);
      userData.id = docRef.id;
      await AsyncStorage.setItem("user_data", JSON.stringify(userData));
      setUsuario(userData);
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar dados no Firestore: ", error);
    }
  };

  const editarPerfil = async (userId, userData) => {
    try {
      const userRef = doc(db, "usuarios", userId);
      await updateDoc(userRef, userData);
      setUsuario((prevUsuario) => ({ ...prevUsuario, ...userData }));
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao atualizar dados no Firestore:", error);
    }
  };

  const excluirPerfil = async () => {
    try {
      await AsyncStorage.removeItem("user_data");
      setUsuario(null);
      setFormData({
        nome: "",
        telefone: "",
        endereco: "",
        idade: "",
        responsavel: "",
      });
      setMostrarFormulario(true);
    } catch (error) {
      console.error("Erro ao excluir cadastro:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (usuario?.id) {
      editarPerfil(usuario.id, formData);
    } else {
      salvarCadastroNoFirestore(formData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={38} color="#FFF" />
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mostrarFormulario || !usuario ? (
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Cadastro do Usuário</Text>

            <View style={styles.inputGroup}>
              <Ionicons name="person-outline" size={18} color="#AAA" />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#888"
                value={formData.nome}
                onChangeText={(text) => handleChange("nome", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="call-outline" size={18} color="#AAA" />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                keyboardType="phone-pad"
                placeholderTextColor="#888"
                value={formData.telefone}
                onChangeText={(text) => handleChange("telefone", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="home-outline" size={18} color="#AAA" />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                placeholderTextColor="#888"
                value={formData.endereco}
                onChangeText={(text) => handleChange("endereco", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="calendar-outline" size={18} color="#AAA" />
              <TextInput
                style={styles.input}
                placeholder="Idade"
                keyboardType="numeric"
                placeholderTextColor="#888"
                value={formData.idade}
                onChangeText={(text) => handleChange("idade", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="people-outline" size={18} color="#AAA" />
              <TextInput
                style={styles.input}
                placeholder="Responsável"
                placeholderTextColor="#888"
                value={formData.responsavel}
                onChangeText={(text) => handleChange("responsavel", text)}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <Text style={styles.label}>
              Nome: <Text style={styles.value}>{usuario?.nome}</Text>
            </Text>
            <Text style={styles.label}>
              Telefone: <Text style={styles.value}>{usuario?.telefone}</Text>
            </Text>
            <Text style={styles.label}>
              Endereço: <Text style={styles.value}>{usuario?.endereco}</Text>
            </Text>
            <Text style={styles.label}>
              Idade: <Text style={styles.value}>{usuario?.idade}</Text>
            </Text>
            <Text style={styles.label}>
              Responsável: <Text style={styles.value}>{usuario?.responsavel}</Text>
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setMostrarFormulario(true)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={excluirPerfil}>
                <Text style={styles.buttonText}>Excluir</Text>
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
    backgroundColor: "#1C1E26", // fundo base escuro elegante
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2E4A8F",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    marginLeft: 8,
  },

  scrollContent: { padding: 20 },

  formCard: {
    backgroundColor: "#2A2D3A",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCard: {
    backgroundColor: "#2A2D3A",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9BB5FF",
    marginBottom: 15,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3D4260",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#1F212C",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#FFF",
  },

  saveButton: {
    backgroundColor: "#2E7DFA",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  label: { fontSize: 15, color: "#AAA", marginBottom: 6 },
  value: { fontWeight: "600", color: "#FFF" },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  editButton: {
    backgroundColor: "#3F8CFF",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: "#FF4D4F",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
});
