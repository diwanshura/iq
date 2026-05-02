import { COGNITIVE_CATEGORIES, type CognitiveCategory } from '../config/constants';

interface GeneratedQuestion {
  question: string;
  type: CognitiveCategory;
  difficulty: number;
  iq_section: string;
  source: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

const patternTemplates = [
  {
    template: "What comes next in the sequence: {sequence}?",
    generate: (difficulty: number) => {
      const sequences = [
        { seq: "2, 4, 6, 8, ?", options: ["10", "12", "11", "9"], correct: "10" },
        { seq: "1, 1, 2, 3, 5, 8, ?", options: ["13", "11", "10", "12"], correct: "13" },
        { seq: "5, 10, 15, 20, ?", options: ["25", "24", "30", "22"], correct: "25" },
      ];
      return sequences[Math.floor(Math.random() * sequences.length)];
    }
  }
];

const logicTemplates = [
  {
    template: "All cats are animals. Fluffy is a cat. Therefore, Fluffy is an {answer}.",
    options: ["animal", "mammal", "cat", "pet"],
    correct: "animal"
  },
  {
    template: "If A > B and B > C, then A {answer} C.",
    options: [">", "<", "=", "≠"],
    correct: ">"
  }
];

const numericalTemplates = [
  {
    template: "What is 15% of 200?",
    options: ["30", "25", "35", "40"],
    correct: "30"
  },
  {
    template: "If x + 5 = 12, what is x?",
    options: ["7", "6", "8", "5"],
    correct: "7"
  }
];

const spatialTemplates = [
  {
    template: "A cube has 6 faces. How many edges does it have?",
    options: ["12", "8", "10", "14"],
    correct: "12"
  },
  {
    template: "If you rotate a square 45 degrees, it becomes a {answer}.",
    options: ["diamond", "triangle", "pentagon", "hexagon"],
    correct: "diamond"
  }
];

const abstractTemplates = [
  {
    template: "Which is different from the others?",
    options: ["Monday", "Tuesday", "Breakfast", "Wednesday"],
    correct: "Breakfast"
  },
  {
    template: "Complete the analogy: Dog is to Bark as Cat is to {answer}.",
    options: ["Meow", "Run", "Eat", "Sleep"],
    correct: "Meow"
  }
];

export const generateAIQuestion = (
  iq_section: string,
  difficulty: number
): GeneratedQuestion => {
  const categoryIndex = Math.floor(Math.random() * COGNITIVE_CATEGORIES.length);
  const type = COGNITIVE_CATEGORIES[categoryIndex];

  let template: any;
  let question: string;
  let options: string[];
  let correct_answer: string;
  let explanation: string;

  switch (type) {
    case 'pattern':
      template = patternTemplates[0];
      const patternData = template.generate(difficulty);
      question = template.template.replace('{sequence}', patternData.seq);
      options = patternData.options;
      correct_answer = patternData.correct;
      explanation = `The pattern increases by 2 each time: ${patternData.seq} → 10`;
      break;

    case 'logic':
      template = logicTemplates[Math.floor(Math.random() * logicTemplates.length)];
      question = template.template;
      options = template.options;
      correct_answer = template.correct;
      explanation = `This tests deductive reasoning and logical inference.`;
      break;

    case 'numerical':
      template = numericalTemplates[Math.floor(Math.random() * numericalTemplates.length)];
      question = template.template;
      options = template.options;
      correct_answer = template.correct;
      explanation = `Basic mathematical calculation or algebra.`;
      break;

    case 'spatial':
      template = spatialTemplates[Math.floor(Math.random() * spatialTemplates.length)];
      question = template.template;
      options = template.options;
      correct_answer = template.correct;
      explanation = `Spatial reasoning and 3D visualization.`;
      break;

    case 'abstract':
      template = abstractTemplates[Math.floor(Math.random() * abstractTemplates.length)];
      question = template.template;
      options = template.options;
      correct_answer = template.correct;
      explanation = `Abstract reasoning and pattern recognition.`;
      break;

    default:
      question = "Test question";
      options = ["A", "B", "C", "D"];
      correct_answer = "A";
      explanation = "Test explanation";
  }

  return {
    question,
    type,
    difficulty,
    iq_section,
    source: 'ai',
    options,
    correct_answer,
    explanation
  };
};

export const generateMultipleQuestions = (
  iq_section: string,
  difficulty: number,
  count: number
): GeneratedQuestion[] => {
  const questions: GeneratedQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateAIQuestion(iq_section, difficulty));
  }
  return questions;
};
