// PhoneAuth.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { auth } from '../../Services/FirebaseConnection';
import { signInWithPhoneNumber } from 'firebase/auth';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const sendVerification = async () => {
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
      setConfirm(confirmation);
      Alert.alert('Código de verificação enviado!');
    } catch (error) {
      console.error("Erro ao enviar SMS:", error);
      Alert.alert('Erro ao enviar SMS. Tente novamente.');
    }
  };

  const confirmCode = async () => {
    try {
      await confirm.confirm(verificationCode);
      Alert.alert('Número verificado com sucesso!');
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      Alert.alert('Código inválido. Tente novamente.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Número de telefone (ex: +5511999998888)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Enviar Código" onPress={sendVerification} />
      
      {confirm && (
        <>
          <TextInput
            placeholder="Código de verificação"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
          />
          <Button title="Verificar Código" onPress={confirmCode} />
        </>
      )}
    </View>
  );
};

export default PhoneAuth;
