import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Platform, Share } from 'react-native';
import {useWindowDimensions} from  'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import MainSVG from '@/components/svgMaker/MainSVG';
import ImageContainer120 from '@/components/ImageContainer120';
import LegendContainer from '@/components/LegendContainer';
import AnimatedSun from '@/components/AnimatedSun';

import { FavListContext } from '@/context/FavListContext';
import { useStoreAPI120 } from '@/context/useStore120API';
import { useStoreDayData } from '@/context/useStoreDayData';

const STEP_HOURS = 12;

const TestSVG = () => {

    const [RefreshFlag,setRefreshFlag] = React.useState(0);
    const [ShowLegend, setShowLegend] = React.useState(false);
    const navigation = useNavigation();

    const [StartPos, setStartPos] = React.useState(0);
    const [MinPos, setMinPos] = React.useState(0);
    const [JSON, setJSON] = React.useState(null);
    const [DayData, setDayData] = React.useState();

    const {G_CurrentCity} = React.useContext(FavListContext);
    const {getData} = useStoreAPI120();
    const {getDayData} = useStoreDayData();

    React.useEffect(() => {
        if(G_CurrentCity && G_CurrentCity.XYstr){
            (async()=>{
                const res = await getData(G_CurrentCity.lat, G_CurrentCity.lon);
                setJSON(res);
                
                const resDay = await getDayData(G_CurrentCity.lat, G_CurrentCity.lon);
                setDayData(resDay);

                /* Offset, so we render only data since current time ====== */
                const fstart = new Date(res.fstart);
                const now = new Date();
                const currentOffset = Math.round((now - fstart) / (1000 * 60 * 60)) -3;
                
                 setMinPos(currentOffset)
                 setStartPos(currentOffset);

            })()
        } 
    }, [G_CurrentCity,RefreshFlag]);



    const handleRefresh = () => {
        setRefreshFlag(prev=>prev+1)
    };

    const handleLegendClick =()=>{
        if (width < 730) {
            navigation.navigate('legend');
        }
        else{
            setShowLegend((prev)=>!prev);
        }  
    }   


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                              RENDERING SECTION                             */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    const {width,height} = useWindowDimensions();
    const isVertical = height > width;


    const leftArrow =( <TouchableOpacity
            style={[styles.arrowButton, styles.arrowLeft]}
            activeOpacity={0.7}
            onPress={() =>
                setStartPos((prev) => (prev - STEP_HOURS >= MinPos ? prev - STEP_HOURS : MinPos))
            }
        >
            <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>)

    const rightArrow=(<TouchableOpacity
            style={[styles.arrowButton, styles.arrowRight]}
            activeOpacity={0.7}
            onPress={() =>
                setStartPos((prev) => (prev + STEP_HOURS < 80 ? prev + STEP_HOURS : prev))
            }
        >
            <FontAwesome5 name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>)


    const SVG = (JSON && DayData) ? 
        (<ImageContainer120 json={JSON} StartPos={StartPos} DayData={DayData} />)
        : (<AnimatedSun text="Pobieranie danych..." size={200} speed={0.6} timeout={10000} textTimeout='Błąd połączenia:('/>);

    const refreshBtn= (
    <TouchableOpacity style={[styles.btns, styles.refreshBtn]}
      onPress={handleRefresh}>
        <FontAwesome5 name="sync-alt" size={12} color="white" />
    </TouchableOpacity>)
      

    const legentBtn = 
      (<TouchableOpacity style={[styles.btns, styles.legendBtn]}
      onPress={(handleLegendClick)}
      >
        <FontAwesome5 name="info-circle" size={18} color="blue" />  
      </TouchableOpacity>)


      

    return (
    <View style={[styles.container,
        isVertical && styles.containerVertical]}>

        {legentBtn}
        {refreshBtn}

         {isVertical &&
            <View style={styles.arrowsVertical}>
        
                
                {leftArrow}
                {rightArrow}

            </View>
        }


        {!isVertical && leftArrow}

        { !isVertical  && ShowLegend &&
         <LegendContainer onPress={()=>setShowLegend(false)}/>
       }
        {SVG}

        {!isVertical && rightArrow}


        
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height:'100%',
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
    },

    arrowButton: {
        marginLeft: 40,
        marginRight:40,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#1976D2',

        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

      btns: {
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
    
    legendBtn: {
        top: 5,
        left: 10,
        backgroundColor: 'rgba(45, 133, 255, 0.57)',
    },

/* vertical pos ============================================================= */
    containerVertical: {
        display:'flex',
        width:'100%',
        maxWidth:'100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    arrowsVertical: {
        marginTop:30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 90,
        paddingVertical: 10,
        paddingBottom: 20
    },
});

export default TestSVG;