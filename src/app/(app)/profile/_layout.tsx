import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          animation: 'none'
        }}
      />
      <Stack.Screen name="edit" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="vehicles" />
      <Stack.Screen name="vehicles/register" />
      <Stack.Screen name="vehicles/edit" />
    </Stack>
  );
} 