// Design: https://uiverse.io/vinodjangid07/lucky-mole-65

import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ModelSwitch({isActive,onToogle}) {
  //const [isActive, setActive] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    onToogle();

    Animated.spring(translateX, {
      toValue: isActive ? 0 : 28,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Model</Text>

      <Pressable onPress={toggle}>
        <View style={styles.switch}>
          <LinearGradient
            colors={['#f5f5f5', '#cfcfcf', '#eeeeee', '#a9a9a9']}
            locations={[0, 0.35, 0.65, 1]}
            style={styles.track}
          >
            {/* Wewnętrzne wgłębienie switcha */}
            <View
              style={[
                styles.innerTrack,
                isActive && styles.innerTrackActive,
              ]}
            />

            {/* Kulka */}
            <Animated.View
              style={[
                styles.thumbWrapper,
                {
                  transform: [{ translateX }],
                },
              ]}
            >
              <LinearGradient
                colors={[
                  '#ffffff',
                  '#dcdcdc',
                  '#9e9e9e',
                  '#eeeeee',
                ]}
                style={styles.thumb}
              />
            </Animated.View>
          </LinearGradient>
        </View>
      </Pressable>

      {/* Napisy pod switchem */}
      <View style={styles.labels}>
        <Text style={styles.label}>old 60h</Text>
        <Text style={styles.label}>new 120h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 110,
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 0,
    color: 'white',
  },

  switch: {
    width: 53,
    height: 25,
    borderRadius: 13,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,

    elevation: 4,
  },

  track: {
    width: 53,
    height: 25,
    borderRadius: 13,

    borderWidth: 1,
    borderColor: '#999',

    overflow: 'hidden',

    justifyContent: 'center',
  },

  innerTrack: {
    position: 'absolute',

    left: 3,
    right: 3,
    top: 3,
    bottom: 3,

    borderRadius: 10,

    backgroundColor: '#b7b7b7',

    borderTopWidth: 1,
    borderTopColor: '#888',

    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
  },

  innerTrackActive: {
      backgroundColor: '#999999',
  borderTopColor: '#828282',
  borderBottomColor: '#c0c0c0',
  },

  thumbWrapper: {
    position: 'absolute',

    left: 2,
    top: 1,

    width: 21,
    height: 21,

    borderRadius: 11,

    zIndex: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.35,
    shadowRadius: 2,

    elevation: 3,
  },

  thumb: {
    width: 21,
    height: 21,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: '#8c8c8c',
  },

  labels: {
    width: 120,

    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 1,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: 'white',
  },
});