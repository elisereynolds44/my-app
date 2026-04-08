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
        <Stack.Screen name="lesson-2" />
        <Stack.Screen name="lesson-3" />
        <Stack.Screen name="lesson-4" />
        <Stack.Screen name="lesson-5" />
        <Stack.Screen name="lesson-6" />
        <Stack.Screen name="lesson-7" />
        <Stack.Screen name="lesson-8" />
        <Stack.Screen name="lesson-9" />
        <Stack.Screen name="lesson-10" />
        <Stack.Screen name="game-1" />
        <Stack.Screen name="game-2" />
        <Stack.Screen name="game-3" />
        <Stack.Screen name="game-4" />
        <Stack.Screen name="game-5" />
        <Stack.Screen name="game-6" />
        <Stack.Screen name="game-7" />
        <Stack.Screen name="game-8" />
        <Stack.Screen name="game-9" />
        <Stack.Screen name="game-10" />
        <Stack.Screen name="simulation-1" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ProfileProvider>
  );
}
