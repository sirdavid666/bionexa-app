
import { Storage } from "../services/storage.js";

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
          <strong>${progress.completedQuizzes}</strong>
          <span>Quizzes completed</span>
        </div>
        <div class="progress-item">
          <strong>${progress.completedTasks}</strong>
          <span>Tasks completed</span>
        </div>
      </div>
    </section>
  `;
}
