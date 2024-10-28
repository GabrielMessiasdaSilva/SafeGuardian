import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

const App = () => {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');

    const connectToWiFi = async () => {
        try {
            const response = await fetch(`http://192.168.15.10/connect?ssid=${ssid}&password=${password}`);
            const message = await response.text();
            
            // Exibir mensagem de status
            Alert.alert("Status da Conexão", message);
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao tentar conectar.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="SSID"
                value={ssid}
                onChangeText={setSsid}
                style={styles.input}
            />
            <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Conectar" onPress={connectToWiFi} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#f4f4f4', // cor de fundo leve
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    }
});

export default App;
