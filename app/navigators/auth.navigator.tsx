import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { SigninScreen } from '@screens/signin';

type StackParamList = {
  Signin: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export type SigninScreenProps = NativeStackScreenProps<StackParamList, 'Signin'>;

/**
 * Authentication Navigation (signed out)
 */
export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'card',
        headerShown: false,
      }}>
      <Stack.Screen name="Signin" component={SigninScreen} />
    </Stack.Navigator>
  );
};
