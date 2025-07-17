import React from "react";
import {saveToCache,getFromCache} from "@/functions/favListLocalStorageHandler.js";
import { nanoid } from "nanoid/non-secure";

const exampleList = [
    {   id: 1,
        location: "Jamniki, gmina Urszulin",
        region: "województwo lubelskie",
        XYstr: "&row=423&col=283" 
    },
    {
        id: 2,
        location: "Heiligenstedtenerkamp, Amt Itzehoe-Land",
        region: "Szlezwik-Holsztyn, Niemcy",
        XYstr: "&row=346&col=59" 
    },
    {
        id: 3,
        location: "Keuruu, Keuruun seutukunta",
        region: "Manner-Suomi, Finlandia",
        XYstr: "&row=290&col=122" 
    },
    {
        id: 4,
        location: "Złe Mięso, gmina Czersk",
        region: "województwo pomorskie",
        XYstr: "&row=199&col=360" 
    }
]

const FavListContext = React.createContext(null);


function FavListContextProvider({children}) {
    const [G_FavList,setG_FavList] = React.useState([]);
    const [G_CurrentCity,setG_CurrentCity] = React.useState({});

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

    //On Load
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

    // On change
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