import React, { useMemo, useCallback } from 'react';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetHandle,
    BottomSheetHandleProps,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@assets/styles';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Gradient } from './gradient';

interface BottomSheetProps {
    sheetRef: React.RefObject<BottomSheetMethods>;
    onClose: () => void;
    snapPoints: number[];
    initialSnapPointIndex: number;
    backgroundColor?: string;
    handleIndicatorStyle?: ViewStyle;
    backdropEnabled?: boolean;
    borderStyle?: ViewStyle;
    children: React.ReactNode;
    useGradient?: boolean;
}

/**
 * Bottom sheet that shows up when clicking on an item in the product list.
 * https://gorhom.dev/react-native-bottom-sheet/
 * @property sheetRef              - Used as an reference object to the BottomSheet Object
 * @property onClose               - onClose event for the BottomSheet
 * @property snapPoints            - The snap points for the BottomSheet
 * @property initialSnapPointIndex - The initial snap point. Provide -1 to make it start in close state
 * @property backgroundColor       - Optional background hex color
 * @property handleIndicatorStyle  - Optional handle indicator style
 * @property borderStyle           - Optional border style
 * @property backdropEnabled       - Optional boolean to enable the backdrop. Default is true
 * @property useGradient           - Optional boolean to enable the gradient. Default is false. If gradient is true it overrides the background color
 */
export const CustomBottomSheet = ({
    sheetRef,
    onClose,
    snapPoints,
    initialSnapPointIndex,
    children,
    backgroundColor,
    handleIndicatorStyle,
    backdropEnabled = true,
    borderStyle,
    useGradient = false
}: BottomSheetProps) => {
    // Set bottomSheet Snap points
    const snapPointsMemo = useMemo(() => snapPoints, [snapPoints]);

    /**
     * Custom backdrop component for the BottomSheet
     */
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                opacity={0.7}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ), []);

    /**
     * Custom handler component for the BottomSheet
     */
    const renderHandler = useCallback(
        (props: BottomSheetHandleProps) => {
            return (
                (useGradient ? (
                    <Gradient >
                        <BottomSheetHandle {...props} />
                    </Gradient >
                ) : (
                    <BottomSheetHandle {...props} />
                ))
            )
        }, []);

    return (
        <BottomSheet
            ref={sheetRef}
            backgroundStyle={[styles.background, backgroundColor ? { backgroundColor: backgroundColor } : null, borderStyle && borderStyle]}
            handleIndicatorStyle={[styles.handleIndicator, handleIndicatorStyle]}
            handleComponent={renderHandler}
            backdropComponent={backdropEnabled ? renderBackdrop : null}
            index={initialSnapPointIndex}
            enablePanDownToClose
            onClose={onClose}
            snapPoints={snapPointsMemo}
        >
            {useGradient ? (
                <Gradient >
                    <BottomSheetView>{children}</BottomSheetView>
                </Gradient >
            ) : (
                <BottomSheetView>{children}</BottomSheetView>
            )}
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: Colors.primary,
        borderRadius: 24
    },
    handleIndicator: {
        backgroundColor: Colors.black,
        width: 35
    }
});
