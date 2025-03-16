import React from 'react';

import MapPopUp from "@/components/MapPopUp"
import { View,StyleSheet } from 'react-native-web';
import { useNavigation } from '@react-navigation/native';


const ModelMap = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <MapPopUp visible={true} onPress={()=>navigation.navigate('search')}/> 
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