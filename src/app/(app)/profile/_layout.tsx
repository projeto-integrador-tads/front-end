import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "none",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="payments"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen name="settings" />
      <Stack.Screen name="settings/notifications" />
      <Stack.Screen name="vehicles" />
      <Stack.Screen name="vehicles/register" />
      <Stack.Screen name="vehicles/edit" />
    </Stack>
  );
}
