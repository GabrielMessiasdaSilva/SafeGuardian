import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
} from "react-native";
import { ref, onValue } from "firebase/database"; // Realtime DB
import { realTimeDb } from "../../Services/FirebaseConnection";
import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
// 💡 IMPORTANTE: Adicione a importação do contexto
import { useUser } from '../../contexts/UserContext'; 

const { width } = Dimensions.get("window");

// --- 🎨 Paleta Otimizada ---
const COLORS = {
    BACKGROUND: "#1A1A2E",
    CARD_BACKGROUND: "#2C2C44",
    TEXT_PRIMARY: "#FFFFFF",
    TEXT_SECONDARY: "#9090A0",
    ACCENT_BLUE: "#2196F3",
    GRADIENT_START: "#2196F3",
    GRADIENT_END: "#0D47A1",
};

// --- Cores de Severidade Ajustadas ---
const severityColors = {
    leve: COLORS.TEXT_SECONDARY,
    moderada: "#FFC107",
    grave: "#D32F2F",
};

const QuedaAlert = () => {
    // 💡 AJUSTE 1: Obtém currentUser e isLoadingContext do contexto
    const { currentUser, isLoadingContext } = useUser(); 

    const [fontsLoaded] = useFonts({
        "Gagalin-Regular": require("../../../assets/fonts/Gagalin-Regular.ttf"),
    });

    const [quedas, setQuedas] = useState([]);
    const [loading, setLoading] = useState(true); // Loading do Realtime DB

    // --- Função para buscar dados de Quedas (Realtime DB) ---
    const fetchRealtimeData = () => {
        // Se o usuário não está carregado, não tentamos buscar o dado
        if (!currentUser) {
             setLoading(false);
             return;
        }

        // Se você estivesse filtrando por user.id, faria:
        // const reference = ref(realTimeDb, `Dispositivo/SafeGuardian/${currentUser.id}/Quedas`);

        const reference = ref(realTimeDb, "Dispositivo/SafeGuardian/Quedas");
        
        const unsubscribe = onValue(reference, (snapshot) => {
            setLoading(false);
            const val = snapshot.val();
            const lista = val
                ? Object.entries(val).map(([id, queda]) => ({ id, ...queda }))
                : [];
            const ordenado = lista.sort(
                (a, b) => new Date(b.data + " " + b.hora) - new Date(a.data + " " + a.hora)
            );
            setQuedas(ordenado);
        }, 
        (error) => {
            console.error("Erro ao ler Quedas (Realtime DB):", error);
            setLoading(false);
        });
        return () => unsubscribe();
    };

    useEffect(() => {
        // Buscamos os dados de queda assim que o usuário (ou o status dele) for carregado pelo Context.
        if (!isLoadingContext) {
            fetchRealtimeData();
        }
    }, [isLoadingContext, currentUser]); 
    
    // ... (formatarDataHora e getSeverity permanecem os mesmos) ...
    const formatarDataHora = (data, hora) => {
        if (!data || !hora) return "Data não informada";
        try {
          const date = new Date(
            `${data.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")}T${hora}`
          );
          return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date);
        } catch {
          return `${data} ${hora}`;
        }
    };
    
    const getSeverity = (queda) => {
        if (queda.nivel && typeof queda.nivel === "string") {
          const nivel = queda.nivel.toLowerCase();
          if (nivel.includes("grave")) return "grave";
          if (nivel.includes("moderada")) return "moderada";
        }
        return "leve";
    };

    // 💡 AJUSTE 2: Unifica os loadings
    if (!fontsLoaded || loading || isLoadingContext) {
        return (
            <View
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ActivityIndicator size="large" color={COLORS.ACCENT_BLUE} />
                <Text style={{color: COLORS.TEXT_PRIMARY, marginTop: 10}}>Carregando dados...</Text>
            </View>
        );
    }
    
    // 💡 AJUSTE 3: Checa o currentUser DEPOIS que o Context terminou de carregar (isLoadingContext é false)
    if (!currentUser) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={styles.noQuedasText}>Nenhum perfil encontrado.</Text>
                <Text style={styles.subMessage}>Por favor, cadastre seu perfil na aba Perfil.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.GRADIENT_START} />

            {/* 💡 HEADER COM GRADIENTE CURVO */}
            <LinearGradient
                colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <MaterialCommunityIcons name="history" size={32} color={COLORS.TEXT_PRIMARY} />
                    <Text style={styles.headerTitle}>Histórico de Quedas</Text>
                    <Text style={styles.headerSub}>
                        {quedas.length} registro{quedas.length !== 1 ? "s" : ""} encontrados
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {quedas.length > 0 ? (
                    quedas.map((queda, index) => {
                        const severity = getSeverity(queda);
                        
                        
                        return (
                            <View key={queda.id} style={styles.quedaCard}>
                                <View
                                    style={[
                                        styles.timelineIndicator,
                                        { backgroundColor: severityColors[severity] },
                                    ]}
                                />

                                <View style={styles.cardContent}>
                                    <View style={styles.dateTimeRow}>
                                        <MaterialCommunityIcons
                                            name="clock-time-three-outline"
                                            size={16}
                                            color={COLORS.ACCENT_BLUE}
                                        />
                                        <Text style={[styles.dateTime, { color: COLORS.ACCENT_BLUE }]}>
                                            {formatarDataHora(queda.data, queda.hora)}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Paciente:</Text>
                                        {/* 💡 USANDO currentUser */}
                                        <Text style={styles.value}>{currentUser?.nome || "Não informado"}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Endereço:</Text>
                                        {/* 💡 USANDO currentUser */}
                                        <Text style={styles.value}>{currentUser?.endereco || "Não informado"}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Idade:</Text>
                                        {/* 💡 USANDO currentUser */}
                                        <Text style={styles.value}>{currentUser?.idade || "Não informado"}</Text>
                                    </View>

                                    {/* 💡 Severity Badge no Rodapé */}
                                    <View style={styles.footerRow}>
                                        <Text style={styles.label}>Severidade Detectada:</Text>
                                        <View
                                            style={[
                                                styles.severityBadge,
                                                { backgroundColor: severityColors[severity] },
                                            ]}
                                        >
                                            <Text style={styles.severityText}>{severity.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.noQuedasContainer}>
                        <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={50}
                            color={COLORS.ACCENT_BLUE}
                        />
                        <Text style={styles.noQuedasText}>Nenhum registro de quedas</Text>
                        <Text style={styles.subMessage}>
                            Seu dispositivo está ativo. Continue tranquilo. 💙
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    headerGradient: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
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
    headerSub: {
        fontSize: 14,
        color: COLORS.TEXT_PRIMARY,
        opacity: 0.8,
        marginTop: 4,
    },

    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 80, 
    },

    quedaCard: {
        flexDirection: "row",
        backgroundColor: COLORS.CARD_BACKGROUND,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 5,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    timelineIndicator: {
        width: 5,
        borderRadius: 2.5,
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },

    dateTimeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#444",
        paddingBottom: 8,
    },
    dateTime: {
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 8,
    },

    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        color: COLORS.TEXT_SECONDARY,
        flex: 1,
    },
    value: {
        fontWeight: "600",
        color: COLORS.TEXT_PRIMARY,
        fontSize: 15,
        flex: 2,
        textAlign: "right",
    },

    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#444",
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        minWidth: 90,
        alignItems: "center",
    },
    severityText: {
        color: COLORS.TEXT_PRIMARY,
        fontWeight: "bold",
        fontSize: 12,
    },

    noQuedasContainer: {
        alignItems: "center",
        marginTop: 80,
        padding: 20,
        backgroundColor: COLORS.CARD_BACKGROUND,
        borderRadius: 15,
    },
    noQuedasText: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.TEXT_PRIMARY,
        marginTop: 15,
    },
    subMessage: {
        fontSize: 14,
        color: COLORS.TEXT_SECONDARY,
        marginTop: 10,
        textAlign: "center",
    },
});

export default QuedaAlert;