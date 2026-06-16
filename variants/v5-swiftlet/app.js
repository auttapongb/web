import { renderNav, renderFooter, initNav, initReveal, initContactForm, renderSections } from "../../shared/components.js";

document.body.insertBefore(renderNav(), document.body.firstChild);
document.getElementById("main-sections").innerHTML = renderSections();
document.body.appendChild(renderFooter());
initNav();
initReveal();
initContactForm();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const blob = document.querySelector(".blob-path");
  if (blob) {
    let t = 0;
    function morph() {
      t += 0.008;
      const r1 = 30 + Math.sin(t) * 8;
      const r2 = 35 + Math.cos(t * 1.3) * 10;
      blob.setAttribute("d", `M50,${50-r1} Q${50+r2},50 50,${50+r1} Q${50-r2},50 50,${50-r1} Z`);
      requestAnimationFrame(morph);
    }
    morph();
  }

  const title = document.querySelector(".swiftlet-title");
  if (title) {
    title.style.clipPath = "inset(0 100% 0 0)";
    requestAnimationFrame(() => {
      title.style.transition = "clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
      title.style.clipPath = "inset(0 0% 0 0)";
    });
  }
}
