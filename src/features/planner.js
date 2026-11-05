
import Storage from "../services/storage.js";

export function renderPlanner() {
  const tasks = Storage.get("planner_tasks", []);

  return `
    <div class="section-intro">
      <h1>Study Planner</h1>
      <p>Organise your learning and keep track of academic tasks.</p>
    </div>

    <div class="calculator-panel">
      <label for="task-title">Task description</label>
      <input id="task-title" placeholder="e.g. Revise calculus">

      <label for="task-date">Due date</label>
      <input id="task-date" type="date">

      <button class="primary-button" id="add-task">Add task</button>
    </div>

    <div class="section-heading">
      <h2>Your tasks (${tasks.length})</h2>
    </div>

    <div class="feature-grid">
      ${tasks.map((task, index) => `
        <article class="feature-card">
          <strong>${escapeHTML(task.title)}</strong>
          <p>Due: ${escapeHTML(task.date || "No date")}</p>
          <p>${task.completed ? "Completed" : "Pending"}</p>
          <button class="secondary-button" data-complete-task="${index}">
            ${task.completed ? "Mark pending" : "Complete"}
          </button>
          <button class="clear-chat" data-delete-task="${index}">
            Delete
          </button>
        </article>
      `).join("")}
    </div>
  `;
}

export function addTask() {
  const title = document.querySelector("#task-title").value.trim();
  const date = document.querySelector("#task-date").value;

  if (!title) {
    alert("Enter a task description.");
    return;
  }

  const tasks = Storage.get("planner_tasks", []);

  tasks.push({
    title,
    date,
    completed: false,
    createdAt: new Date().toISOString()
  });

  Storage.set("planner_tasks", tasks);
}

export function toggleTask(index) {
  const tasks = Storage.get("planner_tasks", []);

  if (!tasks[index]) return;

  tasks[index].completed = !tasks[index].completed;
  Storage.set("planner_tasks", tasks);
}

export function deleteTask(index) {
  const tasks = Storage.get("planner_tasks", []);

  if (!Number.isInteger(index) || index < 0 || index >= tasks.length) return;

  tasks.splice(index, 1);
  Storage.set("planner_tasks", tasks);
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
