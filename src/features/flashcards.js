
import { generateFlashcardSet } from "../services/practice-service.js";
import { Storage } from "../services/storage.js";

let activeDeck = null;
let currentIndex = 0;
let showingAnswer = false;

function getSavedDecks() {
  return Storage.get("ai_flashcard_decks", []) || [];
}

function saveDeck(deck) {
  const decks = getSavedDecks();
  decks.unshift(deck);
  Storage.set("ai_flashcard_decks", decks.slice(0, 30));
}

export function renderFlashcards() {
  activeDeck = null;
  currentIndex = 0;
  showingAnswer = false;

  const decks = getSavedDecks();

  return `
    <div class="page-intro">
      <span class="eyebrow">NEXA PRACTICE</span>
      <h2>AI flashcards</h2>
      <p>Generate revision cards from any Biomedical Engineering topic.</p>
    </div>

    <section class="flashcard-workspace">
      <div id="flashcard-setup">
        <label for="flashcard-topic">Topic</label>
        <input id="flashcard-topic" placeholder="e.g. Human heart anatomy">

        <label for="flashcard-difficulty">Difficulty</label>
        <select id="flashcard-difficulty">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label for="flashcard-count">Number of cards</label>
        <select id="flashcard-count">
          <option value="10">10 cards</option>
          <option value="15">15 cards</option>
          <option value="20">20 cards</option>
          <option value="30">30 cards</option>
        </select>

        <button class="primary-button" id="generate-flashcards">Generate flashcards</button>
      </div>

      <div id="flashcard-message" class="practice-message" aria-live="polite"></div>
      <div id="flashcard-review"></div>

      <div class="saved-decks">
        <h3>Saved decks</h3>
        <div id="saved-deck-list"></div>
      </div>
    </section>
  `;
}

function showMessage(message, isError = false) {
  const element = document.querySelector("#flashcard-message");
  if (!element) return;

  element.textContent = message;
  element.classList.toggle("error", isError);
}

function renderSavedDecks() {
  const container = document.querySelector("#saved-deck-list");
  if (!container) return;

  const decks = getSavedDecks();
  container.replaceChildren();

  if (!decks.length) {
    container.textContent = "Your generated decks will appear here.";
    return;
  }

  decks.forEach((deck, index) => {
    const button = document.createElement("button");
    button.className = "saved-deck-button";
    button.textContent = `${deck.title} — ${deck.cards.length} cards`;
    button.addEventListener("click", () => {
      activeDeck = deck;
      currentIndex = 0;
      showingAnswer = false;
      renderCard();
    });
    container.appendChild(button);
  });
}

function renderCard() {
  const container = document.querySelector("#flashcard-review");
  if (!container || !activeDeck) return;

  const card = activeDeck.cards[currentIndex];

  container.innerHTML = `
    <div class="flashcard-progress">
      <span id="flashcard-counter"></span>
      <span></span>
    </div>
    <button class="flashcard" id="flashcard">
      <span class="eyebrow" id="flashcard-label"></span>
      <strong id="flashcard-content"></strong>
      <small>Tap the card to turn it over</small>
    </button>
    <div class="flashcard-controls">
      <button class="secondary-button" id="flashcard-previous">← Previous</button>
      <button class="primary-button" id="flashcard-next">Next →</button>
    </div>
  `;

  container.querySelector("#flashcard-counter").textContent =
    `Card ${currentIndex + 1} of ${activeDeck.cards.length}`;

  container.querySelector("#flashcard-label").textContent =
    showingAnswer ? "ANSWER" : "QUESTION";

  container.querySelector("#flashcard-content").textContent =
    showingAnswer ? card.back : card.front;

  container.querySelector("#flashcard").classList.toggle("revealed", showingAnswer);

  container.querySelector("#flashcard").addEventListener("click", () => {
    showingAnswer = !showingAnswer;
    renderCard();
  });

  container.querySelector("#flashcard-next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % activeDeck.cards.length;
    showingAnswer = false;
    renderCard();
  });

  container.querySelector("#flashcard-previous").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + activeDeck.cards.length) % activeDeck.cards.length;
    showingAnswer = false;
    renderCard();
  });
}

export function bindFlashcards() {
  renderSavedDecks();

  document.querySelector("#generate-flashcards")?.addEventListener("click", async () => {
    const topic = document.querySelector("#flashcard-topic")?.value.trim();
    const difficulty = document.querySelector("#flashcard-difficulty")?.value;
    const count = document.querySelector("#flashcard-count")?.value;
    const button = document.querySelector("#generate-flashcards");

    if (!topic) {
      showMessage("Enter a topic before generating flashcards.", true);
      return;
    }

    button.disabled = true;
    button.textContent = "Creating your cards...";
    showMessage("Your AI tutor is preparing your revision cards.");

    try {
      activeDeck = await generateFlashcardSet({ topic, difficulty, count });
      activeDeck.id = `${Date.now()}`;
      saveDeck(activeDeck);

      currentIndex = 0;
      showingAnswer = false;

      renderCard();
      renderSavedDecks();
      showMessage("Your new flashcard deck has been saved on this device.");
    } catch (error) {
      showMessage(error.message || "Could not create flashcards. Please try again.", true);
    } finally {
      button.disabled = false;
      button.textContent = "Generate flashcards";
    }
  });
}
