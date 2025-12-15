import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mockQuestions } from "@/constants/questions";

export default function QuizScreen() {
  const [screenState, setScreenState] = useState<"intro" | "quiz" | "result">(
    "intro"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const totalQuestions = mockQuestions.length;

  const handleStartQuiz = () => {
    setScreenState("quiz");
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsSubmitted(false);
    setSelectedOption(null);
  };

  const handleOptionSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    // FIX: Explicitly check for null.
    // If we just check !selectedOption, 0 (the first choice) fails.
    if (selectedOption === null) return;

    setIsSubmitted(true);

    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
      setSelectedOption(null);
    } else {
      setScreenState("result");
    }
  };

  const handleRestart = () => {
    setScreenState("intro");
  };

  // --- 1. INTRO SCREEN ---
  if (screenState === "intro") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.introContent}>
          <View style={styles.introIconCircle}>
            <Ionicons name="play" size={40} color="#4F46E5" />
          </View>
          <Text style={styles.introTitle}>Ready?</Text>
          <Text style={styles.introSubtitle}>
            {totalQuestions} questions selected randomly from all categories.
          </Text>
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
            {isPassed
              ? "You passed the practice test."
              : "You did not pass the test this time."}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBoxGreen}>
              <Text style={styles.statTextGreen}>{score} Correct</Text>
            </View>
            <View style={styles.statBoxRed}>
              <Text style={styles.statTextRed}>{incorrect} Incorrect</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleRestart}>
            <Text style={styles.primaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- 3. QUIZ SCREEN ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Questions {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${
                    ((currentQuestionIndex + 1) / totalQuestions) * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={60} color="#9CA3AF" />
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let borderColor = "#E5E7EB";
            let iconName = "radio-button-off";
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
                  name={iconName as any}
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

        {/* --- FIXED SUBMIT BUTTON --- */}
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {
              marginTop: 24,
              // FIX: Use explicit null check. index 0 is valid!
              backgroundColor: selectedOption === null ? "#9CA3AF" : "#2563EB",
            },
          ]}
          onPress={isSubmitted ? handleNext : handleSubmit}
          // FIX: Use explicit null check
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

  header: { marginBottom: 24, marginTop: 10 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
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
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
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
    marginBottom: 32,
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
