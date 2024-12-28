import { Colors } from "@assets/styles";
import { ActivityIndicator } from "react-native";

export const Loading = () => (
    <ActivityIndicator
        size={"large"}
        style={{
            marginTop: 150
        }}
        color={Colors.primary}
    />
)