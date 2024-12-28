import { UseProductsReturnType } from "@hooks/use-products";
import { ProductScreenStrategy } from "./types";

export const productStrategy = (productsHook: UseProductsReturnType): ProductScreenStrategy => {
    const { productState, refreshProducts } = productsHook;

    return {
        screenParams: (categoryId: number) => {
            const category = productState.find(category => category.categoryId === categoryId);
            return { id: category?.categoryId, products: category?.products };
        },
        refresh: async () => {
            await refreshProducts();
        },
        state: productState
    }
}