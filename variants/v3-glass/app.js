import { renderNav, renderFooter, initNav, initReveal, initContactForm, renderSections } from "../../shared/components.js";

document.body.insertBefore(renderNav(), document.body.firstChild);
document.getElementById("main-sections").innerHTML = renderSections();
document.body.appendChild(renderFooter());
initNav();
initReveal();
initContactForm();
