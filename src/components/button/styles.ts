import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    backgroundColor: colors.primary.normal.default,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary.normal.default,
  },
  success: {
    backgroundColor: colors.status.success,
  },
  error: {
    backgroundColor: colors.status.error,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral.white,
  },
  outlineText: {
    color: colors.primary.normal.default,
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
