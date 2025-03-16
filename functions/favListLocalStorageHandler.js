import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to cache
const saveToCache = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log('Data saved to cache successfully!',key,jsonValue);
  } catch (error) {
    console.error('Failed to save data to cache:', error);
  }
};

// Retrieve data from cache
const getFromCache = async (key) => {
  try {
    const jsonValue  = await AsyncStorage.getItem(key);
    console.log(jsonValue)

    if (jsonValue ) {
      const value = JSON.parse(jsonValue);
      console.log(`Retrieved data for key: ${key}:`, value);
      return value;
    } else {
      console.log(`No data found for the given key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to retrieve data from cache for key: ${key}:`, error);
  }
};

module.exports = {saveToCache,getFromCache}