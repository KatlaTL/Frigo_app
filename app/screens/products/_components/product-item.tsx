import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    UIManager,
    View,
    ViewStyle,
} from 'react-native';
import { Colors, sharedStyles } from '@assets/styles';
import { priceFormatter } from '../../../utils/numbers';
import { ProductType, useProductContext } from '@contexts/product.context';
import { useFavorite } from '@hooks/use-favorite';
import { currency } from '~/constants';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@hooks/use-toast';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ProductItemProps {
    product: ProductType;
    categoryId: number;
    onPress: () => void;
}

/**
 * Creates a product tile
 * @property product           -   Reference for the product object
 * @property onFavoritePressed -   Method toggling the favored state
 * @property onPress           -   Method to pass on the id on product press
 * @property lastItem          -   Boolean to tell if its the last item in the list
 */
export const ProductItem = ({ product, categoryId, onPress }: ProductItemProps) => {
    const productContext = useProductContext();
    const { setProductAsFavorite, removeProductAsFavorite } = useFavorite();
    const toast = useToast();
    const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);

    const favoriteIconInactive = require('@assets/img/icons/favorite-icon-inactive.png');
    const favoriteIconActive = require('@assets/img/icons/favorite-icon-active.png');

    const currentFavoriteIcon = product.isFavorite
        ? favoriteIconActive
        : favoriteIconInactive;

    /**
     * Toggle the isFavorite and save or remove the it from the database
     */
    const toggleFavorite = () => {
        if (product.isFavorite) {
            return removeProductAsFavorite(product.productId)
        } else {
            return setProductAsFavorite(product.productId)
        }
    };

    /**
     * Calls the toggleFavorite and toggle the favorite in the frontend without needing to refresh the product data
     * Shows an toast message if the request fails
     */
    const favoriteMutation = useMutation({
        mutationFn: toggleFavorite,
        onMutate: () => setFavoriteLoading(true),
        onSuccess: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

            if (product.isFavorite) {
                productContext.actionDispatch?.removeProductAsFavorite(product);
            } else {
                productContext.actionDispatch?.setProductAsFavorite(product, categoryId);
            }
        },
        onError: () => {
            toast.error();
        },
        onSettled: () => setFavoriteLoading(false)
    });


    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.wrapper}>
                {favoriteLoading ? (
                    <ActivityIndicator style={styles.favoriteIconContainer} color={Colors.primary} />
                ) : (
                    <TouchableOpacity
                        style={styles.favoriteIconContainer}
                        onPress={() => favoriteMutation.mutate()}
                    >
                        <Image
                            source={currentFavoriteIcon}
                            resizeMode="center"
                            style={styles.image}
                        />
                    </TouchableOpacity>
                )}
                <View style={styles.imageContainer}>
                    <Image
                        source={product.image ? { uri: product.image } : require("@assets/img/icons/no-image.png")}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>
                <Text style={styles.nameText}>{product.name}</Text>
                <Text style={styles.priceText}>
                    {priceFormatter(product.price, currency)}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.white,
        paddingVertical: 16,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        shadowColor: '#000',
        ...Platform.select<ViewStyle>({
            ios: {
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    imageContainer: {
        width: 105,
        height: 105,
    },
    image: {
        height: '100%',
        width: '100%',
        flex: 1,
    },
    nameText: {
        ...sharedStyles.fontInter500,
        fontSize: 16,
        marginTop: 8,
        marginBottom: 'auto',
        color: Colors.black,
        textAlign: 'center',
    },
    priceText: {
        ...sharedStyles.fontInter700,
        color: Colors.primary,
        fontSize: 20,
        textAlign: 'center',
    },
    favoriteIconContainer: {
        height: 35,
        width: 35,
        position: 'absolute',
        right: 0,
        zIndex: 1,
    },
});
