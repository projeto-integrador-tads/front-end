import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

export const styles = StyleSheet.create({
  promotionCard: {
    backgroundColor: colors.primary.light.default,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  promotionTitle: {
    color: colors.neutral.black,
    marginBottom: 8,
  },
  promotionHighlight: {
    color: colors.primary.normal.default,
    marginBottom: 4,
  },
  promotionDate: {
    color: colors.neutral.gray2,
  },
}); 