import { Platform, StyleSheet } from 'react-native';
import { Colors } from './colors';
import { IS_IOS } from '~/constants';

// Simple function that will output the first value if the device is iOS and the second value if it's anything else (android in our case).
const platformVal = <T, T2>(ios: T, android: T2) =>
  IS_IOS ? ios : android;

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  borderStyle: {
    borderStyle: Platform.select({ ios: "solid", android: "dashed" }),
  },
  text: {
    fontFamily: 'SpaceGrotesk-Light',
  },
  textBold: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontWeight: Platform.select({ ios: 'bold', android: undefined }),
  },
  textSemiBold: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontWeight: Platform.select({ ios: '500', android: undefined }),
  },
  fontInter: {
    fontFamily: IS_IOS ? 'Inter' : 'Inter',
    fontWeight: IS_IOS ? '500' : undefined,
    // TODO Skriv alle weigths som bold, semibold...
  },
  // Android doesn't properly support varying degrees of fontWeight in the version of react native being used in this project,
  // so a font is included for each fontWeight
  fontInter100: {
    // fontWeight equivalent: 100
    fontFamily: platformVal('Inter-Thin', 'InterThin'),
  },
  fontInter200: {
    // fontWeight equivalent: 200
    fontFamily: platformVal('Inter-ExtraLight', 'InterExtraLight'),
  },
  fontInter300: {
    // fontWeight equivalent: 300
    fontFamily: platformVal('Inter-Light', 'InterLight'),
    letterSpacing: -0.8,
  },
  fontInter400: {
    // fontWeight equivalent: 400
    fontFamily: platformVal('Inter-Regular', 'InterRegular'),
  },
  fontInter500: {
    // fontWeight equivalent: 500
    fontFamily: platformVal('Inter-Medium', 'InterMedium'),
  },
  fontInter600: {
    // fontWeight equivalent: 600
    fontFamily: platformVal('Inter-SemiBold', 'InterSemiBold'),
    letterSpacing: -0.4,
  },
  fontInter700: {
    // fontWeight equivalent: 700
    fontFamily: platformVal('Inter-Bold', 'InterBold'),
    letterSpacing: -0.5,
  },
  fontInter800: {
    // fontWeight equivalent: 800
    fontFamily: platformVal('Inter-ExtraBold', 'InterExtraBold'),
  },
  fontInter900: {
    // fontWeight equivalent: 900
    fontFamily: platformVal('Inter-Black', 'InterBlack'),
  },
});
