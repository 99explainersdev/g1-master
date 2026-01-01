import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function QuizSelectorScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Quiz Type</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>
          Choose the type of quiz you want to take
        </Text>

        {/* Quick Quiz Card */}
        <TouchableOpacity
          style={styles.quizCard}
          onPress={() => router.push("/quiz?type=quick")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#EEF2FF" }]}>
            <Ionicons name="flash" size={40} color="#4F46E5" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Quick Quiz</Text>
            <Text style={styles.cardDescription}>
              20 random questions from all categories
            </Text>
            <View style={styles.cardFooter}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Mixed</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#6B7280" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Traffic Signs Quiz Card */}
        <TouchableOpacity
          style={styles.quizCard}
          onPress={() => router.push("/quiz?type=traffic_signs")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}>
            <Ionicons name="warning" size={40} color="#EF4444" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Traffic Signs Quiz</Text>
            <Text style={styles.cardDescription}>
              Test your knowledge of road signs
            </Text>
            <View style={styles.cardFooter}>
              <View style={[styles.badge, { backgroundColor: "#FEE2E2" }]}>
                <Text style={[styles.badgeText, { color: "#991B1B" }]}>
                  Part 1A
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#6B7280" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Rules of the Road Quiz Card */}
        <TouchableOpacity
          style={styles.quizCard}
          onPress={() => router.push("/quiz?type=rules_of_road")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#DBEAFE" }]}>
            <Ionicons name="car" size={40} color="#2563EB" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Rules of the Road</Text>
            <Text style={styles.cardDescription}>
              Learn traffic laws and regulations
            </Text>
            <View style={styles.cardFooter}>
              <View style={[styles.badge, { backgroundColor: "#DBEAFE" }]}>
                <Text style={[styles.badgeText, { color: "#1E40AF" }]}>
                  Part 1B
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#6B7280" />
            </View>
          </View>
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
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 32,
  },
  quizCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
});