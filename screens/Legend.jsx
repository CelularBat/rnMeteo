import React from 'react';

import ImagePopUp from "@/components/reusable/ImagePopUp"
import { View,StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import legenda from "@/assets/images/leg_256.png";


const Legend = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <ImagePopUp imageSrc={legenda}  visible={true} onPress={()=>navigation.navigate('home')}/> 
        </View>

    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // background: "linear-gradient(135deg, #87CEEB, #FFFF99)"
  },
});

export default Legend;