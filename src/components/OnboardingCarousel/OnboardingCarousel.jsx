import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const data = [
  {
    title: "Bem-vindo ao Safe Guardian",
    body: "Descubra um aplicativo inovador desenvolvido para oferecer cuidados e suporte a idosos. Nossa equipe de TCC identificou a necessidade de auxiliar aqueles que estão propensos a quedas, proporcionando segurança e tranquilidade para eles e suas famílias.",
    image: require('../../Img/Img1.png'),
  },
  {
    title: "Como utilizar o Safe Guardian?",
    body: "Aprenda a explorar todas as funcionalidades do nosso aplicativo! Desde alertas de segurança até opções de comunicação com cuidadores.",
    image: require('../../Img/img2.png'),
  },
  {
    title: "Envolva-se com a comunidade Safe Guardian",
    body: "Participe de uma rede de suporte! O Safe Guardian não é apenas um aplicativo, mas uma comunidade dedicada ao cuidado e bem-estar dos idosos. Junte-se a nós e faça a diferença na vida de quem precisa.",
    image: require('../../Img/splash.png'),
  },
];

const { width: viewportWidth } = Dimensions.get('window');

function CarouselCardItem({ item }) {
  return (
    <View style={styles.cardContainer}>
      <Image source={item.image} style={styles.img} resizeMode="cover" />
      <Text style={styles.title}>{item.title}</Text>
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

  const handleContinue = () => {
    if (termsAccepted) {
      onComplete();
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Carousel
        layout="default"
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
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
      {showContinueButton && (
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonContinuar}>Continuar</Text>
        </TouchableOpacity>
      )}


      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2F6C',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  img: {
    width: viewportWidth,
    height: viewportWidth,
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  body: {
    fontSize: 18,
    color: '#f1f1f1',
    textAlign: 'justify',
    marginTop: 8,
  },
  activeDot: {
    width: 40,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#F9F9F9',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inactiveDot: {
    width: 30,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: 'rgba(249, 249, 249, 0.4)',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContinuar: {
    color: '#1E2F6C',
    fontSize: 16,
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
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 20,
  },
  acceptButton: {
    padding: 10,
    backgroundColor: '#1E2F6C',
    borderRadius: 5,
    alignItems: 'center',
  },
});
