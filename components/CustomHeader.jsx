// components/CustomHeader.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FavListContext } from '@/context/FavListContext';

const CustomHeader = ({route}) => {
  const navigation = useNavigation();
  const {G_CurrentCity} = React.useContext(FavListContext);

  switch(route.name){
    case 'home': title = (
      <>
        <Text style={styles.title}>{G_CurrentCity.location}</Text>
        <Text style={styles.region}>{G_CurrentCity.region}</Text>
      </>
    );
    refreshBtnVisible = true;
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
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Text style={styles.menuIcon}>☰</Text> 
      </TouchableOpacity>

      <View style={styles.titleContainer}>
         {title}
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 70,
    backgroundColor: '#f4511e',
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 16,
  },
  titleContainer:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  region: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#eee',
  },
});

export default CustomHeader;