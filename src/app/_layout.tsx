import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { colors } from "@/styles/shared/colors/colors";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor={colors.neutral.white} />
      <Slot />
    </View>
  );
}
