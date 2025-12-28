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

  {
    id: 3,
    question: "What does a solid yellow line on your side of the road mean?",
    image: null,
    options: [
      "Passing is allowed",
      "Passing is not allowed",
      "Road under construction",
      "You must stop",
    ],
    correctAnswerIndex: 1,
    explanation:
      "A solid yellow line on your side means you are not allowed to pass vehicles ahead of you.",
  },
  {
    id: 4,
    question: "What should you do when approaching a red traffic light?",
    image: null,
    options: [
      "Slow down and proceed",
      "Stop completely",
      "Speed up",
      "Honk and continue",
    ],
    correctAnswerIndex: 1,
    explanation:
      "A red traffic light means you must come to a complete stop and wait until it turns green.",
  },
  {
    id: 5,
    question: "What does this sign indicate?",
    image: "speed_limit_sign",
    options: [
      "Minimum speed required",
      "Maximum speed allowed",
      "School zone ahead",
      "No parking",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Speed limit signs show the maximum legal speed you are allowed to drive on that road.",
  },
  {
    id: 6,
    question: "When should you use your vehicle's headlights?",
    image: null,
    options: [
      "Only at night",
      "When visibility is poor",
      "Only in rain",
      "Never during daytime",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Headlights should be used whenever visibility is poor, such as during rain, fog, or low-light conditions.",
  },
  {
    id: 7,
    question: "What does a flashing yellow traffic signal mean?",
    image: null,
    options: [
      "Stop completely",
      "Proceed with caution",
      "Road closed",
      "Traffic light malfunction",
    ],
    correctAnswerIndex: 1,
    explanation:
      "A flashing yellow signal warns you to slow down and proceed with caution.",
  },
];
