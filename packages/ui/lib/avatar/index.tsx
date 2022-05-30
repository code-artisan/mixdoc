import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import AvatarInterface from './interface';
import styles from './style';

export default (props: AvatarInterface) => {
  const { size = 'default', text = 'mixdoc' } = props;

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.avatar, styles[size]]}>
        <Text>
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
