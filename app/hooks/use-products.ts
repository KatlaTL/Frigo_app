import { useAxiosContext } from '@contexts/axios.context';
import { CategoriesType, useProductContext } from '@contexts/product.context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './use-auth';
import { createProductService } from '@services/Product.service';

export type UseProductsReturnType = ReturnType<typeof useProducts>;

/**
 * Product hook
 */
export const useProducts = () => {
  const { authAxios } = useAxiosContext();
  const { credentials } = useAuth();
  const productContext = useProductContext();
  const [isLoadEnabled, setIsLoadEnabled] = useState<boolean>(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);

  const queryClient = useQueryClient();
  const productService = createProductService(authAxios);

  // Exclude the favoriteState
  const { favoriteState, ...rest } = productContext;

  /**
   * Fetch all categories and their products
   */
  const fetchProducts = async (): Promise<CategoriesType[]> => {
    return await productService.getAllProducts();
  };

  // The products are only loaded when isLoadEnabled is set to true and the credentials has been loaded
  // Which means the products will be loaded after the app has finished loading the credentials
  // And if no credentials are found then it waits for the user to log in
  // Sets the userId as a queryKey to make sure the productsQuery refetches the correct data next time a user logs in
  const productsQuery = useQuery({
    queryKey: ['products', { userId: credentials?.userId }],
    queryFn: fetchProducts,
    enabled: !!credentials?.userId && isLoadEnabled
  })

  useEffect(() => {
    if (isLoadEnabled) {

      if (productsQuery.isSuccess) {
        productContext.actionDispatch?.setProductState(productsQuery.data);

        setIsLoadEnabled(false);
      }

      if (productsQuery.isError && !hasShownAlert) {
        setHasShownAlert(true);

        Alert.alert("Noget gik galt", "Check din internet forbindelse", [
          {
            text: "Prøv igen",
            onPress: () => {
              setHasShownAlert(false);

              queryClient.resetQueries({
                queryKey: ['products', { userId: credentials?.userId }]
              });

              loadProducts();
            }
          }
        ]);

        setIsLoadEnabled(false);
      }
    }
  }, [productsQuery.data, productsQuery.isError])

  /**
   * Enabled tanstack useQuery to load products
   */
  const loadProducts = () => {
    setIsLoadEnabled(true);
  }

  /**
   * Call the products query's refresh method
   */
  const refreshProducts = () => {
    loadProducts();
    return productsQuery.refetch();
  };

  return {
    fetchProducts,
    loadProducts,
    refreshProducts,
    ...rest
  };
};