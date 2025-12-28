import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useRouter } from "expo-router"; // Import this
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();


  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MY</Text>
          </View>
          <View>
            <Text style={styles.welcomeSub}>WELCOME BACK</Text>
            <Text style={styles.welcomeTitle}>{user?.name || "User"}!</Text>
          </View>
        </View>

        {/* Hero Banner (Quiz) */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>Daily Quick Quiz</Text>
          <Text style={styles.heroSubtitle}>
            20 mixed questions to keep you sharp.
          </Text>

          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => router.push("/quiz")} // 👉 Add this navigation logic
          >
            <Ionicons
              name="play"
              size={16}
              color="#2F54EB"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.startBtnText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
            <Text style={styles.statLabel}>AVG SCORE</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#F59E0B" />
            <Text style={styles.statLabel}>STREAK</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="bookmark" size={24} color="#F97316" />
            <Text style={styles.statLabel}>AVG SCORE</Text>
          </View>
        </View>

        {/* Topics Header */}
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => router.push("/learn")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Topics Row */}
        <View style={styles.topicsContainer}>
          {/* Card 1 */}
          <View style={styles.topicCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="stop-circle" size={24} color="#EF4444" />
            </View>
            <Text style={styles.topicTitle}>Road Signs</Text>
            <Text style={styles.topicSub}>12 Topics</Text>
          </View>

          {/* Card 2 */}
          <View style={styles.topicCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#E0F2FE" }]}>
              <Ionicons name="car" size={24} color="#0284C7" />
            </View>
            <Text style={styles.topicTitle}>Rules Of Road</Text>
            <Text style={styles.topicSub}>12 Topics</Text>
          </View>

          {/* Card 3 */}
          <View style={styles.topicCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="shield-checkmark" size={24} color="#16A34A" />
            </View>
            <Text style={styles.topicTitle}>Safety & Def..</Text>
            <Text style={styles.topicSub}>12 Topics</Text>
          </View>
        </View>

        {/* Resume Section */}
        <Text style={styles.resumeHeader}>Pick up where you left off</Text>

        <View style={styles.resumeCard}>
          <View style={styles.resumeIconContainer}>
            <Ionicons name="stop-circle" size={40} color="#B91C1C" />
          </View>

          <View style={styles.resumeContent}>
            <Text style={styles.resumeTitle}>Regulatory Signs</Text>
            {/* Simple Progress Bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "40%" }]} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Very light grey background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 44,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#D1E0FF", // Light purple/blue
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#2F54EB",
    fontSize: 16,
    fontWeight: "bold",
  },
  welcomeSub: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  welcomeTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "bold",
  },

  // Hero Banner
  heroBanner: {
    backgroundColor: "#1D4ED8", // Darker blue
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "#E0E7FF",
    fontSize: 14,
    marginBottom: 20,
  },
  startBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  startBtnText: {
    color: "#1D4ED8",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    width: "31%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    marginTop: 8,
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "bold",
    textAlign: "center",
  },

  // Topics
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  viewAllText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },
  topicsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  topicCard: {
    backgroundColor: "#FFFFFF",
    width: "31%",
    borderRadius: 12,
    padding: 12,
    paddingVertical: 16,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  topicSub: {
    fontSize: 10,
    color: "#9CA3AF",
  },

  // Resume
  resumeHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
  },
  resumeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resumeIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resumeContent: {
    flex: 1,
  },
  resumeTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 3,
  },
});
