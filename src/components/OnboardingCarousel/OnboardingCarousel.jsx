import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const data = [
  {
    title: "Bem-vindo(a)",
    subtitle: "Ao Safe Guardian",
    body: "Descubra um aplicativo inovador desenvolvido para oferecer cuidados e suporte a idosos. Nossa equipe de TCC identificou a necessidade de auxiliar aqueles que estão propensos a quedas, proporcionando segurança e tranquilidade para eles e suas famílias.",
    image: require('../../Img/Img3.png'),
  },
  {
    title: "Como utilizar o Safe Guardian?",
    body: "Cadastre suas informações pessoais no formulário, emparelhe seu celular com o dispositivo SAFE GUARDIAN e acesse o histórico de quedas e alertas de bateria baixa.",
    image: require('../../Img/img2.png'),
  },
  {
    title: "É importante!",
    body: "Mantenha o volume do celular em um nível audível e fique atento(a) às notificações de quedas. Responda imediatamente ao alerta de queda e ao aviso de bateria baixa, carregando o dispositivo IoT quando necessário.",
    image: require('../../Img/audivel.png'),
  },
];

const { width } = Dimensions.get('window');

function CarouselCardItem({ item }) {
  return (
    <View style={[styles.imageContainer, item.customStyle]}>
      <Image source={item.image} style={styles.img} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );
}

export default function OnboardingCarousel({ onComplete }) {
  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkTermsAccepted = async () => {
      const accepted = await AsyncStorage.getItem('termsAccepted');
      if (accepted) {
        onComplete(); // Redireciona se já aceitou os Termos
      }
    };
    checkTermsAccepted();
  }, []);

  const handleContinue = async () => {
    if (termsAccepted) {
      await AsyncStorage.setItem('termsAccepted', 'true');
      onComplete();
    } else {
      setModalVisible(true);
    }
  };

  const handleNextSlide = () => {
    const nextIndex = index + 1 < data.length ? index + 1 : 0;
    isCarousel.current?.snapToItem(nextIndex);
    setIndex(nextIndex);
    setShowContinueButton(nextIndex === data.length - 1);
  };

  return (
    <View style={styles.container}>
      <Carousel
        layout="default"
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={(index) => {
          setIndex(index);
          setShowContinueButton(index === data.length - 1);
        }}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={styles.activeDot}
        inactiveDotStyle={styles.inactiveDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      />
      {index < data.length - 1 ? (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextSlide}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonContinuar}>Continuar</Text>
        </TouchableOpacity>
      )}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Termos de Uso</Text>
            <Text style={styles.modalBody}>
              {`1. Aceitação dos Termos: Ao usar o aplicativo Safe Guardian, você concorda em cumprir e estar vinculado a estes Termos de Uso.
              
2. Uso do Aplicativo: O aplicativo é destinado ao suporte e cuidado de idosos. Você concorda em usá-lo de maneira responsável.

3. Responsabilidade: A Safe Guardian não se responsabiliza por qualquer dano decorrente do uso inadequado do aplicativo e do aparelho de detecção de quedas.

4. Modificações: A Safe Guardian reserva-se o direito de modificar estes Termos de Uso a qualquer momento.

5. Contato: Para dúvidas, entre em contato pelo e-mail: safeguardian2024@gmail.com.
              
6. Lei Aplicável: Estes termos são regidos pelas leis do Brasil.`}
            </Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                setTermsAccepted(true);
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Aceitar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.acceptButton, { borderStyle: 'solid', borderColor: 'red', borderWidth: 1, backgroundColor: '#fff', marginTop: 10 }]}
              onPress={() => {
                setTermsAccepted(false);
                setModalVisible(false);
              }}
            >
              <Text style={{ color: 'red' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  img: {
    top: 29,
    width: '100%',
    height: 500,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E2F6C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E2F6C',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    padding: 20,
    fontSize: 18,
    color: '#4e4e4e',
    textAlign: 'justify',
    fontWeight: '800',
  },
  activeDot: {
    width: 40,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#1E2F6C',
  },
  inactiveDot: {
    width: 30,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#333',
  },
  nextButton: {
    marginBottom: 10,
    padding: 10,
    width: 200,
    height: 50,
    backgroundColor: '#1E2F6C',
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContinuar: {
    marginBottom: 10,
    padding: 10,
    width: 300,
    height: 50,
    backgroundColor: '#1E2F6C',
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center",
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 20,
  },
  acceptButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#1E2F6C',
    alignItems: 'center',
  },
});
