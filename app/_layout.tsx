// App.js or _layout.js
import React from 'react';
import {FavListContextProvider} from "@/context/FavListContext"

import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawer from '@/components/CustomDrawer';
import HomeScreen from "@/screens/HomeScreen.jsx";
import CustomHeader from "@/components/CustomHeader.jsx";
import SearchScreen from "@/screens/SearchScreen";
import ModelMap from "@/screens/ModelMap";
import About from "@/screens/About";


const Drawer = createDrawerNavigator();

export default function RootLayout() {


  return (
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
        <Drawer.Screen  name="about" component={About} />
       
      </Drawer.Navigator>

  </FavListContextProvider>
  );
}