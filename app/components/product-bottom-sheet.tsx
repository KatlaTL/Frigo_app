import { CustomBottomSheet } from "./custom-bottom-sheet"
import { useCallback, useEffect, useState } from "react";
import { Colors, sharedStyles } from "@assets/styles";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SlideButton, SlideButtonType } from "./slider-button";
import { usePurchases } from "@hooks/use-purchases";
import { useToast } from "@hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useProducts } from "@hooks/use-products";


export const ProductBottomSheet = () => {
    const { purchaseProduct } = usePurchases();
    const { productBottomSheetRef, currentProduct, actionDispatch } = useProducts();
    const toast = useToast();

    const [quantity, setQuantity] = useState<number>(1);
    const [disableDecrement, setDisableDecrement] = useState<boolean>(false);
    const [disableIncrement, setDisableIncrement] = useState<boolean>(false);

    // If the productBottomSheetRef is null, don't render anything
    if (!productBottomSheetRef) {
        return null;
    }

    useEffect(() => {
        if (currentProduct) {
            productBottomSheetRef.current?.expand();
        }
    }, [currentProduct])

    /**
     * Purchase a product.
     */
    const onPurchaseProduct = (): Promise<void> => {
        if (!currentProduct) {
            return Promise.reject();
        }

        productBottomSheetRef.current?.close({
            duration: 450
        });

        setDisableIncrement(true);


        return purchaseProduct(currentProduct, quantity);
    }

    /**
     * Calls the onPurchaseProduct and show an appropriate toast message based on whether the request fails or succeeds
     * Parsed as the slider complete function to the bottom sheet
     */
    const purchaseMutation = useMutation({
        mutationFn: onPurchaseProduct,
        onSuccess: () => {
            toast.success({
                title: "Købet er gennemført"
            })
        },
        onError: () => {
            toast.error({
                title: "Købet mislykkedes"
            })
        },
    });

    /**
     * Runs when the bottom sheet closes
     */
    const onBottomSheetClose = () => {
        setQuantity(1);
        if (currentProduct) {
            actionDispatch?.setCurrentProduct(null);
        }
        setDisableIncrement(false);
    }

    /**
     * Increment quantity
     */
    const incrementQuantity = () => {
        setQuantity(prev => ++prev);
    }

    /**
     * Decrement quantity
     */
    const decrementQuantity = () => {
        if (quantity <= 1) {
            return;
        }
        setQuantity(prev => --prev);
    }

    /**
     * Disable the decrement quantity button if quanitiy is 1 or less
     */
    useEffect(() => {
        setDisableDecrement(quantity <= 1);
    }, [quantity])

    /**
     * Wrap SlideButton in a useCallback to prevent unnecessary heavy rerenders
     */
    const RenderSlideButton = useCallback((props: SlideButtonType) => (
        <SlideButton {...props} />
    ), [currentProduct])

    return (
        <CustomBottomSheet
            sheetRef={productBottomSheetRef}
            onClose={onBottomSheetClose}
            snapPoints={[350, 425]}
            initialSnapPointIndex={-1}
            handleIndicatorStyle={{ backgroundColor: Colors.white }}
            useGradient={true}
        >
            <View style={styles.sheetView}>
                <View style={styles.sheetImageContainer}>
                    <Image
                        source={currentProduct && currentProduct.image ? { uri: currentProduct.image } : require("@assets/img/icons/no-image.png")}
                        resizeMode="contain"
                        style={styles.sheetImage}
                    />
                </View>
                <Text style={styles.sheetItemText}>{currentProduct?.name}</Text>

                <View style={{ flexDirection: 'row', bottom: 32 }}>
                    <TouchableOpacity onPress={decrementQuantity} disabled={disableDecrement} style={{ opacity: disableDecrement ? 0.5 : 1 }}>
                        <Image
                            source={require('@assets/img/icons/bottom-subtract.png')}
                            style={{ top: 5 }}
                        />
                    </TouchableOpacity>

                    <Text style={styles.bottomSheetQuantity}>
                        {quantity}
                    </Text>

                    <TouchableOpacity onPress={incrementQuantity} disabled={disableIncrement} style={{ opacity: disableIncrement ? 0.5 : 1 }}>
                        <Image
                            source={require('@assets/img/icons/bottom-add.png')}
                            style={{ top: 5 }}
                        />
                    </TouchableOpacity>
                </View>

                <RenderSlideButton
                    onSliderComplete={() => purchaseMutation.mutateAsync()}
                    slideBarText="Køb"
                />
            </View>
        </CustomBottomSheet>
    )
}

const styles = StyleSheet.create({
    bottomSheetQuantity: {
        ...sharedStyles.fontInter700,
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 48,
        lineHeight: 58,
        letterSpacing: -0.54,
        color: Colors.white,
        marginHorizontal: 32,
    },
    sheetView: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        marginTop: 100
    },
    sheetItemText: {
        ...sharedStyles.fontInter400,
        color: Colors.white,
        bottom: 55,
        fontSize: 26,
        lineHeight: 24.4,
        letterSpacing: -0.54,
        textAlign: 'center',
        maxWidth: 260,
    },
    sheetImageContainer: {
        width: 130,
        height: 130,
    },
    sheetImage: {
        height: '100%',
        width: '100%',
        bottom: 100,
    },
})