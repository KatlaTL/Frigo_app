import { Colors, sharedStyles } from "@assets/styles";
import { PurchaseHistoryReceiptType } from "@hooks/use-purchases";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { currency } from "~/constants";
import { priceFormatter } from "~/utils/numbers";


type SectionListItemType = {
    receipt: PurchaseHistoryReceiptType,
    index: number;
}

/**
 * Creates a receipt of all the purchases of a given date
 * @property receipt - The receipt data
 * @property index   - The receipt index
 */
export const SectionListItem = ({ receipt, index }: SectionListItemType) => {
    return (
        <View style={[styles.sectionItem, index === 0 && { marginTop: 20 }]}>
            <Text style={styles.itemDate}>
                {receipt.receiptTitle}
            </Text>

            {receipt.receiptItems.map((receiptItem) => (
                <View
                    key={`${receiptItem.createdAt}-${receiptItem.purchaseId}`}
                    style={[styles.itemSubContainer]}
                >

                    <Text style={styles.item}>
                        {receiptItem.amount}x {receiptItem.product.name}
                    </Text>


                    <Text style={styles.item}>
                        {receiptItem.purchasePrice * receiptItem.amount > 0 ? priceFormatter(`${receiptItem.purchasePrice * receiptItem.amount}`, currency) : 'Gratis'}
                    </Text>
                </View>
            ))}

            <View style={styles.itemTotalPriceContainer}>
                <Text style={styles.itemTotalPrice}>Total</Text>
                <Text style={styles.itemTotalPrice}>{receipt.totalPrice > 0 ? priceFormatter(`${receipt.totalPrice}`, currency) : 'Gratis'}</Text>
            </View>
        </View>
    )
};

/**
 * Wraps the SectionListItem component in a memoized version
 * Only re-render if the item or isCollapsed has changed
 */
export const MemoizedSectionListItem = memo(SectionListItem, (prevProps, nextProps) => {
    return (
        prevProps.receipt === nextProps.receipt &&
        prevProps.index === nextProps.index
    )
});


const styles = StyleSheet.create({
    sectionItem: {
        backgroundColor: Colors.white,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        overflow: "hidden",
        borderColor: Colors.gray,
        borderRadius: 5,
        borderWidth: 0.5
    },
    itemDate: {
        ...sharedStyles.fontInter400,
        fontSize: 18,
        lineHeight: 18.15,
        marginBottom: 5,
        color: Colors.textDark,
    },
    itemSubContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
        borderBottomWidth: 0.5,
        ...sharedStyles.borderStyle
    },
    item: {
        ...sharedStyles.fontInter600,
        fontSize: 18,
        lineHeight: 20.57,
        color: Colors.textDark,
    },
    itemTotalPriceContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemTotalPrice: {
        ...sharedStyles.fontInter600,
        fontSize: 18,
        lineHeight: 20.57,
        marginTop: 5,
        color: Colors.textDark,
    }
})