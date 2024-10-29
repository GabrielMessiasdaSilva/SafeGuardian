import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text, Share, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const DashboardScreen = () => {
    const [fontsLoaded] = useFonts({
        Gagalin: require('../../../assets/fonts/Gagalin-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const onShare = async () => {
        try {
            const message = 'Safe Guardian | O seu Guardião em cada passo! Confira nosso projeto: https://github.com/GabrielMessiasdaSilva/SafeGuardian/';
            const result = await Share.share({
                message,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert('Erro ao compartilhar', error.message);
        }
    };

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
                        <Button mode="outlined" onPress={() => alert('Abrir Configurações')}>
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
