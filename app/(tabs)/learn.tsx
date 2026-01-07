import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const API_URL = "https://g1-master-admin.vercel.app";

interface Step {
  title: string;
  desc: string;
}

interface Topic {
  id: string;
  title: string;
  count: string;
  icon: string;
  color: string;
  iconColor: string;
  tag: string;
  mainSignName: string;
  signImage?: string;
  description: string;
  steps: Step[];
  commonMistake: string;
  proTip: string;
  legalNote: string;
}

export default function LearnScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const topicIdFromParams = params.topicId as string | undefined;

  const [viewState, setViewState] = useState<"list" | "detail">("list");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch topics from API
  useEffect(() => {
    fetchTopics();
  }, []);

  // Handle navigation from home screen
  useEffect(() => {
    if (topicIdFromParams && topics.length > 0) {
      const topic = topics.find((t) => t.id === topicIdFromParams);
      if (topic) {
        handleTopicPress(topic);
      }
    }
  }, [topicIdFromParams, topics]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/topics`);
      const data = await response.json();

      if (response.ok && data.success) {
        setTopics(data.topics);
      } else {
        Alert.alert("Error", "Failed to load topics");
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicPress = (topic: Topic) => {
    setSelectedTopic(topic);
    setViewState("detail");
  };

  const handleComplete = () => {
    setViewState("list");
    setSelectedTopic(null);
    // Clear the topicId param by navigating back to learn without params
    router.setParams({ topicId: undefined });
  };

  const handleBackToList = () => {
    setViewState("list");
    setSelectedTopic(null);
    router.setParams({ topicId: undefined });
  };

  // Filter topics based on search
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- 1. LIST VIEW ---
  if (viewState === "list") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.mainTitle}>Topics</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search Topics..."
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Loading topics...</Text>
            </View>
          ) : filteredTopics.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyText}>No topics found</Text>
            </View>
          ) : (
            filteredTopics.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.topicCard}
                onPress={() => handleTopicPress(item)}
              >
                <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                  {item.signImage ? (
                    <Image
                      source={{ uri: item.signImage }}
                      style={styles.iconImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={item.iconColor}
                    />
                  )}
                </View>
                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>{item.title}</Text>
                  <Text style={styles.topicSub}>{item.count}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- 2. DETAIL VIEW ---
  if (!selectedTopic) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleBackToList}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>{selectedTopic.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.detailScrollContent}>
        {/* Sign/Main Visual Card */}
        <View style={styles.signCard}>
          {selectedTopic.signImage ? (
            <View style={styles.signImageContainer}>
              <Image
                source={{ uri: selectedTopic.signImage }}
                style={styles.signImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.signImageContainer}>
              <Ionicons name="image-outline" size={100} color="#9CA3AF" />
            </View>
          )}
          <Text style={styles.signTitle}>{selectedTopic.mainSignName}</Text>
          <View style={[styles.tag, { backgroundColor: selectedTopic.color }]}>
            <Text style={[styles.tagText, { color: selectedTopic.iconColor }]}>
              {selectedTopic.tag}
            </Text>
          </View>
        </View>

        {/* Section: Description */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeading}>What it means</Text>
          <Text style={styles.sectionBody}>{selectedTopic.description}</Text>
        </View>

        {/* Section: Steps/Action */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeading}>Proper Procedure</Text>
          {selectedTopic.steps.map((step: Step, idx: number) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{idx + 1}</Text>
              </View>
              <View style={styles.stepTextContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Common Mistake */}
        <View style={styles.infoBox}>
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.infoBoxTitle}>Common Mistake</Text>
            <Text style={styles.infoBoxText}>
              {selectedTopic.commonMistake}
            </Text>
          </View>
        </View>

        {/* Pro Tip */}
        <View
          style={[
            styles.infoBox,
            { backgroundColor: "#F0F9FF", borderColor: "#BAE6FD" },
          ]}
        >
          <Ionicons name="bulb" size={20} color="#0284C7" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.infoBoxTitle, { color: "#0369A1" }]}>
              Pro-Tip
            </Text>
            <Text style={[styles.infoBoxText, { color: "#0C4A6E" }]}>
              {selectedTopic.proTip}
            </Text>
          </View>
        </View>

        {/* Legal Note */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeading}>Legal Requirement</Text>
          <Text style={styles.sectionBody}>{selectedTopic.legalNote}</Text>
        </View>

        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
          <Text style={styles.completeBtnText}>Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: 50 },
  headerTitleContainer: {
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  mainTitle: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  scrollContent: { padding: 20 },
  searchContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: { fontSize: 16, color: "#111827" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  topicCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  iconImage: {
    width: "100%",
    height: "100%",
  },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  topicSub: { fontSize: 13, color: "#6B7280" },

  // Detail View
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
  },
  detailHeaderTitle: { fontSize: 18, fontWeight: "bold" },
  detailScrollContent: { padding: 20 },
  signCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  signImageContainer: {
    marginBottom: 16,
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  signImage: {
    width: "100%",
    height: "100%",
  },
  signTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  tagText: { fontWeight: "bold", fontSize: 11, textTransform: "uppercase" },
  contentSection: { marginBottom: 24 },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  sectionBody: { fontSize: 15, color: "#4B5563", lineHeight: 22 },
  stepRow: { flexDirection: "row", marginBottom: 16 },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  stepTextContent: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  stepDescription: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  infoBoxTitle: { fontWeight: "bold", color: "#991B1B", marginBottom: 2 },
  infoBoxText: { fontSize: 14, color: "#7F1D1D", lineHeight: 20 },
  completeBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  completeBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});