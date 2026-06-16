import { renderNav, renderFooter, initNav, initReveal, initContactForm, renderSections } from "../../shared/components.js";

document.body.insertBefore(renderNav(), document.body.firstChild);
document.getElementById("main-sections").innerHTML = renderSections();
document.body.appendChild(renderFooter());
initNav();
initContactForm();

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced) {
  Promise.all([
    import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js"),
    import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js"),
  ]).then(([gsapMod, stMod]) => {
    const gsap = gsapMod.default || gsapMod.gsap;
    const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-line", { y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" });
    gsap.from(".hero-sub", { y: 40, opacity: 0, duration: 0.8, delay: 0.6, ease: "power2.out" });
    gsap.from(".hero-actions", { y: 30, opacity: 0, duration: 0.6, delay: 0.9 });

    gsap.utils.toArray(".card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
        y: 60, opacity: 0, duration: 0.7, delay: i * 0.08, ease: "power2.out",
      });
    });

    gsap.utils.toArray(".section-title, .section-desc, .about-body, .blog-card").forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%" },
        y: 40, opacity: 0, duration: 0.6, ease: "power2.out",
      });
    });
  }).catch(() => initReveal());
} else {
  initReveal();
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}
