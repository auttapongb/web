import { renderNav, renderFooter, initNav, initReveal, initContactForm, renderSections } from "../../shared/components.js";

document.body.insertBefore(renderNav(), document.body.firstChild);
document.getElementById("main-sections").innerHTML = renderSections();
document.body.appendChild(renderFooter());
initNav();
initReveal();
initContactForm();

// V1: Three.js particle nebula
const canvas = document.getElementById("hero-canvas");
if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js").then(THREE => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 2500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [[0.07,0.43,1],[0.22,0.56,0.93],[0.35,0.28,0.96],[0.29,0.57,0.43]];
    for (let i = 0; i < count; i++) {
      positions[i*3] = (Math.random()-0.5)*120;
      positions[i*3+1] = (Math.random()-0.5)*80;
      positions[i*3+2] = (Math.random()-0.5)*60;
      const c = palette[Math.floor(Math.random()*palette.length)];
      colors[i*3]=c[0]; colors[i*3+1]=c[1]; colors[i*3+2]=c[2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.85 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mx = 0, my = 0;
    window.addEventListener("mousemove", e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 8;
      my = (e.clientY / window.innerHeight - 0.5) * 5;
    }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0008;
      points.rotation.x += 0.0003;
      camera.position.x += (mx - camera.position.x) * 0.02;
      camera.position.y += (-my - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }).catch(() => { canvas.style.display = "none"; });
}
