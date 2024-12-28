import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';
import sv, { VariantProps } from 'style-variants';

import { Colors, sharedStyles } from '@assets/styles';

/**
 * Style used for button container
 */
const button = sv({
  base: {
    height: 44,
    justifyContent: 'center',
  },
  variants: {
    variant: {
      primary: {
        borderRadius: 5,
        borderWidth: 1,
      },
      secondary: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    border: {
      false: {
        borderWidth: 0,
      },
      true: {
        borderWidth: 1,
      }
    },
    color: {
      dark: {
        borderColor: Colors.text,
      },
      light: {
        borderColor: Colors.white,
      },
      primary: {
        borderColor: Colors.primary
      }
    },
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    color: 'dark',
    border: false,
    disabled: false,
  },
});

/**
 * Style used for button text
 */
const text = sv({
  base: {
    textAlign: 'center',
    fontSize: 17,
  },
  variants: {
    variant: {
      primary: {
        ...sharedStyles.textBold,
      },
      secondary: {
        ...sharedStyles.textSemiBold,
      },
    },
    color: {
      dark: {
        color: Colors.text,
      },
      light: {
        color: Colors.white,
      },
      primary: {
        color: Colors.primary
      }
    },
    disabled: {
      true: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
    color: 'dark',
    disabled: false,
  },
});

type ButtonVariantsProps = VariantProps<typeof button>;

type ButtonProps = ButtonVariantsProps &
  PressableProps & {
    isLoading?: boolean;
    children: string;
  };

/**
 * Button with two variants: 'primary' and 'secondary'
 */
export const Button: React.FC<ButtonProps> = ({ style, children, disabled, variant, color, border, isLoading, ...props }: ButtonProps) => {
  const buttonStyles = button({
    variant,
    color,
    disabled,
    style,
    border
  });

  const textStyles = text({ variant, color, disabled });

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyles,
        {
          opacity: pressed || disabled ? 0.5 : 1.0,
        },
      ]}
      disabled={disabled}
      {...props}>
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </Pressable>
  );
};
