import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name.substring(0, 2).toUpperCase() || "MY"}
            </Text>
          </View>
          <View>
            <Text style={styles.welcomeSub}>WELCOME BACK</Text>
            <Text style={styles.welcomeTitle}>{user?.name || "User"}!</Text>
          </View>
        </View>

        {/* Hero Banner (Daily Quiz) */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>Daily Quick Quiz</Text>
          <Text style={styles.heroSubtitle}>
            20 mixed questions to keep you sharp.
          </Text>

          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => router.push("/quiz?type=quick")}
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

        {/* Stats Row - Updated */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={28} color="#10B981" />
            <Text style={styles.statValue}>{user?.stats.avgScore || 0}%</Text>
            <Text style={styles.statLabel}>AVG SCORE</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="clipboard" size={28} color="#F59E0B" />
            <Text style={styles.statValue}>{user?.stats.totalQuizzes || 0}</Text>
            <Text style={styles.statLabel}>TOTAL QUIZZES</Text>
          </View>
        </View>

        {/* Part 1: Knowledge Test */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="book" size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>Part 1: Knowledge Test</Text>
            </View>
          </View>

          <View style={styles.partCardsContainer}>
            {/* Traffic Signs Card */}
            <TouchableOpacity
              style={styles.partCard}
              onPress={() => router.push("/quiz?type=traffic_signs")}
            >
              <View style={[styles.partIconCircle, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="warning" size={32} color="#EF4444" />
              </View>
              <Text style={styles.partTitle}>A) Traffic Signs</Text>
              <Text style={styles.partDescription}>
                Learn road signs and their meanings
              </Text>
              <View style={styles.partFooter}>
                <Text style={styles.partCount}>40 Questions</Text>
                <Ionicons name="arrow-forward" size={18} color="#6B7280" />
              </View>
            </TouchableOpacity>

            {/* Rules of the Road Card */}
            <TouchableOpacity
              style={styles.partCard}
              onPress={() => router.push("/quiz?type=rules_of_road")}
            >
              <View style={[styles.partIconCircle, { backgroundColor: "#DBEAFE" }]}>
                <Ionicons name="car" size={32} color="#2563EB" />
              </View>
              <Text style={styles.partTitle}>B) Rules of the Road</Text>
              <Text style={styles.partDescription}>
                Traffic laws and regulations
              </Text>
              <View style={styles.partFooter}>
                <Text style={styles.partCount}>40 Questions</Text>
                <Ionicons name="arrow-forward" size={18} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Part 2: Road Test Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="map" size={20} color="#16A34A" />
              <Text style={styles.sectionTitle}>Part 2: Road Test Information</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/learn")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Road Test Topics - Horizontal Scroll */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.roadTestScrollView}
            contentContainerStyle={styles.roadTestScroll}
          >
            {/* Topic 1 */}
            <TouchableOpacity
              style={styles.roadTestCard}
              onPress={() => router.push("/learn")}
            >
              <View style={[styles.roadTestIcon, { backgroundColor: "#DCFCE7" }]}>
                <Ionicons name="shield-checkmark" size={28} color="#16A34A" />
              </View>
              <Text style={styles.roadTestTitle}>Safety Tips</Text>
              <Text style={styles.roadTestSub}>12 Topics</Text>
            </TouchableOpacity>

            {/* Topic 2 */}
            <TouchableOpacity
              style={styles.roadTestCard}
              onPress={() => router.push("/learn")}
            >
              <View style={[styles.roadTestIcon, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="car-sport" size={28} color="#D97706" />
              </View>
              <Text style={styles.roadTestTitle}>Parking</Text>
              <Text style={styles.roadTestSub}>8 Topics</Text>
            </TouchableOpacity>

            {/* Topic 3 */}
            <TouchableOpacity
              style={styles.roadTestCard}
              onPress={() => router.push("/learn")}
            >
              <View style={[styles.roadTestIcon, { backgroundColor: "#E0E7FF" }]}>
                <Ionicons name="navigate" size={28} color="#4F46E5" />
              </View>
              <Text style={styles.roadTestTitle}>Intersections</Text>
              <Text style={styles.roadTestSub}>10 Topics</Text>
            </TouchableOpacity>

            {/* Topic 4 */}
            <TouchableOpacity
              style={styles.roadTestCard}
              onPress={() => router.push("/learn")}
            >
              <View style={[styles.roadTestIcon, { backgroundColor: "#FCE7F3" }]}>
                <Ionicons name="speedometer" size={28} color="#EC4899" />
              </View>
              <Text style={styles.roadTestTitle}>Speed Control</Text>
              <Text style={styles.roadTestSub}>6 Topics</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100, // Increased padding to show full cards at bottom
    paddingHorizontal: 20,
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
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
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
    backgroundColor: "#1D4ED8",
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

  // Stats - Updated
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    textAlign: "center",
  },

  // Section Container
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  viewAllText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },

  // Part Cards (Knowledge Test)
  partCardsContainer: {
    gap: 16,
  },
  partCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  partIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  partTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  partDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  partFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  partCount: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  // Road Test Cards (Horizontal Scroll)
  roadTestScrollView: {
    marginHorizontal: -20, // Offset parent padding
    padding: 5
  },
  roadTestScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  roadTestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roadTestIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  roadTestTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  roadTestSub: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});