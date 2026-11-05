import { Storage } from "../services/storage.js";

const HISTORY_KEY = "practice_history";

export function getPracticeHistory() {
  const history = Storage.get(HISTORY_KEY, []);
  return Array.isArray(history) ? history : [];
}

export function savePracticeResult(result) {
  const history = getPracticeHistory();

  const entry = {
    id: Date.now(),
    topic: String(result.topic || "General practice"),
    score: Number(result.score) || 0,
    total: Number(result.total) || 0,
    percentage: Number(result.percentage) || 0,
    difficulty: result.difficulty || "beginner",
    date: new Date().toISOString()
  };

  if (!entry.percentage && entry.total > 0) {
    entry.percentage = Math.round((entry.score / entry.total) * 100);
  }

  history.unshift(entry);
  Storage.set(HISTORY_KEY, history.slice(0, 100));

  return entry;
}

export function getTopicPerformance() {
  const history = getPracticeHistory();
  const topics = {};

  history.forEach((item) => {
    const topic = item.topic || "General practice";

    if (!topics[topic]) {
      topics[topic] = {
        topic,
        attempts: 0,
        totalPercentage: 0,
        average: 0,
        latestScore: 0
      };
    }

    const percentage = Number(
      item.percentage ??
      (item.total ? (item.score / item.total) * 100 : 0)
    );

    topics[topic].attempts += 1;
    topics[topic].totalPercentage += percentage;

    if (topics[topic].attempts === 1) {
      topics[topic].latestScore = percentage;
    }
  });

  return Object.values(topics).map((item) => ({
    ...item,
    average: item.attempts
      ? item.totalPercentage / item.attempts
      : 0
  })).sort((a, b) => a.average - b.average);
}

export function getWeakTopics() {
  return getTopicPerformance()
    .filter((item) => item.average < 70)
    .sort((a, b) => a.average - b.average);
}

export function renderPracticeHistory() {
  const history = getPracticeHistory();
  const weakTopics = getWeakTopics();

  const weakContainer = document.querySelector("#weak-topic-list");
  const historyContainer = document.querySelector("#practice-history-list");

  if (weakContainer) {
    weakContainer.innerHTML = weakTopics.length
      ? weakTopics.map((item) => `
          <article class="history-topic-row">
            <div>
              <strong>${escapeHTML(item.topic)}</strong>
              <small>${item.attempts} attempt(s)</small>
            </div>
            <span class="score-low">${Math.round(item.average)}%</span>
          </article>
        `).join("")
      : `<p class="empty-state">No weak topics identified yet. Complete a few quizzes to see your revision priorities.</p>`;
  }

  if (historyContainer) {
    historyContainer.innerHTML = history.length
      ? history.map((item) => {
          const percentage = Number(
            item.percentage ??
            (item.total ? (item.score / item.total) * 100 : 0)
          );

          return `
            <article class="history-entry">
              <div>
                <strong>${escapeHTML(item.topic || "General practice")}</strong>
                <small>
                  ${escapeHTML(item.difficulty || "beginner")}
                  · ${formatDate(item.date)}
                </small>
              </div>
              <span class="${percentage < 70 ? "score-low" : "score-good"}">
                ${Math.round(percentage)}%
              </span>
            </article>
          `;
        }).join("")
      : `<p class="empty-state">Your completed AI practice sessions will appear here.</p>`;
  }
}

export function bindPracticeHistory() {
  // History is displayed from saved results. No additional controls are required.
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString();
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}
