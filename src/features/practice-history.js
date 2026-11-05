
import { Storage } from "../services/storage.js";

const HISTORY_KEY = "practice_history";

export function getPracticeHistory() {
  return Storage.get(HISTORY_KEY, []) || [];
}

export function savePracticeResult(result) {
  const history = getPracticeHistory();

  const entry = {
    id: `${Date.now()}`,
    type: result.type || "practice",
    topic: String(result.topic || "General practice"),
    score: Number(result.score) || 0,
    total: Number(result.total) || 0,
    percentage: Number(result.percentage) || 0,
    completedAt: result.completedAt || new Date().toISOString()
  };

  history.unshift(entry);
  Storage.set(HISTORY_KEY, history.slice(0, 100));

  return entry;
}

export function getTopicPerformance() {
  const history = getPracticeHistory();
  const topics = {};

  history.forEach(item => {
    const name = item.topic || "General practice";

    if (!topics[name]) {
      topics[name] = {
        topic: name,
        attempts: 0,
        totalPercentage: 0,
        latestPercentage: item.percentage
      };
    }

    topics[name].attempts += 1;
    topics[name].totalPercentage += item.percentage;
  });

  return Object.values(topics)
    .map(item => ({
      ...item,
      averagePercentage: Math.round(item.totalPercentage / item.attempts)
    }))
    .sort((a, b) => a.averagePercentage - b.averagePercentage);
}

export function getWeakTopics(limit = 5) {
  return getTopicPerformance()
    .filter(item => item.averagePercentage < 70)
    .slice(0, limit);
}

export function renderPracticeHistory() {
  const history = getPracticeHistory();
  const weakTopics = getWeakTopics();

  return `
    <section class="progress-panel">
      <span class="eyebrow">NEXA PRACTICE</span>
      <h3>Practice history</h3>
      <p>${history.length} completed quiz session(s)</p>

      <h4>Topics to revisit</h4>
      <div id="weak-topic-list"></div>

      <h4>Recent attempts</h4>
      <div id="practice-history-list"></div>
    </section>
  `;
}

export function bindPracticeHistory() {
  const weakContainer = document.querySelector("#weak-topic-list");
  const historyContainer = document.querySelector("#practice-history-list");

  if (!weakContainer || !historyContainer) return;

  const weakTopics = getWeakTopics();
  const history = getPracticeHistory();

  weakContainer.replaceChildren();

  if (!weakTopics.length) {
    weakContainer.textContent = "Complete some quizzes to discover which topics need more revision.";
  } else {
    weakTopics.forEach(item => {
      const row = document.createElement("p");
      row.textContent = `${item.topic}: ${item.averagePercentage}% average`;
      weakContainer.appendChild(row);
    });
  }

  historyContainer.replaceChildren();

  if (!history.length) {
    historyContainer.textContent = "Your completed quizzes will appear here.";
    return;
  }

  history.slice(0, 10).forEach(item => {
    const row = document.createElement("p");
    const date = new Date(item.completedAt).toLocaleDateString();

    row.textContent =
      `${item.topic} — ${item.score}/${item.total} (${item.percentage}%) — ${date}`;

    historyContainer.appendChild(row);
  });
}
