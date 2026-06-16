import { renderNav, renderFooter, initNav, initReveal, initContactForm, renderSections } from "../../shared/components.js";

document.body.insertBefore(renderNav(), document.body.firstChild);
document.getElementById("main-sections").innerHTML = renderSections();
document.body.appendChild(renderFooter());
initNav();
initReveal();
initContactForm();

const canvas = document.getElementById("hero-canvas");
const scanline = document.querySelector(".scanline");

if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js").then(THREE => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.015);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 8, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const gridHelper = new THREE.GridHelper(80, 40, 0x3899ec, 0x116dff);
    gridHelper.material.opacity = 0.35;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    const planeGeo = new THREE.PlaneGeometry(80, 80, 1, 1);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x116dff, transparent: true, opacity: 0.04, side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.01;
    scene.add(plane);

    let scrollY = 0;
    window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      const t = scrollY * 0.002;
      camera.position.y = 8 + Math.sin(t) * 2;
      camera.position.z = 18 - t * 3;
      camera.lookAt(0, 0, -t * 5);
      gridHelper.rotation.y = t * 0.1;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }).catch(() => { if (canvas) canvas.style.display = "none"; });
} else if (canvas) {
  canvas.style.display = "none";
}

if (scanline && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let pos = 0;
  function scan() {
    pos = (pos + 1) % 100;
    scanline.style.top = pos + "%";
    requestAnimationFrame(scan);
  }
  scan();
}
