// src/components/PopUp.js
import React from 'react';
import { View } from 'react-native';
import Dialog from 'react-native-dialog';

const PopUp = ({ visible, onClose, message }) => {
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>Notificação de Queda</Dialog.Title>
      <Dialog.Description>
        {message}
      </Dialog.Description>
      <Dialog.Button label="OK" onPress={onClose} />
    </Dialog.Container>
  );
};

export default PopUp;
