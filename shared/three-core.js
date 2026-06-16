/** Shared Three.js loader — matches threejs.org r184 */
export const THREE_VERSION = "0.184.0";
const BASE = `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}`;

let threePromise;
export function loadThree() {
  if (!threePromise) threePromise = import(`${BASE}/build/three.module.js`);
  return threePromise;
}

let orbitPromise;
export function loadOrbitControls() {
  if (!orbitPromise) orbitPromise = import(`${BASE}/examples/jsm/controls/OrbitControls.js`);
  return orbitPromise;
}

export const BRAND_3D = {
  burgundy: 0x8b2332,
  burgundyDeep: 0x6b1a28,
  gold: 0xc9a962,
  goldLight: 0xe8c872,
  bg: 0x2a1518,
};

/** Burgundy/gold particle palette (RGB 0–1) */
export const PARTICLE_PALETTE = [
  [0.545, 0.137, 0.196],
  [0.788, 0.663, 0.384],
  [0.420, 0.102, 0.157],
  [0.910, 0.784, 0.447],
];
