import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import ButtonInterface from './interface';
import styles from './style';

export default (props: ButtonInterface) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.button}>
        {
          typeof props.children === 'string' ? (
            <Text style={styles.text}>{props.children}</Text>
          ) : props.children
        }
      </View>
    </TouchableOpacity>
  );
}
