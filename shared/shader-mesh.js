/**
 * Flowing gradient mesh (shadergradient.co aesthetic, static HTML).
 * Canvas 2D — burgundy/gold brand palette. Pauses off-screen.
 */
export function initShaderMesh(canvas, { opacity = 0.55, theme = "dark" } = {}) {
  if (!canvas) return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    canvas.style.display = "none";
    return () => {};
  }

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return () => {};

  const palette = theme === "light"
    ? [
        [209, 217, 230, 0.35],
        [212, 175, 55, 0.28],
        [128, 0, 32, 0.15],
        [240, 242, 245, 0.5],
        [200, 210, 225, 0.3],
      ]
    : [
        [139, 35, 50, 0.55],
        [107, 26, 40, 0.45],
        [201, 169, 98, 0.35],
        [232, 200, 114, 0.28],
        [74, 40, 48, 0.4],
      ];

  let w = 0;
  let h = 0;
  let visible = true;
  let raf = 0;
  let t0 = performance.now();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = now => {
    if (!visible || !w || !h) {
      raf = requestAnimationFrame(draw);
      return;
    }
    const t = (now - t0) * 0.00035;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    palette.forEach(([r, g, b, a], i) => {
      const phase = i * 1.7;
      const cx = w * (0.5 + 0.38 * Math.sin(t * (1.1 + i * 0.15) + phase));
      const cy = h * (0.45 + 0.32 * Math.cos(t * (0.95 + i * 0.12) + phase * 0.8));
      const radius = Math.max(w, h) * (0.35 + 0.08 * Math.sin(t * 0.7 + i));
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `rgba(${r},${g},${b},${a * opacity})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });

    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(draw);
  };

  const host = canvas.closest("#hero, .section-contact, section");
  if (host) {
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(host);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}
