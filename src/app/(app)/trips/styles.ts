import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

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
    flexGrow: 1,
  },
  header: {
    gap: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  subtitle: {
    color: colors.neutral.gray2,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  emptyStateTitle: {
    textAlign: "center",
    color: colors.neutral.black,
    marginTop: 24,
  },
  emptyStateSubtitle: {
    textAlign: "center",
    color: colors.neutral.gray2,
  },
  loadingContainer: {
    gap: 16,
  },
  ridesContainer: {
    gap: 16,
  },
}); 