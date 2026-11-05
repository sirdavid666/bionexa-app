
import "./style.css";

const pageContainers = {
  home: '[data-page="home"]',
  tutor: "#tutor-content",
  library: '[data-page="library"]',
  tools: "#calculator-content",
  formulas: "#formula-content",
  quiz: "#quiz-content",
  flashcards: "#flashcards-content",
  history: '[data-page="history"]',
  recommendations: "#recommendations-content",
  progress: "#progress-content",
  planner: "#planner-content",
  recorder: "#recorder-content",
  notes: "#notes-content"
};

let currentPage = "home";
const loadedPages = new Set();

function mountHTML(selector, result) {
  const target = document.querySelector(selector);

  if (target && typeof result === "string") {
    target.innerHTML = result;
  }
}

function showPage(page) {
  const target = document.querySelector(`[data-page="${page}"]`);

  if (!target) {
    console.error("BioNexa page not found:", page);
    return;
  }

  document.querySelectorAll("[data-page]").forEach(section => {
    section.hidden = true;
  });

  target.hidden = false;
  currentPage = page;

  document.querySelectorAll("[data-nav]").forEach(button => {
    button.classList.toggle("active", button.dataset.nav === page);
  });

  renderPage(page);
}

function showPageError(page, error) {
  console.error(`BioNexa ${page} error:`, error);

  const selector = pageContainers[page];
  const target = selector ? document.querySelector(selector) : null;

  if (target) {
    target.innerHTML = `
      <div class="error-message">
        <h3>Unable to open this section</h3>
        <p>Please check this feature's file and try again.</p>
      </div>
    `;
  }
}

async function renderPage(page) {
  try {
    switch (page) {
      case "home": {
        const home = document.querySelector('[data-page="home"]');

        if (home && !loadedPages.has(page)) {
          home.innerHTML = `
            <div class="dashboard-welcome">
              <h2>Welcome to BioNexa</h2>
              <p>Your Biomedical Engineering study companion.</p>
              <p>Choose a section from the navigation to get started.</p>
            </div>
          `;
          loadedPages.add(page);
        }
        break;
      }

      case "tutor": {
        const module = await import("./features/tutor.js");
        const result = module.renderTutor?.();
        mountHTML("#tutor-content", result);
        module.bindTutor?.();
        break;
      }

      case "library": {
        const target = document.querySelector('[data-page="library"]');

        if (target && !loadedPages.has(page)) {
          target.innerHTML = `
            <div class="section-heading">
              <h2>Subject Library</h2>
              <p>Explore your Biomedical Engineering study materials.</p>
            </div>
          `;
          loadedPages.add(page);
        }
        break;
      }

      case "tools": {
        const module = await import("./features/calculators.js");
        mountHTML("#calculator-content", module.renderCalculators?.());
        module.bindCalculatorControls?.();
        break;
      }

      case "formulas": {
        const module = await import("./features/formula-library.js");
        mountHTML("#formula-content", module.renderFormulaLibrary?.());
        module.bindFormulaSearch?.();
        break;
      }

      case "quiz": {
        const module = await import("./features/quiz.js");
        mountHTML("#quiz-content", module.renderQuiz?.());
        module.bindQuiz?.();
        break;
      }

      case "flashcards": {
        const module = await import("./features/flashcards.js");
        mountHTML("#flashcards-content", module.renderFlashcards?.());
        module.bindFlashcards?.();
        break;
      }

      case "history": {
        const module = await import("./features/practice-history.js");
        module.renderPracticeHistory?.();
        module.bindPracticeHistory?.();
        break;
      }

      case "recommendations": {
        const module = await import("./features/practice-recommendations.js");
        module.renderPracticeRecommendations?.();
        module.bindPracticeRecommendations?.();
        break;
      }

      case "progress": {
        const module = await import("./features/progress.js");
        mountHTML("#progress-content", module.renderProgress?.());
        break;
      }

      case "planner": {
        const module = await import("./features/planner.js");
        mountHTML("#planner-content", module.renderPlanner?.());
        break;
      }

      case "recorder": {
        const module = await import("./features/lecture-recorder.js");
        mountHTML("#recorder-content", module.renderLectureRecorder?.());
        module.bindLectureRecorder?.();
        break;
      }

      case "notes": {
        const module = await import("./features/notes.js");
        mountHTML("#notes-content", module.renderNotes?.());
        break;
      }

      default:
        console.warn("Unknown BioNexa page:", page);
    }
  } catch (error) {
    showPageError(page, error);
  }
}

async function handleClick(event) {
  const navButton = event.target.closest("[data-nav]");

  if (navButton) {
    showPage(navButton.dataset.nav);
    return;
  }

  const themeButton = event.target.closest(
    "#theme-toggle, [data-theme-toggle]"
  );

  if (themeButton) {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("light-theme");
    return;
  }

  if (event.target.closest("#calculate-button")) {
    const module = await import("./features/calculators.js");
    module.calculateSelected?.();
    return;
  }

  if (event.target.closest("#save-note")) {
    const module = await import("./features/notes.js");
    module.saveNote?.();
    showPage("notes");
    return;
  }

  const deleteNoteButton = event.target.closest("[data-delete-note]");

  if (deleteNoteButton) {
    const module = await import("./features/notes.js");
    module.deleteNote?.(Number(deleteNoteButton.dataset.deleteNote));
    showPage("notes");
    return;
  }

  if (event.target.closest("#add-task")) {
    const module = await import("./features/planner.js");
    module.addTask?.();
    showPage("planner");
    return;
  }

  const completeTaskButton = event.target.closest("[data-complete-task]");

  if (completeTaskButton) {
    const module = await import("./features/planner.js");
    module.toggleTask?.(Number(completeTaskButton.dataset.completeTask));
    showPage("planner");
    return;
  }

  const deleteTaskButton = event.target.closest("[data-delete-task]");

  if (deleteTaskButton) {
    const module = await import("./features/planner.js");
    module.deleteTask?.(Number(deleteTaskButton.dataset.deleteTask));
    showPage("planner");
    return;
  }

  if (
    event.target.closest("#clear-tutor-history") ||
    event.target.closest("#clear-chat")
  ) {
    const module = await import("./features/tutor.js");
    module.clearTutorHistory?.();
    return;
  }

  if (
    event.target.closest("#send-tutor-question") ||
    event.target.closest("#send-question")
  ) {
    const module = await import("./features/tutor.js");
    module.sendTutorQuestion?.();
  }
}

document.addEventListener("click", event => {
  handleClick(event).catch(error => {
    console.error("BioNexa action error:", error);
  });
});

document.addEventListener("keydown", event => {
  if (
    event.key === "Enter" &&
    !event.shiftKey &&
    (event.target.id === "tutor-input" ||
      event.target.id === "question-input")
  ) {
    event.preventDefault();

    import("./features/tutor.js")
      .then(module => module.sendTutorQuestion?.())
      .catch(error => console.error("Tutor error:", error));
  }
});

document.addEventListener("bionexa:practice-topic", event => {
  showPage("quiz");

  setTimeout(() => {
    const topicInput = document.querySelector("#quiz-topic");

    if (topicInput && event.detail?.topic) {
      topicInput.value = event.detail.topic;
    }
  }, 100);
});

window.addEventListener("error", event => {
  console.error("BioNexa application error:", event.error);
});

window.addEventListener("unhandledrejection", event => {
  console.error("BioNexa loading error:", event.reason);
});

showPage("home");
