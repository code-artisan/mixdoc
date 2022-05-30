export default interface ButtonInterface {
  /**
   * 按钮类型。
   */
  type?: 'primary' | 'warning' | 'default' | 'ghost' | 'secondary';

  /**
   * children
   * @ignore
   */
  children?: String | React.ReactElement;

  /**
   * 点击回调
   */
  onPress?: () => void;
}
