import { Colors } from "@assets/styles"
import { StyleSheet, Text, View } from "react-native"
import { capitalizeText } from "~/utils/strings";
import { TopBarContainer } from "@components/top-bar-container";

export const TopBarTitle = ({ title }: { title: string }) => (
    <TopBarContainer>
        <View style={styles.topBarItem}>
            <Text style={styles.topBarItemLabel}>{capitalizeText(title)}</Text>
        </View>
    </TopBarContainer>
)

const styles = StyleSheet.create({
    topBarItem: {
        width: 152,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0.5,
        marginTop: 18
    },
    topBarItemLabel: {
        color: Colors.white,
        fontWeight: "600",
        fontSize: 17,
    },
})