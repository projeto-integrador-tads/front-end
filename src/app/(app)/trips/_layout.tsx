import { Stack } from "expo-router";

export default function TripsLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          animation: 'none'
        }}
      />
      <Stack.Screen 
        name="details/[id]"
        options={{
          animation: 'slide_from_right',
          presentation: 'modal'
        }}
      />
    </Stack>
  );
} 