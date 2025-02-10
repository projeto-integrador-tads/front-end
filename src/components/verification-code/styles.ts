import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
    minHeight: 80,
    justifyContent: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  codeContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  codeInput: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.neutral.background,
    alignItems: "center",
    justifyContent: "center",
  },
  codeText: {
    ...typography.h3,
    color: colors.neutral.black,
  },
}); 