
export const quizQuestions = [
  {
    question: "What is the SI unit of electrical resistance?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    answer: 2,
    explanation: "Electrical resistance is measured in ohms (Ω)."
  },
  {
    question: "Which law relates force, mass and acceleration?",
    options: [
      "Ohm's law",
      "Newton's second law",
      "Faraday's law",
      "Hooke's law"
    ],
    answer: 1,
    explanation: "Newton's second law is expressed as F = ma."
  },
  {
    question: "Which instrument is commonly used to measure blood pressure?",
    options: [
      "Thermometer",
      "Sphygmomanometer",
      "Electrocardiograph",
      "Spirometer"
    ],
    answer: 1,
    explanation: "A sphygmomanometer measures arterial blood pressure."
  },
  {
    question: "What does ECG stand for?",
    options: [
      "Electronic Cardiac Gauge",
      "Electrocardiogram",
      "Electrical Current Graph",
      "External Cardiac Generator"
    ],
    answer: 1,
    explanation: "ECG stands for electrocardiogram."
  },
  {
    question: "Which material property describes resistance to deformation?",
    options: [
      "Stiffness",
      "Colour",
      "Density",
      "Transparency"
    ],
    answer: 0,
    explanation: "Stiffness describes resistance to elastic deformation."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

export function renderQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;

  return `
    <div class="section-intro">
      <h1>Knowledge Check</h1>
      <p>Test your understanding of engineering and biomedical concepts.</p>
    </div>

    <div class="calculator-panel" id="quiz-container">
      ${questionHTML()}
    </div>
  `;
}

function questionHTML() {
  const question = quizQuestions[currentQuestion];

  return `
    <span class="section-tag">
      QUESTION ${currentQuestion + 1} OF ${quizQuestions.length}
    </span>

    <h2>${question.question}</h2>

    <div class="quiz-options">
      ${question.options.map((option, index) => `
        <button class="quiz-option" data-answer="${index}">
          ${option}
        </button>
      `).join("")}
    </div>

    <div id="quiz-feedback"></div>

    <button class="primary-button" id="next-question" disabled>
      ${currentQuestion === quizQuestions.length - 1 ? "Finish quiz" : "Next question"}
    </button>
  `;
}

export function bindQuiz() {
  const container = document.querySelector("#quiz-container");
  if (!container) return;

  container.addEventListener("click", event => {
    const option = event.target.closest("[data-answer]");
    const next = event.target.closest("#next-question");

    if (option && !answered) {
      answered = true;

      const selected = Number(option.dataset.answer);
      const question = quizQuestions[currentQuestion];
      const correct = selected === question.answer;

      if (correct) score++;

      container.querySelectorAll(".quiz-option").forEach(button => {
        button.disabled = true;

        if (Number(button.dataset.answer) === question.answer) {
          button.classList.add("correct-answer");
        } else if (Number(button.dataset.answer) === selected) {
          button.classList.add("wrong-answer");
        }
      });

      container.querySelector("#quiz-feedback").textContent =
        `${correct ? "Correct!" : "Not quite."} ${question.explanation}`;

      container.querySelector("#next-question").disabled = false;
    }

    if (next && answered) {
      currentQuestion++;

      if (currentQuestion >= quizQuestions.length) {
        container.innerHTML = `
          <h2>Quiz completed!</h2>
          <p>You scored ${score} out of ${quizQuestions.length}.</p>
          <button class="primary-button" id="restart-quiz">
            Try again
          </button>
        `;

        container.querySelector("#restart-quiz").addEventListener("click", () => {
          currentQuestion = 0;
          score = 0;
          answered = false;
          container.innerHTML = questionHTML();
        });

        return;
      }

      answered = false;
      container.innerHTML = questionHTML();
    }
  });
}
