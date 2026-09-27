// components/CustomHeader.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FavListContext } from '@/context/FavListContext';
import c from '@/context/constStore';
import MetallicSwitch from './reusable/MetallicSwitch';
import { useUIStore } from '@/context/useStoreUI';
import { adjustVal_Smaller_ScreenW } from '@/hooks/useResponsiveThresholds';

const CustomHeader = ({route}) => {
  const navigation = useNavigation();
  const {G_CurrentCity} = React.useContext(FavListContext);
  const {G_Is_Model_120,G_Toogle_Model_120} = useUIStore();

  const styles = useStyles();

  let title;
  let showModelSwitch = false;
  switch(route.name){
    case 'home': title = (
      <>
        <Text style={styles.title}>{G_CurrentCity.location}</Text>
        <Text style={styles.region}>{G_CurrentCity.region}</Text>
      </>
    );
    showModelSwitch = true;
    break;

    case 'search': title=(
      <Text style={styles.title}>Szukaj miejscowości:</Text>
    )
    break;

    case 'modelMap': title=(
      <Text style={styles.title}>Mapa zasięgu modelu</Text>
    )
    break;

    case 'about': title=(
      <Text style={styles.title}>O aplikacji:</Text>
    )
    break;
    
    case 'legend': title=(
      <Text style={styles.title}>Legenda:</Text>
    )
    break;
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Text style={styles.menuIcon}>☰</Text> 
      </TouchableOpacity>

      <View style={styles.titleContainer}>
         {title}
      </View>

      {showModelSwitch &&
      <View>
        <MetallicSwitch isActive={G_Is_Model_120} onToogle={G_Toogle_Model_120}/>
      </View>}
      
    </View>
  );
};

const useStyles = () => {
    const title_fontSize = adjustVal_Smaller_ScreenW(18, [[390, 15]]);
    const region_fontSize = adjustVal_Smaller_ScreenW(15, [[390, 13]]);

    return React.useMemo(() => StyleSheet.create({
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            height: c.headerBarHeight,
            backgroundColor: '#f4511e',
        },
        menuIcon: {
            fontSize: 24,
            color: '#fff',
            marginRight: 16,
        },
        titleContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize:title_fontSize,
            fontWeight: 'bold',
            color: '#fff',
        },
        region: {
            fontSize: region_fontSize,
            fontWeight: 'normal',
            color: '#eee',
        },
    }), [title_fontSize,region_fontSize]);
};

export default CustomHeader;