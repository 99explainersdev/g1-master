import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://g1-master-admin.vercel.app";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: string;
  imageUrl?: string;
}

interface QuestionAttempt {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const quizType = params.type as string || "quick";

  const [screenState, setScreenState] = useState<"loading" | "intro" | "quiz" | "result" | "saving">("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState<QuestionAttempt[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [userEmail, setUserEmail] = useState<string>("");

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Get user email from authenticated session
  useEffect(() => {
    getUserEmail();
  }, []);

  const getUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      
      if (!email) {
        // User is not logged in - redirect to login screen
        console.log("No user email found - redirecting to login");
        router.replace("/login"); // Update this path to match your login route
        return;
      }
      
      setUserEmail(email);
    } catch (error) {
      console.error("Error getting user email:", error);
      // If there's an error reading the email, redirect to login
      router.replace("/login");
    }
  };

  // Fetch questions based on quiz type
  useEffect(() => {
    if (userEmail) {
      fetchQuestions();
    }
  }, [quizType, userEmail]);

  const fetchQuestions = async () => {
    try {
      setScreenState("loading");
      
      let apiUrl = `${API_URL}/api/quiz`;
      
      if (quizType === "quick") {
        apiUrl += "?random=true&limit=20";
      } else if (quizType === "traffic_signs") {
        apiUrl += "?category=traffic_signs";
      } else if (quizType === "rules_of_road") {
        apiUrl += "?category=rules_of_road";
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.quizzes.length === 0) {
          Alert.alert("No Questions", "No questions available for this quiz type.");
          router.back();
          return;
        }
        setQuestions(data.quizzes);
        setScreenState("intro");
      } else {
        throw new Error("Failed to load questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      Alert.alert("Error", "Could not load quiz questions. Please try again.");
      router.back();
    }
  };

  const getQuizTitle = () => {
    switch (quizType) {
      case "traffic_signs":
        return "Traffic Signs Quiz";
      case "rules_of_road":
        return "Rules of the Road Quiz";
      default:
        return "Quick Quiz";
    }
  };

  const getQuizDescription = () => {
    switch (quizType) {
      case "traffic_signs":
        return `${totalQuestions} questions about road signs`;
      case "rules_of_road":
        return `${totalQuestions} questions about traffic laws`;
      default:
        return `${totalQuestions} mixed questions from all categories`;
    }
  };

  const handleStartQuiz = () => {
    setScreenState("quiz");
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsSubmitted(false);
    setSelectedOption(null);
    setQuestionsAttempted([]);
    setStartTime(Date.now());
  };

  const handleOptionSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    
    // Record this attempt
    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      userAnswer: selectedOption,
      correctAnswer: currentQuestion.correctAnswerIndex,
      isCorrect,
    };

    setQuestionsAttempted([...questionsAttempted, attempt]);
    setIsSubmitted(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
      setSelectedOption(null);
    } else {
      // Quiz completed - save results
      saveQuizAttempt();
    }
  };

  const saveQuizAttempt = async () => {
    setScreenState("saving");

    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000); // in seconds
    
    // Use the current score and questionsAttempted - they already include all answers
    const finalScore = score;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    const passingScore = Math.ceil(totalQuestions * 0.8);
    const isPassed = finalScore >= passingScore;

    const attemptData = {
      email: userEmail,
      quizType,
      totalQuestions,
      correctAnswers: finalScore,
      score: percentage,
      isPassed,
      timeTaken,
      questionsAttempted: questionsAttempted,
    };

    try {
      console.log("Saving quiz attempt for email:", userEmail);
      console.log("Quiz data:", {
        correctAnswers: finalScore,
        totalQuestions,
        percentage,
        isPassed,
        totalAttempts: questionsAttempted.length
      });
      
      const response = await fetch(`${API_URL}/api/quiz/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attemptData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Quiz attempt saved successfully:", data.attemptId);
        setScreenState("result");
      } else {
        throw new Error(data.message || "Failed to save quiz attempt");
      }
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      Alert.alert(
        "Save Failed",
        "Your results couldn't be saved, but you can still view them.",
        [
          {
            text: "OK",
            onPress: () => setScreenState("result"),
          },
        ]
      );
    }
  };

  const handleRestart = () => {
    router.back();
  };

  // --- LOADING SCREEN ---
  if (screenState === "loading" || !userEmail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- SAVING SCREEN ---
  if (screenState === "saving") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Saving your results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- 1. INTRO SCREEN ---
  if (screenState === "intro") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.introContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          <View style={styles.introIconCircle}>
            <Ionicons name="play" size={40} color="#4F46E5" />
          </View>
          <Text style={styles.introTitle}>Ready?</Text>
          <Text style={styles.introSubtitle}>{getQuizDescription()}</Text>
          
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartQuiz}>
            <Text style={styles.primaryBtnText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- 2. RESULT SCREEN ---
  if (screenState === "result") {
    const passingScore = Math.ceil(totalQuestions * 0.8);
    const isPassed = score >= passingScore;
    const incorrect = totalQuestions - score;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContent}>
          <View
            style={[
              styles.scoreCircle,
              { borderColor: isPassed ? "#10B981" : "#EF4444" },
            ]}
          >
            <Text style={styles.scoreBigText}>{score}</Text>
            <Text style={styles.scoreSmallText}>out of {totalQuestions}</Text>
          </View>

          <Text
            style={[
              styles.resultTitle,
              { color: isPassed ? "#10B981" : "#EF4444" },
            ]}
          >
            {isPassed ? "Good Job!" : "Keep Practicing"}
          </Text>
          <Text style={styles.resultSubtitle}>
            You scored {percentage}%. {isPassed ? "You passed!" : "You need 80% to pass."}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBoxGreen}>
              <Text style={styles.statTextGreen}>{score} Correct</Text>
            </View>
            <View style={styles.statBoxRed}>
              <Text style={styles.statTextRed}>{incorrect} Incorrect</Text>
            </View>
          </View>

          <View style={styles.savedIndicator}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.savedText}>Results saved to your history</Text>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleRestart}>
            <Text style={styles.primaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- 3. QUIZ SCREEN ---
  if (!currentQuestion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {currentQuestion.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentQuestion.imageUrl }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={60} color="#9CA3AF" />
          </View>
        )}

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let borderColor = "#E5E7EB";
            let iconName: keyof typeof Ionicons.glyphMap = "radio-button-off";
            let iconColor = "#9CA3AF";

            if (isSubmitted) {
              if (index === currentQuestion.correctAnswerIndex) {
                borderColor = "#10B981";
                iconName = "checkmark-circle";
                iconColor = "#10B981";
              } else if (index === selectedOption) {
                borderColor = "#EF4444";
                iconName = "close-circle";
                iconColor = "#EF4444";
              }
            } else if (selectedOption === index) {
              borderColor = "#2563EB";
              iconName = "radio-button-on";
              iconColor = "#2563EB";
            }

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  {
                    borderColor,
                    borderWidth:
                      isSubmitted &&
                      (index === currentQuestion.correctAnswerIndex ||
                        index === selectedOption)
                        ? 2
                        : 1,
                  },
                ]}
                onPress={() => handleOptionSelect(index)}
                disabled={isSubmitted}
              >
                <Ionicons
                  name={iconName}
                  size={24}
                  color={iconColor}
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isSubmitted && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>Explanation:</Text>
            <Text style={styles.explanationText}>
              {currentQuestion.explanation}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {
              marginTop: 24,
              backgroundColor: selectedOption === null ? "#9CA3AF" : "#2563EB",
            },
          ]}
          onPress={isSubmitted ? handleNext : handleSubmit}
          disabled={selectedOption === null}
        >
          <Text style={styles.primaryBtnText}>
            {isSubmitted
              ? currentQuestionIndex === totalQuestions - 1
                ? "Finish"
                : "Next Question"
              : "Submit"}
          </Text>
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
    paddingBottom: 40,
  },
  introContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  introIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  introSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    width: "100%",
    marginBottom: 24,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
    lineHeight: 26,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  questionImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  optionsContainer: { gap: 12 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  optionText: { fontSize: 15, color: "#374151", flex: 1 },
  explanationBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  explanationLabel: { fontWeight: "bold", color: "#1E40AF", marginBottom: 4 },
  explanationText: { color: "#1E3A8A", fontSize: 14, lineHeight: 20 },
  resultContent: { alignItems: "center", padding: 24, paddingTop: 60 },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    marginTop: 100,
  },
  scoreBigText: { fontSize: 40, fontWeight: "bold", color: "#111827" },
  scoreSmallText: { fontSize: 14, color: "#6B7280" },
  resultTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  resultSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 32,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    marginBottom: 24,
  },
  statBoxGreen: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statTextGreen: { color: "#10B981", fontWeight: "bold", fontSize: 16 },
  statBoxRed: {
    flex: 1,
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statTextRed: { color: "#EF4444", fontWeight: "bold", fontSize: 16 },
  savedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  savedText: {
    color: "#059669",
    fontSize: 14,
    fontWeight: "500",
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});