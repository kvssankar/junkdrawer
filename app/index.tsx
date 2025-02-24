// App.js
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import LottieView from "lottie-react-native";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_GOOGLE_CLIENT_ID",
  });

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Messy Notes</Text>
          <Text style={styles.subtitle}>
            Dump your messy thoughts - we'll organize, remind, and make them
            searchable through AI magic.
          </Text>
        </View>

        <View style={styles.animationContainer}>
          <LottieView
            source={require("../assets/welcome.json")}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/Dashboard")}
      >
        <Text style={styles.buttonText}>Let's Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 500,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 300,
    height: 300,
  },
  button: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
