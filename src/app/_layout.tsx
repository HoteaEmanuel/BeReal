import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoading}>
        <Stack.Screen name="loading" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoading && !!user}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoading && !user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
