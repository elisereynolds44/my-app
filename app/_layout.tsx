// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

function RouteDebug() {
  const pathname = usePathname();

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 48,
        left: 12,
        right: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: "rgba(0,0,0,0.55)",
        zIndex: 9999,
      }}
    >
      <Text style={{ color: "white", fontWeight: "900" }}>ROUTE: {pathname}</Text>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>

      {/* Debug overlay */}
      <RouteDebug />
    </View>
  );
}