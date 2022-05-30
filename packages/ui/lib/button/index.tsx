import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import ButtonInterface from './interface';
import styles from './style';

export default (props: ButtonInterface) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.button}>{props.children}</View>
    </TouchableOpacity>
  );
}
