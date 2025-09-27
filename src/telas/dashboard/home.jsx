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
} from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // largura da tela

  const onNavigateToAssociateEsp32 = useCallback(
    () => navigation.navigate('AssociateEsp32'),
    [navigation]
  );

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

  // Dados de exemplo
  const isDeviceAssociated = true;
  const overlayPermission = true;
  const recentFalls = 2;
  const uptimePercent = 98;

  const fallPatterns = [
    { type: 'Simples', count: 1, color: '#4CAF50' },
    { type: 'Moderada', count: 1, color: '#FF9800' },
    { type: 'Grave', count: 0, color: '#F44336' },
  ];

  // Responsividade: tamanho dinâmico de ícones e fontes
  const iconSize = width * 0.08; // 8% da largura da tela
  const fontSizeSmall = width * 0.035; // ~3.5%
  const fontSizeMedium = width * 0.045; // ~4.5%
  const fontSizeLarge = width * 0.06; // ~6%

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Safe Guardian" titleStyle={[styles.headerTitle, { fontSize: fontSizeLarge }]} />
        <Appbar.Action icon="share-variant" color="#FFFFFF" onPress={onShare} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Status do dispositivo */}
        <Card style={styles.statusCard}>
          <Card.Content>
            <Title style={[styles.cardTitle, { fontSize: fontSizeMedium }]}>Status do Dispositivo</Title>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <MaterialCommunityIcons
                  name="bluetooth-connect"
                  size={iconSize}
                  color={isDeviceAssociated ? '#4CAF50' : '#F44336'}
                />
                <Text style={[styles.statusLabel, { fontSize: fontSizeSmall }]}>Dispositivo</Text>
                <Badge style={isDeviceAssociated ? styles.badgeOk : styles.badgeWarn}>
                  {isDeviceAssociated ? 'Associado' : 'Desassociado'}
                </Badge>
              </View>
              <View style={styles.statusItem}>
                <MaterialCommunityIcons
                  name="cellphone-settings"
                  size={iconSize}
                  color={overlayPermission ? '#4CAF50' : '#F44336'}
                />
                <Text style={[styles.statusLabel, { fontSize: fontSizeSmall }]}>Permissão</Text>
                <Badge style={overlayPermission ? styles.badgeOk : styles.badgeWarn}>
                  {overlayPermission ? 'Ativo' : 'Inativo'}
                </Badge>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Ações rápidas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScroll}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          <Button
            mode="contained"
            icon="link"
            style={[styles.actionButtonPrimaryScroll, { minWidth: width * 0.3 }]}
            contentStyle={styles.actionButtonContent}
            labelStyle={[styles.actionLabelPrimary, { fontSize: fontSizeSmall }]}
            onPress={onNavigateToAssociateEsp32}
          >
            Associar
          </Button>

          <Button
            mode="outlined"
            icon="shield-check"
            style={[styles.actionButtonSecondaryScroll, { minWidth: width * 0.3 }]}
            contentStyle={styles.actionButtonContent}
            labelStyle={[styles.actionLabelSecondary, { fontSize: fontSizeSmall }]}
            onPress={abrirConfiguracoesSobreposicao}
          >
            Permissões
          </Button>

          <Button
            mode="outlined"
            icon="share-variant"
            style={[styles.actionButtonSecondaryScroll, { minWidth: width * 0.3 }]}
            contentStyle={styles.actionButtonContent}
            labelStyle={[styles.actionLabelSecondary, { fontSize: fontSizeSmall }]}
            onPress={onShare}
          >
            Compartilhar
          </Button>
        </ScrollView>

        {/* Métricas */}
        <View style={styles.metricsContainer}>
          <Card style={styles.metricsCard}>
            <Card.Content style={styles.metricContent}>
              <Text style={[styles.metricTitle, { fontSize: fontSizeSmall }]}>Quedas detectadas</Text>
              <Text style={[styles.metricValue, { fontSize: fontSizeLarge }]}>{recentFalls}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.metricsCard}>
            <Card.Content style={styles.metricContent}>
              <Text style={[styles.metricTitle, { fontSize: fontSizeSmall }]}>Tempo online</Text>
              <Text style={[styles.metricValue, { fontSize: fontSizeLarge }]}>{uptimePercent}%</Text>
            </Card.Content>
          </Card>
        </View>


       
        {/* Informação de uso */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={[styles.cardTitle, { fontSize: fontSizeMedium }]}>Como usar o Safe Guardian</Title>
            <Paragraph style={[styles.cardDesc, { fontSize: fontSizeSmall }]}>
              Coloque o dispositivo IoT na cintura, preferencialmente em uma pochete ou bolso lateral. Ele monitora quedas e envia alertas em tempo real.  
              Certifique-se de que as permissões estão ativadas e que o app tem acesso a sobreposições para funcionar corretamente em segundo plano.
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E2F' },
  header: { backgroundColor: '#1E1E2F', elevation: 4 },
  headerTitle: { color: '#FFFFFF', fontWeight: 'bold' },
  scrollContainer: { padding: 16, paddingBottom: 80 },

  statusCard: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#2A2C31',
    elevation: 4,
    padding: 12,
  },
  statusRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, flexWrap: 'wrap' },
  statusItem: { alignItems: 'center', marginVertical: 8 },
  statusLabel: { color: '#FFFFFF', marginTop: 6 },
  badgeOk: { backgroundColor: '#4CAF50', color: '#FFFFFF', marginTop: 4,width: 70 },
  badgeWarn: { backgroundColor: '#F44336', color: '#FFFFFF', marginTop: 4 },

  quickActionsScroll: { marginBottom: 24 },
  actionButtonPrimaryScroll: {
    borderRadius: 16,
    backgroundColor: '#2E4A8F',
    marginRight: 12,
  },
  actionButtonSecondaryScroll: {
    borderRadius: 16,
    borderColor: '#2E4A8F',
    borderWidth: 1,
    marginRight: 12,
  },
  actionButtonContent: { height: 50, justifyContent: 'center' },
  actionLabelPrimary: { fontWeight: '600', color: '#FFFFFF' },
  actionLabelSecondary: { fontWeight: '600', color: '#2E4A8F' },

  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap' },
  metricsCard: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#2A2C31',
    elevation: 6,
    paddingVertical: 24,
    alignItems: 'center',
    minWidth: '45%',
    marginVertical: 6,
  },
  metricContent: { alignItems: 'center' },
  metricTitle: { color: '#CCCCCC', marginBottom: 8 },
  metricValue: { color: '#2E4A8F', fontWeight: 'bold' },

  infoCard: { borderRadius: 20, elevation: 6, marginBottom: 24, backgroundColor: '#2A2C31', padding: 12 },
  cardTitle: { color: '#FFFFFF', marginBottom: 8, fontWeight: 'bold' },
  cardDesc: { color: '#CCCCCC', lineHeight: 22 },

  fallPatternRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  fallIndicator: { borderRadius: 8, marginRight: 12 },
  fallText: { color: '#FFFFFF' },
});

export default DashboardScreen;
