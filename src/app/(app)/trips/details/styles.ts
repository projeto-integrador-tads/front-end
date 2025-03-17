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
    gap: 4,
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 100,
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    marginBottom: 24,
  },
  driverPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral.gray4,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary.normal.default,
  },
  tripInfo: {
    gap: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  locationText: {
    flex: 1,
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
}); 