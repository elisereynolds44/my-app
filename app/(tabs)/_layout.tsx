<<<<<<< HEAD
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
=======
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const NAVY = "#0F172A";
const GREEN = "#7ED6A5";
const MUTED = "#94A3B8";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: {
          backgroundColor: NAVY,
          borderTopWidth: 0,
          height: 84,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 12,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "index") iconName = "home";
          if (route.name === "roadmap") iconName = "map";
          if (route.name === "competition") iconName = "trophy";
          if (route.name === "profile") iconName = "person";

          return <Ionicons name={iconName} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="roadmap" options={{ title: "Roadmap" }} />
      <Tabs.Screen name="competition" options={{ title: "Compete" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
>>>>>>> main
    </Tabs>
  );
}
