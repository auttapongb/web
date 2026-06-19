import { VERITY_CONTENT as C } from "../../shared/content.js";
import { MEDIA as M } from "../../shared/media.js";
import { loadThree, loadOrbitControls, BRAND_3D, PARTICLE_PALETTE } from "../../shared/three-core.js";
import { initShaderMesh } from "../../shared/shader-mesh.js";
import { icon } from "../../shared/icons.js";
import { animate, stagger } from "https://cdn.jsdelivr.net/npm/animejs/+esm";

const SERVICE_ICONS = { chart: "chart", code: "code", home: "home", display: "display" };
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let heroScroll = 0;

function mediaPath(key) {
  const parts = key.split(".");
  let obj = M;
  for (const p of parts) obj = obj?.[p];
  return typeof obj === "string" ? obj : "";
}

/** Pause rAF loops when hero leaves viewport (ui-skills: fixing-motion-performance) */
function observeHeroVisibility(onVisible) {
  const hero = document.getElementById("hero");
  if (!hero) return () => true;
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; onVisible?.(visible); }, { threshold: 0.05 });
  io.observe(hero);
  return () => visible;
}

/* ── Nav ── */
function renderNav() {
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.innerHTML = `
    <div class="nav-inner container">
      <a href="../../" class="nav-logo">
        <img src="${M.logo}" alt="Verity Tech home" width="120" height="40" class="nav-logo-full">
        <span class="logo-text"><span>VERITY</span> TECH</span>
      </a>
      <button class="nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-menu">
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
      </button>
      <ul class="nav-menu" id="nav-menu">
        ${C.nav.map((item, i) => item.children ? `
          <li class="nav-item has-dropdown">
            <button class="nav-link dropdown-toggle" aria-expanded="false" aria-controls="nav-dropdown-${i}">${item.label}</button>
            <ul class="dropdown" id="nav-dropdown-${i}">${item.children.map(c => `<li><a href="${c.href}">${c.label}</a></li>`).join("")}</ul>
          </li>` : `
          <li class="nav-item"><a href="${item.href}" class="nav-link">${item.label}</a></li>`
        ).join("")}
        <li class="nav-item nav-cta"><a href="#contact" class="btn btn-primary btn-sm">Contact Sales</a></li>
      </ul>
    </div>`;
  return nav;
}

function renderFooter() {
  const f = document.createElement("footer");
  f.className = "site-footer";
  f.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="${M.logo}" alt="Verity Tech logo" width="120" height="40">
        <div>
          <strong>${C.company.name}</strong>
          <p>${C.company.role}</p>
          <p class="footer-tagline">${C.company.taglineBrand}</p>
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
  return f;
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  const closeMenu = () => {
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation menu");
    menu?.classList.remove("open");
    document.querySelectorAll(".has-dropdown.open").forEach(el => el.classList.remove("open"));
    document.querySelectorAll(".dropdown-toggle").forEach(b => b.setAttribute("aria-expanded", "false"));
  };
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open navigation menu" : "Close navigation menu");
    menu?.classList.toggle("open", !open);
  });
  document.querySelectorAll(".dropdown-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.parentElement?.classList.toggle("open", !open);
    });
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });
  window.addEventListener("scroll", () => {
    document.querySelector(".site-nav")?.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Lenis-aware anchor scrolling (native jumps bypass Lenis + skip reveals)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenisInstance) lenisInstance.scrollTo(target, { offset: -72 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  });
}

/* ── Content render ── */
function resolveMedia(key) {
  if (!key) return "";
  if (key.startsWith("../../") || key.startsWith("http")) return key;
  return mediaPath(key);
}

function renderContent() {
  const gw = C.gateway;

  document.getElementById("trust-bar").innerHTML = gw.trust.map(t => `
    <div class="trust-badge">
      <span class="trust-value">${t.value}</span>
      <span class="trust-label">${t.label}</span>
    </div>`).join("");

  document.getElementById("path-title").textContent = gw.pathTitle;
  document.getElementById("path-sub").textContent = gw.pathSubtitle;
  document.getElementById("path-grid").innerHTML = gw.roles.map((r, i) => `
    <a href="${r.href}" class="path-card reveal" role="listitem" data-path="${r.id}" style="--reveal-i:${i}">
      <span class="path-icon icon-motion">${icon(SERVICE_ICONS[r.icon] || "chart")}</span>
      <h3>${r.label}</h3>
      <p>${r.summary}</p>
      <span class="path-arrow" aria-hidden="true">→</span>
    </a>`).join("");

  document.getElementById("industries-title").textContent = gw.industriesTitle;
  document.getElementById("industries-sub").textContent = gw.industriesSubtitle;
  document.getElementById("industry-tabs").innerHTML = gw.industries.map((ind, i) => `
    <button type="button" class="tab-btn ${i === 0 ? "active" : ""}" role="tab"
      id="tab-${ind.id}" aria-selected="${i === 0}" aria-controls="panel-${ind.id}"
      data-industry="${ind.id}">${ind.label}</button>`).join("");

  renderIndustryPanel(gw.industries[0]);

  const logos = [...C.about.partners.carousel, ...C.about.partners.carousel];
  document.getElementById("logo-carousel").innerHTML = logos.map(name => `
    <span class="logo-chip">${name}</span>`).join("");

  document.getElementById("service-grid").innerHTML = C.services.map(s => `
    <a href="${s.href}" class="service-card reveal">
      <div class="service-num">${s.num}</div>
      <div class="service-icon icon-motion">${icon(SERVICE_ICONS[s.icon])}</div>
      <h3>${s.name}</h3>
      <p>${s.summary}</p>
    </a>`).join("");

  document.getElementById("hw-title").textContent = C.hardware.title;
  document.getElementById("hw-sub").textContent = C.hardware.subtitle;
  document.getElementById("hw-grid").innerHTML = C.hardware.categories.map(cat => `
    <article class="card card--media reveal">
      ${cat.image ? `<img class="card-img" src="${mediaPath(`hardware.${cat.image}`)}" alt="${cat.name}" loading="lazy">` : ""}
      <div class="card-body">
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
        ${cat.subcategories ? `<div class="subcat-row">${cat.subcategories.map(sc => `
          <figure class="subcat">
            <img src="${mediaPath(`hardware.${sc.image}`)}" alt="${sc.name}" loading="lazy">
            <figcaption>${sc.name}</figcaption>
          </figure>`).join("")}</div>` : ""}
        <ul>${cat.items.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>
    </article>`).join("");

  const hwProducts = C.hardware.categories.flatMap(c => c.products || []);
  document.getElementById("hw-products").innerHTML = hwProducts.length ? `
    <h3 class="product-strip-title">Featured Products</h3>
    <div class="product-strip-grid">${hwProducts.map(p => `
      <article class="product-card">
        <img src="${mediaPath(`hardware.${p.image}`)}" alt="${p.name}" loading="lazy">
        <div class="product-card-body">
          <h4>${p.name}</h4>
          <p>${p.description}</p>
        </div>
      </article>`).join("")}</div>` : "";

  const tc = C.hardware.takeCare;
  document.getElementById("take-care").innerHTML = `
    <div class="take-care-inner">
      <img src="${mediaPath(`hardware.${tc.image}`)}" alt="${tc.title}" loading="lazy">
      <div>
        <h3>${tc.title}</h3>
        <p>${tc.description}</p>
      </div>
    </div>`;

  const vx = C.hardware.visix;
  document.getElementById("visix-title").textContent = vx.title;
  document.getElementById("visix-intro").textContent = vx.intro;
  document.getElementById("visix-gallery").innerHTML = M.hardware.visix.map((src, i) => `
    <button type="button" class="visix-thumb ${i === 0 ? "active" : ""}" data-index="${i}" aria-label="Visix screenshot ${i + 1}">
      <img src="${src}" alt="Visix product screenshot ${i + 1}" loading="lazy">
    </button>`).join("") + `
    <figure class="visix-main">
      <img id="visix-main-img" src="${M.hardware.visix[0]}" alt="Visix product showcase" loading="lazy">
    </figure>`;
  document.getElementById("visix-products").innerHTML = vx.products.map(p => `
    <article class="visix-product-card">
      <h4>${p.name}</h4>
      <p>${p.description}</p>
    </article>`).join("");

  document.getElementById("sw-title").textContent = C.software.title;
  document.getElementById("sw-sub").textContent = C.software.subtitle;
  document.getElementById("sw-visual").innerHTML = `
    <img src="${M.software.phone1}" alt="Verity Tech mobile app mockup" loading="lazy" class="sw-mockup sw-mockup--1">
    <img src="${M.software.phone2}" alt="Verity Tech software interface mockup" loading="lazy" class="sw-mockup sw-mockup--2">`;
  document.getElementById("sw-grid").innerHTML = C.software.categories.map(cat => `
    <article class="card card--media reveal">
      ${cat.image ? `<img class="card-img" src="${mediaPath(`software.${cat.image}`)}" alt="${cat.name}" loading="lazy">` : ""}
      <div class="card-body">
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
        ${cat.stacks ? `<p class="stack-tag">Tech: ${cat.stacks}</p>` : ""}
        <ul>${cat.items.slice(0, 9).map(i => `<li>${i}</li>`).join("")}</ul>
      </div>
    </article>`).join("");

  const dev = C.software.development;
  document.getElementById("dev-title").textContent = dev.title;
  document.getElementById("dev-intro").textContent = dev.intro;
  document.getElementById("dev-grid").innerHTML = dev.features.map(f => `
    <article class="feature-card">
      <span class="feature-icon icon-motion">${icon(SERVICE_ICONS[f.icon] || "code")}</span>
      <h4>${f.name}</h4>
      <p>${f.description}</p>
    </article>`).join("");

  const data = C.software.data;
  document.getElementById("data-title").textContent = data.title;
  document.getElementById("data-intro").textContent = data.intro;
  document.getElementById("data-grid").innerHTML = data.features.map(f => `
    <article class="feature-card">
      <span class="feature-icon icon-motion">${icon(SERVICE_ICONS[f.icon] || "chart")}</span>
      <h4>${f.name}</h4>
      <p>${f.description}</p>
    </article>`).join("");

  const ts = C.software.techStacks;
  document.getElementById("tech-stacks").innerHTML = `
    <h3 class="feature-block-title">${ts.title}</h3>
    <div class="tech-stack-grid">
      ${[["Frontend", ts.frontend], ["Backend", ts.backend], ["Mobile", ts.mobile], ["Data", ts.data]].map(([label, list]) => `
        <div class="tech-stack-col">
          <h4>${label}</h4>
          <ul class="tech-chips">${list.map(t => `<li class="tech-chip">${t}</li>`).join("")}</ul>
        </div>`).join("")}
    </div>`;

  document.getElementById("about-title").textContent = C.about.title;
  document.getElementById("about-body").textContent = C.about.body;
  document.getElementById("about-exp").textContent = C.about.experience;
  document.getElementById("about-photo").src = M.hero.team;

  document.getElementById("partners-title").textContent = C.about.partners.title;
  document.getElementById("partners-note").textContent = C.about.partners.note;

  document.getElementById("blog-title").textContent = C.blog.title;
  document.getElementById("blog-list").innerHTML = C.blog.posts.map(p => `
    <article class="blog-card reveal">
      ${p.image ? `<img class="blog-img" src="${mediaPath(`about.${p.image}`)}" alt="" loading="lazy">` : ""}
      <time datetime="2023-11-27">${p.date}</time>
      <h3>${p.title}</h3>
      <p>${p.body || p.excerpt}</p>
      <span class="blog-meta">By ${p.author}</span>
    </article>`).join("");

  const cp = C.contact.person;
  document.getElementById("contact-label").textContent = C.contact.title;
  document.getElementById("contact-cta").textContent = C.contact.cta;
  document.getElementById("contact-desc").textContent = C.contact.description;
  document.getElementById("contact-person").innerHTML = `
    <h4>${cp.name}</h4>
    <p class="title">${cp.title}</p>
    <p class="contact-detail"><span class="icon" aria-hidden="true">${icon("phone")}</span><a href="tel:${cp.phone.replace(/\s/g,"")}">${cp.phone}</a></p>
    <p class="contact-detail"><span class="icon" aria-hidden="true">${icon("mail")}</span><a href="mailto:${cp.email}">${cp.email}</a></p>
    <p class="contact-detail"><span class="icon" aria-hidden="true">${icon("globe")}</span><a href="https://${C.company.domain}">${C.company.domain}</a></p>
    <p class="contact-detail"><span class="icon" aria-hidden="true">${icon("message")}</span><span>Line: ${cp.line}</span></p>`;

  renderStats();
  renderCapabilities();
  renderProcess();
  renderCompare();
  renderFAQ();
}

function renderCompare() {
  const cmp = C.compare;
  if (!cmp) return;
  document.getElementById("compare-label").textContent = cmp.label;
  const ct = document.getElementById("compare-title");
  ct.textContent = cmp.title;
  ct.classList.add("split-reveal");
  document.getElementById("compare-sub").textContent = cmp.subtitle;
  document.getElementById("compare-grid").innerHTML = cmp.columns.map((col, i) => `
    <article class="compare-col compare-col--${col.id} reveal" style="--reveal-i:${i}">
      <h3>${col.title}</h3>
      <ul>${col.highlights.map(h => `<li>${h}</li>`).join("")}</ul>
      <a href="${col.href}" class="btn btn-primary btn-sm">${col.cta}</a>
    </article>`).join("");
}

/* ── Process timeline (figcomponents / motionsites) ── */
function renderProcess() {
  const p = C.process;
  if (!p) return;
  document.getElementById("process-label").textContent = p.label;
  const pt = document.getElementById("process-title");
  pt.textContent = p.title;
  pt.classList.add("split-reveal");
  document.getElementById("process-sub").textContent = p.subtitle;
  document.getElementById("process-steps").innerHTML = p.steps.map((s, i) => `
    <li class="process-step" style="--step-i:${i}">
      <span class="process-num">${s.num}</span>
      <span class="process-icon icon-motion">${icon(s.icon)}</span>
      <h3>${s.title}</h3>
      <p>${s.body}</p>
    </li>`).join("");
}

/* ── Stat band — counts derived from real content (no fabricated metrics) ── */
function renderStats() {
  const band = document.getElementById("stat-band");
  if (!band) return;
  const sum = arr => arr.reduce((n, c) => n + (c.items?.length || 0), 0);
  const ts = C.software.techStacks;
  const technologies = ["frontend", "backend", "mobile", "data"].reduce((n, k) => n + ts[k].length, 0);
  const stats = [
    { value: C.gateway.industries.length, label: "Industries served" },
    { value: sum(C.hardware.categories), label: "Hardware solutions" },
    { value: sum(C.software.categories), label: "Software & data services" },
    { value: technologies, label: "Technologies covered" },
  ];
  band.innerHTML = stats.map(s => `
    <div class="stat-item reveal">
      <span class="stat-value" data-target="${s.value}">0</span>
      <span class="stat-cap">${s.label}</span>
    </div>`).join("");
}

/* ── Capability bento (differentiators, not a service-list dupe) ── */
function renderCapabilities() {
  const cap = C.capabilities;
  if (!cap) return;
  document.getElementById("cap-label").textContent = cap.label;
  document.getElementById("cap-title").textContent = cap.title;
  document.getElementById("cap-title").classList.add("split-reveal");
  document.getElementById("cap-sub").textContent = cap.subtitle;
  document.getElementById("bento-grid").innerHTML = cap.tiles.map((t, i) => `
    <article class="bento-tile${t.feature ? " bento-tile--feature" : ""} reveal" style="--reveal-i:${i}">
      <span class="bento-icon icon-motion">${icon(t.icon)}</span>
      <div class="bento-body">
        <h3>${t.title}</h3>
        <p>${t.body}</p>
      </div>
    </article>`).join("");
}

/* ── FAQ (accessible native disclosure) ── */
function renderFAQ() {
  const faq = C.faq;
  if (!faq) return;
  document.getElementById("faq-label").textContent = faq.label;
  document.getElementById("faq-title").textContent = faq.title;
  document.getElementById("faq-sub").textContent = faq.subtitle;
  document.getElementById("faq-list").innerHTML = faq.items.map((it, i) => `
    <details class="faq-item"${i === 0 ? " open" : ""}>
      <summary class="faq-q"><span>${it.q}</span><span class="faq-icon" aria-hidden="true">${icon("plus")}</span></summary>
      <div class="faq-a"><div class="faq-a-inner"><p>${it.a}</p></div></div>
    </details>`).join("");
}

function renderIndustryPanel(ind, animate = false) {
  const panel = document.querySelector(".tab-panel");
  if (!panel || !ind) return;
  const html = `
    <div class="industry-panel-inner">
      <div class="industry-copy">
        <h3>${ind.title}</h3>
        <p>${ind.description}</p>
        <ul>${ind.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
        <a href="${ind.href}" class="btn btn-primary btn-sm">Learn more</a>
      </div>
      <figure class="industry-visual">
        <img src="${resolveMedia(ind.image)}" alt="${ind.title}" loading="lazy">
      </figure>
    </div>`;
  const apply = () => {
    panel.id = `panel-${ind.id}`;
    panel.setAttribute("aria-labelledby", `tab-${ind.id}`);
    panel.innerHTML = html;
  };
  if (animate && !reduced) {
    panel.classList.add("is-changing");
    setTimeout(() => { apply(); panel.classList.remove("is-changing"); }, 200);
  } else apply();
}

function initIndustryTabs() {
  const tabs = document.getElementById("industry-tabs");
  if (!tabs) return;
  tabs.addEventListener("click", e => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    const id = btn.dataset.industry;
    const ind = C.gateway.industries.find(i => i.id === id);
    if (!ind) return;
    tabs.querySelectorAll(".tab-btn").forEach(t => {
      const on = t === btn;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
    });
    renderIndustryPanel(ind, true);
  });
  tabs.addEventListener("keydown", e => {
    const btns = [...tabs.querySelectorAll(".tab-btn")];
    const idx = btns.indexOf(document.activeElement);
    if (idx < 0) return;
    let next = idx;
    if (e.key === "ArrowRight") { next = (idx + 1) % btns.length; e.preventDefault(); }
    else if (e.key === "ArrowLeft") { next = (idx - 1 + btns.length) % btns.length; e.preventDefault(); }
    else if (e.key === "Home") { next = 0; e.preventDefault(); }
    else if (e.key === "End") { next = btns.length - 1; e.preventDefault(); }
    else return;
    btns[next].focus();
    btns[next].click();
  });
}

function initPathCards() {
  document.querySelectorAll(".path-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".path-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });
}

function initLogoCarousel() {
  if (reduced) return;
  const track = document.getElementById("logo-carousel");
  const wrap = track?.closest(".logo-carousel");
  if (!track) return;
  track.style.setProperty("--carousel-duration", `${C.about.partners.carousel.length * 4}s`);
  wrap?.addEventListener("mouseenter", () => { track.style.animationPlayState = "paused"; });
  wrap?.addEventListener("mouseleave", () => { track.style.animationPlayState = "running"; });
  wrap?.addEventListener("focusin", () => { track.style.animationPlayState = "paused"; });
  wrap?.addEventListener("focusout", () => { track.style.animationPlayState = "running"; });
}

/* ── Sticky mobile CTA (figcomponents / SaaS landing) ── */
function initMobileCta() {
  const bar = document.getElementById("mobile-cta");
  const contact = document.getElementById("contact");
  if (!bar) return;
  let contactVisible = false;
  const update = () => {
    const pastHero = window.scrollY > window.innerHeight * 0.45;
    bar.hidden = !pastHero || contactVisible;
    bar.classList.toggle("show", pastHero && !contactVisible);
  };
  window.addEventListener("scroll", update, { passive: true });
  if (contact) {
    const io = new IntersectionObserver(([e]) => {
      contactVisible = e.isIntersecting;
      update();
    }, { threshold: 0.15 });
    io.observe(contact);
  }
  update();
}

function initVisixGallery() {
  const gallery = document.getElementById("visix-gallery");
  const main = document.getElementById("visix-main-img");
  if (!gallery || !main) return;
  const swap = src => {
    if (main.getAttribute("src") === src) return;
    if (reduced) { main.src = src; return; }
    main.classList.add("is-fading");
    setTimeout(() => {
      main.src = src;
      main.onload = () => main.classList.remove("is-fading");
    }, 180);
  };
  gallery.addEventListener("click", e => {
    const btn = e.target.closest(".visix-thumb");
    if (!btn) return;
    gallery.querySelectorAll(".visix-thumb").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    swap(M.hardware.visix[Number(btn.dataset.index)]);
  });
}

function initHeroVideo() {
  const video = document.querySelector(".hero-video");
  if (!video || reduced) return;
  video.play().catch(() => { video.style.display = "none"; });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const toast = document.getElementById("toast");
  const endpoint = (C.contact.endpoint || "").trim();
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const showToast = () => {
      toast?.classList.add("show");
      setTimeout(() => toast?.classList.remove("show"), 4000);
      form.reset();
      form.querySelectorAll("input, textarea").forEach(f => {
        f.classList.remove("field-valid", "field-invalid");
      });
    };

    const data = Object.fromEntries(new FormData(form).entries());

    if (endpoint) {
      const btn = form.querySelector("button[type='submit']");
      const label = btn?.textContent;
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        showToast();
      } catch {
        // Fallback to mailto if the endpoint is unreachable
        openMailto(data);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    } else {
      openMailto(data);
      showToast();
    }
  });
}

function openMailto({ name = "", email = "", message = "" }) {
  const subject = encodeURIComponent(`Website enquiry from ${name || "a visitor"}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${C.contact.person.email}?subject=${subject}&body=${body}`;
}

/* ── Form field validation UX (figcomponents / designspells) ── */
function initFormEnhance() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.querySelectorAll("input, textarea").forEach(field => {
    const sync = () => {
      const touched = field.value.length > 0;
      field.classList.toggle("field-valid", touched && field.validity.valid);
      field.classList.toggle("field-invalid", touched && !field.validity.valid);
    };
    field.addEventListener("blur", sync);
    field.addEventListener("input", sync);
  });
}

/* ── Process step stagger reveal ── */
function initProcessReveal() {
  const list = document.getElementById("process-steps");
  const steps = document.querySelectorAll(".process-step");
  const syncProgress = () => {
    if (!list || !steps.length) return;
    const n = [...steps].filter(s => s.classList.contains("visible")).length;
    list.style.setProperty("--process-progress", String(n / steps.length));
  };
  if (!steps.length || reduced) {
    steps.forEach(s => s.classList.add("visible"));
    syncProgress();
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        syncProgress();
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -5% 0px" });
  steps.forEach(s => io.observe(s));
}

/* ── itshover-style SVG stroke draw on card hover ── */
function initIconMotion() {
  if (reduced) return;
  const shapes = "path, polyline, line, circle, rect";
  document.querySelectorAll(".icon-motion svg").forEach(svg => {
    svg.querySelectorAll(shapes).forEach(el => {
      const len = typeof el.getTotalLength === "function" ? el.getTotalLength() : 48;
      el.dataset.strokeLen = len;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.style.transition = "stroke-dashoffset 0.55s var(--ease-out-expo)";
    });
  });
  document.querySelectorAll(".path-card, .service-card, .bento-tile, .process-step, .feature-card").forEach(card => {
    const draw = on => {
      card.querySelectorAll(`.icon-motion svg ${shapes}`).forEach(el => {
        el.style.strokeDashoffset = on ? "0" : el.dataset.strokeLen;
      });
    };
    card.addEventListener("mouseenter", () => draw(true));
    card.addEventListener("mouseleave", () => draw(false));
    card.addEventListener("focusin", () => draw(true));
    card.addEventListener("focusout", () => draw(false));
  });
}

/* ── Split-word headline reveal (motionsites / Aceternity) ── */
function initSplitReveal() {
  const els = document.querySelectorAll(".split-reveal");
  if (!els.length) return;
  els.forEach(el => {
    if (el.dataset.splitDone) return;
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    el.dataset.splitDone = "1";
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "split-word";
      span.style.setProperty("--wi", i);
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    if (reduced) { el.classList.add("visible"); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
  });
}

/* ── Optional Unicorn Studio embed (unicorn.studio) ── */
function initUnicornScene() {
  const cfg = C.unicorn;
  const host = document.getElementById("unicorn-scene");
  if (!cfg?.enabled || !cfg.projectId || !host || reduced) return;
  host.hidden = false;
  host.setAttribute("data-us-project", cfg.projectId);
  host.setAttribute("data-us-production", "true");
  host.setAttribute("data-us-lazyload", "true");
  host.style.cssText = "width:100%;height:100%;position:absolute;inset:0;";
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js";
  script.defer = true;
  document.head.appendChild(script);
}

/* ── anime.js hero (MotionSites-style stagger) ── */
function initHeroAnime() {
  if (reduced) return;

  try {
  animate(".hero-brand-tag", {
    opacity: [0, 1], translateY: [16, 0], duration: 700, ease: "outExpo", delay: 200,
  });

  animate("[data-animate='line']", {
    opacity: [0, 1], translateY: [48, 0], duration: 900, ease: "outExpo",
    delay: stagger(120, { start: 400 }),
  });

  animate("[data-animate='fade']", {
    opacity: [0, 1], translateY: [24, 0], duration: 700, ease: "outExpo",
    delay: stagger(100, { start: 900 }),
  });

  animate(".kinetic-bar", {
    scaleX: [0, 1], duration: 1200, ease: "outExpo", delay: 1100,
  });
  } catch (err) {
    console.warn("Hero animation fallback:", err);
  }
}

/* ── Three.js hero (threejs.org patterns: grid + particles + wireframes) ── */
async function initHeroThree() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || reduced) { if (canvas) canvas.style.display = "none"; return; }

  try {
    const THREE = await loadThree();
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BRAND_3D.bg, 0.022);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 8, 24);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const grid = new THREE.GridHelper(70, 35, BRAND_3D.gold, BRAND_3D.burgundy);
    grid.material.opacity = 0.28;
    grid.material.transparent = true;
    scene.add(grid);

    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = Math.random() * 35 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70;
      const c = PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.22, vertexColors: true, transparent: true, opacity: 0.75,
    }));
    scene.add(points);

    const wireGroup = new THREE.Group();
    [[4, 0, -6], [-5, 3, 4], [3, 6, 8]].forEach(([x, y, z], i) => {
      const size = 1.8 + i * 0.6;
      const geo = new THREE.IcosahedronGeometry(size, i === 0 ? 1 : 0);
      const mat = new THREE.MeshBasicMaterial({
        color: i === 1 ? BRAND_3D.gold : BRAND_3D.burgundy,
        wireframe: true, transparent: true, opacity: 0.55 + i * 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      wireGroup.add(mesh);
    });
    scene.add(wireGroup);

    const isHeroVisible = observeHeroVisibility();
    let mx = 0, my = 0;
    window.addEventListener("mousemove", e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 4;
      my = (e.clientY / window.innerHeight - 0.5) * 2.5;
    }, { passive: true });

    const start = performance.now();
    renderer.setAnimationLoop(now => {
      if (!isHeroVisible()) return;
      const t = (now - start) * 0.001;
      grid.rotation.y = t * 0.12;
      points.rotation.y = t * 0.04;
      wireGroup.rotation.y = t * 0.18;
      wireGroup.children.forEach((m, i) => {
        m.rotation.x = t * (0.3 + i * 0.1);
        m.rotation.z = t * (0.2 + i * 0.05);
      });
      const targetZ = 24 + heroScroll * 26;
      const targetY = 8 + heroScroll * 12;
      camera.position.x += (mx - camera.position.x) * 0.03;
      camera.position.y += (targetY - my - camera.position.y) * 0.03;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.lookAt(0, 4, 0);
      renderer.render(scene, camera);
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch {
    canvas.style.display = "none";
  }
}

/* ── Classic threejs.org icosahedron (Creating a Scene) ── */
async function initHeroGeo() {
  const canvas = document.getElementById("hero-geo-canvas");
  if (!canvas || reduced) { if (canvas) canvas.style.display = "none"; return; }

  try {
    const THREE = await loadThree();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: BRAND_3D.gold, wireframe: true, transparent: true, opacity: 0.9,
    }));
    const solid = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      color: BRAND_3D.burgundy, metalness: 0.35, roughness: 0.45,
      transparent: true, opacity: 0.35,
    }));
    scene.add(solid);
    scene.add(wire);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.015, 8, 64),
      new THREE.MeshBasicMaterial({ color: BRAND_3D.goldLight, transparent: true, opacity: 0.5 }),
    );
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    scene.add(new THREE.AmbientLight(BRAND_3D.gold, 0.4));
    const dir = new THREE.DirectionalLight(BRAND_3D.goldLight, 1.1);
    dir.position.set(3, 4, 5);
    scene.add(dir);

    const isHeroVisible = observeHeroVisibility();
    const resize = () => {
      const w = canvas.clientWidth || 380;
      const h = canvas.clientHeight || 380;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    renderer.setAnimationLoop(time => {
      if (!isHeroVisible()) return;
      wire.rotation.x = time * 0.0004;
      wire.rotation.y = time * 0.0007;
      solid.rotation.copy(wire.rotation);
      ring.rotation.z = time * 0.0003;
      renderer.render(scene, camera);
    });
  } catch {
    canvas.style.display = "none";
  }
}

/* ── Three.js product showcase + OrbitControls (threejs.org examples) ── */
async function initShowcase3D() {
  const canvas = document.getElementById("showcase-canvas");
  const section = document.getElementById("showcase-3d");
  if (!canvas || !section || reduced) { if (canvas) canvas.style.display = "none"; return; }

  const textures = [
    M.hardware.signageMockup,
    M.hardware.videowall,
    M.hardware.lcd,
    M.software.phone1,
    M.software.phone2,
    M.hardware.smartOffice,
  ];

  try {
    const THREE = await loadThree();
    const { OrbitControls } = await loadOrbitControls();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BRAND_3D.bg, 0.04);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 1, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const loader = new THREE.TextureLoader();
    const group = new THREE.Group();
    scene.add(group);

    textures.forEach((url, i) => {
      const tex = loader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 1.85, 0.06),
        new THREE.MeshStandardMaterial({ color: BRAND_3D.burgundyDeep, metalness: 0.4, roughness: 0.5 }),
      );
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 1.65),
        new THREE.MeshStandardMaterial({ map: tex, metalness: 0.1, roughness: 0.7 }),
      );
      screen.position.z = 0.04;
      const panel = new THREE.Group();
      panel.add(frame);
      panel.add(screen);
      const angle = (i / textures.length) * Math.PI * 2;
      panel.position.set(Math.cos(angle) * 3.5, Math.sin(i * 0.6) * 0.3, Math.sin(angle) * 3.5);
      panel.rotation.y = -angle + Math.PI / 2;
      group.add(panel);
    });

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.45, 0.12, 100, 16),
      new THREE.MeshStandardMaterial({ color: BRAND_3D.gold, metalness: 0.6, roughness: 0.3 }),
    );
    knot.position.y = -0.5;
    group.add(knot);

    scene.add(new THREE.AmbientLight(BRAND_3D.gold, 0.35));
    const key = new THREE.DirectionalLight(BRAND_3D.goldLight, 1.2);
    key.position.set(5, 8, 6);
    scene.add(key);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 14;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    const wrap = canvas.closest(".showcase-canvas-wrap");
    const dismissHint = () => wrap?.classList.add("hint-dismissed");
    canvas.addEventListener("pointerdown", dismissHint, { once: true });
    controls.addEventListener("start", dismissHint);

    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(section);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || 420;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    renderer.setAnimationLoop(() => {
      if (!visible) return;
      controls.update();
      knot.rotation.x += 0.008;
      knot.rotation.y += 0.012;
      renderer.render(scene, camera);
    });
  } catch {
    canvas.style.display = "none";
  }
}

/* ── Reveal on scroll (IntersectionObserver — robust with Lenis) ── */
function initReveals() {
  const reveals = document.querySelectorAll(".reveal");
  if (reduced) {
    reveals.forEach(el => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  reveals.forEach(el => io.observe(el));
}

/* ── GSAP cinematic hero scrub + scroll-driven 3D (2026 trend) ── */
async function initScroll() {
  initReveals();
  if (reduced) return;

  try {
    const [gsapMod, stMod] = await Promise.all([
      import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js"),
      import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js"),
    ]);
    const gsap = gsapMod.default || gsapMod.gsap;
    const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis smooth scroll with ScrollTrigger (gsap.ticker fix)
    if (lenisInstance) {
      lenisInstance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => lenisInstance.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Cinematic hero parallax: drift hero content + visual as you scroll past
    gsap.to(".hero-glass", {
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 },
      y: 120, opacity: 0.15, ease: "none",
    });
    gsap.to(".hero-visual", {
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.4 },
      y: -80, ease: "none",
    });

    // Scroll-driven 3D: feed hero scroll progress into the render loop
    ScrollTrigger.create({
      trigger: "#hero", start: "top top", end: "bottom top", scrub: true,
      onUpdate: self => { heroScroll = self.progress; },
    });

    ScrollTrigger.refresh();
  } catch {
    /* reveals already handled by IntersectionObserver */
  }
}

/* ── Lenis smooth scroll (2026 immersive stack) ── */
let lenisInstance = null;
async function initSmoothScroll() {
  if (reduced) return null;
  try {
    const { default: Lenis } = await import("https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm");
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisInstance = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return lenis;
  } catch {
    return null;
  }
}

/* ── Scroll progress bar ── */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ── Magnetic CTAs (micro-interaction) ── */
function initMagneticButtons() {
  if (reduced) return;
  document.querySelectorAll(".btn-primary").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
}

/* ── Animated counters / stat reveal ── */
function initCounters() {
  const cards = document.querySelectorAll(".stat-card .stat-num");
  if (!cards.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("stat-pulse"); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  cards.forEach(c => io.observe(c));
}

/* ── Rolling-digit stat band (tripo3d-style count-up) ── */
function initStatCounters() {
  const els = document.querySelectorAll(".stat-value");
  if (!els.length) return;
  if (reduced) { els.forEach(el => { el.textContent = el.dataset.target; }); return; }
  const run = el => {
    const target = Number(el.dataset.target) || 0;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.classList.add("stat-pulse");
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ── Branded page loader → cinematic intro (getlayers/motionsites) ── */
function initLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  if (reduced) { loader.remove(); return; }
  const done = () => {
    loader.classList.add("done");
    setTimeout(() => loader.remove(), 700);
  };
  if (document.readyState === "complete") setTimeout(done, 400);
  else window.addEventListener("load", () => setTimeout(done, 400));
  setTimeout(done, 4000); // safety: never trap the page
}

/* ── Cursor-follow spotlight on hero (motionsites/designspells) ── */
function initCursorSpotlight() {
  if (reduced) return;
  const hero = document.getElementById("hero");
  const spot = document.getElementById("hero-spotlight");
  if (!hero || !spot) return;
  let raf = 0, x = 50, y = 40;
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    x = ((e.clientX - r.left) / r.width) * 100;
    y = ((e.clientY - r.top) / r.height) * 100;
    if (!raf) raf = requestAnimationFrame(() => {
      spot.style.setProperty("--mx", `${x}%`);
      spot.style.setProperty("--my", `${y}%`);
      raf = 0;
    });
  }, { passive: true });
  hero.addEventListener("pointerenter", () => spot.classList.add("active"));
  hero.addEventListener("pointerleave", () => spot.classList.remove("active"));
}

/* ── Subtle pointer tilt on bento tiles (transform-only) ── */
function initBentoTilt() {
  if (reduced) return;
  document.querySelectorAll(".bento-tile").forEach(tile => {
    tile.addEventListener("pointermove", e => {
      const r = tile.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tile.style.transform = `perspective(800px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg)`;
    });
    tile.addEventListener("pointerleave", () => { tile.style.transform = ""; });
  });
}

/* ── FAQ: single-open accordion (native details) ── */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach(d => d.addEventListener("toggle", () => {
    if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
  }));
}

/* ── Scroll-spy: highlight the nav link for the section in view ── */
function initScrollSpy() {
  const links = [...document.querySelectorAll('.nav-menu > .nav-item > .nav-link[href^="#"]')];
  const map = new Map();
  links.forEach(l => {
    const id = l.getAttribute("href");
    const sec = id && id.length > 1 ? document.querySelector(id) : null;
    if (sec) map.set(sec, l);
  });
  if (!map.size) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove("active"));
      map.get(e.target)?.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  map.forEach((_, sec) => io.observe(sec));
}

/* ── Back-to-top control ── */
function initBackToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  const toggle = () => btn.classList.toggle("show", window.scrollY > window.innerHeight);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  btn.addEventListener("click", () => {
    if (lenisInstance) lenisInstance.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });
}

/* ── Kinetic marquee (getlayers / motionsites) ── */
function initMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;
  const words = [
    C.company.taglineBrand,
    "Digital Signage",
    "Smart Office & Home",
    "Custom Software",
    "Data Analytics",
    ...C.about.partners.carousel,
  ];
  const chunk = words.map(w => `<span class="marquee-item">${w}</span><span class="marquee-dot">◆</span>`).join("");
  track.innerHTML = chunk + chunk;
  if (reduced) track.style.animationPlayState = "paused";
}

/* ── Hero scroll cue (motionsites / Clarix) ── */
function initScrollCue() {
  const cue = document.querySelector(".hero-scroll-cue");
  const hero = document.getElementById("hero");
  if (!cue || !hero) return;
  const hide = () => cue.classList.toggle("hidden", window.scrollY > window.innerHeight * 0.12);
  window.addEventListener("scroll", hide, { passive: true });
  hide();
}

/* ── Button ripple (designspells) ── */
function initButtonRipple() {
  if (reduced) return;
  document.querySelectorAll(".btn-primary, .btn-ghost").forEach(btn => {
    btn.classList.add("btn-ripple");
    btn.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      const r = btn.getBoundingClientRect();
      const rip = document.createElement("span");
      rip.className = "ripple";
      rip.style.left = `${e.clientX - r.left}px`;
      rip.style.top = `${e.clientY - r.top}px`;
      btn.appendChild(rip);
      rip.addEventListener("animationend", () => rip.remove(), { once: true });
    });
  });
}

/* ── Scanline (V4) ── */
function initScanline() {
  const scanline = document.querySelector(".scanline");
  if (!scanline || reduced) return;
  const isHeroVisible = observeHeroVisibility();
  let pos = 0;
  (function scan() {
    if (isHeroVisible()) {
      pos = (pos + 0.12) % 100;
      scanline.style.transform = `translateY(${pos}vh)`;
    }
    requestAnimationFrame(scan);
  })();
}

/* ── Boot ── */
document.body.insertBefore(renderNav(), document.body.firstChild);
renderContent();
document.getElementById("site-footer").replaceWith(renderFooter());
initNav();
initContactForm();
initFormEnhance();
initHeroVideo();
initVisixGallery();
initIndustryTabs();
initPathCards();
initLogoCarousel();
initMobileCta();
initScrollProgress();
initMagneticButtons();
initCounters();
initStatCounters();
initLoader();
initCursorSpotlight();
initBentoTilt();
initFAQ();
initScrollSpy();
initBackToTop();
initMarquee();
initScrollCue();
initButtonRipple();
initShaderMesh(document.getElementById("shader-mesh"), { opacity: 0.5 });
initShaderMesh(document.getElementById("contact-shader-mesh"), { opacity: 0.35 });
initProcessReveal();
initIconMotion();
initSplitReveal();
initUnicornScene();
initHeroAnime();
initHeroThree();
initHeroGeo();
initShowcase3D();
initScanline();
// Smooth scroll must init before ScrollTrigger sync
initSmoothScroll().then(initScroll);
