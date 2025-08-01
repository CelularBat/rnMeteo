import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';


function ImagePopUp({imageSrc,visible, onPress}) {

    return (
    
        <Pressable style={[styles.imageContainer, (!visible) && styles.hidden ]}
            onPress={onPress}
        >
                 <Image source={imageSrc} style={styles.image} contentFit='contain' />
                 
        </Pressable>
       
    );
}

const styles = StyleSheet.create({

    imageContainer: {
      flex: 1,
      width: "100%",
      display: "absolute"
    },
    hidden:{
        display:"none"
    },
    image: {
      flex: 1
    },
  });

export default ImagePopUp;