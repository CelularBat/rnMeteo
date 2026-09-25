/* context/useStoreDayData.js */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*              STORE FOR SUNRISE/SUNSET DATA AND DAILY CACHING              */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getDayData } from '@/functions/dayDataAPI';

import * as dayDataCache from './cacheHandler/cacheHandler';


export const useStoreDayData = create(
  persist(
    (set, get) => ({
      cacheIndex: {},

      getDayData: async (lon, lat) => {
        if (!lat || !lon) {
          console.warn('useStoreDayData: getDayData(): Empty values passed');
          return null;
        }

        const locationIdxKey = `${lon}&${lat}`;
        const cacheIndex = get().cacheIndex;
        const entry = cacheIndex[locationIdxKey];

        // Dzisiejsza data w formacie YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Sprawdź cache
        if (entry) {
          const cachedData = await dayDataCache.get(entry.cacheKey);

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
        const dayData = await getDayData(lon, lat);

        if (!dayData || !dayData.date) {
          return null;
        }
        const cacheKey = `dayData:${locationIdxKey}:${dayData.date}`;

       // Store the full JSON outside Zustand.
        await dayDataCache.set(cacheKey, dayData);

         // Store only the small index in Zustand.
        set((state) => ({
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

      partialize: (state) => ({
        cacheIndex: state.cacheIndex,
      }),
    }
  )
);