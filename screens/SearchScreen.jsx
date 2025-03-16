
import React, { useState } from 'react';
import { nanoid } from "nanoid";
import { View, Text, TextInput, StyleSheet, FlatList, Alert,Pressable } from 'react-native';
import Button from "@/components/reusable/Button";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import {searchPlace} from "@/functions/searchCityHandler";
import {coordsToXYString} from "@/functions/coordsHandler";

import { FavListContext } from '@/context/FavListContext';

import AskModal from "@/components/reusable/AskModal";

import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const [SearchQuery, setSearchQuery] = useState(''); 
  const [ResultsList,setResultsList] = React.useState([]);

  const [ShowAskModal,setShowAskModal] = React.useState(false);
  const [PressedCity,setPressedCity] = React.useState({});


  const {G_addCity, setG_CurrentCity} = React.useContext(FavListContext);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (SearchQuery.trim() === '') {
      Alert.alert('Błąd', 'Proszę wpisać nazwę miejscowości.'); 
    } else {
      
      const result = await searchPlace(SearchQuery);
      setResultsList(result);
    }
  };

  const handleCityPress = async (item)=>{
    setPressedCity(item);
    let objXY = await coordsToXYString(item.lat , item.lon);
    if (objXY.status === 1){
        item.XYstr = objXY.data;
        setG_CurrentCity(item);
        setShowAskModal(true);
    }
    else{
        Alert.alert("Miejsowość poza zasięgiem modelu pogody!")
    }
  };

  return (
    <View style={styles.container}>
        {/* <Text style={styles.title}>Wpisz nazwę miejscowości</Text> */}
        <View style ={styles.searchContainer}>
            <TextInput
                style={styles.input}
                placeholder="Nazwa miejscowości"
                value={SearchQuery}
                onChangeText={setSearchQuery} 
            /> 
            <Button onPress={handleSearch} >
                <FontAwesome5 name="search-location" size={18} color="green" />  Szukaj
            </Button>
        </View>
   
        <View style={styles.resultsContainer}>   
            {ResultsList.length > 0 ? (
                <FlatList
                data={ResultsList}
                keyExtractor={() => nanoid()}
                renderItem={({ item }) => (
                    <Pressable style={[
                        styles.resultItem, 
                        (PressedCity.name === item.name) && styles.resultItem_marked 
                    ]} 
                    onPress={()=>handleCityPress(item)}>
                        <Text style={styles.resultText}>
                            {item.name}
                        </Text>
                    </Pressable>
                )}
                style={styles.resultsList}
                />
            ) : (
                <Text style={styles.noResultsText}>Brak wyników</Text>
            )}
        </View>

        <Button onPress={()=>navigation.navigate('modelMap')} >
                <FontAwesome5 name="map" size={18} color="green" />  Pokaż zasięg modelu
        </Button>
        


        <AskModal visible={ShowAskModal} 
        onConfirm={()=>{
            G_addCity(PressedCity);
            setShowAskModal(false);
            navigation.navigate('home')
        }}
        onCancel={()=>{
            setShowAskModal(false);
            navigation.navigate('home')
        }} >
            Czy dodać {"\n"}
            <Text style={{ fontWeight: 'bold' }}> {PressedCity.name} {"\n"} </Text>
            do listy ulubionych?
        </AskModal>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Background color for the screen
    display: "flex",
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '70%',
    height: 40,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff', // Background color for the input field
  },

  searchContainer: {
    flex: 1,
    height: 50,
    maxHeight:50,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },
  resultsContainer:{
    flex:1,
    marginBlock:10,
    maxHeight:"80%",
  },
  resultItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff', 
    marginBlock:3,
  },
  resultItem_marked:{
    backgroundColor: 'yellow'
  },
  resultText: {
    fontSize: 14,
  },
  noResultsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default SearchScreen;