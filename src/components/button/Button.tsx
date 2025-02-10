import React from "react";
import { TouchableOpacity, Text, View, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "error";
  disabled?: boolean;
}

interface ButtonIconProps {
  children: React.ReactNode;
  position?: "left" | "right";
}

const ButtonIcon = ({ children }: ButtonIconProps) => {
  return <>{children}</>;
};

const ButtonRoot = React.forwardRef<View, ButtonProps>(
  ({ children, variant = "default", disabled, style, ...props }, ref) => {
    const buttonStyles = [
      styles.button,
      variant !== "default" && styles[variant],
      disabled && styles.disabled,
      style,
    ];

    const textStyles = [
      styles.text,
      variant === "outline" && styles.outlineText,
    ];

    const content = React.Children.toArray(children);
    const icons = content.filter(child => 
      React.isValidElement(child) && child.type === ButtonIcon
    );
    const text = content.filter(child => 
      !React.isValidElement(child) || child.type !== ButtonIcon
    );

    return (
      <TouchableOpacity
        disabled={disabled}
        style={buttonStyles}
        {...props}
      >
        <View ref={ref} style={styles.contentContainer}>
          {icons.map((icon, index) => {
            const iconElement = icon as React.ReactElement<ButtonIconProps>;
            return iconElement.props.position === "left" ? icon : null;
          })}
          <Text style={textStyles}>{text}</Text>
          {icons.map((icon, index) => {
            const iconElement = icon as React.ReactElement<ButtonIconProps>;
            return iconElement.props.position === "right" ? icon : null;
          })}
        </View>
      </TouchableOpacity>
    );
  }
);

ButtonRoot.displayName = "Button";

export const Button = Object.assign(ButtonRoot, {
  Icon: ButtonIcon,
});
