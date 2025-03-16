import { StyleSheet, View, Pressable, Text } from 'react-native';

import React from 'react';

function Button({children,onPress}) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonLabel}>
                    {children}
                </Text>
            </Pressable>
            
        </View>
    );
}

export default Button;

const styles = StyleSheet.create({
    buttonContainer: {

      height: 40,
      marginBlock: 5,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
    },
    button: {
      borderRadius: 10,
      borderColor:'green',
      borderWidth:3,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    buttonLabel: {
      color: '#000',
      fontSize: 16,
      marginHorizontal:10,
    },
  });