import {
  getPracticeHistory,
  getTopicPerformance,
  getWeakTopics
} from "./practice-history.js";

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

export function getPracticeRecommendations() {
  const history = getPracticeHistory();
  const weakTopics = getWeakTopics();

  if (!history.length) {
    return [{
      topic: "Biomedical Engineering fundamentals",
      reason: "Start with a general foundation quiz to establish your baseline.",
      priority: "Getting started"
    }];
  }

  if (weakTopics.length) {
    return weakTopics.slice(0, 5).map((item) => ({
      topic: item.topic,
      reason: `Your average score is ${Math.round(item.average)}%. Practise this topic again.`,
      priority: "Needs revision"
    }));
  }

  const recentTopics = [...new Set(
    history.slice(0, 5).map((item) => item.topic).filter(Boolean)
  )];

  if (recentTopics.length) {
    return recentTopics.slice(0, 5).map((topic) => ({
      topic,
      reason: "Your recent results look encouraging. Try a fresh set of questions to strengthen your understanding.",
      priority: "Keep practising"
    }));
  }

  return [{
    topic: "Biomedical Engineering fundamentals",
    reason: "Try a fresh practice set to build your learning history.",
    priority: "Suggested"
  }];
}

export function renderPracticeRecommendations() {
  const container = document.querySelector("#recommendations-content");
  if (!container) return;

  const recommendations = getPracticeRecommendations();

  container.innerHTML = `
    <section class="content-panel">
      <h2>Your next study steps</h2>
      <p>Recommendations are based on your saved Nexa Practice results.</p>

      <div class="recommendation-list">
        ${recommendations.map((item, index) => `
          <article class="recommendation-card">
            <div class="recommendation-heading">
              <span class="recommendation-number">${index + 1}</span>
              <span class="recommendation-priority">
                ${escapeHTML(item.priority)}
              </span>
            </div>

            <h3>${escapeHTML(item.topic)}</h3>
            <p>${escapeHTML(item.reason)}</p>

            <button class="primary-button"
              data-recommend-topic="${escapeHTML(item.topic)}">
              Practise this topic
            </button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function bindPracticeRecommendations() {
  const container = document.querySelector("#recommendations-content");
  if (!container || container.dataset.bound === "true") return;

  container.dataset.bound = "true";

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-recommend-topic]");
    if (!button) return;

    window.dispatchEvent(new CustomEvent("bionexa:practice-topic", {
      detail: { topic: button.dataset.recommendTopic }
    }));
  });
}
