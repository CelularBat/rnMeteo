import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';
import { Image } from 'expo-image';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';


function ImageContainer({ url,doCropBanner }) {

// on longPress we change key, so component is replaced with new instance.
const [zoomableKey, setZoomableKey] = React.useState(0);
const handleLongPress = () => {
  setZoomableKey(prev => prev + 1);
};

// --START OF SECTION: handling cropping
async function croppImg(url){
  try{
      return await ImageManipulator.manipulateAsync(
      url,
      [{crop: {
            originX: 0,
            originY: 120,
            width: 660,
            height: 780,
          }
      }],
      {
        compress: 0.9,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
  } catch(err){
    console.error(url,err);
  }

}

function cleanCachedImg(urlCache){
  if (Platform.OS === 'web') return;
  FileSystem.deleteAsync(urlCache, {
      idempotent: true,
    });
}

const [ImgUrl, setImgUrl] = React.useState();

React.useEffect(() => {
  if (!url) return;
  if (!doCropBanner){
    setImgUrl(url); 
    return;
  } 
  let croppedUrl;
  let unMounted = false;

  const crop = async () => {
    const result = await croppImg(url);
    setImgUrl(result.uri);
    croppedUrl=result.uri;

    // Race-condition check. If component is unmounted before img is cropped, then useEffect cleanup is missed, and we need
    // to clean it here.
    if (unMounted){ 
      cleanCachedImg(url);
    }
  }
  crop();

  // On unmount clearing cropped image from cache.
  return ()=>{
     unMounted = true; 
     if (croppedUrl) {
      cleanCachedImg(url);
    }
  }
}, [url,doCropBanner]);


  return (
    <View style={styles.container}>
      <ReactNativeZoomableView
        key={zoomableKey}
        maxZoom={2.5}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        disablePanOnInitialZoom={true}
        bindToBorders={true}
        pinchToZoomInSensitivity={5}
        movementSensibility={3}
        doubleTapZoomToCenter={true}
        onLongPress={handleLongPress}

        
       // panEnabled={false}
      >
        <Image source={{ uri: ImgUrl }} style={styles.image} contentFit='contain' />
      </ReactNativeZoomableView>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    
    flex:1,
    width:'100%',
     height:'100%',
     overflow:'visible',
     transformOrigin:'bottom',
   
  },
  image: {
    flex:1,
    minWidth:'450px',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
}); 
 
export default ImageContainer;
