import { Colors } from "@assets/styles";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, ListRenderItem, StyleSheet, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import Icon from 'react-native-vector-icons/Entypo';

type AnimatedDotIndicatorsTypes = {
    length: number;
    currentIndex: number;
    setCurrentIndex: (value: number) => void;
    carouselScreenRef: React.RefObject<ICarouselInstance>
}

type ranges = { start: number, end: number, index: number }[]

const width = Dimensions.get("screen").width / 2;
const dotIndicatorWidth = 40;

export const AnimatedDotIndicators = ({ length, currentIndex, setCurrentIndex, carouselScreenRef }: AnimatedDotIndicatorsTypes) => {
    const emptyData = Array.from({ length }, (_, index) => ({ id: index }));
    const [ranges, setRanges] = useState<ranges>([]);

    /**
     * The onPress even for the dot indicators
     */
    const onDotPress = (index: number) => {
        carouselScreenRef.current?.scrollTo({ index, animated: true });
        setCurrentIndex(index);
    }

    // Set the ranges based on the amount of dot indicators
    useEffect(() => {
        let tempArr: ranges = [];

        emptyData.forEach((_, index) => {
            tempArr.push({
                start: dotIndicatorWidth * index,
                end: (dotIndicatorWidth * index) + dotIndicatorWidth,
                index
            })
        })

        setRanges(tempArr);
    }, [length])

    // The pan gesture event handler
    const panGesture = Gesture.Pan()
        // Run on the JS thread rather than the UI thread to ensure that the code can run JavaScript specific functions like setCurrentIndex()
        .runOnJS(true)
        .hitSlop({ top: 50, bottom: 50, left: 50, right: 50 })
        .shouldCancelWhenOutside(true)
        .onUpdate((event) => {
            // Find correct index based on the drag x value
            const matchedRange = ranges.find(range => event.x >= range.start && event.x <= range.end);

            if (matchedRange) {
                carouselScreenRef.current?.scrollTo({ index: matchedRange.index });
                setCurrentIndex(matchedRange.index);
            }

        })

    /**
     * The renderItem of the FlatList
     */
    const renderItem: ListRenderItem<{ id: number }> = ({ item, index }) => {
        const isCurrentIndex: boolean = index === currentIndex;

        const iconSize = isCurrentIndex ? 50 : 30;

        return (
            <TouchableOpacity
                style={style.iconWrapper}
                onPress={() => onDotPress(index)}
            >
                <Icon
                    name="dot-single"
                    style={{ position: "absolute", right: isCurrentIndex ? 5 : 3 }}
                    size={iconSize}
                    color={Colors.secondary}
                />
            </TouchableOpacity>
        )
    }

    return (
        <View style={style.container}>
            <GestureDetector gesture={panGesture}>
                <FlatList
                    style={style.dotIndicators}
                    data={emptyData}
                    renderItem={renderItem}
                    horizontal
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                />
            </GestureDetector>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: width,
    },
    dotIndicators: {
        alignSelf: "center",
    },
    iconWrapper: {
        width: dotIndicatorWidth,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
})