import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';

const API_URL = "https://g1-master-admin.vercel.app";

interface QuizStatistics {
  totalAttempts: number;
  passedAttempts: number;
  failedAttempts: number;
  averageScore: number;
  passRate: number;
}

// 1. UPDATED INTERFACE TO MATCH YOUR API RESPONSE
interface Topic {
  id: string;
  title: string;
  imgUrl: string; // Matches the JSON response
  count: string;
  tag: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<QuizStatistics | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(true);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.email) {
        fetchUserStats();
      }
      fetchTopics();
    }, [user?.email])
  );

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/user/stats?email=${encodeURIComponent(user?.email || "")}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/topics`);
      const data = await response.json();

      if (response.ok && data.success) {
        setTopics(data.topics);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleTopicPress = (topic: Topic) => {
    // Navigate to learn screen with the topic data
    router.push({
      pathname: "/learn",
      params: { topicId: topic.id }
    });
  };

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

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={28} color="#10B981" />
            {loading ? (
              <ActivityIndicator size="small" color="#10B981" style={{ marginTop: 8 }} />
            ) : (
              <>
                <Text style={styles.statValue}>
                  {statistics?.averageScore?.toFixed(0) || 0}%
                </Text>
                <Text style={styles.statLabel}>AVG SCORE</Text>
              </>
            )}
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={28} color="#F59E0B" />
            {loading ? (
              <ActivityIndicator size="small" color="#F59E0B" style={{ marginTop: 8 }} />
            ) : (
              <>
                <Text style={styles.statValue}>
                  {statistics?.passRate?.toFixed(0) || 0}%
                </Text>
                <Text style={styles.statLabel}>PASS RATE</Text>
              </>
            )}
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
          {topicsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.roadTestScrollView}
              contentContainerStyle={styles.roadTestScroll}
            >
              {topics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.roadTestCard}
                  onPress={() => handleTopicPress(topic)}
                >
                  {/* 2. UPDATED IMAGE RENDERING USING imgUrl */}
                  <View style={styles.topicImageContainer}>
                    <Image 
                      source={{ uri: topic.imgUrl || "https://via.placeholder.com/150" }}
                      style={styles.topicImage}
                      resizeMode="cover"
                    />
                  </View>
                  
                  {/* 3. UPDATED TITLE & REMOVED DESCRIPTION */}
                  <Text style={styles.roadTestTitle} numberOfLines={2}>
                    {topic.title}
                  </Text>
                  
                  {/* Optional: Show Tag or Count */}
                  <View style={styles.metaRow}>
                    <Text style={styles.roadTestSub}>{topic.count}</Text>
                    {topic.tag ? (
                      <Text style={styles.tagText}>• {topic.tag}</Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
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

  // Stats
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
    minHeight: 120,
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

  // Part Cards
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

  // Road Test Cards - UPDATED
  roadTestScrollView: {
    marginHorizontal: -20,
    padding: 5
  },
  roadTestScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  roadTestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12, // Reduced padding slightly
    width: 170, // Slightly wider for better title fit
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topicImageContainer: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#F3F4F6",
  },
  topicImage: {
    width: "100%",
    height: "100%",
  },
  roadTestTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  roadTestSub: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  tagText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
    marginLeft: 4,
  },
});