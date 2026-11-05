
import { Storage } from "../services/storage.js";
import {
  getPracticeHistory,
  getWeakTopics
} from "./practice-history.js";

const DEFAULT_PROGRESS = {
  studySessions: 0,
  completedQuizzes: 0,
  completedTasks: 0
};

export function getProgress() {
  return {
    ...DEFAULT_PROGRESS,
    ...(Storage.get("academic_progress", {}) || {})
  };
}

export function recordProgress(type) {
  const progress = getProgress();

  if (!Object.prototype.hasOwnProperty.call(progress, type)) {
    return progress;
  }

  progress[type] += 1;
  Storage.set("academic_progress", progress);

  return progress;
}

export function renderProgress() {
  const progress = getProgress();
  const history = getPracticeHistory();
  const weakTopics = getWeakTopics();

  const average = history.length
    ? Math.round(
        history.reduce((sum, item) => sum + item.percentage, 0) / history.length
      )
    : 0;

  return `
    <section class="progress-panel">
      <span class="eyebrow">YOUR ACTIVITY</span>
      <h3>Learning progress</h3>

      <div class="progress-grid">
        <div class="progress-item">
          <strong>${progress.studySessions}</strong>
          <span>Study sessions</span>
        </div>

        <div class="progress-item">
          <strong>${history.length}</strong>
          <span>Quiz attempts</span>
        </div>

        <div class="progress-item">
          <strong>${average}%</strong>
          <span>Average quiz score</span>
        </div>
      </div>

      <div class="progress-section">
        <h4>Topics that may need more practice</h4>
        ${
          weakTopics.length
            ? weakTopics.map(item => `
                <div class="weak-topic-row">
                  <span>${escapeHTML(item.topic)}</span>
                  <strong>${item.averagePercentage}%</strong>
                </div>
              `).join("")
            : "<p>Complete some quizzes to see your learning recommendations here.</p>"
        }
      </div>
    </section>
  `;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}
