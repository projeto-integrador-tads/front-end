import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { colors } from "@/styles/shared/colors/colors";
import { useRouter } from "expo-router";
import LogoSvg from "@/assets/svgs/logo";

interface TopBarProps {
  showLogo?: boolean;
}

export function TopBar({ showLogo = true }: TopBarProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <IconArrowLeft size={24} color={colors.neutral.black} />
      </Pressable>
      {showLogo && (
        <View style={styles.logoContainer}>
          <LogoSvg width={48} height={48} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 80,
  },
  backButton: {
    position: "absolute",
    left: 24,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
}); 