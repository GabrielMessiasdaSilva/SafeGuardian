import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, Share, Alert, Linking, Platform, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

import { useNavigation } from '@react-navigation/native'; // Importa o hook de navegação

const DashboardScreen = () => {
    const navigation = useNavigation();

    // Utilizando useCallback para evitar a recriação da função a cada render
    const onNavigateToAssociateEsp32 = useCallback(() => {
        navigation.navigate('AssociateEsp32'); // Navega para a tela AssociateEsp32
    }, [navigation]);

    const [fontsLoaded] = useFonts({
      Gagalin: require('../../../assets/fonts/Gagalin-Regular.ttf'),
  });

  if (!fontsLoaded) {
      return <AppLoading />; 
  }

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
  }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <View style={styles.headerContainer}>
                    <Image source={require('../../Img/splash.png')} style={styles.logo} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titlePart1}>Safe </Text>
                        <Text style={styles.titlePart2}>Guardian</Text>
                    </View>
                </View>
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>
                            <Text style={styles.TipoTitulo}>Sobre o </Text>
                            <Text style={styles.TipoTitulo}>Safe Guardian</Text>
                        </Title>
                        <Paragraph style={styles.paragraph}>
                            O Safe Guardian é um aplicativo inovador projetado para a segurança de idosos.
                            Ele utiliza tecnologia avançada de detecção de quedas, permitindo que cuidadores e familiares sejam notificados em tempo real.
                        </Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>
                            <Text style={styles.TipoTitulo}>Associe o </Text>
                            <Text style={styles.TipoTitulo}>seu dispositivo</Text>
                        </Title>
                        <Paragraph style={styles.paragraph}>
                            É fundamental associar o seu dispositivo ao aplicativo para garantir que ele seja monitorado e que você receba notificações em caso de queda.
                        </Paragraph>
                        <TouchableOpacity style={styles.button} onPress={onNavigateToAssociateEsp32}>
                            <Text style={styles.buttonText}>Ir já</Text>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>
                            <Text style={styles.TipoTitulo}>Liberação para </Text>
                            <Text style={styles.TipoTitulo}>Sobreposição</Text>
                        </Title>
                        <Paragraph style={styles.paragraph}>
                            Para permitir que o Safe Guardian funcione sobre outros aplicativos, você deve habilitar a opção de sobreposição nas configurações do seu dispositivo.
                            Isso garante que o aplicativo possa mostrar alertas e notificações importantes em qualquer tela.
                        </Paragraph>
                        <Button mode="outlined" style={styles.button} onPress={abrirConfiguracoesSobreposicao}>
                            Ir para Configurações
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
  },
  appBar: {
      backgroundColor: '#1e2f6c',
  },
  scrollContainer: {
      padding: 10,
  },
  card: {
      marginVertical: 15,
      borderRadius: 10,
      elevation: 4,
  },
  headerContainer: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%',
  },
  logo: {
      width: 50,
      height: 50,
      borderRadius: 25,
  },
  titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
  },
  titlePart1: {
      fontFamily: 'Gagalin',
      fontSize: 24,
      color: '#fff',
  },
  titlePart2: {
      fontFamily: 'Gagalin',
      fontSize: 24,
      color: '#6E85D9',
  },
  TipoTitulo: {
      fontFamily: 'Gagalin',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e2f6c',
  },
  paragraph: {
      fontSize: 16,
      color: '#555',
      marginBottom: 15,
  },
  button: {
      borderColor: '#1e2f6c',
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
  },
  buttonText: {
      color: '#1e2f6c',
      fontSize: 16,
      fontWeight: 'bold',
  },
});

export default DashboardScreen;
