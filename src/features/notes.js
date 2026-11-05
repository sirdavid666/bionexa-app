
import Storage from "../services/storage.js";

export function renderNotes() {
  const notes = Storage.get("notes", []);

  return `
    <div class="section-intro">
      <h1>Your personal knowledge centre</h1>
      <p>Write down ideas, lecture notes and important concepts.</p>
    </div>

    <div class="note-editor">
      <input id="note-title" placeholder="Give your note a title">
      <textarea id="note-content"
        placeholder="Start writing your note..."></textarea>
      <button class="primary-button" id="save-note">Save note</button>
    </div>

    <div class="section-heading">
      <h2>Saved notes (${notes.length})</h2>
    </div>

    <div class="feature-grid">
      ${notes.map((note, index) => `
        <article class="feature-card">
          <strong>${escapeHTML(note.title)}</strong>
          <p>${escapeHTML(note.content).replace(/\n/g, "<br>")}</p>
          <small>${new Date(note.createdAt).toLocaleString()}</small>
          <button class="clear-chat" data-delete-note="${index}">
            Delete note
          </button>
        </article>
      `).join("")}
    </div>
  `;
}

export function saveNote() {
  const title = document.querySelector("#note-title")?.value.trim();
  const content = document.querySelector("#note-content")?.value.trim();

  if (!title || !content) {
    alert("Please enter both a title and note.");
    return;
  }

  const notes = Storage.get("notes", []);

  notes.unshift({
    title,
    content,
    createdAt: new Date().toISOString()
  });

  Storage.set("notes", notes);
}

export function deleteNote(index) {
  const notes = Storage.get("notes", []);

  if (!Number.isInteger(index) || index < 0 || index >= notes.length) {
    return;
  }

  notes.splice(index, 1);
  Storage.set("notes", notes);
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
