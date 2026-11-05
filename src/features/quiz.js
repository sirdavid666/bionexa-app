
import { generatePracticeSet } from "../services/practice-service.js";
import { savePracticeResult } from "./practice-history.js";

let currentSet = null;
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;

export function renderQuiz() {
  currentSet = null;
  currentIndex = 0;
  score = 0;
  selectedAnswer = null;
  answered = false;

  return `
    <div class="page-intro">
      <span class="eyebrow">NEXA PRACTICE</span>
      <h2>AI-powered quiz</h2>
      <p>Choose any topic and let your AI tutor create a fresh practice session.</p>
    </div>

    <section class="quiz-panel">
      <div id="quiz-setup">
        <label for="quiz-topic">What topic do you want to practise?</label>
        <input id="quiz-topic" placeholder="e.g. Ohm's law, ECG signals, cell physiology">

        <label for="quiz-difficulty">Difficulty</label>
        <select id="quiz-difficulty">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label for="quiz-count">Number of questions</label>
        <select id="quiz-count">
          <option value="5">5 questions</option>
          <option value="10">10 questions</option>
          <option value="15">15 questions</option>
        </select>

        <button class="primary-button" id="generate-quiz">Generate my quiz</button>
        <p class="practice-hint">An internet connection is required to generate a new quiz.</p>
      </div>

      <div id="quiz-message" class="practice-message" aria-live="polite"></div>
      <div id="quiz-question-area"></div>
    </section>
  `;
}

function showMessage(message, isError = false) {
  const element = document.querySelector("#quiz-message");
  if (!element) return;

  element.textContent = message;
  element.classList.toggle("error", isError);
}

function renderQuestion() {
  const area = document.querySelector("#quiz-question-area");
  if (!area || !currentSet) return;

  const question = currentSet.questions[currentIndex];

  area.innerHTML = `
    <div class="quiz-progress">
      <span>Question ${currentIndex + 1} of ${currentSet.questions.length}</span>
      <span>Score: ${score}</span>
    </div>

    <h3 class="quiz-question"></h3>
    <div class="quiz-options" id="quiz-options"></div>
    <div id="quiz-feedback" class="quiz-feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="primary-button" id="quiz-check" disabled>Check answer</button>
      <button class="secondary-button" id="quiz-next" hidden>
        ${currentIndex === currentSet.questions.length - 1 ? "Finish quiz" : "Next question →"}
      </button>
    </div>
  `;

  area.querySelector(".quiz-question").textContent = question.question;

  const options = area.querySelector("#quiz-options");

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener("click", () => {
      if (answered) return;

      selectedAnswer = index;
      options.querySelectorAll("button").forEach(item => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");
      area.querySelector("#quiz-check").disabled = false;
    });

    options.appendChild(button);
  });

  area.querySelector("#quiz-check").addEventListener("click", checkAnswer);
  area.querySelector("#quiz-next").addEventListener("click", nextQuestion);
}

function checkAnswer() {
  if (selectedAnswer === null || answered || !currentSet) return;

  answered = true;

  const question = currentSet.questions[currentIndex];
  const correct = selectedAnswer === question.correctIndex;

  if (correct) score += 1;

  const options = document.querySelectorAll("#quiz-options .quiz-option");

  options.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correctIndex) {
      button.classList.add("correct");
    } else if (index === selectedAnswer) {
      button.classList.add("incorrect");
    }
  });

  const feedback = document.querySelector("#quiz-feedback");
  feedback.textContent = `${correct ? "Correct!" : "Not quite."} ${question.explanation}`;

  document.querySelector("#quiz-check").hidden = true;
  document.querySelector("#quiz-next").hidden = false;
}

function nextQuestion() {
  if (!currentSet) return;

  if (currentIndex < currentSet.questions.length - 1) {
    currentIndex += 1;
    selectedAnswer = null;
    answered = false;
    renderQuestion();
    return;
  }

  finishQuiz();
}

function finishQuiz() {
  const total = currentSet.questions.length;
  const percentage = Math.round((score / total) * 100);

  savePracticeResult({
    type: "quiz",
    topic: currentSet.topic,
    score,
    total,
    percentage,
    completedAt: new Date().toISOString()
  });

  const area = document.querySelector("#quiz-question-area");

  area.innerHTML = `
    <div class="quiz-result">
      <span class="eyebrow">PRACTICE COMPLETED</span>
      <h2>${percentage}%</h2>
      <p>You scored ${score} out of ${total}.</p>
      <p>${percentage >= 80
        ? "Good work. Keep strengthening your understanding."
        : "Use the explanations to review the areas you found difficult."}</p>
      <button class="primary-button" id="quiz-again">Create another quiz</button>
    </div>
  `;

  area.querySelector("#quiz-again").addEventListener("click", () => {
    currentSet = null;
    currentIndex = 0;
    score = 0;
    selectedAnswer = null;
    answered = false;
    area.innerHTML = "";
    document.querySelector("#quiz-topic").focus();
    showMessage("Choose a topic to begin another practice session.");
  });
}

export function bindQuiz() {
  document.querySelector("#generate-quiz")?.addEventListener("click", async () => {
    const topic = document.querySelector("#quiz-topic")?.value.trim();
    const difficulty = document.querySelector("#quiz-difficulty")?.value;
    const count = document.querySelector("#quiz-count")?.value;
    const button = document.querySelector("#generate-quiz");

    if (!topic) {
      showMessage("Enter a topic before generating your quiz.", true);
      return;
    }

    button.disabled = true;
    button.textContent = "Generating questions...";
    showMessage("Your AI tutor is preparing your questions.");

    try {
      currentSet = await generatePracticeSet({ topic, difficulty, count });
      currentIndex = 0;
      score = 0;
      selectedAnswer = null;
      answered = false;

      showMessage(`Your practice set: ${currentSet.title}`);
      renderQuestion();
    } catch (error) {
      showMessage(error.message || "Could not generate the quiz. Please try again.", true);
    } finally {
      button.disabled = false;
      button.textContent = "Generate my quiz";
    }
  });
}
