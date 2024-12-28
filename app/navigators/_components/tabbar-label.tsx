import { Text } from 'react-native';

import { sharedStyles } from '@assets/styles';
import { IS_ANDROID } from '~/constants';

interface TabBarLabelProps {
  // True if tab is focused/active
  focused: boolean;
  // Label color
  color: string;
  // Label text
  children: string;
}

/**
 * Custom tabbar label to support custom font
 */
export const TabBarLabel: React.FC<TabBarLabelProps> = props => {
  const { focused, color, children } = props;
  return <Text style={[focused ? sharedStyles.textBold : sharedStyles.textSemiBold, { marginBottom: IS_ANDROID ? 10 : 24, color, fontSize: 12 }]}>{children}</Text>;
};
