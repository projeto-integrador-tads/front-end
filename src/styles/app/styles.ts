import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

const TAB_BAR_HEIGHT = 76;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    gap: 24,
    paddingBottom: TAB_BAR_HEIGHT + 24,
  },
  header: {
    gap: 8,
  },
  subtitle: {
    color: colors.neutral.gray2,
  },
});

export default styles; 