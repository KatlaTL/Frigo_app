import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { createContext, useContext, useReducer, useRef } from "react";

export type ProductType = {
    productId: number;
    name: string;
    price: string;
    image: string | null;
    isFavorite: boolean;
    categoryId?: number;
};

export type CategoriesType = {
    categoryId: number;
    title: string;
    products: ProductType[];
};

enum ActionTypes {
    SET_PRODUCT_STATE = "SET_PRODUCT_STATE",
    SET_CURRENT_PRODUCT = "SET_CURRENT_PRODUCT",
    RESET_PRODUCT_AND_FAVORITE_STATE = "RESET_PRODUCT_AND_FAVORITE_STATE",
    SET_FAVORITE_STATE = "SET_FAVORITE_STATE",
    SET_FAVORITE = "SET_FAVORITE",
    REMOVE_FAVORITE = "REMOVE_FAVORITE",
}

type ReducerActionType =
    { type: ActionTypes.SET_PRODUCT_STATE, payload: { categories: CategoriesType[] } } |
    { type: ActionTypes.SET_CURRENT_PRODUCT, payload: { product: ProductType | null } } |
    { type: ActionTypes.RESET_PRODUCT_AND_FAVORITE_STATE } |
    { type: ActionTypes.SET_FAVORITE_STATE, payload: { favorites: CategoriesType[] } } |
    { type: ActionTypes.SET_FAVORITE, payload: { product: ProductType, categoryId: number } } |
    { type: ActionTypes.REMOVE_FAVORITE, payload: { product: ProductType } }

type ReducerStateType = {
    productState: CategoriesType[];
    favoriteState: CategoriesType[];
    currentProduct: ProductType | null;
};

interface ProductContextI extends ReducerStateType {
    actionDispatch: {
        setProductState: (data: CategoriesType[]) => void;
        setCurrentProduct: (product: ProductType | null) => void;
        resetProductAndFavoriteState: () => void;
        setFavoriteState: (data: CategoriesType[]) => void;
        setProductAsFavorite: (product: ProductType, categoryId: number) => void;
        removeProductAsFavorite: (product: ProductType) => void;
    } | null;
    isLoaded: boolean;
    productBottomSheetRef: React.RefObject<BottomSheetMethods> | null;

}

const reducerInitialState: ReducerStateType = {
    productState: [],
    favoriteState: [{
        categoryId: -1, // Set the categoryId to -1 for favorites
        products: [],
        title: "Favoritter"
    }],
    currentProduct: null,
};

const contextInitialState: ProductContextI = {
    productState: reducerInitialState.productState,
    favoriteState: reducerInitialState.favoriteState,
    currentProduct: reducerInitialState.currentProduct,
    isLoaded: false,
    actionDispatch: null,
    productBottomSheetRef: null
}

const ProductContext = createContext<ProductContextI>(contextInitialState);

const productReducer = (state: ReducerStateType, action: ReducerActionType): ReducerStateType => {
    switch (action.type) {
        // Used to set the product state with the category and product data
        case ActionTypes.SET_PRODUCT_STATE:
            return {
                ...state,
                // Cast to a set to remove any potential duplicates
                productState: [...new Set(action.payload.categories)]
            }
        case ActionTypes.SET_CURRENT_PRODUCT:
            return {
                ...state,
                currentProduct: action.payload.product
            }
        // Used to reset the product state
        case ActionTypes.RESET_PRODUCT_AND_FAVORITE_STATE:
            return {
                ...state,
                productState: reducerInitialState.productState,
                favoriteState: reducerInitialState.favoriteState,
                currentProduct: reducerInitialState.currentProduct
            }
        case ActionTypes.SET_FAVORITE_STATE:
            return {
                ...state,
                // Cast to a set to remove any potential duplicates
                favoriteState: [...new Set(action.payload.favorites)]
            }
        // Used to set a product as favorite. Change the isFavorite prop on the product to true and add it to the product list on the favoriteState
        case ActionTypes.SET_FAVORITE:
            return {
                ...state,
                // Cast to a set to remove any potential duplicates
                // Add the product to the favorite category in the favoriteState
                favoriteState: [...new Set([...state.favoriteState.map(category => {
                    if (category.categoryId === -1) {
                        category.products.push({
                            ...action.payload.product,
                            isFavorite: true,
                            categoryId: action.payload.categoryId
                        });

                        return {
                            ...category,
                            products: category.products
                        }
                    }

                    return category;
                })])],
                // Cast to a set to remove any potential duplicates
                // Set the product as isFavorite on it's category in the productState
                productState: [...new Set([...state.productState.map(category => {
                    if (category.categoryId === action.payload.categoryId) {
                        return {
                            ...category,
                            products: category.products.map(product => {
                                if (product.productId === action.payload.product.productId) {
                                    return {
                                        ...product,
                                        isFavorite: true
                                    };
                                }

                                return product;
                            })
                        }
                    }

                    return category;
                })])]
            }
        // Used to remove a product as favorite. Change the isFavorite prop on the product to false and remove it form the product list on the favorite category
        case ActionTypes.REMOVE_FAVORITE:
            const favorites: CategoriesType | undefined = state.favoriteState.find(category => category.categoryId === -1);

            if (!favorites) {
                return {
                    ...state
                }
            }

            return {
                ...state,
                // Cast to a set to remove any potential duplicates
                favoriteState: [...new Set(state.favoriteState.map(category => {
                    if (category.categoryId === -1) {
                        return {
                            ...category,
                            products: category.products.filter((product) => product.productId !== action.payload.product.productId)
                        }
                    }

                    return category;
                }))],
                productState: [...new Set(state.productState.map(category => {
                    // If the product doesn't have a categoryId we have to loop through all the categories products until we find the product
                    // Otherwise we only have to look in the category with the specified categoryId 
                    if (!action.payload.product.categoryId || category.categoryId === action.payload.product.categoryId) {
                        return {
                            ...category,
                            products: category.products.map(product => {
                                if (product.productId === action.payload.product.productId) {
                                    return {
                                        ...product,
                                        isFavorite: false
                                    }
                                }

                                return product;
                            })
                        }
                    }

                    return category;
                }))]
            }
        default:
            return { ...state }
    }
}

export const ProductProvider = ({ children }: React.PropsWithChildren) => {
    const [state, dispatch] = useReducer(productReducer, reducerInitialState);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const actionDispatch = {
        setProductState: (data: CategoriesType[]) => {
            dispatch({
                type: ActionTypes.SET_PRODUCT_STATE,
                payload: {
                    categories: data
                }
            })
        },
        setCurrentProduct: (product: ProductType | null) => {
            dispatch({
                type: ActionTypes.SET_CURRENT_PRODUCT,
                payload: {
                    product: product
                }
            })
        },
        resetProductAndFavoriteState: () => {
            dispatch({
                type: ActionTypes.RESET_PRODUCT_AND_FAVORITE_STATE
            })
        },
        setFavoriteState: (data: CategoriesType[]) => {
            dispatch({
                type: ActionTypes.SET_FAVORITE_STATE,
                payload: {
                    favorites: data
                }
            })
        },
        setProductAsFavorite: (product: ProductType, categoryId: number) => {
            dispatch({
                type: ActionTypes.SET_FAVORITE,
                payload: {
                    product: product,
                    categoryId: categoryId
                }
            })
        },
        removeProductAsFavorite: (product: ProductType) => {
            dispatch({
                type: ActionTypes.REMOVE_FAVORITE,
                payload: {
                    product: product
                }
            })
        }
    } as ProductContextI["actionDispatch"]

    return (
        <ProductContext.Provider
            value={{
                actionDispatch: actionDispatch,
                productState: state.productState,
                favoriteState: state.favoriteState,
                isLoaded: state.productState.length > 0,
                currentProduct: state.currentProduct,
                productBottomSheetRef: bottomSheetRef
            }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProductContext must be used within a LoadingProvider');
    }
    return context;
};
