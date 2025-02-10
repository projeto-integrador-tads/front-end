import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand.primary,
  },
  header: {
    height: "45%",
    position: "relative",
  },
  illustration: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: colors.neutral.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -18,
  },
  contentContainer: {
    padding: 24,
    gap: 24,
  },
  headerContent: {
    gap: 8,
  },
  subtitle: {
    color: colors.neutral.gray2,
  },
  form: {
    gap: 16,
  },
  forgotPassword: {
    ...typography.body2,
    color: colors.primary.normal.default,
    textAlign: "right",
  },
});

export default styles; 