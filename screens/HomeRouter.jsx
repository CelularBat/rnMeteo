import React from 'react';
import HomeScreen from './HomeScreen';
import TestSVG from './TestSVG';
import { useUIStore } from '@/context/useStoreUI';

function  HomeRouter() {
    const {G_Is_Model_120} = useUIStore()

    return G_Is_Model_120 ?
        <TestSVG />
    : 
        <HomeScreen />;
}

export default  HomeRouter;