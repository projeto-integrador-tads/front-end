import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

type Styles = {
  container: ViewStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  label: TextStyle;
  error: ViewStyle;
  errorText: TextStyle;
  icon: ViewStyle;
};

export const styles = StyleSheet.create<Styles>({
  container: {
    width: "100%",
  },
  inputContainer: {
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral.black,
  },
  label: {
    fontSize: 14,
    color: colors.neutral.gray2,
    marginBottom: 4,
  },
  error: {
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 12,
    marginTop: 4,
  },
  icon: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
