import "./style.css";

import {
  renderTutor,
  sendTutorQuestion,
  clearTutorHistory
} from "./features/tutor.js";

import {
  renderCalculators,
  calculateSelected,
  bindCalculatorControls
} from "./features/calculators.js";

import { subjects } from "./data/subjects.js";

import {
  renderNotes,
  saveNote,
  deleteNote
} from "./features/notes.js";

import {
  renderPlanner,
  addTask,
  toggleTask,
  deleteTask
} from "./features/planner.js";

import {
  renderFormulaLibrary,
  bindFormulaSearch
} from "./features/formula-library.js";

import { renderQuiz, bindQuiz } from "./features/quiz.js";

import {
  renderLectureRecorder,
  bindLectureRecorder
} from "./features/lecture-recorder.js";

import {
  renderFlashcards,
  bindFlashcards
} from "./features/flashcards.js";

import {
  renderPracticeHistory,
  bindPracticeHistory
} from "./features/practice-history.js";

import { renderProgress } from "./features/progress.js";

import {
  renderPracticeRecommendations,
  bindPracticeRecommendations
} from "./features/practice-recommendations.js";

const pageNames = [
  "home",
  "tutor",
  "library",
  "tools",
  "formulas",
  "quiz",
  "flashcards",
  "history",
  "recommendations",
  "progress",
  "planner",
  "recorder",
  "notes"
];

let activePage = "home";
let pendingPracticeTopic = "";

const pageTitles = {
  home: "Dashboard",
  tutor: "AI Tutor",
  library: "Subject Library",
  tools: "Engineering Calculators",
  formulas: "Formula Library",
  quiz: "Nexa Practice",
  flashcards: "AI Flashcards",
  history: "Practice History",
  recommendations: "Study Recommendations",
  progress: "My Progress",
  planner: "Study Planner",
  recorder: "Lecture Recorder",
  notes: "My Notes"
};

function getPageElement(page) {
  return document.querySelector(`[data-page="${page}"]`);
}

function showPage(page) {
  if (!pageNames.includes(page)) return;

  activePage = page;

  document.querySelectorAll("[data-page]").forEach((element) => {
    element.hidden = element.dataset.page !== page;
  });

  document.querySelectorAll("[data-nav]").forEach((element) => {
    element.classList.toggle("active", element.dataset.nav === page);
  });

  const title = document.querySelector("#page-title");
  if (title) title.textContent = pageTitles[page] || "BioNexa";

  renderActivePage();
}

function renderHome() {
  const container = getPageElement("home");
  if (!container) return;

  container.innerHTML = `
    <section class="hero-card">
      <p class="eyebrow">BIOMEDICAL ENGINEERING COMPANION</p>
      <h1>Welcome to BioNexa</h1>
      <p>Your learning space for Biomedical Engineering.</p>
    </section>

    <section class="feature-grid">
      <button class="feature-card" data-open-page="tutor">
        <span>🤖</span>
        <h3>AI Tutor</h3>
        <p>Understand difficult concepts.</p>
      </button>

      <button class="feature-card" data-open-page="quiz">
        <span>🧠</span>
        <h3>Nexa Practice</h3>
        <p>Generate fresh AI-powered questions.</p>
      </button>

      <button class="feature-card" data-open-page="flashcards">
        <span>📚</span>
        <h3>AI Flashcards</h3>
        <p>Create cards for active revision.</p>
      </button>

      <button class="feature-card" data-open-page="recommendations">
        <span>🎯</span>
        <h3>Study Recommendations</h3>
        <p>Find topics that need more attention.</p>
      </button>

      <button class="feature-card" data-open-page="library">
        <span>📖</span>
        <h3>Subject Library</h3>
        <p>Explore your course subjects.</p>
      </button>

      <button class="feature-card" data-open-page="tools">
        <span>🧮</span>
        <h3>Calculators</h3>
        <p>Work through engineering calculations.</p>
      </button>

      <button class="feature-card" data-open-page="formulas">
        <span>∑</span>
        <h3>Formula Library</h3>
        <p>Find useful formulas.</p>
      </button>

      <button class="feature-card" data-open-page="planner">
        <span>🗓️</span>
        <h3>Study Planner</h3>
        <p>Organise your study tasks.</p>
      </button>

      <button class="feature-card" data-open-page="progress">
        <span>📈</span>
        <h3>My Progress</h3>
        <p>Review your learning activity.</p>
      </button>
    </section>
  `;
}

function renderLibrary() {
  const container = getPageElement("library");
  if (!container) return;

  container.innerHTML = `
    <section class="content-panel">
      <h2>Biomedical Engineering Subjects</h2>
      <p>Choose a subject to explore its topics or use them in Nexa Practice.</p>
      <div class="subject-grid">
        ${subjects.map((subject, index) => `
          <article class="subject-card">
            <h3>${escapeHTML(subject.name)}</h3>
            <ul>
              ${(subject.topics || []).map((topic) =>
                `<li>${escapeHTML(topic)}</li>`
              ).join("")}
            </ul>
            <button class="primary-button"
              data-practice-subject="${index}">
              Practise this subject
            </button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
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

function renderActivePage() {
  switch (activePage) {
    case "home":
      renderHome();
      break;

    case "library":
      renderLibrary();
      break;

    case "tutor":
      renderTutor();
      break;

    case "tools":
      renderCalculators();
      bindCalculatorControls();
      break;

    case "formulas":
      renderFormulaLibrary();
      bindFormulaSearch();
      break;

    case "quiz":
      renderQuiz();
      bindQuiz();

      if (pendingPracticeTopic) {
        const topicInput = document.querySelector("#quiz-topic");
        if (topicInput) topicInput.value = pendingPracticeTopic;
        pendingPracticeTopic = "";
      }
      break;

    case "flashcards":
      renderFlashcards();
      bindFlashcards();
      break;

    case "history":
      renderPracticeHistory();
      bindPracticeHistory();
      break;

    case "recommendations":
      renderPracticeRecommendations();
      bindPracticeRecommendations();
      break;

    case "progress":
      renderProgress();
      break;

    case "planner":
      renderPlanner();
      break;

    case "recorder":
      renderLectureRecorder();
      bindLectureRecorder();
      break;

    case "notes":
      renderNotes();
      break;
  }
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    showPage(nav.dataset.nav);
    return;
  }

  const openButton = event.target.closest("[data-open-page]");
  if (openButton) {
    showPage(openButton.dataset.openPage);
    return;
  }

  const subjectButton = event.target.closest("[data-practice-subject]");
  if (subjectButton) {
    const subject = subjects[Number(subjectButton.dataset.practiceSubject)];
    if (subject) {
      pendingPracticeTopic = subject.name;
      showPage("quiz");
    }
  }
});

window.addEventListener("bionexa:practice-topic", (event) => {
  const topic = String(event.detail?.topic || "").trim();
  if (!topic) return;

  pendingPracticeTopic = topic;
  showPage("quiz");
});

document.addEventListener("click", (event) => {
  if (event.target.closest("#send-question")) {
    sendTutorQuestion();
  }

  if (event.target.closest("#clear-chat")) {
    clearTutorHistory();
  }

  if (event.target.closest("#calculate-button")) {
    calculateSelected();
  }

  if (event.target.closest("#save-note")) {
    saveNote();
  }

  if (event.target.closest("[data-delete-note]")) {
    deleteNote(event.target.closest("[data-delete-note]").dataset.deleteNote);
  }

  if (event.target.closest("#add-task")) {
    addTask();
  }

  if (event.target.closest("[data-toggle-task]")) {
    toggleTask(event.target.closest("[data-toggle-task]").dataset.toggleTask);
  }

  if (event.target.closest("[data-delete-task]")) {
    deleteTask(event.target.closest("[data-delete-task]").dataset.deleteTask);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches("#tutor-input")) {
    if (!event.shiftKey) {
      event.preventDefault();
      sendTutorQuestion();
    }
  }
});

const themeButton = document.querySelector("#theme-toggle");

if (themeButton) {
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const lightMode = document.body.classList.contains("light-theme");
    localStorage.setItem("bionexa_theme", lightMode ? "light" : "dark");
  });
}

const savedTheme = localStorage.getItem("bionexa_theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
}

showPage("home");
