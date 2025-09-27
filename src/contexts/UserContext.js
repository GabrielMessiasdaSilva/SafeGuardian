import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. Criação do Contexto
const UserContext = createContext();

// 2. Provedor do Contexto (Componente que envolve todo o App)
export const UserProvider = ({ children }) => {
  // currentUser é o objeto do usuário logado (inclui o 'id' para filtragem)
  const [currentUser, setCurrentUser] = useState(null); 
  const [isLoadingContext, setIsLoadingContext] = useState(true); 

  // Efeito para carregar o usuário do AsyncStorage na primeira vez que o App carrega
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const parsed = JSON.parse(userData);
          // Define o usuário no estado global se ele tiver um ID
          if (parsed && parsed.id) { 
            setCurrentUser(parsed);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do AsyncStorage no Contexto:", error);
      } finally {
        setIsLoadingContext(false);
      }
    };
    loadUserFromStorage();
  }, []);

  // 💡 Funções para atualizar o estado do usuário
  const signInUser = (userData) => {
    // Chamado quando o usuário é cadastrado/editado com sucesso
    setCurrentUser(userData);
  };
  
  const signOutUser = () => {
    // Chamado quando o usuário é excluído
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, signInUser, signOutUser, isLoadingContext }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Hook customizado para consumir o contexto em qualquer lugar
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};