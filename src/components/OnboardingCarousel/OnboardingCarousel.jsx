import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native'; // Importação do hook useNavigation

const data = [
  {
    title: "Bem-vindo ao Safe Guardian",
    body: "Descubra um aplicativo inovador desenvolvido para oferecer cuidados e suporte a idosos. Nossa equipe de TCC identificou a necessidade de auxiliar aqueles que estão propensos a quedas, proporcionando segurança e tranquilidade para eles e suas famílias.",
    imgUrl: "https://images.pexels.com/photos/1382726/pexels-photo-1382726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "Como utilizar o Safe Guardian?",
    body: "Aprenda a explorar todas as funcionalidades do nosso aplicativo! Desde alertas de segurança até opções de comunicação com cuidadores, estamos aqui para garantir que você aproveite ao máximo essa ferramenta essencial para o cuidado de idosos.",
    imgUrl: "https://images.pexels.com/photos/2525714/pexels-photo-2525714.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "Envolva-se com a comunidade Safe Guardian",
    body: "Participe de uma rede de suporte! O Safe Guardian não é apenas um aplicativo, mas uma comunidade dedicada ao cuidado e bem-estar dos idosos. Junte-se a nós e faça a diferença na vida de quem precisa.",
    imgUrl: "https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

function CarouselCardItem({ item }) {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.imgUrl }} style={styles.img} resizeMode="cover" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );
}

const { width, height} = Dimensions.get('window');
const imageWidth = width * 1.0; 
const imageHeight = imageWidth * 1.0; 

export default function App() {
  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);  
  const carouselRef = useRef(null);
  const [showContinueButton, setShowContinueButton] = useState(false); 

  const onComplete = () => {
   
  console.log('Perfil')
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
          setShowContinueButton(index === data.length - 1); // Mostrar botão apenas no último slide
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
      {showContinueButton && ( // Mostrar botão com base no estado
        <TouchableOpacity style={styles.button} onPress={onComplete}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      )}
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
    width: imageWidth,
    height: imageHeight,
    borderRadius: 10, 
    overflow: 'hiden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    marginTop: 16,
  },
  body: {
    fontSize: 16,
    color: '#d1d1d1', 
    textAlign: 'center',
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
    color: '#1E2F6C',
    fontSize: 16,
  },
});
