
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';
import { useNavigationBuilder, TabRouter, createNavigatorFactory, DefaultNavigatorOptions, ParamListBase, TabNavigationState, TabRouterOptions, TabActionHelpers } from '@react-navigation/native';
import { Colors } from '@assets/styles';
import Carousel from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useCallback, useRef, useState } from 'react';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { MaterialTopTabNavigationConfig, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { capitalizeText } from '~/utils/strings';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TopBarContainer } from '@components/top-bar-container';
import { CarouselClickableIcon } from './_components/carousel-clickable-icon';
import { AnimatedDotIndicators } from './_components/animated-dot-indicators';

type Props = DefaultNavigatorOptions<
    ParamListBase,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap
> & TabRouterOptions & MaterialTopTabNavigationConfig;

const CarouselTopTabNavigator = ({ initialRouteName, children, screenOptions }: Props) => {
    const { state, descriptors, NavigationContent } =
        useNavigationBuilder<
            TabNavigationState<ParamListBase>,
            TabRouterOptions,
            TabActionHelpers<ParamListBase>,
            MaterialTopTabNavigationOptions,
            MaterialTopTabNavigationEventMap
        >(TabRouter, {
            children,
            screenOptions,
            initialRouteName,
        });

    // Cast screenOptions to MaterialTopTabNavigationOptions to avoid TypeScript errors and to make the props available
    screenOptions = screenOptions as MaterialTopTabNavigationOptions;

    const refScreenView = useRef<ICarouselInstance>(null);
    const refTab = useRef<ICarouselInstance>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeCarousel, setActiveCarousel] = useState<React.RefObject<ICarouselInstance> | null>(null);
    const [shouldAnimateTopBar, setShouldAnimateTopBar] = useState<boolean>(false);
    const [absoluteIndex, setAbsoluteIndex] = useState<number>(0);
    const [isPanning, setIsPanning] = useState<boolean>(false);

    const width = Dimensions.get('window').width;

    /**
     * Jump to the provided carousel index. \
     * Prev() and Next() uses a more fluent animation than scrollTo(). \
     * The function will check if the pressed tab is adjacent to the current tab and then use prev() and next() accordingly.
     * @param index The index of the pressed tab
     * @param ref The carousel reference
     * @param currentIndex Optional current index
    */
    const goToIndex = (index: number, ref: ICarouselInstance | null, currentIndex?: number): void => {
        if (!ref) {
            return;
        }

        if (!currentIndex) {
            currentIndex = ref.getCurrentIndex() || activeIndex;
        }

        const maxIndex = state.routes.length - 1;

        if (index === maxIndex && (currentIndex === 0 || currentIndex === 1)) {
            if (currentIndex === 0) {
                ref.prev()
            }

            if (currentIndex === 1) {
                ref.prev({ count: 2 })
            }

            return;
        }

        if (index === maxIndex - 1 && currentIndex === 0) {
            ref.prev({ count: 2 })

            return;
        }

        if (index === 0 && (currentIndex === maxIndex || currentIndex === maxIndex - 1)) {
            if (currentIndex === maxIndex) {
                ref.next()
            }

            if (currentIndex === maxIndex - 1) {
                ref.next({ count: 2 })
            }

            return;
        }

        if (index === 1 && currentIndex === maxIndex) {
            ref.next({ count: 2 })

            return;
        }

        if (index > currentIndex) {
            ref.next({ count: index - currentIndex })

            return;
        }

        if (index < currentIndex) {
            ref.prev({ count: currentIndex - index });

            return;
        }

        ref.scrollTo({ index: index, animated: true });
    }

    /**
     * Set the active index 
     * @param index - The new active index
     */
    const onChangeIndex = (index: number): void => {
        setActiveIndex(() => index);
    }

    /**
     * Check if the provided index is equaly to the current index
     * Round to nearest integer a the refScreenView index can be an absolute value
     * @param index Index to compare with
     * @returns boolean
     */
    const isActive = (index: number): boolean => {
        if (!refScreenView.current?.getCurrentIndex()) {
            return index === state.index;
        }
        return Math.round(refScreenView.current?.getCurrentIndex()) === index;
    }

    /**
     * The Tab Bar Carousel Render Item
     */
    const tabBarCarouselItem = useCallback(({ item, index }: { item: typeof state.routes[0], index: number }) => {
        return (
            <Pressable
                onPress={() => {
                    if (isPanning) return;

                    goToIndex(index, refScreenView.current);
                    setShouldAnimateTopBar(true);
                }}
                key={activeIndex + item.key}
            >
                <View style={styles.tabBarCarouselItem}>
                    <Text style={[styles.tabBarCarouselItemLabel, { opacity: isActive(index) ? 1 : 0.6 }]}>{capitalizeText(descriptors[item.key].options.title ?? item.name)}</Text>
                </View>
            </Pressable>
        )
    }, [goToIndex, setShouldAnimateTopBar, isActive, capitalizeText])

    /**
     * The Product View Carousel Render Item
     */
    const productViewCarouselItem = useCallback(({ item }: { item: typeof state.routes[0] }) => {
        return (
            <View style={{ flex: 1 }}>
                {descriptors[item.key].render()}
            </View>
        )
    }, [descriptors])

    // Pan gesture to detect when the user interact with the top tab carousel
    const panGestureTopCarousel = Gesture.Pan()
        .runOnJS(true)
        .minDistance(10)
        .onBegin(() => {
            setActiveCarousel(refTab);
            setShouldAnimateTopBar(false);
        })
        .onTouchesDown(() => {
            setIsPanning(false); // Sets the isPanning to false on touch down to stop it from preventing the tabBarCarouselItem onPress
        })
        .onTouchesMove(() => {
            if (!isPanning) {
                setIsPanning(true);
            }
        })
        .onEnd(() => {
            setActiveCarousel(null);
            setIsPanning(false);
        })

    // Pan gesture to detect when the user interact with the screen view carousel
    const panGestureViewCarousel = Gesture.Pan()
        .runOnJS(true)
        .onBegin(() => setActiveCarousel(refScreenView))
        .onEnd(() => setActiveCarousel(null));

    return (
        <NavigationContent>
            <TopBarContainer>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop: 18 }}>
                    <GestureDetector gesture={panGestureTopCarousel}>
                        <Carousel
                            ref={refTab}
                            data={state.routes}
                            renderItem={tabBarCarouselItem}
                            scrollAnimationDuration={500}
                            width={width / 2.8}
                            height={width / 2}
                            style={{ width: width, justifyContent: "space-between" }}
                            onSnapToItem={(index) => {
                                if (activeCarousel === refTab) {
                                    onChangeIndex(index);
                                }
                            }}
                            onProgressChange={(_, absolute) => {
                                if (activeCarousel === refTab && !shouldAnimateTopBar) {
                                    refScreenView.current?.scrollTo({
                                        index: absolute
                                    })
                                }
                            }}
                        />
                    </GestureDetector>
                </View>
            </TopBarContainer>

            <View style={{ flex: 1 }}>
                <View style={styles.productViewCarouselContainer}>

                    <CarouselClickableIcon
                        iconName='chevron-thin-left'
                        onPress={() => {
                            refScreenView.current?.prev();
                            setShouldAnimateTopBar(true);
                        }}
                    />

                    <GestureDetector gesture={panGestureViewCarousel}>
                        <Carousel
                            ref={refScreenView}
                            data={state.routes}
                            renderItem={productViewCarouselItem}
                            scrollAnimationDuration={500}
                            width={width - 45}
                            onSnapToItem={(index) => {
                                if (activeCarousel === refScreenView) {
                                    onChangeIndex(index);
                                }
                            }}
                            onProgressChange={(_, absolute) => {
                                if (activeCarousel === refScreenView || shouldAnimateTopBar) {
                                    refTab.current?.scrollTo({
                                        index: absolute
                                    })
                                }
                                setAbsoluteIndex(() => absolute);
                            }}
                            pagingEnabled={false}
                            snapEnabled={true}
                        />
                    </GestureDetector>

                    <CarouselClickableIcon
                        iconName='chevron-thin-right'
                        onPress={() => {
                            refScreenView.current?.next();
                            setShouldAnimateTopBar(true);
                        }}
                    />

                </View>

                <View style={{ flex: 1, alignItems: "center", paddingVertical: 2 }}>
                    <AnimatedDotIndicators
                        length={state.routes.length}
                        currentIndex={activeIndex}
                        carouselScreenRef={refScreenView}
                        abosuluteIndex={absoluteIndex}
                        goToIndex={goToIndex}
                        setActiveCarousel={setActiveCarousel}
                    />
                </View>
            </View>

        </NavigationContent>
    )
}

const styles = StyleSheet.create({
    productViewCarouselContainer: {
        flex: 30,
        flexDirection: "row",
        justifyContent: "center",
    },
    tabBarCarouselItem: {
        paddingTop: 0.5,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        alignContent: "center"
    },
    tabBarCarouselItemLabel: {
        color: Colors.white,
        fontWeight: "600",
        fontSize: 17,
    },
});

export const createCarouselTopTabNavigator = createNavigatorFactory(CarouselTopTabNavigator);