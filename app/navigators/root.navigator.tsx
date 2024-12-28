import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { useLoadingContext } from '@contexts/loading.context';
import { useAuth } from '@hooks/use-auth';
import { SplashScreen } from '@screens/splash';
import { AppNavigator } from './app.navigator';
import { AuthNavigator } from './auth.navigator';

const Stack = createNativeStackNavigator();

/**
 * Root Navigation
 */
export const RootNavigator = () => {
  const { isLoaded } = useLoadingContext();
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      {isLoaded ? (
        isLoggedIn ? (
          <Stack.Navigator
            screenOptions={{
              presentation: 'card',
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Screen name="App" component={AppNavigator} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{
              presentation: 'card',
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </Stack.Navigator>
        )
      ) : (
        <Stack.Navigator
          screenOptions={{
            presentation: 'card',
            headerShown: false,
            animation: 'fade',
          }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
