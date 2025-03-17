import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.normal.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: colors.neutral.white,
    flex: 1,
    marginLeft: 16,
  },
  headerSvg: {
    marginTop: -12,
    marginRight: -8,
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  formContainer: {
    gap: 24,
    paddingBottom: 32,
  },
  submitButton: {
    marginTop: 8,
  },
  vehicleCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    color: colors.neutral.black,
    marginBottom: 8,
  },
  vehicleDetails: {
    flexDirection: "row",
    marginBottom: 4,
  },
  vehicleDetailLabel: {
    ...typography.body2,
    color: colors.neutral.gray2,
    marginRight: 4,
  },
  vehicleDetailValue: {
    ...typography.body2,
    color: colors.neutral.black,
  },
  vehicleActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral.gray4,
    marginTop: 8,
    marginBottom: 32,
  },
  addButtonText: {
    ...typography.button,
    color: colors.primary.normal.default,
  },
  section: {
    gap: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.neutral.black,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.status.error + '20',
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  emptyStateText: {
    textAlign: "center",
    color: colors.neutral.gray3,
  },
}); 