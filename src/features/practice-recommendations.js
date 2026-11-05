
import { getWeakTopics, getTopicPerformance } from "./practice-history.js";

export function getPracticeRecommendations() {
  const weakTopics = getWeakTopics(5);
  const performance = getTopicPerformance();

  if (!performance.length) {
    return [{
      title: "Start your first practice session",
      reason: "Complete an AI-generated quiz to begin building your learning record.",
      topic: ""
    }];
  }

  if (weakTopics.length) {
    return weakTopics.map(item => ({
      title: `Revise ${item.topic}`,
      reason: `Your average score is ${item.averagePercentage}%. Try another practice session.`,
      topic: item.topic
    }));
  }

  return [{
    title: "Challenge yourself",
    reason: "Your recorded topic averages are looking encouraging. Try a more advanced quiz.",
    topic: performance[0].topic
  }];
}

export function renderPracticeRecommendations() {
  const recommendations = getPracticeRecommendations();

  return `
    <section class="progress-panel">
      <span class="eyebrow">YOUR NEXT STEPS</span>
      <h3>Revision recommendations</h3>
      <div id="recommendation-list"></div>
    </section>
  `;
}

export function bindPracticeRecommendations() {
  const container = document.querySelector("#recommendation-list");
  if (!container) return;

  container.replaceChildren();

  getPracticeRecommendations().forEach(item => {
    const card = document.createElement("article");
    card.className = "recommendation-card";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const reason = document.createElement("p");
    reason.textContent = item.reason;

    card.append(title, reason);

    if (item.topic) {
      const button = document.createElement("button");
      button.className = "secondary-button";
      button.textContent = "Practise this topic";

      button.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("bionexa:practice-topic", {
          detail: { topic: item.topic }
        }));
      });

      card.appendChild(button);
    }

    container.appendChild(card);
  });
}
