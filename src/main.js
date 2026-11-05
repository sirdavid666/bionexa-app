
import "./style.css";

const app = document.querySelector("#app");

const navigation = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "tutor", label: "AI Tutor", icon: "✧" },
  { id: "library", label: "Library", icon: "▤" },
  { id: "tools", label: "Tools", icon: "⌘" },
  { id: "notes", label: "Notes", icon: "▧" }
];

const state = {
  currentPage: "home",
  darkMode: true
};

function render() {
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">B</div>
          <div>
            <h1>BioNexa</h1>
            <span>LEARN. ENGINEER. INNOVATE.</span>
          </div>
        </div>

        <div class="nav-heading">WORKSPACE</div>

        <nav class="navigation">
          ${navigation.map(item => `
            <button class="nav-item ${state.currentPage === item.id ? "active" : ""}"
              data-page="${item.id}">
              <span class="nav-icon">${item.icon}</span>
              ${item.label}
            </button>
          `).join("")}
        </nav>

        <div class="sidebar-bottom">
          <div class="profile-avatar">D</div>
          <div class="profile-info">
            <strong>David</strong>
            <span>Biomedical Engineering</span>
          </div>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div>
            <span class="eyebrow">YOUR ACADEMIC COMPANION</span>
            <h2>${pageTitle()}</h2>
          </div>
          <button class="theme-button" id="theme-toggle"
            aria-label="Toggle theme">☼</button>
        </header>

        <section class="page-content">
          ${renderPage()}
        </section>

        <footer class="footer">
          BioNexa <span>•</span> Built for Biomedical Engineering
        </footer>
      </main>
    </div>
  `;

  bindEvents();
}

function pageTitle() {
  const titles = {
    home: "Dashboard",
    tutor: "AI Academic Tutor",
    library: "Learning Library",
    tools: "Engineering Tools",
    notes: "My Notes"
  };

  return titles[state.currentPage] || "Dashboard";
}

function renderPage() {
  switch (state.currentPage) {
    case "tutor":
      return `
        <div class="welcome-card">
          <span class="section-tag">YOUR INTELLIGENT LEARNING PARTNER</span>
          <h1>What would you like to understand today?</h1>
          <p>Ask questions about Biomedical Engineering, mathematics,
          physics and engineering concepts.</p>
          <div class="coming-soon">AI CONNECTION — COMING NEXT</div>
        </div>
      `;

    case "library":
      return `
        <div class="section-intro">
          <h1>Explore your learning library</h1>
          <p>Build your knowledge, one subject at a time.</p>
        </div>
        <div class="feature-grid">
          ${featureCard("Mathematics", "Calculations and mathematical principles", "∑")}
          ${featureCard("Physics", "Understand the physical world", "ϕ")}
          ${featureCard("Anatomy", "Explore the human body", "◎")}
          ${featureCard("Physiology", "Understand body functions", "♡")}
          ${featureCard("Electronics", "Circuits and components", "ϟ")}
          ${featureCard("Biomechanics", "Engineering and human movement", "↗")}
        </div>
      `;

    case "tools":
      return `
        <div class="section-intro">
          <h1>Engineering tools</h1>
          <p>Practical tools for your calculations and studies.</p>
        </div>
        <div class="feature-grid">
          ${featureCard("Scientific Calculator", "Perform academic calculations", "±")}
          ${featureCard("Unit Converter", "Convert engineering measurements", "⇄")}
          ${featureCard("Formula Centre", "Find important equations", "ƒ")}
          ${featureCard("Electrical Tools", "Explore electrical calculations", "ϟ")}
        </div>
      `;

    case "notes":
      return `
        <div class="welcome-card">
          <span class="section-tag">PERSONAL KNOWLEDGE CENTRE</span>
          <h1>Your ideas deserve a home.</h1>
          <p>Create, organise and revisit your academic notes.</p>
          <button class="primary-button" id="new-note">New note</button>
        </div>
        <div id="notes-area"></div>
      `;

    default:
      return `
        <div class="hero-card">
          <div>
            <span class="section-tag">WELCOME TO YOUR LEARNING SPACE</span>
            <h1>Welcome, David.</h1>
            <p>Your journey in Biomedical Engineering starts here.
            Learn deeply. Think critically. Build confidently.</p>
            <button class="primary-button" data-page="tutor">
              Open AI Tutor <span>→</span>
            </button>
          </div>
          <div class="hero-symbol">B</div>
        </div>

        <div class="section-heading">
          <div>
            <h2>Your workspace</h2>
            <p>Everything you need to keep learning.</p>
          </div>
        </div>

        <div class="feature-grid">
          ${featureCard("AI Academic Tutor", "Understand difficult concepts", "✧", "tutor")}
          ${featureCard("Learning Library", "Explore engineering subjects", "▤", "library")}
          ${featureCard("Engineering Tools", "Calculate, convert and solve", "⌘", "tools")}
          ${featureCard("Personal Notes", "Keep your knowledge organised", "▧", "notes")}
        </div>

        <div class="section-heading">
          <div>
            <h2>Your academic journey</h2>
            <p>Your study progress will appear here.</p>
          </div>
        </div>

        <div class="progress-card">
          <div class="progress-icon">✦</div>
          <div>
            <strong>Your learning dashboard is ready.</strong>
            <p>Study hours, quiz results and completed topics
            will be tracked as we add those features.</p>
          </div>
        </div>
      `;
  }
}

function featureCard(title, description, icon, page = "") {
  return `
    <button class="feature-card" ${page ? `data-page="${page}"` : ""}>
      <span class="feature-icon">${icon}</span>
      <strong>${title}</strong>
      <p>${description}</p>
      <span class="card-arrow">Explore →</span>
    </button>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
      state.currentPage = button.dataset.page;
      render();
    });
  });

  document.querySelector("#theme-toggle")?.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle("light-mode", !state.darkMode);
  });

  document.querySelector("#new-note")?.addEventListener("click", () => {
    const area = document.querySelector("#notes-area");
    area.innerHTML = `
      <div class="note-editor">
        <input id="note-title" placeholder="Note title" />
        <textarea id="note-content" placeholder="Write your note..."></textarea>
        <button class="primary-button" id="save-note">Save note</button>
      </div>
    `;

    document.querySelector("#save-note").addEventListener("click", () => {
      const title = document.querySelector("#note-title").value.trim();
      const content = document.querySelector("#note-content").value.trim();

      if (!title || !content) {
        alert("Please enter a title and note.");
        return;
      }

      const notes = JSON.parse(localStorage.getItem("bionexa-notes") || "[]");
      notes.push({ title, content, createdAt: new Date().toISOString() });
      localStorage.setItem("bionexa-notes", JSON.stringify(notes));
      area.innerHTML = "<p class='success-message'>Note saved successfully.</p>";
    });
  });
}

render();
