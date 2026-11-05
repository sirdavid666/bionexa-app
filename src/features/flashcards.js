
const cards = [
  {
    question: "What does Biomedical Engineering combine?",
    answer: "Engineering principles with biology and medicine to improve healthcare."
  },
  {
    question: "What is the SI unit of force?",
    answer: "The newton (N)."
  },
  {
    question: "What is the SI unit of electrical resistance?",
    answer: "The ohm (Ω)."
  },
  {
    question: "What does ECG stand for?",
    answer: "Electrocardiogram. It records the electrical activity of the heart."
  },
  {
    question: "What is a biomaterial?",
    answer: "A material designed to interact with a biological system for a medical purpose."
  },
  {
    question: "What is the SI unit of pressure?",
    answer: "The pascal (Pa)."
  },
  {
    question: "What does MRI stand for?",
    answer: "Magnetic Resonance Imaging."
  },
  {
    question: "What is the function of a biosensor?",
    answer: "It detects a biological or chemical substance and converts the response into a measurable signal."
  }
];

let currentIndex = 0;
let showingAnswer = false;

export function renderFlashcards() {
  currentIndex = 0;
  showingAnswer = false;

  return `
    <div class="page-intro">
      <span class="eyebrow">ACTIVE REVISION</span>
      <h2>Flashcards</h2>
      <p>Test your recall before revealing the answer.</p>
    </div>

    <section class="flashcard-workspace">
      <div class="flashcard-progress">
        <span id="flashcard-counter">Card 1 of ${cards.length}</span>
        <span>Biomedical Engineering basics</span>
      </div>

      <button class="flashcard" id="flashcard">
        <span class="eyebrow" id="flashcard-label">QUESTION</span>
        <strong id="flashcard-content">${cards[0].question}</strong>
        <small>Tap to reveal the answer</small>
      </button>

      <div class="flashcard-controls">
        <button class="secondary-button" id="flashcard-previous">← Previous</button>
        <button class="primary-button" id="flashcard-next">Next →</button>
      </div>
    </section>
  `;
}

function updateCard() {
  const card = cards[currentIndex];
  const content = document.querySelector("#flashcard-content");
  const label = document.querySelector("#flashcard-label");
  const counter = document.querySelector("#flashcard-counter");
  const flashcard = document.querySelector("#flashcard");

  if (!content || !label || !counter || !flashcard) return;

  content.textContent = showingAnswer ? card.answer : card.question;
  label.textContent = showingAnswer ? "ANSWER" : "QUESTION";
  counter.textContent = `Card ${currentIndex + 1} of ${cards.length}`;
  flashcard.classList.toggle("revealed", showingAnswer);
}

export function bindFlashcards() {
  document.querySelector("#flashcard")?.addEventListener("click", () => {
    showingAnswer = !showingAnswer;
    updateCard();
  });

  document.querySelector("#flashcard-next")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showingAnswer = false;
    updateCard();
  });

  document.querySelector("#flashcard-previous")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showingAnswer = false;
    updateCard();
  });
}
