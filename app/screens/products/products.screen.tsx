import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ProductsScrenProps } from '@navigators/types';
import { debounce } from '~/utils/debounce';
import { ProductType } from '@contexts/product.context';
import { ProductsScreenPresentation } from './_components/products.screen.presentation';
import { useProducts } from '@hooks/use-products';
import { useFavorite } from '@hooks/use-favorite';
import { isEven } from '~/utils/numbers';
import { favoritesStrategy, productStrategy } from './_strategies';

/**
 * Displays Products Screen
 */
export const ProductsScreen = ({ route, navigation }: ProductsScrenProps) => {
  const { products = [], id: categoryId } = route.params;
  const isFavoriteTab = "isFavorite" in route.params; // TypeScript type guard that checks whether the key "isFavorite" exists in the route.params object

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const productsHook = useProducts();
  const favoritesHook = useFavorite();
  
  const { actionDispatch } = productsHook;
  const { loadFavorites, loading } = favoritesHook;

  // Defined which strategy to use
  const strategy = isFavoriteTab ? favoritesStrategy(favoritesHook) : productStrategy(productsHook);

  // Update the route param with the new product data for the products tab and favorite tab,
  // if the productState or favoriteState changes
  useEffect(() => {
    navigation.setParams(strategy.screenParams(categoryId));
  }, [strategy.state])

  // Load all favorites if it's the favorite tab
  useEffect(() => {
    if (isFavoriteTab) {
      loadFavorites();
    }
  }, [isFavoriteTab])

  /**
   * Sets the current product on click and opens the bottom sheet
   * It's wrapped in a useCallback() to make sure it doesn't rerender with the rest of the FlatList, so it can be used with a debounce
   * @param product 
   */
  const handleItemOnPress = useCallback((product: ProductType) => {
    actionDispatch?.setCurrentProduct(product);
  }, []);

  /**
   * Wrap handleItemOnPress in a debounce to prevent it from being called muliple times in quick succesion when using scroll as click
   * It's wrapped in a useMemo() to make sure the function doesn't rerender with the rest of the FlatList, which would result in the debounce not working
   */
  const debounceHandleItemOnPress = useMemo(() => {
    return debounce(handleItemOnPress, 150);
  }, [handleItemOnPress]);

  /**
   * Add a spacer object to the product list if there are a odd number of products
   */
  const processedData: (ProductType | { productId: "spacer" })[] = (
    !isEven(products.length) ? [...products, { productId: "spacer" }] : products // Add an extra spacer item to the list if it's a odd number of items, to make the column spacing even
  );

  /**
   * The product refresh logic based on the defined strategy
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    strategy.refresh()
      .finally(() => setRefreshing(false))
  }, [strategy]);

  return (
    <ProductsScreenPresentation
      productItemOnPress={debounceHandleItemOnPress}
      categoryId={categoryId}
      data={processedData}
      refreshing={refreshing}
      onRefresh={onRefresh}
      isFavoriteTab={isFavoriteTab}
      loading={loading}
    />
  );
};