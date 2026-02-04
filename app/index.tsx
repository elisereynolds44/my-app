import { router } from "expo-router";
import { useState } from "react";
import Splash from "./Splash";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <Splash
        onDone={() => {
          setShowSplash(false);
          router.replace("/(tabs)");
        }}
      />
    );
  }

  return null;
}
