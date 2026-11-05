here
import { askAI } from "./ai-service.js";

function extractJSON(text) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("The AI did not return valid structured data. Please try again.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

function validateTopic(topic) {
  const value = String(topic || "").trim();

  if (value.length < 2) {
    throw new Error("Please enter a topic first.");
  }

  if (value.length > 160) {
    throw new Error("Please keep the topic under 160 characters.");
  }

  return value;
}

export async function generatePracticeSet({
  topic,
  difficulty = "beginner",
  count = 5
}) {
  const safeTopic = validateTopic(topic);
  const safeCount = Math.min(15, Math.max(3, Number(count) || 5));

  const prompt = `
You are Nexa Practice, an educational assessment assistant for a Biomedical Engineering student.

Create ${safeCount} original multiple-choice practice questions about:
"${safeTopic}"

Difficulty: ${difficulty}.

Requirements:
- Questions must be scientifically accurate and appropriate for Biomedical Engineering education.
- Use four answer options per question.
- Only one option must be correct.
- Include a clear explanation of why the correct answer is right.
- Avoid ambiguous wording and trick questions.
- Do not invent citations, textbook quotations or examination-board claims.
- If the topic is outside your reliable knowledge, say so in the explanation rather than inventing facts.
- Return ONLY valid JSON in this exact structure:
{
  "title": "Short practice title",
  "topic": "Topic",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation"
    }
  ]
}
`;

  const response = await askAI(prompt, []);
  const data = extractJSON(response.answer);

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error("The AI returned no practice questions. Please try again.");
  }

  const questions = data.questions.slice(0, safeCount).map(item => {
    const options = Array.isArray(item.options)
      ? item.options.slice(0, 4).map(option => String(option))
      : [];

    const correctIndex = Number(item.correctIndex);

    if (
      !item.question ||
      options.length !== 4 ||
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex > 3
    ) {
      throw new Error("The AI returned an incomplete question. Please generate another set.");
    }

    return {
      question: String(item.question),
      options,
      correctIndex,
      explanation: String(item.explanation || "Review the topic to understand this answer.")
    };
  });

  return {
    title: String(data.title || `${safeTopic} Practice`),
    topic: safeTopic,
    difficulty,
    questions
  };
}

export async function generateFlashcardSet({
  topic,
  count = 10,
  difficulty = "beginner"
}) {
  const safeTopic = validateTopic(topic);
  const safeCount = Math.min(30, Math.max(3, Number(count) || 10));

  const prompt = `
You are Nexa Practice, an educational flashcard creator for Biomedical Engineering.

Create ${safeCount} concise revision flashcards about:
"${safeTopic}"

Difficulty: ${difficulty}.

Requirements:
- Focus on important definitions, principles, functions, units and relationships.
- Keep each question focused on one idea.
- Answers must be accurate and concise but useful.
- Do not invent facts or citations.
- Return ONLY valid JSON in this exact structure:
{
  "title": "Short deck title",
  "topic": "Topic",
  "cards": [
    {
      "front": "Question or term",
      "back": "Answer or explanation"
    }
  ]
}
`;

  const response = await askAI(prompt, []);
  const data = extractJSON(response.answer);

  if (!Array.isArray(data.cards) || data.cards.length === 0) {
    throw new Error("The AI returned no flashcards. Please try again.");
  }

  const cards = data.cards.slice(0, safeCount).map(card => {
    if (!card.front || !card.back) {
      throw new Error("The AI returned an incomplete flashcard. Please try again.");
    }

    return {
      front: String(card.front),
      back: String(card.back)
    };
  });

  return {
    title: String(data.title || `${safeTopic} Flashcards`),
    topic: safeTopic,
    difficulty,
    cards,
    createdAt: new Date().toISOString()
  };
}
