import { useAxiosContext } from "@contexts/axios.context";
import { useProductContext } from "@contexts/product.context";
import { createProductService } from "@services/Product.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";

export type UseFavoritesReturnType = ReturnType<typeof useFavorite>;

/**
 * Favorite hook
 */
export const useFavorite = () => {
    const { authAxios } = useAxiosContext();
    const { credentials } = useAuth();
    const { actionDispatch, favoriteState } = useProductContext();
    const toast = useToast();
    const [isLoadEnabled, setIsLoadEnabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const productService = createProductService(authAxios);

    /**
     * Get all favorites for the signed in user
     * @returns All favorites for the signed in user
     */
    const getAllFavorites = async () => {
        return await productService.getAllFavorites();
    }

    /**
     * Used to fetch the user's favorites
     * @param queryKey - userId
     */
    const favoritesQuery = useQuery({
        queryKey: ['favorites'],
        queryFn: getAllFavorites,
        enabled: !!credentials?.userId && isLoadEnabled
    });

    // Sort the data and save it in the useReducer state when it is succesfully loaded
    useEffect(() => {
        if (isLoadEnabled) {
            if (favoritesQuery.isSuccess) {
                actionDispatch?.setFavoriteState(favoritesQuery.data);
                setIsLoadEnabled(false);
            }

            if (favoritesQuery.isError) {
                toast.error({ title: "Favoritter kunne ikke hentes" });
                setIsLoadEnabled(false);
            }

            setLoading(false);
        }
    }, [favoritesQuery.data, favoritesQuery.isError]);

    /**
     * Enabled tanstack useQuery to load favorites
     */
    const loadFavorites = () => {
        setIsLoadEnabled(true);
        setLoading(true);
    }

    /**
     * Call the products query's refresh method
     */
    const refreshFavorites = () => {
        return favoritesQuery.refetch();
    };

    /**
     * Set a product as favorite
     * @param productId - The product object's ID
     */
    const setProductAsFavorite = async (productId: number) => {
        return await productService.setProductAsFavorite(productId);
    }

    /**
     * Remove a product as favorite
     * @param productId - The product object's ID
     */
    const removeProductAsFavorite = async (productId: number) => {
        return await productService.removeProductAsFavorite(productId);
    }

    return {
        getAllFavorites,
        setProductAsFavorite,
        removeProductAsFavorite,
        loadFavorites,
        refreshFavorites,
        favoriteState,
        loading
    }
}