// CustomDrawer.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CityList from "./CityList";
import Button from "./reusable/Button";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const CustomDrawer = ({ navigation }) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>

          <Button onPress={()=>navigation.navigate('about')}>
            O aplikacji
          </Button>

          <Button onPress={()=>navigation.navigate('search')}> 
            <FontAwesome5 name="search-location" size={18} color="green" />  Znajdź miejscowość
          </Button>
        
      </View>
      <CityList {...{navigation}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerItem: {
    paddingVertical: 10,
  },
});

export default CustomDrawer;