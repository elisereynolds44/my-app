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
          let iconName: any;

          if (route.name === "index") iconName = "home";
          if (route.name === "profile") iconName = "person";
          if (route.name === "roadmap") iconName = "map";

          return <Ionicons name={iconName} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="welcome" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="roadmap" options={{ title: "Roadmap" }} />
    </Tabs>
  );
}