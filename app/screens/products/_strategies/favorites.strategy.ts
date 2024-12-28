import { UseFavoritesReturnType } from "@hooks/use-favorite";
import { ProductScreenStrategy } from "./types";

export const favoritesStrategy = (favoritesHook: UseFavoritesReturnType): ProductScreenStrategy => {
    const { favoriteState, refreshFavorites } = favoritesHook;

    return {
        screenParams: (categoryId: number) => {
            const category = favoriteState.find(category => category.categoryId === categoryId);
            return { id: category?.categoryId, products: category?.products };
        },
        refresh: async () => {
            await refreshFavorites();
        },
        state: favoriteState
    }
}