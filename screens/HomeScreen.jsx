import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Platform, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ImageContainer from "@/components/ImageContainer.jsx"
import { getCurrentDateString , createImgUrl} from "@/functions/coordsHandler";
import { FavListContext } from '@/context/FavListContext';


const HomeScreen = () => {
  const [RefreshFlag,setRefreshFlag] = React.useState(0);

  const {G_CurrentCity} = React.useContext(FavListContext);

  let currentDate = getCurrentDateString();
  const navigation = useNavigation();
  

  const currentURL = React.useMemo(() => { 
    if(G_CurrentCity){
      return (createImgUrl(G_CurrentCity.XYstr,currentDate));
    }
    else {
      return ("");
    }
    
  },[currentDate,G_CurrentCity,RefreshFlag]);

  const handleRefresh = () => {
    setRefreshFlag(prev=>prev+1)
  };

  // Android only
  const handleShare = async() => {
    await Share.share({
      message: currentURL
    });
  };

  return (
    
    <View style={styles.container}>
      // Legend button
      <TouchableOpacity style={[styles.btn, styles.legendBtn]}
      onPress={()=>navigation.navigate('legend')}
        >
            <FontAwesome5 name="info-circle" size={18} color="blue" />  
      </TouchableOpacity>

      // Share button - Android only
      {Platform.OS !== "web" &&

        <TouchableOpacity style={[styles.btn, styles.shareBtn]} 
        onPress={handleShare}>
          <FontAwesome5 name="share-alt" size={12} color="black" />
        </TouchableOpacity>
      }

      // Refresh button
      <TouchableOpacity style={[styles.btn, styles.refreshBtn]}
      onPress={handleRefresh}>
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
  btn: {
    zIndex: 99999999,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  refreshBtn: {
    top: 5,
    right: 10,
  },

  shareBtn: {
    top: 5,
    right: 100,
    backgroundColor: 'rgba(240, 246, 255, 0.73)',
  },
  
  legendBtn: {
    top: 5,
    left: 10,
    backgroundColor: 'rgba(45, 133, 255, 0.57)',
  },

  
});

export default HomeScreen;