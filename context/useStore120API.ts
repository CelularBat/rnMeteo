/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*      STORE FOR MANAGING CALLS TO API MODEL 120 AND CACHING THE RESULTS     */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getDataModel120 ,T120Json} from '@/functions/API/120dataAPI';

import CacheHandler from './cacheHandler/cacheHandler';

interface TCacheIndexObj  {
  fstart : string,
  cacheKey : string,
}

const TIME_RETENTION = 1000 *60 * 60 * 24 ; // 24 hours
const api120Cache = new CacheHandler("api_120_cache:");

export const useStoreAPI120 = create(
  persist(
    (set, get) => ({
      cacheIndex: {} as Record<string, TCacheIndexObj>,

      getData: async (lat:number, lon:number) => {
        
       

        // If somehow parameters are wrapped in string, convert them
        if (typeof lat === 'string'){
          lat = Number(lat);
        }
        if (typeof lon === 'string'){
          lon = Number(lon);
        }

        if (!Number.isFinite(lat) || !Number.isFinite(lon)){
          console.warn("useStoreAPI120: getData(): Empty values passed. lat: "+lat+" lon: "+lon);
          return null;
        }

        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        /*                         GETTING FROM CACHE                         */
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

        const locationIdxKey = `${lat}&${lon}`;
        const entry : TCacheIndexObj = get().cacheIndex[locationIdxKey];

        // Check if we have cached data which is not terminated and retrieve it
        if (entry) {
          const fstartTime = new Date(entry.fstart).getTime();
          const now = Date.now();

          const isValid = !Number.isNaN(fstartTime) &&
            now - fstartTime < TIME_RETENTION; 
         
          if (isValid) {
            const cachedData : T120Json | null = await api120Cache.get(entry.cacheKey);

            if (cachedData) {
              console.debug("Retrieved data from JSONcache: " ,locationIdxKey);
              return cachedData;
            }
            else console.warn("JSONcache found in index, but can't be found: ",fstartTime ,locationIdxKey);
          } 
          else{
              console.debug("Found JSONcache, which are too old: ",fstartTime ,locationIdxKey);
              api120Cache.remove(entry.cacheKey);
              set((state:any) => {
                const cacheIndex = { ...state.cacheIndex };
                delete cacheIndex[locationIdxKey];
                return { cacheIndex };
              });
          }


        }
        else{
          console.debug("No JSONcache found for: " ,locationIdxKey);
        }

        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        /*                   NOT IN CACHE - GETTING FROM API                  */
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        
        const date = new Date();
          // We need to send correct date in UTC+0, but encoded in local Polish time (UTC+2 or UTC+1)
        if (date.getHours() < 7){
         
          date.setUTCHours(0, 0, 0, 0);
          date.setUTCHours(date.getUTCHours()-12);
        }
        else if (date.getHours() < 21){
          
          date.setUTCHours(0, 0, 0, 0);
          
        } else {
          date.setUTCHours(12, 0, 0, 0);
        }
        // Date mus be divided by 1000
        const timestamp = date.getTime() / 1000;

        
        const json : T120Json|null = await getDataModel120(timestamp, lat, lon, "120");
  
        if (!json || !json.data || !json.fstart) return null;

        const fstart = json.fstart;
        const cacheKey = `api120:${locationIdxKey}`;

        // Store the full JSON outside Zustand.
        await api120Cache.set(cacheKey, json);

        // Store only the small index in Zustand.
        set((state:any) => ({
          cacheIndex: {
            ...state.cacheIndex,
            
            [locationIdxKey]: {
              fstart,
              cacheKey,
            },
          },
        }));

        return json;
      },
    }),
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /*                    PERSISTENT ZUSTAND STORE SETTINGS                   */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    {
      name: 'api120-index',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state:any) => ({
        cacheIndex: state.cacheIndex,
      }),
    }
  )
);