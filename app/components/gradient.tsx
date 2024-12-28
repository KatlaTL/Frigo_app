import { Colors } from "@assets/styles";
import { PropsWithChildren } from "react";
import { ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";

type GradientType = {
    colors?: string[];
    style?: ViewStyle;
}

/**
 * Creates a backendground gradient. Uses the primary and secondary color as default
 * @property colors - An array of colors. Can be Hex, RBG or plain text like 'red'
 * @property style  - A view style which should be applied to the gradient
 */
export const Gradient = ({ style, colors, children }: PropsWithChildren<GradientType>) => (
    <LinearGradient
        colors={colors ? colors : [Colors.primary, Colors.secondary]}
        start={{
            x: 0,
            y: 0.5
        }}
        end={{
            x: 1,
            y: 0.5
        }}
        style={style}
    >
        {children}
    </LinearGradient>
)