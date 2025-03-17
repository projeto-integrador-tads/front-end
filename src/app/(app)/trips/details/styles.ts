import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    backgroundColor: colors.neutral.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  headerTitle: {
    color: colors.neutral.black,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  map: {
    height: 200,
  },
  detailsContainer: {
    padding: 24,
    gap: 24,
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.neutral.gray4,
  },
  driverPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  driverInfo: {
    flex: 1,
  },
  messageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primary.light.default,
  },
  tripInfo: {
    gap: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationText: {
    flex: 1,
    gap: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  actionButton: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  startButton: {
    backgroundColor: colors.status.success,
  },
  endButton: {
    backgroundColor: colors.status.success,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  chatButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.normal.default,
  },
  actionBar: {
    width: '100%',
    backgroundColor: colors.neutral.white,
    padding: 16,
    marginTop: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statusSection: {
    marginTop: 8,
  },
  statusMessage: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passengerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  passengerPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  skeletonBase: {
    backgroundColor: colors.neutral.gray4,
    borderRadius: 8,
  },
  skeletonPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral.gray4,
  },
  skeletonText: {
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray4,
  },
  skeletonTextLarge: {
    height: 24,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray4,
  },
  skeletonTextSmall: {
    height: 12,
    width: '60%',
    borderRadius: 4,
    backgroundColor: colors.neutral.gray4,
  },
  skeletonStatus: {
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray4,
  },
  skeletonMap: {
    height: 200,
    backgroundColor: colors.neutral.gray4,
  },
  skeletonPassenger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
}); 