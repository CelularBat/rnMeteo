// CityList.js
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FavListContext } from '@/context/FavListContext';
import { nanoid } from "nanoid/non-secure";
import AskModal from './reusable/AskModal';


function CityList  ({navigation})  {
    const [CityToDelete,setCityToDelete] = React.useState({});
    const [ShowAskModal,setShowAskModal] = React.useState(false);

    const {G_FavList,G_CurrentCity,setG_CurrentCity,G_deleteCity} = React.useContext(FavListContext);

    function onSelectCity(city){
        setG_CurrentCity(city);
        navigation.navigate('home')
        navigation.closeDrawer();

    }


    const renderList = G_FavList.map((city) => (
        <TouchableOpacity
          key={nanoid()}
          style={ (G_CurrentCity.id === city.id)? styles.cityItemActive : styles.cityItem}
          onPress={() => onSelectCity(city)}
          onLongPress={()=>{
            setCityToDelete(city);
            setShowAskModal(true)
          }}
        >
          <Text style={styles.cityText}>
            {city.location}  -  <Text style={styles.regionText}>{city.region}</Text>
            </Text>
          
        </TouchableOpacity>
      ))

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Ulubione miasta:</Text>
      {renderList}

      <AskModal visible={ShowAskModal} 
      onConfirm={()=>{
        G_deleteCity(CityToDelete.id)
        setShowAskModal(false);
      }}
      onCancel={()=>{
        setShowAskModal(false);
      }}
      >
          Czy na pewno usunąć {"\n"}
          <Text style={{ fontWeight: 'bold' }}> {CityToDelete.location} {"\n"} </Text>
          z ulubionych ?
      </AskModal>  
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  cityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cityItemActive:{
    padding: 11,
    borderColor:'blue',
    borderWidth: 2,
  },
  cityText: {
    fontSize: 16,
  },
  regionText:{
    fontSize: 13,
    color: "#333"
  },
  headerText:{
    fontWeight:"bolder",
    fontSize:18,
    alignSelf:"center"
  }
});

export default CityList;