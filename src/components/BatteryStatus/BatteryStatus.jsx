import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { realTimeDb } from '../../Services/FirebaseConnection';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ícones vetorizados para um design melhor

const { width } = Dimensions.get('window');

// --- 🎨 Paleta de Cores Otimizada ---
const COLORS = {
  BACKGROUND: '#1A1A2E',           // Fundo principal escuro
  CARD_BACKGROUND: '#2C2C44',      // Fundo do widget (Card)
  TEXT_PRIMARY: '#FFFFFF',         // Texto principal branco
  TEXT_SECONDARY: '#9090A0',       // Texto secundário/ícones
  ACCENT_BLUE: '#2196F3',          // Azul de destaque/conexão (Bateria OK)
  DANGER_RED: '#FF6347',           // Vermelho para bateria baixa e alertas
  MODAL_TITLE: '#D32F2F',          // Vermelho mais forte para o título do modal
  MODAL_BUTTON: '#1E2F6C',         // Azul para o botão do modal
};

const BatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Referências do Realtime Database
    const batteryRef = ref(realTimeDb, '/Bateria/percentual');
    const connectionRef = ref(realTimeDb, 'Dispositivo/SafeGuardian/conectado');

    // 1. Escutando mudanças no status da bateria
    const onBatteryValueChange = onValue(batteryRef, snapshot => {
      const level = snapshot.val();
      if (level !== null) {
        setBatteryLevel(level);
        
        // CORREÇÃO: Lógica para mostrar/esconder o modal de alerta.
        // O modal aparecerá se a bateria for menor ou igual a 20%.
        if (level <= 20) {
          setModalVisible(true);
        } else {
          // O modal é fechado automaticamente se o nível subir acima de 20%
          setModalVisible(false);
        }
      }
    });

    // 2. Escutando mudanças no status da conexão
    const onConnectionValueChange = onValue(connectionRef, snapshot => {
      const connected = snapshot.val();
      setIsConnected(connected);
    });

    // Limpando os listeners ao desmontar o componente
    return () => {
      off(batteryRef, onBatteryValueChange);
      off(connectionRef, onConnectionValueChange);
    };
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Determina a cor de exibição com base no nível da bateria
  const batteryColor = batteryLevel <= 20 ? COLORS.DANGER_RED : COLORS.ACCENT_BLUE;
  
  // Função auxiliar para selecionar o ícone de bateria correto
  const getBatteryIconName = (level) => {
    if (level > 95) return 'battery-charging-100'; 
    if (level > 75) return 'battery-80';
    if (level > 50) return 'battery-60';
    if (level > 25) return 'battery-40';
    return 'battery-20';
  };
  
  // Ícone de conexão
  const connectionIcon = isConnected ? 'wifi' : 'wifi-off';
  const connectionColor = isConnected ? COLORS.ACCENT_BLUE : COLORS.TEXT_SECONDARY;

  return (
    <View style={styles.cardContainer}>
        {/* WIDGET DE STATUS (O QUE FICA FIXO NA TELA) */}
        <View style={styles.statusRow}>
            
            {/* 1. Status da Bateria */}
            <View style={styles.batteryDisplay}>
                <MaterialCommunityIcons 
                    name={getBatteryIconName(batteryLevel)} 
                    size={24} 
                    color={batteryColor} 
                    style={{ marginRight: 5 }}
                />
                <Text style={[styles.batteryText, { color: batteryColor }]}>
                    {batteryLevel}%
                </Text>
            </View>

            {/* 2. Status da Conexão */}
            <View style={styles.connectionDisplay}>
                <Text style={styles.connectionLabel}>Conexão:</Text>
                <MaterialCommunityIcons 
                    name={connectionIcon} 
                    size={24} 
                    color={connectionColor}
                />
            </View>

        </View>

        {/* MODAL DE ALERTA DE BATERIA BAIXA (SÓ VISÍVEL QUANDO batteryLevel <= 20) */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <MaterialCommunityIcons 
                        name="alert-octagon" 
                        size={60} 
                        color={COLORS.MODAL_TITLE} 
                        style={{ marginBottom: 10 }}
                    />
                    <Text style={styles.modalTextTitulo}>Atenção!</Text>
                    <Text style={styles.modalText}>
                        O dispositivo está com a bateria extremamente **baixa** ({batteryLevel}%).
                        Recarregue-o o mais rápido possível!
                    </Text>
                    
                    <TouchableOpacity onPress={handleCloseModal} style={styles.button} activeOpacity={0.7}>
                        <Text style={styles.buttonText}>Entendido</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: COLORS.CARD_BACKGROUND,
        borderRadius: 10,
        marginVertical: 10,
        // Sombras para dar a aparência de card
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    batteryDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    batteryText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    connectionDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connectionLabel: {
        fontSize: 14,
        color: COLORS.TEXT_SECONDARY,
        marginRight: 8,
    },
    // --- Estilos do Modal de Alerta ---
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: width * 0.85,
        padding: 25,
        backgroundColor: COLORS.TEXT_PRIMARY, // Fundo branco/claro
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    modalTextTitulo: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.MODAL_TITLE,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        color: COLORS.BACKGROUND,
        marginBottom: 25,
        lineHeight: 24,
    },
    button: {
        backgroundColor: COLORS.MODAL_BUTTON,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    buttonText: {
        color: COLORS.TEXT_PRIMARY,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BatteryStatus;