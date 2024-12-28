import { Colors } from "@assets/styles"
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import Icon from 'react-native-vector-icons/Entypo';

export enum AnimationTypes {
    Opacity = "OPACITY",
    SliderWidthShrink = "SLIDER_WIDTH_SHRINK",
    IconWidthExpand = "ICON_WIDTH_EXPAND",
    SliderWidthShrinkAndRoll = "SLIDER_WIDTH_SHRINK_AND_ROLL"
}

export type SlideButtonType = {
    /**
     * Callback which is run when the gesture reached the end state
     */
    onSliderComplete: () => Promise<void>;
    slideBarText: string;
    /**
     * Set the primary and secondary color of the slider. \
     * Default: The primary and secondary color defined in Colors at "@assets/styles"
     */
    colors?: {
        primary: string,
        secondary: string
    };
    /**
     * Choose what kind of animation should be appplied to the slider. \
     * Import AnimationTypes for a list of animations. \
     * Default animation: SliderWidthShrink
     */
    animationType?: `${AnimationTypes}`
}

// Set the slidebar width based on the device screen width
const sliderWidth = Dimensions.get("screen").width - 75;

// Create an animatedIcon component 
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

/**
 * SlideButton component 
 * @param {object} SlideButtonType 
 * @returns React.JSX.Element
 */
export const SlideButton = ({
    onSliderComplete,
    slideBarText,
    animationType = AnimationTypes.SliderWidthShrink,
    colors = { primary: Colors.primary, secondary: Colors.white }
}: SlideButtonType) => {
    const position = useSharedValue<number>(0);
    const rotation = useSharedValue<number>(0);

    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    // The position in which the drag gesture will trigger the completed state 
    const completedPosition = sliderWidth / 1.3;

    // Set logic for the Pan gesture
    const panGesture = Gesture.Pan()
        // Run on the JS thread rather than the UI thread to ensure that the code can run JavaScript specific functions like onSliderComplete()
        .runOnJS(true)
        .hitSlop({ top: 50, bottom: 50, left: 50, right: 50 })
        .shouldCancelWhenOutside(true)
        .onUpdate((event) => {
            // Update position.value if the gesture x-axis position is within the slidebar
            if (event.translationX >= 0 && event.translationX <= sliderWidth - 50) {
                position.value = event.translationX;

                // Set the isCompleted state based on the gesture x-axis position
                // run on the JS thread to ensure the state change will cause a rerender of the icon
                if (position.value > completedPosition) {
                    runOnJS(setIsCompleted)(true);
                } else {
                    runOnJS(setIsCompleted)(false);
                }
            }
        })
        .onEnd(() => {
            // Check if the position.value is near the end of the slidebar when the user finish dragging the slider
            // If true: Finish the animation and execute the onSliderComplete() function
            // else reset the animation
            if (position.value > completedPosition) {
                position.value = withTiming(sliderWidth - 50, { duration: 100 });

                onSliderComplete()
                    .catch(() => {
                        position.value = 0;
                    });

            } else {
                position.value = withTiming(0, { duration: 100 });
                rotation.value = 0;
            }
        });

    // Set the rotation value for the icon when the gesture position is in a completed state
    useDerivedValue(() => {
        const baseDuration = 450;

        if (position.value > completedPosition) {
            rotation.value = withTiming(360, { duration: baseDuration });
        } else {
            rotation.value = withTiming(0, { duration: baseDuration / 2 });
        }
    })

    //  Set the animation for the drag icon base on the AnimationType
    const animatedIconStyle = useAnimatedStyle(() => {
        switch (animationType) {
            case AnimationTypes.Opacity:
                return {
                    transform: [
                        { translateX: position.value },
                        { rotate: rotation.value + "deg" }
                    ],
                }
            case AnimationTypes.IconWidthExpand:
                return {
                    width: interpolate(
                        position.value,
                        [0, sliderWidth],
                        [45, (sliderWidth + 50) - 10]
                    )
                }
            case AnimationTypes.SliderWidthShrinkAndRoll:
                return {
                    transform: [
                        { rotateZ: (position.value * 1.19) + "deg" },
                        { rotate: rotation.value + "deg" }
                    ]
                }
            case AnimationTypes.SliderWidthShrink:
                return {
                    transform: [{ rotate: rotation.value + "deg" }]
                }
            default:
                return {}
        }
    })

    // Set the animation for the slidebar base on the AnimationType
    const animatedSliderStyle = useAnimatedStyle(() => {
        switch (animationType) {
            case AnimationTypes.Opacity:
                return {
                    opacity: interpolate(
                        position.value,
                        [0, (sliderWidth - 50) / 2, sliderWidth / 2, sliderWidth - 50],
                        [1, 0.8, 0.65, 0]
                    ),
                }
            case AnimationTypes.SliderWidthShrinkAndRoll:
            case AnimationTypes.SliderWidthShrink:
                return {
                    width: interpolate(
                        position.value,
                        [0, sliderWidth],
                        [sliderWidth, 5]
                    ),
                    left: interpolate(
                        position.value,
                        [0, sliderWidth],
                        [0, (sliderWidth - 5) / 2]
                    )
                }
            default:
                return {}
        }
    })

    // Set the animation for the slider bar text base on the AnimationType
    const animatedTextStyle = useAnimatedStyle(() => {
        switch (animationType) {
            case AnimationTypes.Opacity:
                return {
                    opacity: interpolate(
                        position.value,
                        [0, (sliderWidth - 50) / 2, sliderWidth / 2, sliderWidth - 50],
                        [1, 0.8, 0.65, 0]
                    ),
                }
            // Use the same animation for IconWidthExpand, SliderWidthShrinkAndRoll and SliderWidthShrink
            case AnimationTypes.IconWidthExpand:
            case AnimationTypes.SliderWidthShrinkAndRoll:
            case AnimationTypes.SliderWidthShrink:
                return {
                    opacity: interpolate(
                        position.value,
                        [0, (sliderWidth - 50) / 4],
                        [1, 0]
                    )
                }
            default:
                return {}
        }
    })

    return (
        <View style={styles.sliderView}>
            <Animated.Text style={[styles.sliderText, animatedTextStyle, { color: colors.primary }]}>{slideBarText}</Animated.Text>
            <Animated.View style={[styles.sliderContainer, animatedSliderStyle, { backgroundColor: colors.secondary }]}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.swipeButton, animatedIconStyle, { backgroundColor: colors.primary }]}>
                        <AnimatedIcon
                            // If isCompleted and aniationType is not IconWidthExpand then it should show the check mark icon otherwise show chevron right
                            name={(isCompleted && animationType !== AnimationTypes.IconWidthExpand) ? "check" : "chevron-right"}
                            size={(isCompleted && animationType !== AnimationTypes.IconWidthExpand) ? 34 : 42}
                            color={colors.secondary}
                            style={animationType !== AnimationTypes.IconWidthExpand && styles.icon}
                        />
                    </Animated.View>
                </GestureDetector>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderView: {
        justifyContent: "center",
        alignItems: "center",
        bottom: 20
    },
    sliderContainer: {
        alignItems: "center",
        flexDirection: "row",
        position: "relative",
        height: 55,
        overflow: "hidden",
        borderRadius: 50,
        width: sliderWidth,
    },
    sliderText: {
        position: "absolute",
        zIndex: 1,
        fontSize: 20,
    },
    swipeButton: {
        width: 45,
        height: 45,
        borderRadius: 50,
        position: "absolute",
        left: 5,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    icon: {
        alignSelf: "center"
    }
})