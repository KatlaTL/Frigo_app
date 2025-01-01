import { Colors, sharedStyles } from "@assets/styles";
import { memo, useCallback } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductItem } from "./product-item";
import { ProductType } from "@contexts/product.context";
import { Loading } from "@components/loading";
import { TopBarTitle } from "@components/top-bar-title";

type ProductsScreenPresentationType = {
    data: (ProductType | { productId: "spacer" })[];
    categoryId: number;
    productItemOnPress: (product: ProductType) => void;
    refreshing: boolean;
    onRefresh: () => void;
    isFavoriteTab: boolean;
    loading: boolean;
}

/**
 * The products screen presentation layer
 */
export const ProductsScreenPresentation = memo(({
    data,
    categoryId,
    productItemOnPress,
    refreshing,
    onRefresh,
    isFavoriteTab,
    loading
}: ProductsScreenPresentationType) => {

    const flatListRenderItem = useCallback(({ item }: { item: ProductType | { productId: 'spacer' } }) => {
        return (
            item.productId !== 'spacer' ? (
                <ProductItem
                    product={item}
                    categoryId={categoryId}
                    onPress={() => productItemOnPress(item)}
                />
            ) : (
                <View style={styles.spacerView}></View>
            )
        )
    }, [categoryId, productItemOnPress])

    return (
        <>
            {isFavoriteTab && (
                <TopBarTitle title="Favoritter" />
            )}

            <SafeAreaView style={sharedStyles.container} edges={['left', 'right']}>
                {loading ? (
                    <Loading />
                ) : (
                    data.length > 0 ? (
                        <FlatList
                            overScrollMode='never'
                            data={data}
                            keyExtractor={item => item.productId.toString()}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between', columnGap: 10 }}
                            contentContainerStyle={[styles.flatListContainer, isFavoriteTab && { marginHorizontal: 22.5 }]}
                            renderItem={flatListRenderItem}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <ScrollView
                            contentContainerStyle={styles.emptyList}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            <Text style={styles.emptyListText}>{categoryId === -1 ? "Der er ingen favoritter" : "Kategorien er tom"}</Text>
                        </ScrollView>
                    )
                )}
            </SafeAreaView>
        </>
    );
});

const styles = StyleSheet.create({
    flatListContainer: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        paddingTop: 20
    },
    items: {
        flex: 1,
        height: 500,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    title: {
        ...sharedStyles.textBold,
        fontSize: 26,
        color: Colors.text,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 50
    },
    emptyListText: {
        ...sharedStyles.textBold,
        fontSize: 24,
        color: Colors.primary
    },
    spacerView: {
        flex: 1
    },
});
