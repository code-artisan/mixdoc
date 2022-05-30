export default interface AvatarInterface {
  /**
   * 按钮类型。
   */
  size?: 'small' | 'default' | 'large';

  /**
   * 头像文本
   */
  text?: string;

  /**
   * 点击回调
   */
  onPress?: () => void;
}
