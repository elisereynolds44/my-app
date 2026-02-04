import React from "react";
import { View } from "react-native";
import ProfileScreen from "./profile";

export default function App() {
  // In a real app you'd probably render this screen inside a navigator
  // and pass real user data via props or context.
  return (
    <View style={{ flex: 1 }}>
      <ProfileScreen />
    </View>
  );
}