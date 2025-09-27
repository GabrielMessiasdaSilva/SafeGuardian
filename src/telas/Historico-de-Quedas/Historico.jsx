import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { db, realTimeDb } from "../../Services/FirebaseConnection";
import { collection, onSnapshot } from "firebase/firestore";
import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const severityColors = {
  leve: "#4CAF50",
  moderada: "#FF9800",
  grave: "#F44336",
};

const QuedaAlert = () => {
  const [fontsLoaded] = useFonts({
    "Gagalin-Regular": require("../../../assets/fonts/Gagalin-Regular.ttf"),
  });

  const [perfil, setPerfil] = useState([]);
  const [quedas, setQuedas] = useState([]);

  const fetchRealtimeData = () => {
    const reference = ref(realTimeDb, "Dispositivo/SafeGuardian/Quedas");
    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      const lista = val
        ? Object.entries(val).map(([id, queda]) => ({ id, ...queda }))
        : [];
      const ordenado = lista.sort(
        (a, b) => new Date(b.data + " " + b.hora) - new Date(a.data + " " + a.hora)
      );
      setQuedas(ordenado);
    });
    return () => unsubscribe();
  };

  const fetchFirestoreData = () => {
    const reference = collection(db, "usuarios");
    const unsubscribe = onSnapshot(reference, (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPerfil(dados);
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    fetchRealtimeData();
    fetchFirestoreData();
  }, []);

  const formatarDataHora = (data, hora) => {
    if (!data || !hora) return "Data não informada";
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(`${data} ${hora}`));
    } catch {
      return `${data} ${hora}`;
    }
  };

  const getSeverity = (queda) => {
    // Exemplo: definir severidade por algum campo, ou aleatório para demonstração
    if (queda.nivel === "grave") return "grave";
    if (queda.nivel === "moderada") return "moderada";
    return "leve";
  };

  if (!fontsLoaded) {
    return (
      <ActivityIndicator size="large" color="#2E4A8F" style={styles.loading} />
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="history" size={28} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Histórico de Quedas</Text>
        <Text style={styles.headerSub}>
          {quedas.length} registro{quedas.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {quedas.length > 0 ? (
          quedas.map((queda, index) => {
            const severity = getSeverity(queda);
            return (
              <View key={queda.id} style={styles.quedaCard}>
                {/* Linha lateral */}
                <View
                  style={[
                    styles.timelineIndicator,
                    { backgroundColor: severityColors[severity] },
                  ]}
                />

                <View style={styles.cardContent}>
                  <Text style={styles.dateTime}>
                    {formatarDataHora(queda.data, queda.hora)}
                  </Text>

                  <Text style={styles.label}>
                    Paciente: <Text style={styles.value}>{perfil[0]?.nome || "Não informado"}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Contato: <Text style={styles.value}>{perfil[0]?.telefone || "(11) 12345-6789"}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Endereço: <Text style={styles.value}>{perfil[0]?.endereco || "Não informado"}</Text>
                  </Text>

                  <View style={[styles.severityBadge, { backgroundColor: severityColors[severity] }]}>
                    <Text style={styles.severityText}>{severity.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.noQuedasContainer}>
            <Text style={styles.noQuedasText}>Nenhum registro de quedas</Text>
            <Text style={styles.subMessage}>
              Até o momento não foram detectados incidentes. Continue tranquilo. 💙
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E2F" },
  header: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#2A2C31",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "column",
    alignItems: "flex-start",
    elevation: 6,
    marginBottom: 16,
  },
  headerTitle: { fontSize: 24, fontFamily: "Gagalin-Regular", color: "#FFFFFF", marginTop: 4 },
  headerSub: { fontSize: 14, color: "#CCCCCC", marginTop: 2 },
  scrollViewContent: { paddingHorizontal: 16, paddingBottom: 40 },

  quedaCard: {
    flexDirection: "row",
    backgroundColor: "#2A2C31",
    borderRadius: 20,
    marginBottom: 16,
    elevation: 5,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  timelineIndicator: {
    width: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  dateTime: { fontSize: 16, color: "#4CAF50", fontWeight: "bold", marginBottom: 8 },
  label: { fontSize: 15, color: "#FFFFFF", marginBottom: 4 },
  value: { fontWeight: "600", color: "#CCCCCC" },
  severityBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 12 },
  loading: { marginTop: 50 },
  noQuedasContainer: { alignItems: "center", marginTop: 80, paddingHorizontal: 20 },
  noQuedasText: { fontSize: 18, fontWeight: "bold", color: "#4CAF50" },
  subMessage: { fontSize: 14, color: "#CCCCCC", marginTop: 10, textAlign: "center" },
});

export default QuedaAlert;
