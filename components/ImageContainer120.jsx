import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

import MainSVG from './svgMaker/MainSVG';



function ImageContainer120({ json,StartPos,DayData }) {




/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                              REBDERING SECTION                             */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// on longPress we change key, so component is replaced with new instance.
const [zoomableKey, setZoomableKey] = React.useState(0);
const handleLongPress = () => {
  setZoomableKey(prev => prev + 1);
};



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
        doubleTapZoomToCenter={false}
        onLongPress={handleLongPress}

        
       // panEnabled={false}
      >
        
        <MainSVG json={json} StartPos={StartPos}  DayData={DayData} style={styles.image} contentFit='contain'/>
      </ReactNativeZoomableView>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    
    flex:1,
    width:'100%',
     height:'100%',
     overflow:'visible'
   
  },
  image: {
    flex:1,
    minWidth:'450px',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
}); 
 
export default ImageContainer120;
