import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const GREEN = "#7ED6A5";
const MUTED = "#94A3B8";
const TAB = "#09111D";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 16,
          backgroundColor: TAB,
          borderTopWidth: 0,
          height: 74,
          paddingTop: 8,
          borderRadius: 24,
          shadowColor: "#000000",
          shadowOpacity: 0.28,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 12,
        },
        tabBarItemStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "index") iconName = "home";
          if (route.name === "roadmap") iconName = "map";
          if (route.name === "games") iconName = "game-controller";
          if (route.name === "profile") iconName = "person";

          return <Ionicons name={iconName} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="roadmap" options={{ title: "Roadmap" }} />
      <Tabs.Screen name="games" options={{ title: "Games" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
