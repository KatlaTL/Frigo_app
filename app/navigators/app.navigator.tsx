import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@assets/styles';
import { ProductsScreen } from '@screens/products';
import { SettingsScreen } from '@screens/settings';
import { TabBarIcon } from './_components/tabbar-icon';
import { TabBarLabel } from './_components/tabbar-label';
import { BottomTabParamList, TopTabParamList } from './types';
import { createCarouselTopTabNavigator } from './carousel-top-tab.navigator';
import { useProducts } from '@hooks/use-products';
import { HistoryScreen } from '@screens/history';
import { IS_ANDROID } from '~/constants';
import { Gradient } from '@components/gradient';
import { ProductBottomSheet } from '@components/product-bottom-sheet';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const CarouselTopTab = createCarouselTopTabNavigator<TopTabParamList>();

/**
 * Custom Carousel Top Tab Navigator.\
 * All of the navigator and screen options besides [title] are yet to be implemented.
 */
const CarouselTopTabProductsTabs = () => {
  const { productState } = useProducts();

  return (
    <CarouselTopTab.Navigator>
      {productState.map((category, index) => {
        return (
          <CarouselTopTab.Screen
            key={index + category.title}
            name={category.title}
            component={ProductsScreen}
            initialParams={{ id: category.categoryId, products: category.products }}
            options={{
              title: category.title
            }}
          />
        )
      })}
    </CarouselTopTab.Navigator>
  )
}

/**
 * App Navigation (signed in)
 */
export const AppNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <BottomTab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarInactiveTintColor: Colors.primary,
          tabBarActiveTintColor: Colors.white,
          tabBarStyle: {
            height: IS_ANDROID ? 65 : 50 + insets.bottom,
            paddingBottom: 0,
            elevation: 0,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: Colors.gray + "50", // Adds an alpha transparency value to the hex color.
          },
          tabBarButton: (props: BottomTabBarButtonProps) => {
            const { children, accessibilityState } = props;
            const focused = accessibilityState?.selected;

            return (
              <View style={{ flex: 1 }}>
                {focused ? (
                  <Gradient style={{ flex: 1, overflow: 'hidden', alignItems: 'center' }}>
                    {children}
                  </Gradient>
                ) : (
                  <TouchableOpacity style={{ flex: 1 }} {...props}>
                    {children}
                  </TouchableOpacity>
                )}
              </View>
            );
          },
        }}>
        <BottomTab.Screen
          name="ProductsTab"
          component={CarouselTopTabProductsTabs}
          options={{
            title: 'Produkter',
            tabBarIcon: ({ color, size }) => <TabBarIcon icon={require('@assets/img/tabbar/soda.svg')} color={color} size={size} />,
            tabBarLabel: ({ focused, color, children }) => <TabBarLabel focused={focused} color={color} children={children} />,
          }}
        />
        <BottomTab.Screen
          name="FavoritesTab"
          component={ProductsScreen}
          initialParams={{ id: -1, isFavorite: true }}
          options={{
            title: 'Favoritter',
            tabBarIcon: ({ color }) => <TabBarIcon icon={require('@assets/img/tabbar/favorite.svg')} color={color} size={22} />,
            tabBarLabel: ({ focused, color, children }) => <TabBarLabel focused={focused} color={color} children={children} />,
          }}
        />
        <BottomTab.Screen
          name="HistoryTab"
          component={HistoryScreen}
          options={{
            title: 'Historik',
            tabBarIcon: ({ color, size }) => <TabBarIcon icon={require('@assets/img/tabbar/history.svg')} color={color} size={size} />,
            tabBarLabel: ({ focused, color, children }) => <TabBarLabel focused={focused} color={color} children={children} />,
          }}
        />
        <BottomTab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{
            title: 'Indstillinger',
            tabBarIcon: ({ color }) => <TabBarIcon icon={require('@assets/img/tabbar/settings.svg')} color={color} size={23} />,
            tabBarLabel: ({ focused, color, children }) => <TabBarLabel focused={focused} color={color} children={children} />,
          }}
        />
      </BottomTab.Navigator>

      {/* The product bottom sheet for purchasing a product */}
      <ProductBottomSheet />
    </>
  );
};
