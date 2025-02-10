import React from "react";
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  Pressable,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { IconProps } from "@tabler/icons-react-native";
import { styles } from "./styles";
import { colors } from "@/styles/shared/colors/colors";

interface InputRootProps extends Omit<TextInputProps, "style"> {
  label?: React.ReactNode;
  error?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

interface InputIconProps {
  icon: React.ComponentType<IconProps>;
  onPress?: () => void;
  position?: "left" | "right";
  color?: string;
  size?: number;
}

const InputIcon = ({
  icon: Icon,
  onPress,
  color = colors.neutral.gray2,
  size = 24,
}: InputIconProps) => {
  const content = (
    <View style={styles.icon}>
      <Icon size={size} color={color} strokeWidth={1.5} />
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
};

const InputRoot = React.forwardRef<TextInput, InputRootProps>(
  ({ label, error, children, style, inputStyle, ...props }, ref) => {
    const content = React.Children.toArray(children);
    const icons = content.filter(
      (child) => React.isValidElement(child) && child.type === InputIcon
    ) as React.ReactElement<InputIconProps>[];

    const leftIcon = icons.find(
      (icon) => icon.props.position === "left" || !icon.props.position
    );
    const rightIcon = icons.find((icon) => icon.props.position === "right");

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.inputContainer, error && styles.error, style]}>
          {leftIcon}
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            placeholderTextColor={styles.label.color}
            {...props}
          />
          {rightIcon}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

InputRoot.displayName = "Input";

export const Input = Object.assign(InputRoot, {
  Icon: InputIcon,
});
