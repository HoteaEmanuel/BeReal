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

      <Stack.Protected
        guard={!isLoading && !!user && !user.onboardingCompleted}
      >
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected
        guard={!isLoading && !!user && !!user.onboardingCompleted}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="edit-profile"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="privacy-policy"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="terms-of-service"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="help-support"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="notifications"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="privacy"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isLoading && !user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
