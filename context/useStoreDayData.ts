
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*              STORE FOR SUNRISE/SUNSET DATA AND DAILY CACHING              */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getDayData,TDayData } from '@/functions/dayDataAPI';

import * as dayDataCache from './cacheHandler/cacheHandler';

interface TDayCacheIndexObj  {
  date : string,
  cacheKey : string,
}

export const useStoreDayData = create(
  persist(
    (set, get) => ({
      cacheIndex: {},

      getDayData: async (lon:number, lat:number) => {
        if (!lat || !lon) {
          console.warn('useStoreDayData: getDayData(): Empty values passed');
          return null;
        }

        // If somehow parameters are wrapped in string, convert them
        if (typeof lat === 'string'){
          lat = Number(lat);
          if (!Number.isFinite(lat)){
            console.warn("useStoreDayData: getData(): lat: "+lat+ " is inValid number");
            return null;
          }
        }
        if (typeof lon === 'string'){
          lon = Number(lon);
          if (!Number.isFinite(lon)){
            console.warn("useStoreDayData: getData(): lon: "+lon+ " is inValid number");
            return null;
          }
        }
        
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        /*                             GETTING FROM CACHE                             */
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        const locationIdxKey = `${lon}&${lat}`;
        const cacheIndex = get().cacheIndex;
        const entry:TDayCacheIndexObj = cacheIndex[locationIdxKey];

        // Dzisiejsza data w formacie YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Sprawdź cache
        if (entry) {
          const cachedData : TDayData = await dayDataCache.get(entry.cacheKey);

          if (cachedData) {
            if (cachedData.date === today) {
              console.debug('Retrieved dayData from JSONcache:',locationIdxKey );
              return cachedData;
            }

            console.debug('Found dayData in cache, but date is outdated:',cachedData.date,locationIdxKey);
          } else {
            console.warn('JSONcache found in index, but cannot be found:',locationIdxKey);
          }
        } else {
          console.debug('No dayData cache found for:',locationIdxKey);
        }

         // Cache miss or expired cache -> fetch new data.
        const dayData : TDayData = await getDayData(lon, lat);

        if (!dayData || !dayData.date) {
          return null;
        }
        const cacheKey = `dayData:${locationIdxKey}:${dayData.date}`;

       // Store the full JSON outside Zustand.
        await dayDataCache.set(cacheKey, dayData);

         // Store only the small index in Zustand.
        set((state:any) => ({
          cacheIndex: {
            ...state.cacheIndex,

            [locationIdxKey]: {
              date: dayData.date,
              cacheKey,
            },
          },
        }));

        return dayData;
      },
    }),
    {
      name: 'dayData-index',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state:any) => ({
        cacheIndex: state.cacheIndex,
      }),
    }
  )
);