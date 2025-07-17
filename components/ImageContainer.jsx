import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

function ImageContainer({ url }) {

  return (
    <View style={styles.container}>
      <ReactNativeZoomableView
        maxZoom={2.5}
        minZoom={1}
        zoomStep={0.1}
        initialZoom={1}
        disablePanOnInitialZoom={true}
        bindToBorders={true}
        pinchToZoomInSensitivity={5}
        movementSensibility={3}
        doubleTapZoomToCenter={true}
        
       // panEnabled={false}
      >
        <Image source={{ uri: url }} style={styles.image} contentFit='contain' />
      </ReactNativeZoomableView>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  image: {
    flex:1,
    width: '100%',
    height: '100%',
     resizeMode: 'contain'
  },
}); 
 
export default ImageContainer;
