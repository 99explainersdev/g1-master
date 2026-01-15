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

/* ---------- TYPES ---------- */

interface Step {
  title: string;
  desc: string;
}

// New Content Block Types
type ContentBlock =
  | {
      type: "text";
      data: { text: string };
    }
  | {
      type: "image";
      data: { imageUrl: string; caption?: string };
    }
  | {
      type: "steps";
      data: { steps: Step[] };
    }
  | {
      type: "note";
      data: { text: string; level: "info" | "warning" | "danger" };
    };

interface Topic {
  id: string;
  title: string;
  imgUrl: string; // Updated from signImage
  count: string;
  tag: string;
  // Make these optional as they might not be in the new API response,
  // we will provide defaults if missing
  icon?: string;
  color?: string;
  iconColor?: string;

  // The new flexible structure
  contentBlocks: ContentBlock[];

  isPublished?: boolean;
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
    router.setParams({ topicId: undefined });
  };

  const handleBackToList = () => {
    setViewState("list");
    setSelectedTopic(null);
    router.setParams({ topicId: undefined });
  };

  // Helper for defaults since specific colors/icons were removed from backend
  const getTopicColor = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes("beginner")) return { bg: "#DBEAFE", text: "#1E40AF" }; // Blue
    if (t.includes("advanced")) return { bg: "#FCE7F3", text: "#9D174D" }; // Pink
    if (t.includes("warning")) return { bg: "#FEE2E2", text: "#991B1B" }; // Red
    return { bg: "#F3F4F6", text: "#374151" }; // Gray default
  };

  // Filter topics based on search
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------- BLOCK RENDERER ---------- */
  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "text":
        return (
          <View key={index} style={styles.contentSection}>
            <Text style={styles.sectionBody}>{block.data.text}</Text>
          </View>
        );

      case "image":
        return (
          <View key={index} style={styles.contentSection}>
            <View style={styles.contentImageContainer}>
              <Image
                source={{ uri: block.data.imageUrl }}
                style={styles.contentImage}
                resizeMode="contain"
              />
            </View>
            {block.data.caption ? (
              <Text style={styles.imageCaption}>{block.data.caption}</Text>
            ) : null}
          </View>
        );

      case "steps":
        return (
          <View key={index} style={styles.contentSection}>
            {block.data.steps.map((step, idx) => (
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
        );

      case "note":
        let bg = "#EFF6FF"; // info - blue
        let border = "#BFDBFE";
        let text = "#1E3A8A";
        let iconName: any = "information-circle";
        let iconColor = "#2563EB";

        if (block.data.level === "warning") {
          bg = "#FEFCE8"; // yellow
          border = "#FEF08A";
          text = "#854D0E";
          iconName = "warning";
          iconColor = "#EAB308";
        } else if (block.data.level === "danger") {
          bg = "#FEF2F2"; // red
          border = "#FECACA";
          text = "#991B1B";
          iconName = "alert-circle";
          iconColor = "#EF4444";
        }

        return (
          <View
            key={index}
            style={[
              styles.infoBox,
              { backgroundColor: bg, borderColor: border },
            ]}
          >
            <Ionicons name={iconName} size={20} color={iconColor} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.infoBoxTitle, { color: iconColor }]}>
                {block.data.level.toUpperCase()}
              </Text>
              <Text style={[styles.infoBoxText, { color: text }]}>
                {block.data.text}
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

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
            filteredTopics.map((item) => {
              const theme = getTopicColor(item.tag);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.topicCard}
                  onPress={() => handleTopicPress(item)}
                >
                  <View style={[styles.iconBox, { backgroundColor: theme.bg }]}>
                    {/* Prioritize imgUrl for the thumbnail */}
                    {item.imgUrl ? (
                      <Image
                        source={{ uri: item.imgUrl }}
                        style={styles.iconImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons
                        name="book-outline"
                        size={24}
                        color={theme.text}
                      />
                    )}
                  </View>
                  <View style={styles.topicInfo}>
                    <Text style={styles.topicTitle}>{item.title}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.topicSub}>{item.count}</Text>
                      <Text style={[styles.listTag, { color: theme.text }]}>
                        • {item.tag}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- 2. DETAIL VIEW ---
  if (!selectedTopic) return null;

  const theme = getTopicColor(selectedTopic.tag);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleBackToList}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        {/* Truncate title in header if too long */}
        <Text style={styles.detailHeaderTitle} numberOfLines={1}>
          {selectedTopic.title}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.detailScrollContent}>
        {/* Sign/Main Visual Card */}
        <View style={styles.signCard}>
          {selectedTopic.imgUrl ? (
            <View style={styles.signImageContainer}>
              <Image
                source={{ uri: selectedTopic.imgUrl }}
                style={styles.signImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.signImageContainer}>
              <Ionicons name="image-outline" size={100} color="#9CA3AF" />
            </View>
          )}

          <Text style={styles.signTitle}>{selectedTopic.title}</Text>

          <View style={[styles.tag, { backgroundColor: theme.bg }]}>
            <Text style={[styles.tagText, { color: theme.text }]}>
              {selectedTopic.tag}
            </Text>
          </View>
        </View>

        {/* DYNAMIC CONTENT BLOCKS */}
        {selectedTopic.contentBlocks &&
        selectedTopic.contentBlocks.length > 0 ? (
          selectedTopic.contentBlocks.map((block, index) =>
            renderContentBlock(block, index)
          )
        ) : (
          <Text style={styles.sectionBody}>No content details available.</Text>
        )}

        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
          <Text style={styles.completeBtnText}>Complete Topic</Text>
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
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  listTag: { fontSize: 12, marginLeft: 6, fontWeight: "600" },

  // Detail View
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
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
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  signImage: {
    width: "100%",
    height: "100%",
  },
  signTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  tag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  tagText: { fontWeight: "bold", fontSize: 11, textTransform: "uppercase" },

  // Content Rendering
  contentSection: { marginBottom: 20 },
  sectionBody: { fontSize: 16, color: "#374151", lineHeight: 24 },

  contentImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
  },
  contentImage: {
    width: "100%",
    height: "100%",
  },
  imageCaption: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
    textAlign: "center",
  },

  // Steps
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
  stepDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
    lineHeight: 20,
  },

  // Notes
  infoBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  infoBoxTitle: { fontWeight: "bold", fontSize: 12, marginBottom: 4 },
  infoBoxText: { fontSize: 14, lineHeight: 20 },

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
