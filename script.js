const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".main-nav a");
const form = document.querySelector("#enquiryForm");
const formNote = document.querySelector("#formNote");
const articleForm = document.querySelector("#articleForm");
const articleNote = document.querySelector("#articleNote");
const savedArticles = document.querySelector("#savedArticles");
const exportArticles = document.querySelector("#exportArticles");
const clearArticles = document.querySelector("#clearArticles");
const articlesKey = "hzg_articles";

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const contact = String(data.get("contact") || "").trim();
  const service = String(data.get("service") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !contact || !service || !message) {
    formNote.textContent = "Please complete all fields before sending the enquiry.";
    formNote.style.color = "#963e45";
    return;
  }

  const subject = encodeURIComponent(`Website enquiry - ${service}`);
  const bodyText = encodeURIComponent(
    `Name: ${name}\nContact: ${contact}\nService: ${service}\n\nMessage:\n${message}`
  );

  formNote.textContent = "Opening your email app with the enquiry details.";
  formNote.style.color = "#14845d";
  window.location.href = `mailto:hozefa@cahzgassociates.co.in?subject=${subject}&body=${bodyText}`;
});

const getArticles = () => {
  try {
    return JSON.parse(localStorage.getItem(articlesKey) || "[]");
  } catch {
    return [];
  }
};

const saveArticles = (articles) => {
  localStorage.setItem(articlesKey, JSON.stringify(articles));
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const renderArticles = () => {
  if (!savedArticles) return;

  const articles = getArticles();

  if (!articles.length) {
    savedArticles.innerHTML = `
      <div class="empty-articles">
        <h3>No saved articles yet</h3>
        <p>Use the form above to add an article. It will appear here in this browser.</p>
      </div>
    `;
    return;
  }

  savedArticles.innerHTML = articles
    .map(
      (article, index) => `
        <article class="saved-article-card">
          <span>${escapeHtml(article.category)}</span>
          <h3>${escapeHtml(article.title)}</h3>
          <small>${escapeHtml(article.date)}</small>
          <p>${escapeHtml(article.summary)}</p>
          <details>
            <summary>Read full article</summary>
            <p>${escapeHtml(article.content).replace(/\n/g, "<br />")}</p>
          </details>
          <button type="button" class="article-delete" data-index="${index}">Remove</button>
        </article>
      `
    )
    .join("");
};

articleForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(articleForm);
  const title = String(data.get("title") || "").trim();
  const category = String(data.get("category") || "").trim();
  const summary = String(data.get("summary") || "").trim();
  const content = String(data.get("content") || "").trim();

  if (!title || !category || !summary || !content) {
    articleNote.textContent = "Please complete all article fields.";
    articleNote.style.color = "#963e45";
    return;
  }

  const articles = getArticles();
  articles.unshift({
    title,
    category,
    summary,
    content,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  });

  saveArticles(articles);
  renderArticles();
  articleForm.reset();
  articleNote.textContent = "Article added below. It is saved in this browser.";
  articleNote.style.color = "#14845d";
});

savedArticles?.addEventListener("click", (event) => {
  const button = event.target.closest(".article-delete");
  if (!button) return;

  const index = Number(button.dataset.index);
  const articles = getArticles();
  articles.splice(index, 1);
  saveArticles(articles);
  renderArticles();
});

exportArticles?.addEventListener("click", () => {
  const articles = getArticles();
  const subject = encodeURIComponent("Saved website articles");
  const bodyText = encodeURIComponent(
    articles
      .map(
        (article) =>
          `Title: ${article.title}\nCategory: ${article.category}\nDate: ${article.date}\n\nSummary:\n${article.summary}\n\nArticle:\n${article.content}`
      )
      .join("\n\n---\n\n")
  );

  articleNote.textContent = "Opening your email app with the saved articles.";
  articleNote.style.color = "#14845d";
  window.location.href = `mailto:hozefa@cahzgassociates.co.in?subject=${subject}&body=${bodyText}`;
});

clearArticles?.addEventListener("click", () => {
  saveArticles([]);
  renderArticles();
  articleNote.textContent = "Saved articles cleared from this browser.";
  articleNote.style.color = "#14845d";
});

renderArticles();
