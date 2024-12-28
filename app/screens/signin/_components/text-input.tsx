import { forwardRef } from "react";
import { TextInput, TextInputProps, ViewStyle } from "react-native"

type SignInInputType = {
    style: ViewStyle;
    placeholder: string;
    value: string;
    onChangeText: (value: string) => void;
    isLoading: boolean;
    onSubmitEditing: () => void;
    textContentType: TextInputProps["textContentType"];
    returnKeyType: TextInputProps["returnKeyType"];
    keyboardType?: TextInputProps["keyboardType"];
    secureTextEntry?: TextInputProps["secureTextEntry"];
}

/**
 * Sign in text input fields. \
 * Using forwardRef to allow a ref to to be parsed down to the TextInput
 */
export const SignInInput = forwardRef<TextInput, SignInInputType>(
    ({
        style,
        placeholder,
        value,
        onChangeText,
        isLoading,
        onSubmitEditing,
        textContentType,
        returnKeyType,
        keyboardType,
        secureTextEntry
    }, ref) => {
        return (
            <TextInput
                ref={ref}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                style={style}
                placeholder={placeholder}
                value={value}
                editable={!isLoading}
                returnKeyType={returnKeyType}
                textContentType={textContentType}

                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#000000"
                enablesReturnKeyAutomatically={true}
                onChangeText={text => onChangeText(text)}
                onSubmitEditing={onSubmitEditing}
            />
        )
    })