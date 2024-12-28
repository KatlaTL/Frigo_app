import { Image, ImageSource } from 'expo-image';

interface TabBarIconProps {
  // Icon image
  icon: ImageSource;
  // Icon tint color
  color: string;
  // Icon size
  size: number;
}

/**
 * Custom tabbar icon to support svg
 */
export const TabBarIcon: React.FC<TabBarIconProps> = props => {
  const { icon, color, size } = props;
  return (
      <Image
        style={{ marginTop: 10, width: size, height: size, tintColor: color }}
        source={icon}
        contentFit="contain"
      />
  );
};
