import React, { useRef } from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  Animated,
} from 'react-native';

function Button({ children, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={styles.button}
        onPressIn={animateIn}
        onPressOut={animateOut}
        onPress={onPress}
      >
        <Text style={styles.buttonLabel}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 40,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    borderColor: 'green',
    borderWidth: 3,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#000',
    fontSize: 16,
    marginHorizontal: 10,
  },
});
