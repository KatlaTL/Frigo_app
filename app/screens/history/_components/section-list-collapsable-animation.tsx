import { memo, useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { MemoizedSectionListItem } from "./section-list-item";
import { PurchaseHistoryGrouppedByDateType } from "@hooks/use-purchases";


type SectionListCollapsableAnimationType = {
    section: PurchaseHistoryGrouppedByDateType;
    isCollapsed: boolean;
}

/**
 * The purchase history section list collapse/expand animation wrapper
 * @property section     - The section data
 * @property isCollapsed - A boolean showing the sections collapse state  
 */
export const SectionListCollapsableAnimation = ({ section, isCollapsed }: SectionListCollapsableAnimationType) => {
    const [contentHeight, setContentHeight] = useState<number | null>(null);
    const [measured, setMeasured] = useState(false);

    const height = useSharedValue<number | null>(null);
    const opacity = useSharedValue<number>(0);

    const onLayout = (event: LayoutChangeEvent) => {
        const { height: layoutHeight } = event.nativeEvent.layout;

        if (!measured) {
            setContentHeight(layoutHeight);
            setMeasured(true); // Mark as measured to prevent this function from re-triggering unnecessarily
        }
    };

    useEffect(() => {
        if (contentHeight !== null) {
            if (isCollapsed) {
                height.value = withTiming(0, { duration: 300 });
                opacity.value = withTiming(0, { duration: 300 });
            } else {
                height.value = withTiming(contentHeight, { duration: 300 });
                opacity.value = withTiming(1, { duration: 300 });
            }
        }
    }, [contentHeight, isCollapsed]);

    const animatedSectionStyle = useAnimatedStyle(() => {
        return {
            ...(height && { height: height.value }),
            opacity: opacity.value
        };
    });

    return (
        <Animated.View
            onLayout={onLayout}
            style={[styles.sectionItem, animatedSectionStyle]}
        >
            {section.data.map((item, index) => (
                <MemoizedSectionListItem
                    key={item.receiptTitle + index}
                    receipt={item}
                    index={index}
                />
            ))}
        </Animated.View>
    )
};


/**
 * Wraps the SectionListCollapsableAnimation component in a memoized version
 * Only re-render if the item or isCollapsed has changed
 */
export const MemoizedSectionListCollapsableAnimation = memo(SectionListCollapsableAnimation, (prevProps, nextProps) => {
    return (
        prevProps.section === nextProps.section &&
        prevProps.isCollapsed === nextProps.isCollapsed
    )
});

const styles = StyleSheet.create({
    sectionItem: {
        overflow: 'hidden'
    },
})