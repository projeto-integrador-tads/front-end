import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  headerContent: {
    gap: 8,
    marginBottom: 32,
  },
  subtitle: {
    color: colors.neutral.gray2,
  },
  form: {
    gap: 16,
  },
  button: {
    marginTop: "auto",
  },
  codeSection: {
    gap: 16,
    alignItems: "center",
  },
  resendCode: {
    ...typography.body2,
    color: colors.primary.normal.default,
    textAlign: "center",
  },
});

export default styles; 