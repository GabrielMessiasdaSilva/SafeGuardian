import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { realTimeDb } from "../Services/FirebaseConnection"; // Ajuste o caminho conforme seu projeto

const useQuedasData = () => {
  const [quedas, setQuedas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const reference = ref(realTimeDb, "Dispositivo/SafeGuardian/Quedas");
    
    // Configura o listener em tempo real
    const unsubscribe = onValue(reference, (snapshot) => {
      const val = snapshot.val();
      const lista = val
        ? Object.entries(val).map(([id, queda]) => ({ id, ...queda }))
        : [];
      
      // Ordena por data e hora (mais recente primeiro)
      const ordenado = lista.sort(
        (a, b) => new Date(b.data + " " + b.hora) - new Date(a.data + " " + a.hora)
      );
      
      setQuedas(ordenado);
      setIsLoading(false);
    }, (error) => {
        console.error("Erro ao buscar dados do Realtime DB:", error);
        setIsLoading(false);
    });

    // Função de limpeza para remover o listener
    return () => unsubscribe();
  }, []);

  // Retorna a lista de quedas e o status de carregamento
  return { quedas, isLoading };
};

export default useQuedasData;