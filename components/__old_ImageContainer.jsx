import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

function ImageContainer({url}) {
    return (
    
        <View style={styles.imageContainer}>
          <Image source={{uri: url}} style={styles.image} contentFit='contain' />
        </View>
   
    );
}

const styles = StyleSheet.create({

    imageContainer: {
      flex: 1,
      width: "100%",

    },
    image: {
      flex: 1
    },
  });

export default ImageContainer;