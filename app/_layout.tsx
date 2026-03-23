import { Stack } from "expo-router";
import React from "react";

import { ProfileProvider } from "@/components/profile-context";

export default function RootLayout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)/welcome" />
        <Stack.Screen name="lesson-1" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ProfileProvider>
  );
}
