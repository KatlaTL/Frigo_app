import { Colors } from "@assets/styles";
import { useCallback, useEffect, useMemo } from "react";
import { Dimensions, ListRenderItem, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ICarouselInstance } from "react-native-reanimated-carousel";

type AnimatedDotIndicatorsTypes = {
    length: number;
    currentIndex: number;
    carouselScreenRef: React.RefObject<ICarouselInstance>;
    abosuluteIndex: number;
    goToIndex: (index: number, ref: ICarouselInstance | null, currentIndex?: number) => void;
    setActiveCarousel: (index: React.RefObject<ICarouselInstance> | null) => void;
}

type ranges = { start: number, end: number, index: number }[];

const width = Dimensions.get("screen").width;
const dotIndicatorWidth = 40;

export const AnimatedDotIndicators = ({ length, currentIndex, carouselScreenRef, abosuluteIndex = 0, goToIndex, setActiveCarousel }: AnimatedDotIndicatorsTypes) => {
    const emptyData = Array.from({ length }, (_, index) => ({ id: index }));

    const iconSize = useSharedValue<number>(7);
    const backgroundColorAnimation = useSharedValue<number>(0);

    /**
     * The onPress even for the dot indicators
     */
    const onDotPress = (index: number) => {
        goToIndex(index, carouselScreenRef.current);
        setActiveCarousel(carouselScreenRef);
    }

    // Set the ranges based on the amount of dot indicators
    const ranges: ranges = useMemo(() => (
        emptyData.map((_, index) => ({
            start: dotIndicatorWidth * index,
            end: (dotIndicatorWidth * index) + dotIndicatorWidth,
            index
        }))
    ), [length]);

    // Set the interpolate input and output arrays for the animation based on the amount of dot indicators
    const interpolateInputArr = useMemo(() => (
        emptyData.map((_, index) => [(0 + index), (0.5 + index), (1 + index)]).flat()
    ), [length]);

    const interpolateOutputArr = useMemo(() => (
        (emptyData.map(() => [10, dotIndicatorWidth / 2, 10]).flat())
    ), [length]);

    // Calculate the iconSize based on whether the absouluteIndex is within range of the currentIndex 
    useEffect(() => {
        const withInIndex: boolean =
            (abosuluteIndex >= currentIndex - 0.5 && abosuluteIndex <= currentIndex + 0.5) ||
            (currentIndex === 0 && abosuluteIndex > length - 0.5);

        const targetSize = withInIndex ? 10 : 7;

        if (iconSize.value != targetSize) {
            iconSize.value = withTiming(targetSize, { duration: 200 });
        }
    }, [abosuluteIndex, currentIndex]);

    // The pan gesture event handler
    const panGesture = Gesture.Pan()
        // Run on the JS thread rather than the UI thread to ensure that the code can run JavaScript specific functions like setCurrentIndex()
        .runOnJS(true)
        .minDistance(10)
        .hitSlop({ top: 50, bottom: 50, left: 50, right: 50 })
        .shouldCancelWhenOutside(true)
        .onBegin(() => setActiveCarousel(carouselScreenRef))
        .onUpdate((event) => {
            // Find correct index based on the drag x value
            const matchedRange = ranges.find(range => event.x >= range.start && event.x <= range.end);

            if (matchedRange) {
                carouselScreenRef.current?.scrollTo({ index: matchedRange.index });
            }
        })
        .onStart(() => backgroundColorAnimation.value = withTiming(1, { duration: 200, easing: Easing.linear }))
        .onTouchesUp(() => backgroundColorAnimation.value = withTiming(0, { duration: 200, easing: Easing.linear }))
        .onEnd(() => {
            setActiveCarousel(null);
            backgroundColorAnimation.value = withTiming(0, { duration: 200, easing: Easing.linear });
        });

    // Animated style for the icon wrapper
    const animatedIconWrapperStyle = useAnimatedStyle(() => ({
        left: abosuluteIndex < length - 0.5 ?
            interpolate(
                abosuluteIndex,
                [0, length - 1],
                [0, (dotIndicatorWidth * (length - 1))]
            ) :
            interpolate(
                abosuluteIndex,
                [length - 0.5, length],
                [-(dotIndicatorWidth / 2), 0]
            )
    }))

    // Animated style for the icon
    const animatedIconStyle = useAnimatedStyle(() => ({
        width: interpolate(
            abosuluteIndex,
            interpolateInputArr,
            interpolateOutputArr
        )
    }))

    // Animated style for the icon size
    const animatedIconSizeStyle = useAnimatedStyle(() => ({
        width: iconSize.value,
        height: iconSize.value
    }))

    // Animated style for the background
    const animatedBackgroundStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                backgroundColorAnimation.value,
                [0, 1],
                [Colors.transparent, Colors.secondary + "20"]
            ),
            borderRadius: 10,
        }
    })

    /**
     * The renderItem of the FlatList
     */
    const renderItem: ListRenderItem<{ id: number }> = useCallback(({ item, index }) => (
        <Pressable
            style={style.iconWrapper}
            onPress={() => onDotPress(index)}
            onLongPress={() => backgroundColorAnimation.value = withTiming(1, { duration: 200, easing: Easing.linear })}
        >
            <Animated.View style={[style.dot, index === currentIndex && animatedIconSizeStyle]} />
        </Pressable>
    ), [currentIndex, animatedIconSizeStyle, onDotPress]);

    return (
        <View style={style.container}>
            <>
                <GestureDetector gesture={panGesture}>
                    <Animated.FlatList
                        style={animatedBackgroundStyle}
                        data={emptyData}
                        renderItem={renderItem}
                        horizontal
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        extraData={currentIndex}
                    />
                </GestureDetector>

                {/* Calculate the position for the animated dot based on the flatlist length */}
                <Animated.View style={[style.iconWrapper, { bottom: 20, marginRight: 40 * (length - 1) }, animatedIconWrapperStyle]}>
                    <Animated.View style={[style.animatedDot, animatedIconStyle]} />
                </Animated.View>
            </>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: width,
        alignItems: "center"
    },
    iconWrapper: {
        width: dotIndicatorWidth,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        zIndex: -10
    },
    dot: {
        width: 7,
        height: 7,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: Colors.secondary,
        backgroundColor: Colors.secondary
    },
    animatedDot: {
        borderWidth: 1,
        borderRadius: 30,
        borderColor: Colors.secondary,
        backgroundColor: Colors.secondary,
        height: 10,
        width: 10,
    }
})