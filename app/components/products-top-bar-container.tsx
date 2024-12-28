import { Colors } from "@assets/styles"
import { StyleSheet, View } from "react-native"
import { Gradient } from "./gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ProductsTopBarContainer = ({ children }: { children: React.ReactNode }) => {
    const insets = useSafeAreaInsets();

    return (
        <Gradient>
            <View style={[styles.topBarContainer, { paddingTop: insets.top }]}>
                <View style={styles.topBar}>
                    {children}
                </View>
            </View>
        </Gradient>
    )
}

const styles = StyleSheet.create({
    topBarContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray + '50',
    },
    topBar: {
        height: 60
    }
})