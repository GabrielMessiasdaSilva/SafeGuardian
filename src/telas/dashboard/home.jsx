import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, Share, Alert, Linking, Platform } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';

const DashboardScreen = () => {
    const [fontsLoaded] = useFonts({
        Gagalin: require('../../../assets/fonts/Gagalin-Regular.ttf'),
    });

    // Defina a função solicitarPermissoes antes de usá-la no useEffect
    const solicitarPermissoes = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'É necessário permitir notificações para o funcionamento adequado do aplicativo.');
            abrirConfiguracoesSobreposicao();
        } else {
            Alert.alert('Permissão Concedida', 'As notificações foram permitidas!');
        }
    };

    useEffect(() => {
        solicitarPermissoes();
    }, []);

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

    function abrirConfiguracoesSobreposicao() {
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
            <Appbar.Header>
                <Image source={require('../../Img/splash.png')} style={styles.logo} />
                <View style={styles.titleContainer}>
                    <Text style={styles.titlePart1}>Safe </Text>
                    <Text style={styles.titlePart2}>Guardian</Text>
                </View>
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>
                            <Text style={styles.TipoTitulo}>Sobre o </Text>
                            <Text style={styles.TipoTitulo}>Safe Guardian</Text>
                        </Title>
                        <Paragraph>
                            O Safe Guardian é um aplicativo inovador projetado para a segurança de idosos.
                            Ele utiliza tecnologia avançada de detecção de quedas, permitindo que cuidadores e familiares sejam notificados em tempo real.
                        </Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>
                            <Text style={styles.TipoTitulo}>Compartilhe o </Text>
                            <Text style={styles.TipoTitulo}>Projeto</Text>
                        </Title>
                        <Paragraph>
                            Ajude-nos a espalhar a palavra! Compartilhe o Safe Guardian com amigos e familiares que podem se beneficiar deste serviço.
                        </Paragraph>
                        <Button mode="outlined" onPress={onShare}>
                            Compartilhe o Projeto
                        </Button>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>
                            <Text style={styles.TipoTitulo}>Liberação para </Text>
                            <Text style={styles.TipoTitulo}>Sobreposição</Text>
                        </Title>
                        <Paragraph>
                            Para permitir que o Safe Guardian funcione sobre outros aplicativos, você deve habilitar a opção de sobreposição nas configurações do seu dispositivo.
                            Isso garante que o aplicativo possa mostrar alertas e notificações importantes em qualquer tela.
                        </Paragraph>
                        <Button mode="outlined" onPress={abrirConfiguracoesSobreposicao}>
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
    scrollContainer: {
        padding: 10,
    },
    card: {
        marginVertical: 10,
        elevation: 2,
    },
    logo: {
        width: 50,
        height: 50,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titlePart1: {
        fontFamily: 'Gagalin',
        fontSize: 20,
        color: '#1e2f6c',
    },
    titlePart2: {
        fontFamily: 'Gagalin',
        fontSize: 20,
        color: '#6E85D9',
    },
    button: {
        backgroundColor: '#1e2f6c',
        padding: 5,
        margin: 20,
    },
});

export default DashboardScreen;
