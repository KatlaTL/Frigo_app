import { PurchaseHistoryGrouppedByDateType, usePurchases } from "@hooks/use-purchases";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useReducer, useState } from "react";
import { dateTimeFormatOptions } from "~/constants";
import { HistoryScreenPresentation } from "./_components/history.screen.presentation";
import { useToast } from "@hooks/use-toast";

export type ReducerActionType =
    { type: "SET_SECTION_DATA", payload: PurchaseHistoryGrouppedByDateType[] } |
    { type: "SET_COLLAPSABLE", payload: { title: string } };

/**
 * Displays the Purchase history screen
 */
export const HistoryScreen = () => {
    const { userPurchaseHistory } = usePurchases();
    const toast = useToast();

    // UseReducer used to handle the SectionList state
    const [purchaseHistoryState, purchaseHistoryStateDispatch] = useReducer((state: PurchaseHistoryGrouppedByDateType[], action: ReducerActionType): PurchaseHistoryGrouppedByDateType[] => {
        switch (action.type) {
            case "SET_SECTION_DATA":
                return action.payload;
            case "SET_COLLAPSABLE":
                return [
                    ...state.map(value => {
                        if (value.title === action.payload.title) {
                            value.isCollapsed = !value.isCollapsed;
                            return value;
                        }
                        return value;
                    })
                ]
            default:
                return [...state]
        }
    }, []);

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    /**
     * Used to fetch the purchases history for the user
     * @param queryKey - userId, limit and offset
     */
    const purchaseHistoryQuery = useQuery({
        queryKey: ['purchases', {}],
        queryFn: userPurchaseHistory
    });

    // Sort the data and save it in the useReducer state when it is succesfully loaded
    useEffect(() => {
        if (purchaseHistoryQuery.data) {
            purchaseHistoryStateDispatch({ type: "SET_SECTION_DATA", payload: purchaseHistoryQuery.data });
            setLoading(false);
        }

        if (purchaseHistoryQuery.isError) {
            toast.error({ title: "Købshistorikken kunne ikke hentes" });
            setLoading(false);
          }
    }, [purchaseHistoryQuery.data, purchaseHistoryQuery.isError]);


    /**
     * Call the purchase history query's refresh method
     */
    const refreshHistory = useCallback(() => {
        setRefreshing(true);

        purchaseHistoryQuery.refetch()
            .finally(() => setRefreshing(false));
    }, []);

    return (
        <HistoryScreenPresentation
            purchaseHistoryState={purchaseHistoryState}
            purchaseHistoryStateDispatch={purchaseHistoryStateDispatch}
            currentMonth={new Date(Date.now()).toLocaleDateString("dk", dateTimeFormatOptions.historySectionHeader)}
            refreshing={refreshing}
            refreshHistory={refreshHistory}
            loading={loading}
        />
    )
}