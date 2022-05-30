import EStyleSheet from 'react-native-extended-stylesheet';
import themes from './theme';

EStyleSheet.build(themes);

export default EStyleSheet.create({
  button: {
    borderRadius: '$button_border_radius',
    backgroundColor: '$button_fill',
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  text: {
    color: '#fff',
  },
});
