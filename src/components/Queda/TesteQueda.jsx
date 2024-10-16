const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendQuedaNotification = functions.database.ref('/Quedas/{quedaId}')
  .onCreate((snapshot, context) => {
    const quedaData = snapshot.val();
    
    const payload = {
      notification: {
        title: 'Alerta de Queda',
        body: 'Uma queda foi detectada!',
        sound: 'default',
      },
    };

    // Recupere o token do dispositivo para enviar a notificação
    const deviceToken = 'TOKEN_DO_DISPOSITIVO'; // Você precisa gerenciar os tokens dos dispositivos

    return admin.messaging().sendToDevice(deviceToken, payload)
      .then(response => {
        console.log('Notificação enviada com sucesso:', response);
        return null;
      })
      .catch(error => {
        console.error('Erro ao enviar notificação:', error);
      });
  });
