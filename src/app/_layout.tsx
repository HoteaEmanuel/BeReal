import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootGuard />
    </AuthProvider>
  );
}

function RootGuard() {
  const router = useRouter();
  const segments = useSegments();
  const inAuthGroup = segments[0] === "(auth)";
  const inTabsGroup = segments[0] === "(tabs)";
  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (isLoading) {
      router.replace("/loading");
      return;
    }
    if (!user) {
      if (!inAuthGroup) router.replace("/(auth)/login");
    } else {
      if (!inTabsGroup) router.replace("/(tabs)");
    }
  }, [user, segments]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="loading" />
    </Stack>
  );
}
