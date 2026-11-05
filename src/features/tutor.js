
import { askAI } from "../services/ai-service.js";
import Storage from "../services/storage.js";

let history = Storage.get("ai_history", []);
let busy = false;

export function renderTutor() {
  return `
    <div class="welcome-card">
      <span class="section-tag">BIONEXA INTELLIGENCE</span>
      <h1>Your academic questions deserve clear answers.</h1>
      <p>Ask about Biomedical Engineering, mathematics,
      physics, electronics and more.</p>
    </div>

    <div class="section-heading">
      <h2>Ask your AI tutor</h2>
      <p>Connect to the internet to receive an answer.</p>
    </div>

    <div class="tutor-panel">
      <div class="chat-messages" id="chat-messages">
        <div class="chat-message assistant">
          <strong>BioNexa AI</strong>
          <p>Hello! What would you like to learn today?</p>
        </div>
        ${history.map(item => `
          <div class="chat-message ${item.role === "user" ? "user" : "assistant"}">
            <strong>${item.role === "user" ? "You" : "BioNexa AI"}</strong>
            <p>${escapeHTML(item.content).replace(/\n/g, "<br>")}</p>
          </div>
        `).join("")}
      </div>

      <div class="suggestion-list">
        <button data-prompt="Explain Ohm's law with a worked example.">Explain Ohm's law</button>
        <button data-prompt="Explain the relationship between engineering and human physiology.">Engineering and physiology</button>
        <button data-prompt="Teach me the fundamentals of biomedical instrumentation.">Biomedical instrumentation</button>
      </div>

      <div class="question-box">
        <textarea id="question-input"
          placeholder="Ask your Biomedical Engineering question..."></textarea>
        <button id="send-question" class="primary-button">Send ↑</button>
      </div>

      <p class="chat-status" id="chat-status">
        Online AI service. Internet connection required.
      </p>

      <button class="clear-chat" id="clear-chat">Clear conversation</button>
    </div>
  `;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export async function sendTutorQuestion() {
  if (busy) return;

  const input = document.querySelector("#question-input");
  const status = document.querySelector("#chat-status");
  const question = input?.value.trim();

  if (!question) {
    status.textContent = "Please enter a question first.";
    return;
  }

  busy = true;
  input.disabled = true;
  document.querySelector("#send-question").disabled = true;

  history.push({ role: "user", content: question });
  appendMessage("user", question);
  input.value = "";

  status.textContent = "BioNexa is preparing your answer...";

  try {
    const result = await askAI(
      question,
      history.slice(0, -1).slice(-18)
    );

    history.push({ role: "assistant", content: result.answer });
    Storage.set("ai_history", history);

    appendMessage("assistant", result.answer);
    status.textContent = `Answered by ${result.model}.`;
  } catch (error) {
    history.pop();
    status.textContent = error.message;
  } finally {
    busy = false;
    input.disabled = false;
    document.querySelector("#send-question").disabled = false;
    input.focus();
  }
}

function appendMessage(role, content) {
  const container = document.querySelector("#chat-messages");
  const message = document.createElement("div");

  message.className = `chat-message ${role}`;
  const heading = document.createElement("strong");
  heading.textContent = role === "user" ? "You" : "BioNexa AI";

  const paragraph = document.createElement("p");
  paragraph.textContent = content;

  message.append(heading, paragraph);
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

export function clearTutorHistory() {
  history = [];
  Storage.set("ai_history", []);
}
