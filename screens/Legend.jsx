import React from 'react';

import LegendContainer from '@/components/LegendContainer'
import { useNavigation } from '@react-navigation/native';




const Legend = () => {
    const navigation = useNavigation();
    return (
         <LegendContainer onPress={()=>navigation.navigate('home')} />
    );
};


export default Legend;