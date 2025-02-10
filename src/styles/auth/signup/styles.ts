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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 80,
  },
  backButton: {
    position: "absolute",
    left: 24,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  content: {
    flex: 1,
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
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    ...typography.body2,
    color: colors.neutral.gray2,
  },
  requiredMark: {
    color: colors.status.error,
    fontSize: 14,
  },
});

export default styles; 