

import ImagePopUp from "@/components/reusable/ImagePopUp"
import { View,StyleSheet } from 'react-native';
import legenda from "@/assets/images/leg_256.png";




function LegendContainer ({onPress}) {
    return (
        <View style={[styles.container]}>
            <ImagePopUp imageSrc={legenda}  visible={true} onPress={onPress}/> 
        </View>

    );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    height:'100%',
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },


});

export default LegendContainer;