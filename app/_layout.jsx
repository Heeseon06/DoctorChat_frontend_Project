import { Stack } from "expo-router";
import IntroScreen from "./IntroScreen";
import Index from "./index";
import Chatting from "./Chatting";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="IntroScreen" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Chatting" options={{ headerShown: false }} />
    </Stack>
  );
}
