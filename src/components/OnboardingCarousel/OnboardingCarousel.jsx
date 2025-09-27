import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Dados dos Slides ---
const data = [
  {
    title: "Bem-vindo(a) ao Safe Guardian",
    body: "Um aplicativo inovador desenvolvido para oferecer cuidado e suporte a idosos, proporcionando segurança e tranquilidade para eles e suas famílias.",
    image: require('../../Img/1.png'),
  },
  {
    title: "Como Utilizar?",
    body: "Cadastre suas informações, emparelhe seu celular com o dispositivo SAFE GUARDIAN e acesse o histórico de quedas e alertas de bateria.",
    image: require('../../Img/2.png'),
  },
  {
    title: "É Importante!",
    body: "Mantenha o volume do celular audível e fique atento às notificações. Responda aos alertas e carregue o dispositivo sempre que necessário.",
    image: require('../../Img/3.png'),
  },
];

// 🎨 1. TEMA DE CORES CENTRALIZADO
// Facilita a manutenção e garante consistência visual.
const THEME = {
  primary: '#494949ff',
  white: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  background: '#f8f5f5ff',
  danger: '#D32F2F',
  inactive: '#2A2C31',
};

const { width, height } = Dimensions.get('window');

// --- Componente para cada item do Carrossel (Layout Melhorado) ---
const CarouselCardItem = ({ item }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.img} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </View>
    </View>
  );
};

// --- Componente para o Modal de Termos (Código mais limpo) ---
const TermsModal = ({ visible, onAccept, onCancel }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Termos de Uso</Text>
          <Text style={styles.modalBody}>
            {`1. Aceitação dos Termos: Ao usar o aplicativo Safe Guardian, você concorda em cumprir estes Termos de Uso.
            \n2. Uso do Aplicativo: O aplicativo é destinado ao suporte de idosos. Use-o de maneira responsável.
            \n3. Responsabilidade: Não nos responsabilizamos por danos decorrentes do uso inadequado do aplicativo.
            \n4. Modificações: Reservamo-nos o direito de modificar estes Termos a qualquer momento.
            \n5. Contato: Em caso de dúvidas, contate-nos em safeguardian2024@gmail.com.
            \n6. Lei Aplicável: Estes termos são regidos pelas leis do Brasil.`}
          </Text>
          <TouchableOpacity style={styles.buttonPrimary} onPress={onAccept}>
            <Text style={styles.buttonTextPrimary}>Aceitar e Continuar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOutline} onPress={onCancel}>
            <Text style={styles.buttonTextOutline}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- Componente Principal ---
export default function OnboardingCarousel({ onComplete }) {
  const carouselRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // 2. LÓGICA E ESTADO SIMPLIFICADOS
  // Removemos o estado 'showContinueButton' e usamos uma variável derivada.
  const isLastSlide = index === data.length - 1;

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      if (hasCompletedOnboarding) {
        onComplete();
      }
    };
    checkOnboardingStatus();
  }, [onComplete]);

  // 3. FLUXO DE USUÁRIO MELHORADO
  // O usuário não precisa mais clicar duas vezes para continuar.
  const handleAcceptTerms = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setModalVisible(false);
      onComplete();
    } catch (e) {
      console.error("Failed to save onboarding status.", e);
    }
  };

  const handleNext = () => {
    if (isLastSlide) {
      setModalVisible(true);
    } else {
      carouselRef.current?.snapToNext();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={(i) => setIndex(i)}
        inactiveSlideScale={1} // Mantém o slide com a mesma escala
      />
      
      <View style={styles.footer}>
        <Pagination
          dotsLength={data.length}
          activeDotIndex={index}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.activeDot}
          inactiveDotStyle={styles.inactiveDot}
          inactiveDotOpacity={0.6}
          inactiveDotScale={0.8}
        />
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleNext}>
          <Text style={styles.buttonTextPrimary}>{isLastSlide ? 'Concluir' : 'Próximo'}</Text>
        </TouchableOpacity>
      </View>

      <TermsModal
        visible={modalVisible}
        onAccept={handleAcceptTerms}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

// 4. ESTILOS REFEITOS E ORGANIZADOS
// Usando o objeto THEME para um visual consistente e profissional.
const styles = StyleSheet.create({
  // --- Estrutura Principal ---
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  
  cardContainer: {
    flex: 1,
    backgroundColor: THEME.background,
    width: width,
    alignItems: 'center',
paddingTop: 10
  },
  imageWrapper: {
    flex: 0.8, // 60% da altura para a imagem
    justifyContent: 'center',
    alignItems: 'center',
    // Adicionado: 100% da largura do cardContainer (que agora é 100% da tela).
    width: '100%', 
  },
  img: {
    width: '100%',
    height: '90%',
  
    resizeMode: 'cover', 
  },
  textWrapper: {
    flex: 0.3, // 40% da altura para o texto
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: THEME.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  body: {
    fontSize: 16,
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  // --- Paginação ---
  paginationContainer: {
    paddingVertical: 20,
  },
  activeDot: {
   width: 25,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.primary,
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.inactive,
  },
  
  // --- Botões ---
  buttonPrimary: {
    backgroundColor: THEME.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: width * 0.8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTextPrimary: {
    color: THEME.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: THEME.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.danger,
    marginTop: 10,
  },
  buttonTextOutline: {
    color: THEME.danger,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- Modal de Termos ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    padding: 25,
    backgroundColor: THEME.white,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.textPrimary,
    marginBottom: 15,
  },
  modalBody: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginBottom: 25,
    lineHeight: 22,
  },
});