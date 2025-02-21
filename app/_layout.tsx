import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Text } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  let [loaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    fonts: {
      bodyLarge: { fontFamily: "Poppins_400Regular", fontWeight: "normal" },
      bodyMedium: { fontFamily: "Poppins_400Regular", fontWeight: "normal" },
      bodySmall: { fontFamily: "Poppins_400Regular", fontWeight: "normal" },
      labelLarge: { fontFamily: "Poppins_500Medium", fontWeight: "normal" },
      labelMedium: { fontFamily: "Poppins_500Medium", fontWeight: "normal" },
      labelSmall: { fontFamily: "Poppins_500Medium", fontWeight: "normal" },
      titleLarge: { fontFamily: "Poppins_500Medium", fontWeight: "normal" },
      titleMedium: { fontFamily: "Poppins_500Medium", fontWeight: "normal" },
      titleSmall: { fontFamily: "Poppins_500Medium", fontWeight: "normal" },
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="EditNote" options={{ headerShown: false }} />
        <Stack.Screen name="EditVoiceNote" options={{ headerShown: false }} />
        <Stack.Screen name="EditImageNote" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </PaperProvider>
  );
}
