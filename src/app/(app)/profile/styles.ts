import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.normal.default,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.neutral.white,
  },
  placeholderPhoto: {
    backgroundColor: colors.primary.dark.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.dark.default,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.neutral.white,
  },
  userName: {
    ...typography.h3,
    color: colors.neutral.white,
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
  },
  menuSection: {
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  menuText: {
    ...typography.body1,
    color: colors.neutral.black,
    flex: 1,
  },
  logoutButton: {
    marginTop: 8,
    paddingHorizontal: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral.white,
    paddingTop: 24,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray4,
    elevation: 4,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
}); 