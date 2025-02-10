import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { colors } from "@/styles/shared/colors/colors";

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor={colors.neutral.white} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.neutral.white,
          },
          animation: "fade",
        }}
      />
    </View>
  );
} 