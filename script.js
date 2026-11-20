document.getElementById('year').textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sections = [...document.querySelectorAll('.section-head, .venture, .about-grid')];
let observer;

function showAll() {
  observer?.disconnect();
  sections.forEach(section => section.classList.remove('reveal-pending', 'reveal-ready'));
}

function prepareReveals() {
  showAll();
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('reveal-pending');
      observer.unobserve(entry.target);
    }
  });
  for (const section of sections) {
    // Refreshes can restore a scroll position. Never hide text already on screen.
    if (section.getBoundingClientRect().top < window.innerHeight || section.contains(document.activeElement)) continue;
    section.classList.add('reveal-ready', 'reveal-pending');
    observer.observe(section);
  }
}

// Opening animations are CSS-only so content never depends on JavaScript finishing.
// Skip the sequence for restored positions and stop immediately on user interaction.
const finishEntrance = () => document.documentElement.classList.add('entry-complete');
if (window.location.hash || window.scrollY > 8) finishEntrance();
for (const eventName of ['pointerdown', 'keydown', 'focusin']) {
  document.addEventListener(eventName, finishEntrance, { once: true, passive: true });
}
window.addEventListener('wheel', finishEntrance, { once: true, passive: true });
window.addEventListener('pagehide', finishEntrance);
reducedMotion.addEventListener('change', finishEntrance);

// Wait for load and scroll restoration, then prepare only off-screen sections.
window.addEventListener('pageshow', event => {
  if (event.persisted) { finishEntrance(); showAll(); return; }
  if (window.scrollY > 8 || window.location.hash) finishEntrance();
  requestAnimationFrame(() => requestAnimationFrame(prepareReveals));
});
window.addEventListener('pagehide', showAll);
document.addEventListener('focusin', event => {
  for (const section of sections) {
    if (!section.contains(event.target)) continue;
    section.classList.remove('reveal-ready', 'reveal-pending');
    observer?.unobserve(section);
  }
});
reducedMotion.addEventListener('change', event => {
  if (event.matches) showAll();
});

// One viewport light drives the monogram and every heading. Artwork stays fixed.
const lightRoot = document.body;
const heroArt = document.querySelector('.hero-art');
const lightGradient = document.querySelector('#monogram-graphite');
const litHeadings = [...document.querySelectorAll('h1, h2, h3, .footer-brand p')];
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const offsets = ['contact', 'near', 'far', 'tail', 'edge'].map(name =>
  document.querySelector(`feOffset[result="${name}-offset"]`)
);
const originalLighting = [lightGradient, ...offsets].map(element => ({
  element,
  attributes: Object.fromEntries([...element.attributes].map(({ name, value }) => [name, value]))
}));
let lightPosition = { x: 0, y: 0, strength: 0 };
let targetLight = { ...lightPosition };
let lightFrame = 0;
let lastLightTime = 0;
const canMoveLight = () => finePointer.matches && !reducedMotion.matches;

function restoreLighting() {
  cancelAnimationFrame(lightFrame);
  lightFrame = 0;
  lastLightTime = 0;
  lightPosition.strength = targetLight.strength = 0;
  for (const { element, attributes } of originalLighting) {
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  }
  for (const name of ['--pointer-light-x', '--pointer-light-y', '--pointer-light-opacity', '--rest-light-opacity']) {
    lightRoot.style.removeProperty(name);
  }
  for (const heading of litHeadings) {
    heading.style.removeProperty('--heading-shadow');
    heading.style.removeProperty('--heading-filter');
  }
}

function directionFrom(bounds, scale) {
  const dx = (lightPosition.x - bounds.left - bounds.width / 2) / scale;
  const dy = (lightPosition.y - bounds.top - bounds.height / 2) / scale;
  const distance = Math.hypot(1, dx, dy);
  return { x: dx / distance, y: dy / distance };
}

function paintLighting() {
  // Read layout before any writes. Re-measure on scroll, including a stationary cursor.
  const artBounds = heroArt.getBoundingClientRect();
  const headings = litHeadings.map(element => ({ element, bounds: element.getBoundingClientRect() }));
  const strength = lightPosition.strength;
  const direction = directionFrom(artBounds, Math.max(artBounds.width, 1));
  const x = -1 + (direction.x + 1) * strength;
  const y = -.77 + (direction.y + .77) * strength;
  lightGradient.setAttribute('x1', 31 + x * 17);
  lightGradient.setAttribute('y1', 29 + y * 26);
  lightGradient.setAttribute('x2', 31 - x * 17);
  lightGradient.setAttribute('y2', 29 - y * 26);
  [[1.2, 1.8], [6, 5], [12, 9.4], [19, 14], [.18, .28]].forEach(([dx, dy], index) => {
    offsets[index].setAttribute('dx', -x * dx);
    offsets[index].setAttribute('dy', -y * dy);
  });
  lightRoot.style.setProperty('--pointer-light-x', `${lightPosition.x}px`);
  lightRoot.style.setProperty('--pointer-light-y', `${lightPosition.y}px`);
  lightRoot.style.setProperty('--pointer-light-opacity', strength);
  lightRoot.style.setProperty('--rest-light-opacity', 1 - strength);
  for (const { element, bounds } of headings) {
    if (bounds.bottom < -80 || bounds.top > window.innerHeight + 80) continue;
    const { x, y } = directionFrom(bounds, 180);
    const distance = Math.hypot(lightPosition.x - bounds.left - bounds.width / 2, lightPosition.y - bounds.top - bounds.height / 2);
    const power = strength * (.5 + .5 / (1 + distance / 600));
    const layers = [[3, 1, .95], [14, 3, .88], [34, 9, .68]].map(([length, blur, alpha]) =>
      `${(-x * length).toFixed(2)}px ${(-y * length).toFixed(2)}px ${blur}px rgba(0,0,0,${(alpha * power).toFixed(3)})`
    );
    element.style.setProperty('--heading-shadow', layers.join(','));
    // SVG headings need an alpha-shaped shadow, not a rectangular box shadow.
    if (element.classList.contains('halenn-heading')) {
      element.style.setProperty('--heading-filter', layers.map(layer => `drop-shadow(${layer})`).join(' '));
    }
  }
}

function animateLighting(time) {
  lightFrame = 0;
  if (!canMoveLight()) { restoreLighting(); return; }
  const elapsed = lastLightTime ? Math.min(time - lastLightTime, 64) : 16;
  lastLightTime = time;
  const blend = 1 - Math.exp(-elapsed / (targetLight.strength ? 32 : 110));
  for (const key of ['x', 'y', 'strength']) lightPosition[key] += (targetLight[key] - lightPosition[key]) * blend;
  const settled = Math.hypot(targetLight.x - lightPosition.x, targetLight.y - lightPosition.y) < .25
    && Math.abs(targetLight.strength - lightPosition.strength) < .002;
  if (settled) lightPosition = { ...targetLight };
  if (settled && !targetLight.strength) { restoreLighting(); return; }
  paintLighting();
  if (!settled) lightFrame = requestAnimationFrame(animateLighting);
  else lastLightTime = 0;
}

function startLighting() {
  if (!lightFrame) lightFrame = requestAnimationFrame(animateLighting);
}

document.addEventListener('pointermove', event => {
  if (!canMoveLight() || event.pointerType !== 'mouse') return;
  if (!targetLight.strength) {
    lightPosition.x = event.clientX;
    lightPosition.y = event.clientY;
  }
  targetLight = { x: event.clientX, y: event.clientY, strength: 1 };
  startLighting();
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => {
  targetLight = { ...lightPosition, strength: 0 };
  if (lightPosition.strength) startLighting();
});
// Scroll and resize change the direction from each heading to the viewport light.
for (const eventName of ['scroll', 'resize']) window.addEventListener(eventName, () => {
  if (targetLight.strength) startLighting();
}, { passive: true });
document.addEventListener('pointercancel', restoreLighting);
document.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse') restoreLighting();
}, { passive: true });
reducedMotion.addEventListener('change', restoreLighting);
finePointer.addEventListener('change', restoreLighting);
window.addEventListener('pagehide', restoreLighting);
window.addEventListener('blur', restoreLighting);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) restoreLighting();
});
