import { Image, LayoutAnimation, Platform, RefreshControl, ScrollView, SectionList, StyleSheet, Text, TouchableWithoutFeedback, UIManager, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, sharedStyles } from "@assets/styles";
import { ReducerActionType } from "../history.screen";
import { CustomBottomSheet } from "@components/custom-bottom-sheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { currency, IS_IOS } from "~/constants";
import { throttle } from "~/utils/debounce";
import { SectionListCollapsableAnimation } from "./section-list-collapsable-animation";
import { PurchaseHistoryGrouppedByDateType } from "@hooks/use-purchases";
import { priceFormatter } from "~/utils/numbers";
import { Gradient } from "@components/gradient";
import Icon from 'react-native-vector-icons/Entypo';
import { Loading } from "@components/loading";
import { TopBarTitle } from "@components/top-bar-title";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type HistoryScreenPresentationType = {
    purchaseHistoryState: PurchaseHistoryGrouppedByDateType[];
    purchaseHistoryStateDispatch: (value: ReducerActionType) => void;
    refreshing: boolean;
    refreshHistory: () => void;
    loading: boolean;
    currentMonth: string;
}

/**
 * The purchase history screen presentation layer
 */
export const HistoryScreenPresentation = memo(({ purchaseHistoryState, purchaseHistoryStateDispatch, refreshing, refreshHistory, loading, currentMonth }: HistoryScreenPresentationType) => {
    const insets = useSafeAreaInsets();
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Automatically expand the bottom sheet when the history list is populated with data
    useEffect(() => {
        if (purchaseHistoryState.length > 0) {
            bottomSheetRef.current?.expand();
        }
    }, [purchaseHistoryState.length]);

    /**
     * Toggles the section headers collapseable state.
     * It's wrapped in a useCallback() to make sure it doesn't rerender with the rest of the SelectionList, so it can be used with a throttle
     */
    const toggleSectionHeaderCollapseState = useCallback((title: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        purchaseHistoryStateDispatch({ type: "SET_COLLAPSABLE", payload: { title: title } });
    }, []);

    /**
     * Wraps the toggleSectionHeaderCollapseState() in a throttle to prevent the collapse animation from firing in quick succsion as it's rather expensive.
     * It's wrapped in a useMemo() to make sure the function doesn't rerender with the rest of the SelectionList, which would result in the throttle not working
     */
    const throttleToggleSectionHeaderCollapseState = useMemo(() => {
        return throttle((title: string) => toggleSectionHeaderCollapseState(title), 300);
    }, [toggleSectionHeaderCollapseState]);

    /**
     * Renders the Section List header
     */
    const sectionListHeaderItem = ({ section }: { section: PurchaseHistoryGrouppedByDateType }) => (
        <Gradient>
            <TouchableWithoutFeedback onPress={() => throttleToggleSectionHeaderCollapseState(section.title)}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderTitleWrapper}>
                        <Text style={styles.sectionHeaderText}>{section.title}</Text>
                        <Icon name={section.isCollapsed ? "chevron-small-right" : "chevron-small-down"} size={22} color={Colors.white} style={styles.sectionHeaderIcon} />
                    </View>
                    <Text style={styles.sectionHeaderText}>{`Total pris: ${priceFormatter(section.totalPrice ?? 0, currency)}`}</Text>
                </View>
            </TouchableWithoutFeedback>
        </Gradient>
    );

    /**
    * Renders the Section List items with an animated view for the collapse functionality 
    */
    const sectionListFooterItem = useCallback(({ section }: { section: PurchaseHistoryGrouppedByDateType }) => (
        <SectionListCollapsableAnimation section={section} isCollapsed={section.isCollapsed} />
    ), [purchaseHistoryState]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                purchaseHistoryState.length > 0 ? (
                    <>
                        {/* Adds a gradient to the safearea  */}
                        <Gradient style={{ paddingTop: insets.top }} />

                        <SectionList
                            sections={purchaseHistoryState}
                            overScrollMode="never"
                            keyExtractor={(item, index) => `${item.receiptTitle}-${index}`}
                            renderSectionHeader={sectionListHeaderItem}
                            renderSectionFooter={sectionListFooterItem} // Uses the renderSectionFooter to render all items, as it's the only way to wrap all of the item in on view which is necessary for a smooth collapse/expand animation
                            renderItem={() => null} // RenderItem is null as it is required. All of the render item logic happends in renderSectionFooter
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshHistory} />}
                            windowSize={10}
                            initialNumToRender={10}
                            maxToRenderPerBatch={5}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                ) : (
                    <>
                        <TopBarTitle title="Historik" />

                        <View style={styles.emptyListWrapper}>
                            <ScrollView
                                contentContainerStyle={[styles.emptyList, IS_IOS && { marginTop: insets.top }]}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshHistory} />}
                            >
                                <Text style={styles.emptyListText}>{"Historik er tom"}</Text>
                            </ScrollView>
                        </View>
                    </>
                )
            )}

            <CustomBottomSheet
                sheetRef={bottomSheetRef}
                onClose={() => bottomSheetRef.current?.snapToIndex(0)}
                snapPoints={[30, 180]}
                initialSnapPointIndex={-1}
                backgroundColor={Colors.white}
                backdropEnabled={false}
                borderStyle={{
                    borderColor: Colors.background,
                    borderWidth: 1
                }}
                handleIndicatorStyle={{ backgroundColor: Colors.primary }}
            >
                <View style={[styles.overviewDisplay]}>
                    <View>
                        <Text style={styles.overviewTitle}>
                            Nuværende måned
                        </Text>
                        <Text style={styles.overviewTotal}>{`${purchaseHistoryState.find(value => value.title === currentMonth)?.totalPrice || 0} DKK`}</Text>
                    </View>

                    <Image
                        style={styles.overviewImage}
                        source={require('@assets/img/icons/history-receipt.png')}
                    />
                </View>
            </CustomBottomSheet>
        </>
    )
});


const styles = StyleSheet.create({
    headerContainer: {
        height: 'auto',
        minHeight: 100,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        backgroundColor: Colors.white,
        padding: 15,
        justifyContent: 'flex-end',
        flex: 1,
        borderBottomColor: Colors.background,
        borderBottomWidth: 1
    },
    headerText: {
        fontSize: 40,
        color: Colors.primary
    },
    sectionHeader: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.gray + "50", // Adds an alpha transparency value to the hex color.
    },
    sectionHeaderTitleWrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    sectionHeaderIcon: {
        height: 22,
        width: 22
    },
    sectionHeaderText: {
        color: Colors.white,
        fontSize: 17,
        lineHeight: 20.57,
        fontWeight: "600",
    },
    overviewDisplay: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    overviewTitle: {
        ...sharedStyles.fontInter400,
        marginTop: 20,
        marginLeft: '15%',
        fontSize: 24,
        color: Colors.textDark,
    },
    overviewTotal: {
        ...sharedStyles.fontInter700,
        lineHeight: 50.83,
        fontSize: 42,
        marginLeft: '15%',
        marginTop: 10,
        color: Colors.textDark,
    },
    overviewImage: {
        marginRight: '15%',
        marginTop: 20,
    },
    sheetView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyListWrapper: {
        flex: 1,
        marginTop: 50
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -50,
    },
    emptyListText: {
        ...sharedStyles.textBold,
        fontSize: 24,
        color: Colors.primary,
        marginBottom: IS_IOS ? 130 : 0
    }
});
