
import React from 'react';
import {FavListContextProvider} from "@/context/FavListContext"

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawer from '@/components/CustomDrawer';
import HomeScreen from "@/screens/HomeScreen.jsx";
import CustomHeader from "@/components/CustomHeader.jsx";
import SearchScreen from "@/screens/SearchScreen";
import ModelMap from "@/screens/ModelMap";
import AboutScreen from "@/screens/AboutScreen";
import Legend from "@/screens/Legend";


const Drawer = createDrawerNavigator();

const linking = {
  prefixes: ['/', 'rnmeteo://'],
  config: {
    screens: {
      home: 'home',
      search: 'search',
      modelMap: 'modelMap',
      about: 'about',
      legend: 'legend',
    },
  },
};


export default function RootLayout() {


  return (
  <NavigationContainer linking={linking}>
    <FavListContextProvider>

      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: true,
          header: (props) => <CustomHeader {...props} />,
          sceneStyle: {
            backgroundColor: "#87CEEB"
          }  
        }}
      >
        <Drawer.Screen name="home" component={HomeScreen} />
        <Drawer.Screen  name="search" component={SearchScreen} />
        <Drawer.Screen  name="modelMap" component={ModelMap} />
        <Drawer.Screen  name="about" component={AboutScreen} />
        <Drawer.Screen  name="legend" component={Legend} />
       
      </Drawer.Navigator>

    </FavListContextProvider>
  </NavigationContainer>

  );
}