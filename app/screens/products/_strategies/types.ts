import { CategoriesType, ProductType } from "@contexts/product.context";

export type ProductScreenStrategy = {
    screenParams: (categoryId: number) => { id: number | undefined, products: ProductType[] | undefined };
    refresh: () => Promise<void>;
    state: CategoriesType[];
};