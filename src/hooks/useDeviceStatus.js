import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { realTimeDb } from '../Services/FirebaseConnection'; // Ajuste o caminho conforme necessário

const useBatteryAndConnection = (deviceId = 'SafeGuardian') => {
  const [batteryLevel, setBatteryLevel] = useState(0); // Nível da bateria
  const [isConnected, setIsConnected] = useState(false); // Status da conexão
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Caminhos baseados na sua implementação anterior:
    const batteryRef = ref(realTimeDb, '/Bateria/percentual');
    const connectionRef = ref(realTimeDb, `Dispositivo/${deviceId}/conectado`);

    // Escutando mudanças no status da bateria
    const onBatteryValueChange = onValue(batteryRef, (snapshot) => {
      const level = snapshot.val();
      if (level !== null && typeof level === 'number') {
        setBatteryLevel(level);
      }
      // O loading só deve ser setado para false após a primeira leitura de ambos
      // mas vamos simplificar assumindo que a bateria é o último a carregar.
      setIsLoading(false);
    });

    // Escutando mudanças no status da conexão
    const onConnectionValueChange = onValue(connectionRef, (snapshot) => {
      const connected = snapshot.val();
      // Assume que 'conectado' é um booleano (true/false)
      setIsConnected(connected === true); 
    });

    // Limpando os listeners quando o hook for desmontado
    return () => {
      off(batteryRef, onBatteryValueChange);
      off(connectionRef, onConnectionValueChange);
    };
  }, [deviceId]);

  // Retorna os dados necessários para o Dashboard
  return { batteryLevel, isConnected, isLoading };
};

export default useBatteryAndConnection;