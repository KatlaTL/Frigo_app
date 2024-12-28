import { ProductType } from '@contexts/product.context';
import type { BottomTabScreenProps as BottomTabProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Products: undefined;
  Favorites: undefined;
  History: undefined;
  Settings: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type BottomTabParamList = {
  ProductsTab: undefined;
  FavoritesTab: {
    id: number;
    products: ProductType[];
    isFavorite: boolean;
  };
  HistoryTab: undefined;
  SettingsTab: undefined;
};

export type BottomTabScreenProps<T extends keyof BottomTabParamList> = CompositeScreenProps<
  BottomTabProps<BottomTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type TopTabParamList = {
  [key: string]: {
    id: number,
    products: ProductType[]
  }
};

export type TopTabScreenProps = MaterialTopTabScreenProps<TopTabParamList>;

export type ProductsScrenProps =
  | TopTabScreenProps
  | BottomTabScreenProps<"FavoritesTab">;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
