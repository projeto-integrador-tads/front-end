import { StyleSheet } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  headerSection: {
    position: "relative",
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  backgroundSvg: {
    width: "100%",
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 24,
    paddingTop: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    color: colors.neutral.white,
  },
  userName: {
    color: colors.neutral.white,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral.gray3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral.black,
  },
  sectionTitle: {
    marginVertical: 24,
    color: colors.neutral.black,
  },
  serviceOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  serviceOption: {
    width: 72,
  },
  serviceIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.primary.light.default,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceLabel: {
    fontSize: 12,
    color: colors.neutral.gray1,
    textAlign: "center",
    marginTop: 8,
  },
}); 