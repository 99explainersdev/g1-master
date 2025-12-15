export const mockQuestions = [
  {
    id: 1,
    question: "What does this sign mean?",
    // For local images, use require. For remote, use string URL.
    // We will use a placeholder color block in the UI for now.
    image: "yield_sign",
    options: [
      "Stop sign ahead",
      "Yield right-of-way",
      "Slow moving vehicle",
      "No entry",
    ],
    correctAnswerIndex: 1, // 0-based index (Yield right-of-way)
    explanation:
      "A downward-pointing triangle is a Yield sign. You must slow down and give the right-of-way to traffic.",
  },
  {
    id: 2,
    question: "When are you allowed to pass another vehicle on the right?",
    image: null,
    options: [
      "When the vehicle is turning left",
      "On a curve",
      "Never",
      "In a school zone",
    ],
    correctAnswerIndex: 0,
    explanation:
      "You may pass on the right only when the vehicle ahead is making a left turn and there is room to pass.",
  },
];
