// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />

      {/* hidden onboarding screen */}
      <Tabs.Screen name="welcome" options={{ href: null }} />

      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="roadmap" options={{ title: "Roadmap" }} />
    </Tabs>
  );
}