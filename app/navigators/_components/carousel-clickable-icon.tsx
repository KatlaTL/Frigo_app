import { Colors } from "@assets/styles";
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';

type CarouselIcon = {
    iconName: string;
    onPress: () => void;
}

export const CarouselClickableIcon = ({ iconName, onPress }: CarouselIcon) => (
    <TouchableOpacity
        onPress={onPress}
        style={{ alignSelf: "center" }}
    >
        <Icon
            name={iconName}
            size={24}
            color={Colors.primary + "50"} // Adds an alpha transparency value to the hex color.
        />
    </TouchableOpacity>
)