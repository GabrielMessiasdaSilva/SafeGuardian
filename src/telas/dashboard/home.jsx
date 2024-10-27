import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button } from 'react-native-paper';

const DashboardScreen = () => {
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Safe Guardian" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Sobre o Safe Guardian</Title>
                        <Paragraph>
                            O Safe Guardian é um aplicativo inovador projetado para a segurança de idosos. 
                            Ele utiliza tecnologia avançada de detecção de quedas, permitindo que cuidadores e familiares sejam notificados em tempo real.
                        </Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Compartilhe o Projeto</Title>
                        <Paragraph>
                            Ajude-nos a espalhar a palavra! Compartilhe o Safe Guardian com amigos e familiares que podem se beneficiar deste serviço.
                        </Paragraph>
                        <Button mode="contained" onPress={() => alert('Compartilhar via WhatsApp')}>
                            Compartilhar
                        </Button>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Liberação para Sobreposição</Title>
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
});

export default DashboardScreen;
