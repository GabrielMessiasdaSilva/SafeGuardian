import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Linking,
  Platform,
  Share,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Badge, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useQuedasData from '../../hooks/useQuedasData';
import useDeviceStatus from '../../hooks/useDeviceStatus'; // Ajuste o nome se o seu hook for 'useBatteryAndConnection'

// 🟦 Cores e Constantes
const PRIMARY_BLUE = '#2196F3';
const DANGER_RED = '#F44336';
const SUCCESS_GREEN = '#4CAF50';
const WARNING_YELLOW = '#FFC107'; // Cor para bateria em nível de atenção
const BACKGROUND_COLOR = '#1A1A2E';
const CARD_COLOR = '#2C2C44';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // --- Hooks de Dados ---
  const { quedas, isLoading: isQuedasLoading } = useQuedasData();
  const { batteryLevel, isConnected, isLoading: isDeviceLoading } = useDeviceStatus();

  // --- Lógica de Negócio ---
  const fallsLast30Days = quedas.length;
  const hasPendingAlert = fallsLast30Days > 0;
  const overlayPermission = true; // Substituir por lógica real se necessário
  const uptimePercent = 98; // Substituir por lógica real se necessário

  // --- Funções Auxiliares ---
  const getBatteryStatus = (level) => {
    if (level > 75) {
      return { icon: 'battery', color: SUCCESS_GREEN };
    }
    if (level > 25) {
      return { icon: 'battery-50', color: WARNING_YELLOW };
    }
    return { icon: 'battery-alert-variant-outline', color: DANGER_RED };
  };

  const batteryStatus = getBatteryStatus(batteryLevel);

  const onNavigateToAssociateEsp32 = useCallback(() => navigation.navigate('AssociateEsp32'), [navigation]);

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Conheça o Safe Guardian, um aplicativo inovador para a segurança de idosos!',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao compartilhar');
    }
  };

  const abrirConfiguracoesSobreposicao = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings().catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir as configurações de sobreposição');
      });
    } else {
      Alert.alert('Aviso', 'Configurações de sobreposição estão disponíveis apenas no Android.');
    }
  };

  // --- Cálculos de Responsividade ---
  const iconSize = width * 0.09;
  const fontSizeSmall = width * 0.035;
  const fontSizeMedium = width * 0.045;
  const fontSizeLarge = width * 0.07;

  // --- Renderização de Estado de Carregamento ---
  if (isQuedasLoading || isDeviceLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        <Text style={{ color: '#FFFFFF', marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  // --- Renderização Principal ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="Safe Guardian"
          titleStyle={[styles.headerTitle, { fontSize: fontSizeMedium, color: PRIMARY_BLUE }]}
        />
        <Appbar.Action icon="share-variant" color="#FFFFFF" onPress={onShare} />
        <Appbar.Action icon="cog-outline" color="#FFFFFF" onPress={() => navigation.navigate('Settings')} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Card de Alerta de Quedas Recentes */}
        {hasPendingAlert && (
          <Card style={styles.alertCard}>
            <Card.Content style={styles.alertContent}>
              <MaterialCommunityIcons name="alert-decagram" size={iconSize} color={DANGER_RED} />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Title style={[styles.alertTitle, { fontSize: fontSizeMedium }]}>
                  {fallsLast30Days} Queda(s) detectada(s)
                </Title>
                <Paragraph style={[styles.alertDesc, { fontSize: fontSizeSmall }]}>
                  Verifique o histórico de eventos para detalhes e localização.
                </Paragraph>
                <Button
                  mode="contained"
                  style={styles.alertButton}
                  labelStyle={[styles.alertButtonLabel, { fontSize: fontSizeSmall }]}
                  onPress={() => navigation.navigate('Historico')}
                >
                  Ver Histórico
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Status do Dispositivo (Integrado com o Hook) */}
        <Card style={styles.statusCard}>
          <Card.Content>
            <Title style={[styles.cardTitle, { fontSize: fontSizeMedium }]}>Status do Sistema</Title>
            <Divider style={styles.divider} />
            <View style={styles.statusRow}>

              {/* Status de Conexão */}
              <View style={styles.statusItem}>
                <MaterialCommunityIcons
                  name="link-variant"
                  size={iconSize * 0.7}
                  color={isConnected ? SUCCESS_GREEN : DANGER_RED}
                />
                <Text style={[styles.statusLabel, { fontSize: fontSizeSmall }]}>Dispositivo IoT</Text>
                <Badge
                  style={[isConnected ? styles.badgeOk : styles.badgeWarn, { fontSize: fontSizeSmall }]}
                >
                  {isConnected ? 'Ativo' : 'Offline'}
                </Badge>
              </View>

              {/* Status da Bateria */}
              <View style={styles.statusItem}>
                <MaterialCommunityIcons
                  name={batteryStatus.icon}
                  size={iconSize * 0.7}
                  color={batteryStatus.color}
                />
                <Text style={[styles.statusLabel, { fontSize: fontSizeSmall }]}>Bateria IoT</Text>
                <Text style={[styles.statusValue, { color: batteryStatus.color, fontSize: fontSizeSmall }]}>
                  {`${batteryLevel}%`}
                </Text>
              </View>

              {/* Status de Permissão */}
              <View style={styles.statusItem}>
                <MaterialCommunityIcons
                  name="android"
                  size={iconSize * 0.7}
                  color={overlayPermission ? SUCCESS_GREEN : DANGER_RED}
                />
                <Text style={[styles.statusLabel, { fontSize: fontSizeSmall }]}>Permissão Overlay</Text>
                <Badge
                  style={[overlayPermission ? styles.badgeOk : styles.badgeWarn, { fontSize: fontSizeSmall }]}
                >
                  {overlayPermission ? 'OK' : 'Necessária'}
                </Badge>
              </View>

            </View>
          </Card.Content>
        </Card>

        {/* Métricas */}
        <View style={styles.metricsContainer}>
          <Card style={styles.metricsCard}>
            <Card.Content style={styles.metricContent}>
              <Text style={[styles.metricTitle, { fontSize: fontSizeSmall }]}>Tempo Online (24h)</Text>
              <Text style={[styles.metricValue, { fontSize: fontSizeLarge }]}>{uptimePercent}%</Text>
              <MaterialCommunityIcons name="clock-check-outline" size={iconSize * 0.5} color="#CCCCCC" />
            </Card.Content>
          </Card>
          <Card style={styles.metricsCard}>
            <Card.Content style={styles.metricContent}>
              <Text style={[styles.metricTitle, { fontSize: fontSizeSmall }]}>Quedas (Total)</Text>
              <Text style={[styles.metricValue, { fontSize: fontSizeLarge, color: fallsLast30Days > 0 ? DANGER_RED : PRIMARY_BLUE }]}>
                {quedas.length}
              </Text>
              <MaterialCommunityIcons name="floor-plan" size={iconSize * 0.5} color="#CCCCCC" />
            </Card.Content>
          </Card>
        </View>

        {/* Ações Rápidas */}
        <Title style={[styles.sectionTitle, { fontSize: fontSizeMedium }]}>Ações Rápidas</Title>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScroll}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          <Button
            mode="contained"
            icon="link"
            style={[styles.actionButtonPrimaryScroll, { minWidth: width * 0.35 }]}
            labelStyle={[styles.actionLabelPrimary, { fontSize: fontSizeSmall }]}
            onPress={onNavigateToAssociateEsp32}
          >
            Conectar Dispositivo
          </Button>

          <Button
            mode="outlined"
            icon="shield-check"
            style={[styles.actionButtonSecondaryScroll, { minWidth: width * 0.35 }]}
            labelStyle={[styles.actionLabelSecondary, { fontSize: fontSizeSmall }]}
            onPress={abrirConfiguracoesSobreposicao}
          >
            Ajustar Permissões
          </Button>

          <Button
            mode="outlined"
            icon="account-group"
            style={[styles.actionButtonSecondaryScroll, { minWidth: width * 0.35 }]}
            labelStyle={[styles.actionLabelSecondary, { fontSize: fontSizeSmall }]}
            onPress={() => navigation.navigate('Contatos')}
          >
            Contatos
          </Button>
        </ScrollView>

        {/* Dicas de Uso */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={[styles.cardTitle, { fontSize: fontSizeMedium }]}>Dicas de Uso</Title>
            <Paragraph style={[styles.cardDesc, { fontSize: fontSizeSmall }]}>
              Para monitoramento ideal, posicione o dispositivo na cintura (pochete ou bolso lateral). Certifique-se que o app está configurado para iniciar automaticamente e que as permissões de sobreposição estão ativas para alertas em segundo plano.
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  header: { backgroundColor: BACKGROUND_COLOR, elevation: 0 },
  headerTitle: { color: '#FFFFFF', fontWeight: 'bold' },
  scrollContainer: { padding: 16, paddingBottom: 80 },
  divider: { backgroundColor: '#444466', marginVertical: 8 },
  sectionTitle: { color: '#FFFFFF', fontWeight: '600', marginBottom: 12, marginTop: 12 },
  alertCard: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#381C1C',
    elevation: 8,
    borderLeftWidth: 5,
    borderLeftColor: DANGER_RED,
  },
  alertContent: { flexDirection: 'row', alignItems: 'center' },
  alertTitle: { color: DANGER_RED, fontWeight: 'bold' },
  alertDesc: { color: '#FFCCCC', marginTop: 4 },
  alertButton: {
    marginTop: 12,
    backgroundColor: DANGER_RED,
    alignSelf: 'flex-start',
    borderRadius: 8
  },
  alertButtonLabel: { color: '#FFFFFF', fontWeight: 'bold' },
  statusCard: {
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: CARD_COLOR,
    elevation: 4,
    padding: 8,
  },
  infoCard: { borderRadius: 20, elevation: 4, marginBottom: 24, backgroundColor: CARD_COLOR, padding: 8 },
  cardTitle: { color: PRIMARY_BLUE, marginBottom: 8, fontWeight: 'bold' },
  cardDesc: { color: '#CCCCCC', lineHeight: 20 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, flexWrap: 'wrap' },
  statusItem: { alignItems: 'center', marginHorizontal: 4, marginVertical: 8, flex: 1, minWidth: '30%' },
  statusLabel: { color: '#CCCCCC', marginTop: 6, textAlign: 'center' },
  badgeOk: { backgroundColor: SUCCESS_GREEN, color: '#FFFFFF', marginTop: 4, paddingHorizontal: 8 },
  badgeWarn: { backgroundColor: DANGER_RED, color: '#FFFFFF', marginTop: 4, paddingHorizontal: 8 },
  statusValue: {
    fontWeight: 'bold',
    marginTop: 4,
    paddingHorizontal: 8
  },
  quickActionsScroll: { marginBottom: 24 },
  actionButtonPrimaryScroll: {
    borderRadius: 16,
    backgroundColor: PRIMARY_BLUE,
    marginRight: 12,
  },
  actionButtonSecondaryScroll: {
    borderRadius: 16,
    borderColor: PRIMARY_BLUE,
    borderWidth: 1,
    marginRight: 12,
  },
  actionLabelPrimary: { fontWeight: '600', color: '#FFFFFF' },
  actionLabelSecondary: { fontWeight: '600', color: PRIMARY_BLUE },
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap' },
  metricsCard: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: CARD_COLOR,
    elevation: 6,
    paddingVertical: 16,
    alignItems: 'center',
    minWidth: '45%',
    marginVertical: 6,
  },
  metricContent: { alignItems: 'center', padding: 0 },
  metricTitle: { color: '#BBBBBB', marginBottom: 4, textAlign: 'center' },
  metricValue: { color: PRIMARY_BLUE, fontWeight: 'bold', marginBottom: 8 },
});

export default DashboardScreen;
