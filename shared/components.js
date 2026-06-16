import { VERITY_CONTENT as C } from "./content.js";

export function renderNav() {
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.innerHTML = `
    <div class="nav-inner container">
      <a href="/" class="nav-logo">
        <span class="logo-mark">V</span>
        <span class="logo-text">${C.company.shortName}</span>
      </a>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-menu" id="nav-menu">
        ${C.nav.map(item => item.children ? `
          <li class="nav-item has-dropdown">
            <button class="nav-link dropdown-toggle" aria-expanded="false">${item.label}</button>
            <ul class="dropdown">
              ${item.children.map(c => `<li><a href="${c.href}">${c.label}</a></li>`).join("")}
            </ul>
          </li>` : `
          <li class="nav-item"><a href="${item.href}" class="nav-link">${item.label}</a></li>`
        ).join("")}
        <li class="nav-item nav-cta"><a href="#contact" class="btn btn-primary btn-sm">Contact</a></li>
      </ul>
    </div>`;
  return nav;
}

export function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="logo-mark">V</span>
        <div>
          <strong>${C.company.name}</strong>
          <p>${C.company.role}</p>
        </div>
      </div>
      <div class="footer-links">
        <a href="${C.company.facebook}" target="_blank" rel="noopener">Facebook</a>
        <a href="#hardware">Hardware</a>
        <a href="#software">Software</a>
        <a href="#contact">Contact</a>
      </div>
      <p class="footer-copy">${C.footer.copyright}</p>
    </div>`;
  return footer;
}

export function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
  }
  document.querySelectorAll(".dropdown-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.parentElement.classList.toggle("open", !open);
    });
  });
  window.addEventListener("scroll", () => {
    document.querySelector(".site-nav")?.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

export function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

export function initContactForm() {
  const form = document.getElementById("contact-form");
  const toast = document.getElementById("toast");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (toast) { toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 4000); }
    form.reset();
  });
}

export function renderSections() {
  const C2 = C;
  return `
    <section id="hardware" class="section">
      <div class="container">
        <p class="section-label reveal">Hardware</p>
        <h2 class="section-title reveal">${C2.hardware.title}</h2>
        <p class="section-desc reveal">${C2.hardware.subtitle}</p>
        <div class="card-grid">
          ${C2.hardware.categories.map(cat => `
            <article class="card reveal">
              <h3>${cat.name}</h3>
              <p>${cat.description}</p>
              <ul>${cat.items.map(i => `<li>${i}</li>`).join("")}</ul>
            </article>`).join("")}
        </div>
      </div>
    </section>
    <section id="software" class="section section-alt">
      <div class="container">
        <p class="section-label reveal">Software</p>
        <h2 class="section-title reveal">${C2.software.title}</h2>
        <p class="section-desc reveal">${C2.software.subtitle}</p>
        <div class="card-grid">
          ${C2.software.categories.map(cat => `
            <article class="card reveal">
              <h3>${cat.name}</h3>
              <p>${cat.description}</p>
              ${cat.stacks ? `<p class="stack-tag">Tech: ${cat.stacks}</p>` : ""}
              <ul>${cat.items.slice(0, 8).map(i => `<li>${i}</li>`).join("")}</ul>
            </article>`).join("")}
        </div>
      </div>
    </section>
    <section id="about" class="section">
      <div class="container about-grid">
        <div class="reveal">
          <p class="section-label">About Us</p>
          <h2 class="section-title">${C2.about.title}</h2>
          <p class="about-body">${C2.about.body}</p>
          <p class="about-body muted">${C2.about.experience}</p>
        </div>
        <div class="about-visual reveal">
          <div class="stat-card"><span class="stat-num">2023</span><span class="stat-label">Tech Leadership</span></div>
          <div class="stat-card accent"><span class="stat-num">NDA</span><span class="stat-label">Trusted Clients</span></div>
          <div class="stat-card"><span class="stat-num">HW+SW</span><span class="stat-label">One-Stop Shop</span></div>
        </div>
      </div>
    </section>
    <section id="blog" class="section section-alt">
      <div class="container">
        <p class="section-label reveal">Blog</p>
        <h2 class="section-title reveal">${C2.blog.title}</h2>
        ${C2.blog.posts.map(p => `
          <article class="blog-card reveal">
            <time>${p.date}</time>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
            <span class="blog-meta">By ${p.author}</span>
          </article>`).join("")}
      </div>
    </section>
    <section id="contact" class="section">
      <div class="container contact-grid">
        <div class="reveal">
          <p class="section-label">${C2.contact.title}</p>
          <h2 class="section-title">${C2.contact.cta}</h2>
          <p class="section-desc">${C2.contact.description}</p>
          <a href="${C2.company.facebook}" class="btn btn-ghost" target="_blank" rel="noopener">Facebook</a>
        </div>
        <form id="contact-form" class="contact-form reveal" novalidate>
          <div class="form-group"><label for="name">Name *</label><input id="name" name="name" required minlength="2" autocomplete="name"></div>
          <div class="form-group"><label for="email">Email *</label><input id="email" name="email" type="email" required autocomplete="email"></div>
          <div class="form-group"><label for="message">Message *</label><textarea id="message" name="message" required minlength="10"></textarea></div>
          <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
      </div>
    </section>`;
}
