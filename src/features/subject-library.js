import { subjects } from "../data/subjects.js";

export function renderSubjectLibrary() {
  return `<div class="page-intro"><span class="eyebrow">BIOMEDICAL ENGINEERING LEARNING MAP</span><h2>Subject Library</h2><p>Explore foundational and applied topics. This learning map is general study guidance, not an official course or semester list.</p><label for="subject-search">Find a subject or topic</label><input id="subject-search" type="search" placeholder="Search topics..."></div><div id="subject-list" class="subject-grid" aria-live="polite"></div>`;
}

export function bindSubjectLibrary() {
  const search = document.querySelector("#subject-search");
  const container = document.querySelector("#subject-list");
  if (!search || !container) return;

  const render = () => {
    const term = search.value.trim().toLowerCase();
    const matches = subjects.map(subject => ({
      ...subject,
      topics: subject.topics.filter(topic => !term || topic.toLowerCase().includes(term) || subject.name.toLowerCase().includes(term))
    })).filter(subject => subject.topics.length);
    container.innerHTML = matches.length ? matches.map((subject, index) => `<details class="subject-card" ${term || index === 0 ? "open" : ""}><summary><span>${subject.icon}</span> <strong>${escapeHTML(subject.name)}</strong> <small>${subject.topics.length} topics</small></summary><p>${escapeHTML(subject.description)}</p><ul>${subject.topics.map(topic => `<li><button class="topic-link" type="button" data-topic="${escapeHTML(topic)}">${escapeHTML(topic)}</button></li>`).join("")}</ul></details>`).join("") : `<p class="empty-state">No subject or topic matches that search.</p>`;
  };
  render();
  search.addEventListener("input", render);
  container.addEventListener("click", event => {
    const button = event.target.closest("[data-topic]");
    if (button) window.dispatchEvent(new CustomEvent("bionexa:practice-topic", { detail: { topic: button.dataset.topic } }));
  });
}

function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
