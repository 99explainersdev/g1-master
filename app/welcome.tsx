// app/welcome.tsx
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="car" size={80} color="#2563EB" />
        </View>

        <Text style={styles.title}>Road ready in{"\n"}Weeks, Not Months.</Text>

        <Text style={styles.subtitle}>
          Practice with Ontario G1 official questions, track your progress, and
          pass with confidence.
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.secondaryBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },
});