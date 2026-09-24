/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*      STORE FOR MANAGING CALLS TO API MODEL 120 AND CACHING THE RESULTS     */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getDataModel120} from '@/functions/coordsHandler';

 import * as api120Cache from './cacheHandler/cacheHandler';


const TIME_RETENTION = 1000 *60 * 60 * 24 ; // 48 hours

export const useStoreAPI120 = create(
  persist(
    (set, get) => ({
      cacheIndex: {},

      getData: async (lat, lon) => {
        if (!lat || !lon){
          console.warn("useStoreAPI120: getData(): Empty values passed");
          return null;
        }

        const locationIdxKey = `${lat}&${lon}`;
        const cacheIndex = get().cacheIndex;
        const entry = cacheIndex[locationIdxKey];

        // Check if we have cached data which is not terminated and retrieve it
        if (entry) {
          const fstartTime = new Date(entry.fstart).getTime();
          const now = Date.now();

          const isValid = !Number.isNaN(fstartTime) &&
            now - fstartTime < TIME_RETENTION;
         
          if (isValid) {
            const cachedData = await api120Cache.get(entry.cacheKey);

            if (cachedData !== null) {
              console.debug("Retrieved data from JSONcache: " ,locationIdxKey);
              return cachedData;
            }
            else console.warn("JSONcache found in index, but can't be found: ",fstartTime ,locationIdxKey);
          } 
          else console.debug("Found JSONcache, which are too old: " ,locationIdxKey);
        }
        else{
          console.debug("No JSONcache found for: " ,locationIdxKey);
        }

        // Cache miss or expired cache -> fetch new data.
        const date = new Date();

        // We need to get json with currentdate at 00:00 CET or 22:00 (previous day) UTC, divided by 1000
        date.setUTCHours(0, 0, 0, 0);
        date.setUTCHours(date.getHours()-2);
        
        const timestamp = date.getTime() / 1000;

        
        const json = await getDataModel120(timestamp, lat, lon);
  
        if (!json || !json.data || !json.fstart) return null;

        const fstart = json.fstart;
        const cacheKey = `api120:${locationIdxKey}:fstart`;

        // Store the full JSON outside Zustand.
        await api120Cache.set(cacheKey, json);

        // Store only the small index in Zustand.
        set((state) => ({
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
    {
      name: 'api120-index',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        cacheIndex: state.cacheIndex,
      }),
    }
  )
);