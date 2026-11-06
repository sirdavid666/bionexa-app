import { subjects } from "./subjects.js";

export const practiceTopics = Object.fromEntries(
  subjects.map(subject => [subject.name, subject.topics])
);

export function getAllPracticeTopics() {
  return Object.entries(practiceTopics).flatMap(([category, topics]) =>
    topics.map(topic => ({ category, topic }))
  );
}

export function searchPracticeTopics(searchTerm = "") {
  const term = String(searchTerm).trim().toLowerCase();

  return getAllPracticeTopics().filter(item =>
    item.topic.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
  );
}
