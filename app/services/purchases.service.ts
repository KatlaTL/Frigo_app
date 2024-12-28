import { ProductType } from "@contexts/product.context";
import { PurchaseHistoryGrouppedByDateType } from "@hooks/use-purchases";
import { AxiosInstance } from "axios";

export class PurchasesService {
    private axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    /**
     * Post method to purchase a product
     * @param product - The product object
     * @param quantity - The product quantity
     */
    purchaseProduct = async (product: ProductType, quantity: number) => {
        try {
            const response = await this.axiosInstance.post("/purchases", {
                productId: product.productId,
                amount: quantity,
                purchasePrice: product.price
            });

            return response.data
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get all purchases for the signed in user
     * @param userId - The signed in user ID
     * @param limit - Optional limit
     * @param offset - Optional offset
     * @returns Purchase History
     */
    purchaseHistory = async (limit?: number, offset?: number) => {
        try {
            const urlParams = new URLSearchParams({
                ...(limit && { limit: limit.toString() }),
                ...(offset && { offset: offset.toString() })
            });
            
            const response = await this.axiosInstance.get<{ purchases: PurchaseHistoryGrouppedByDateType[] }>(`/purchases?${urlParams.toString()}`);
            
            return response.data.purchases;
        } catch (err) {
            throw err;
        }
    }
}

export const createPurchasesService = (axiosInstance: AxiosInstance) => new PurchasesService(axiosInstance);