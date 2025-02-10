import { StyleSheet, TextStyle } from "react-native";
import { colors } from "../colors/colors";

type TypographyVariants = {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  subtitle1: TextStyle;
  subtitle2: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  button: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
};

export const typography = StyleSheet.create<TypographyVariants>({
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    color: colors.neutral.black,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: colors.neutral.black,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: colors.neutral.black,
  },
  subtitle1: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    color: colors.neutral.black,
  },
  subtitle2: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: colors.neutral.black,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: colors.neutral.black,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: colors.neutral.black,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: colors.neutral.white,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    color: colors.neutral.gray2,
  },
  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.neutral.gray2,
  },
}); 