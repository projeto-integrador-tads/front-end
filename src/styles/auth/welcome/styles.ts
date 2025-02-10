import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: colors.neutral.gray2,
  },
  footer: {
    padding: 24,
    gap: 12,
  },
});

export default styles; 