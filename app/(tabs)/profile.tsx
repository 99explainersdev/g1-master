// app/(tabs)/profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const API_URL = "https://g1-master-admin.vercel.app";

interface QuizStatistics {
  totalAttempts: number;
  passedAttempts: number;
  failedAttempts: number;
  averageScore: number;
  passRate: number;
}

interface QuizAttempt {
  attemptId: string;
  quizType: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  isPassed: boolean;
  timeTaken: number;
  attemptedAt: string;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [statistics, setStatistics] = useState<QuizStatistics | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data when screen comes into focus
useFocusEffect(
  useCallback(() => {
    if (user?.email) {
      fetchUserStats();
    }
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
        setRecentAttempts(data.data.attempts.slice(0, 3)); // Get last 3 attempts
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserStats();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/welcome");
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getQuizTypeLabel = (type: string) => {
    switch (type) {
      case "traffic_signs":
        return "Traffic Signs";
      case "rules_of_road":
        return "Rules of Road";
      default:
        return "Quick Quiz";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Profile</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Statistics Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {statistics?.averageScore || 0}%
              </Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {statistics?.totalAttempts || 0}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {statistics?.passRate || 0}%
              </Text>
              <Text style={styles.statLabel}>Pass Rate</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.passedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.passedText}>
                  {statistics?.passedAttempts || 0}
                </Text>
              </View>
              <Text style={styles.statLabel}>Passed</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.failedBadge}>
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.failedText}>
                  {statistics?.failedAttempts || 0}
                </Text>
              </View>
              <Text style={styles.statLabel}>Failed</Text>
            </View>
          </View>
        </View>

        {/* Recent Attempts */}
        {recentAttempts.length > 0 && (
          <View style={styles.recentCard}>
            <Text style={styles.recentTitle}>Recent Quizzes</Text>
            {recentAttempts.map((attempt) => (
              <View key={attempt.attemptId} style={styles.attemptItem}>
                <View style={styles.attemptHeader}>
                  <View style={styles.attemptType}>
                    <Ionicons
                      name={
                        attempt.quizType === "traffic_signs"
                          ? "warning"
                          : attempt.quizType === "rules_of_road"
                          ? "book"
                          : "flash"
                      }
                      size={18}
                      color="#2563EB"
                    />
                    <Text style={styles.attemptTypeText}>
                      {getQuizTypeLabel(attempt.quizType)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.attemptBadge,
                      attempt.isPassed
                        ? styles.passedBadgeSmall
                        : styles.failedBadgeSmall,
                    ]}
                  >
                    <Text
                      style={
                        attempt.isPassed
                          ? styles.passedBadgeText
                          : styles.failedBadgeText
                      }
                    >
                      {attempt.isPassed ? "Passed" : "Failed"}
                    </Text>
                  </View>
                </View>

                <View style={styles.attemptDetails}>
                  <Text style={styles.attemptScore}>
                    Score: {attempt.score}% ({attempt.correctAnswers}/
                    {attempt.totalQuestions})
                  </Text>
                  
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  passedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  passedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
    marginLeft: 4,
  },
  failedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  failedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EF4444",
    marginLeft: 4,
  },
  recentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  attemptItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  attemptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  attemptType: {
    flexDirection: "row",
    alignItems: "center",
  },
  attemptTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  attemptBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  passedBadgeSmall: {
    backgroundColor: "#ECFDF5",
  },
  failedBadgeSmall: {
    backgroundColor: "#FEF2F2",
  },
  passedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  failedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
  },
  attemptDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attemptScore: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  attemptTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});