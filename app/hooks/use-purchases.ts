import { useAxiosContext } from "@contexts/axios.context";
import { ProductType } from "@contexts/product.context";
import { createPurchasesService } from "@services/Purchases.service";
import { QueryFunction } from "@tanstack/react-query";

type PurchaseHistoryType = {
    purchaseId: number,
    purchasePrice: number,
    amount: number,
    product: {
        productId: number,
        name: string,
        isActive: boolean
    },
    createdAt: Date,
    updatedAt: Date
}

export type PurchaseHistoryReceiptType = {
    receiptTitle: string;
    receiptItems: PurchaseHistoryType[];
    totalPrice: number;
}

export type PurchaseHistoryGrouppedByDateType = {
    title: string;
    data: PurchaseHistoryReceiptType[];
    isCollapsed: boolean;
    totalPrice: number;
}

type UserPurchaseHistoryQueryKeyType = [string, { limit?: number; offset?: number }];

/**
 * Purchase hook
 */
export const usePurchases = () => {
    const { authAxios } = useAxiosContext();

    const purchasesService = createPurchasesService(authAxios);

    /**
     * Purchase a product for the signed in user
     * @param product - The product object
     * @param quantity - The product quantity
     */
    const purchaseProduct = async (product: ProductType, quantity: number) => {
        return await purchasesService.purchaseProduct(product, quantity);
    }

    /**
     * Get all purchases for the signed in user
     * @param queryKey - Deconstruct into the userId, limit and offset
     */
    const userPurchaseHistory: QueryFunction<any, UserPurchaseHistoryQueryKeyType> = async ({ queryKey }): Promise<PurchaseHistoryGrouppedByDateType[]> => {
        const [_key, { limit, offset }] = queryKey;

        return await purchasesService.purchaseHistory(limit, offset);
    }

    return {
        purchaseProduct,
        userPurchaseHistory
    }
}