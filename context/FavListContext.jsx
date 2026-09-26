/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                CONTEXT FOR MANAGING LIST OF FAVORITE CITIES                */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Old implementation - to be replaced with zustand store
import React from "react";
import {saveToCache,getFromCache} from "@/functions/favListLocalStorageHandler";
import { nanoid } from "nanoid/non-secure";

const exampleList = [
    {   id: 1,
        location: "Jamniki, gmina Urszulin",
        region: "województwo lubelskie",
        XYstr: "&row=423&col=283",
        lon: 23.1033535,
        lat: 51.4556024, 
    },
    {
        id: 2,
        location: "Heiligenstedtenerkamp, Amt Itzehoe-Land",
        region: "Szlezwik-Holsztyn, Niemcy",
        XYstr: "&row=346&col=59" ,
        lon: 9.4663342,
        lat: 53.8995053, 
    },
    {
        id: 3,
        location: "Keuruu, Keuruun seutukunta",
        region: "Manner-Suomi, Finlandia",
        XYstr: "&row=290&col=122",
        lon: 24.7083599,
        lat: 62.2579819,  
    },
    {
        id: 4,
        location: "Złe Mięso, gmina Czersk",
        region: "województwo pomorskie",
        XYstr: "&row=199&col=360",
        lon: 18.1066872,
        lat: 53.8278296,  
    }
]

const FavListContext = React.createContext(null);


function FavListContextProvider({children}) {
    /* states =============================================================== */
    const [G_FavList,setG_FavList] = React.useState([]);
    const [G_CurrentCity,setG_CurrentCity] = React.useState({});

    /* methods ============================================================== */
    function G_deleteCity (id){
        setG_FavList((prev) => { 
          const newlist = prev.filter(item=>item.id !== id);  
          return(newlist); 
        })
    }
 
    function G_addCity(city){
        city.id = nanoid();
        setG_FavList(prev=>[...prev,city]);
    }

    /* On first load ======================================================== */
    // Get saved city list from cache, load it into context state. 
    // If it's epty load example list
    React.useEffect( ()=>{
      (async () => {
        const cachedList = await getFromCache("fav");
        if (cachedList) {
            setG_FavList(cachedList); 
        } 
        else{
            setG_FavList(()=>{
                setG_CurrentCity(exampleList[0]);
               return exampleList;
            }); 
        } 

        const cachedCurrent = await getFromCache("currentCity");
        if (cachedCurrent?.id){
            setG_CurrentCity(cachedCurrent);
        }

      })();
    },[]);

    /* On change save changes to  cache ===================================== */
    React.useEffect( ()=>{
        if (G_FavList.length > 0) {
            saveToCache("fav", G_FavList);
        }
    },[G_FavList]);

    React.useEffect( ()=>{
        if (G_CurrentCity?.id) {
            saveToCache("currentCity", G_CurrentCity);
        }
    },[G_CurrentCity]);


    
    return (
        <FavListContext.Provider value={{
            G_FavList,
            G_deleteCity,
            G_addCity,
            G_CurrentCity,setG_CurrentCity
        }}>
            {children}
        </FavListContext.Provider>
    );
}

export  {FavListContextProvider,FavListContext};