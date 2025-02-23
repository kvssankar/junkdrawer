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
    colors: {
      primary: "rgb(39, 111, 245)", // Primary Blue (#276FF5)
      onPrimary: "rgb(255, 255, 255)", // White text on primary
      primaryContainer: "rgb(200, 222, 255)", // Light blue container
      onPrimaryContainer: "rgb(0, 30, 80)", // Darker text on light blue

      secondary: "rgb(220, 220, 220)", // Soft grayish-white
      onSecondary: "rgb(50, 50, 50)", // Darker text on secondary
      secondaryContainer: "rgb(240, 240, 240)", // Slightly darker gray
      onSecondaryContainer: "rgb(33, 33, 33)", // Dark text for contrast

      tertiary: "rgb(150, 150, 150)", // Neutral gray tertiary color
      onTertiary: "rgb(255, 255, 255)", // White text on tertiary
      tertiaryContainer: "rgb(230, 230, 230)", // Light gray container
      onTertiaryContainer: "rgb(40, 40, 40)", // Dark text on light tertiary

      error: "rgb(211, 47, 47)", // Strong red for errors
      onError: "rgb(255, 255, 255)", // White text on error
      errorContainer: "rgb(255, 205, 210)", // Light red error background
      onErrorContainer: "rgb(105, 0, 0)", // Darker text for error contrast

      background: "rgb(245, 245, 245)", // Light grayish background
      onBackground: "rgb(30, 30, 30)", // Dark text on background

      surface: "rgb(255, 255, 255)", // Pure white surface
      onSurface: "rgb(30, 30, 30)", // Dark text on surface
      surfaceVariant: "rgb(225, 225, 225)", // Slightly darker surface
      onSurfaceVariant: "rgb(60, 60, 60)", // Medium-dark text on variant

      outline: "rgb(150, 150, 150)", // Medium gray outlines
      outlineVariant: "rgb(200, 200, 200)", // Lighter outline

      shadow: "rgb(0, 0, 0)", // Default black shadows
      scrim: "rgb(0, 0, 0)", // Default black overlay

      inverseSurface: "rgb(50, 50, 50)", // Dark surface for inverted themes
      inverseOnSurface: "rgb(220, 220, 220)", // Light text on dark surface
      inversePrimary: "rgb(150, 200, 255)", // Lighter blue for inverse

      elevation: {
        level0: "transparent",
        level1: "rgb(240, 240, 240)",
        level2: "rgb(230, 230, 230)",
        level3: "rgb(220, 220, 220)",
        level4: "rgb(210, 210, 210)",
        level5: "rgb(200, 200, 200)",
      },

      surfaceDisabled: "rgba(30, 30, 30, 0.12)", // Muted surface
      onSurfaceDisabled: "rgba(30, 30, 30, 0.38)", // Muted text
      backdrop: "rgba(50, 50, 50, 0.4)", // Semi-transparent dark backdrop
    },
    fonts: {
      default: {
        fontFamily: "Poppins_400Regular",
        fontWeight: "400",
        letterSpacing: 0,
      },

      displaySmall: {
        fontFamily: "Poppins_400Regular",
        fontSize: 36,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 44,
      },
      displayMedium: {
        fontFamily: "Poppins_400Regular",
        fontSize: 45,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 52,
      },
      displayLarge: {
        fontFamily: "Poppins_400Regular",
        fontSize: 57,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 64,
      },

      headlineSmall: {
        fontFamily: "Poppins_400Regular",
        fontSize: 24,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 32,
      },
      headlineMedium: {
        fontFamily: "Poppins_400Regular",
        fontSize: 28,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 36,
      },
      headlineLarge: {
        fontFamily: "Poppins_400Regular",
        fontSize: 32,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 40,
      },

      titleSmall: {
        fontFamily: "Poppins_500Medium",
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20,
      },
      titleMedium: {
        fontFamily: "Poppins_500Medium",
        fontSize: 16,
        fontWeight: "500",
        letterSpacing: 0.15,
        lineHeight: 24,
      },
      titleLarge: {
        fontFamily: "Poppins_400Regular",
        fontSize: 22,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 28,
      },

      labelSmall: {
        fontFamily: "Poppins_500Medium",
        fontSize: 11,
        fontWeight: "500",
        letterSpacing: 0.5,
        lineHeight: 16,
      },
      labelMedium: {
        fontFamily: "Poppins_500Medium",
        fontSize: 12,
        fontWeight: "500",
        letterSpacing: 0.5,
        lineHeight: 16,
      },
      labelLarge: {
        fontFamily: "Poppins_500Medium",
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20,
      },

      bodySmall: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        fontWeight: "400",
        letterSpacing: 0.4,
        lineHeight: 16,
      },
      bodyMedium: {
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.25,
        lineHeight: 20,
      },
      bodyLarge: {
        fontFamily: "Poppins_400Regular",
        fontSize: 16,
        fontWeight: "400",
        letterSpacing: 0.15,
        lineHeight: 24,
      },
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="NoteDetailView" options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
        <Stack.Screen name="EditNote" options={{ headerShown: false }} />
        <Stack.Screen name="EditVoiceNote" options={{ headerShown: false }} />
        <Stack.Screen name="EditImageNote" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </PaperProvider>
  );
}
