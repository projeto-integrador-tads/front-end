import { Stack, Redirect } from "expo-router";
import { useUser } from "@/contexts/UserContext";

export default function AuthLayout() {
  const { user, loading } = useUser();

  if (!loading && user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
