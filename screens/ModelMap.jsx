import React from 'react';

import ImagePopUp from "@/components/reusable/ImagePopUp"
import { View,StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import mapa from "@/assets/images/oreografia.png";


const ModelMap = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <ImagePopUp imageSrc={mapa}  visible={true} onPress={()=>navigation.navigate('search')}/> 
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

export default ModelMap;