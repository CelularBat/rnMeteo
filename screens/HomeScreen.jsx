import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

import ImageContainer from "@/components/ImageContainer.jsx"
import { getCurrentDateString , createImgUrl} from "@/functions/coordsHandler";
import { FavListContext } from '@/context/FavListContext';


const HomeScreen = () => {
  const [RefreshFlag,setRefreshFlag] = React.useState(0);

  const {G_CurrentCity} = React.useContext(FavListContext);

  let currentDate = getCurrentDateString();

  const handleRefresh = () => {
    setRefreshFlag(prev=>prev+1)
  };

  const currentURL = React.useMemo(() => { 
    if(G_CurrentCity){
      return (createImgUrl(G_CurrentCity.XYstr,currentDate));
    }
    else {
      return ("");
    }
    
  },[currentDate,G_CurrentCity,RefreshFlag]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <FontAwesome5 name="sync-alt" size={12} color="white" />
      </TouchableOpacity>

      <ImageContainer url={currentURL}/>
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
  refreshButton: {
    zIndex:99999999,
    position: 'absolute',
    top: 5,
    right: 10, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
    elevation: 5, // Shadow on Android
    shadowColor: "#000", // Shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default HomeScreen;