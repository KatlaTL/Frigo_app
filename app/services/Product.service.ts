import { CategoriesType } from "@contexts/product.context";
import { AxiosInstance } from "axios";

export class ProductService {
    private axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    /**
     * Get all categories and their products
     * @returns Categories and all of their products
     */
    getAllProducts = async (): Promise<CategoriesType[]> => {
        try {
            const response = await this.axiosInstance.get<{ categories: CategoriesType[] }>(`/categories/products`);

            return response.data.categories;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get all of the users favorite products
     * @returns All the user's favoritees
     */
    getAllFavorites = async (): Promise<CategoriesType[]> => {
        try {
            const response = await this.axiosInstance.get<{ favorites: CategoriesType[] }>(`/favorites`);

            return response.data.favorites;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Post method to set a product as favorite
     * @param productId - The product object's ID
     */
    setProductAsFavorite = async (productId: number) => {
        try {
            const response = await this.axiosInstance.post(`/favorites`, {
                productId
            });

            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Delete method to set a product as favorite
     * @param productId - The product object's ID
     */
    removeProductAsFavorite = async (productId: number) => {
        try {
            const response = await this.axiosInstance.delete(`/favorites/${productId}`);

            return response.data;
        } catch (err) {
            throw err;
        }
    }
}

export const createProductService = (axiosInstance: AxiosInstance) => new ProductService(axiosInstance);