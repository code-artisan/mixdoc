import { StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import themes from './theme';

EStyleSheet.build(themes);

export default EStyleSheet.create({
  avatar: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '$avatar_border_color',
    backgroundColor: '$avatar_fill',
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    width: '$avatar_large_size',
    height: '$avatar_large_size',
    borderRadius: '$avatar_large_size / 2',
  },
  default: {
    width: '$avatar_default_size',
    height: '$avatar_default_size',
    borderRadius: '$avatar_default_size / 2',
  },
  small: {
    width: '$avatar_small_size',
    height: '$avatar_small_size',
    borderRadius: '$avatar_small_size / 2',
  },
});
