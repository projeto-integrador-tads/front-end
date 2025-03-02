import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: colors.neutral.gray2,
  },
  spots: {
    color: colors.neutral.gray2,
  },
}); 