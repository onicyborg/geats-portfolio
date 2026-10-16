import * as THREE from 'three';
import { t } from './i18n.js';

const WIDTH = 2.65, HEIGHT = 4.1;
const REST_Y = -3.05;
function roundedShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2, y = -height / 2;
  shape.moveTo(x + radius, y); shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius); shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}
function faceGeometry() {
  const geometry = new THREE.ShapeGeometry(roundedShape(WIDTH, HEIGHT, .15), 12);
  const position = geometry.attributes.position, uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, position.getX(i) / WIDTH + .5, position.getY(i) / HEIGHT + .5);
  return geometry;
}
function drawFace(canvas, photo, back) {
  const ctx = canvas.getContext('2d');
  // Draw in logical units; the backing texture is twice as dense on both axes.
  const w = 1024, h = 1584;
  ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#171B22'; ctx.fillRect(0, 0, w, h);
  const text = (value, x, y, size, color = '#ECEEF1', mono = false, weight = 400) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px "${mono ? 'Geist Mono' : 'Instrument Sans'}", ${mono ? 'monospace' : 'sans-serif'}`;
    ctx.fillText(value, x, y, w - x - 72);
  };
  const line = y => { ctx.fillStyle = '#343A44'; ctx.fillRect(72, y, w - 144, 2); };
  text('geats.', 72, 140, 76, '#ECEEF1', false, 700);
  text('AF / 26', 775, 130, 28, '#A1A9B5', true);
  line(180);
  if (!back) {
    const px = 72, py = 222, pw = w - 144, ph = 548;
    const scale = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight);
    const sw = pw / scale, sh = ph / scale;
    const sx = (photo.naturalWidth - sw) / 2, sy = (photo.naturalHeight - sh) * .08;
    ctx.save(); ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 10); ctx.clip();
    ctx.drawImage(photo, sx, sy, sw, sh, px, py, pw, ph); ctx.restore();
    text('@onicyborg', 72, 845, 42, '#A1A9B5', true);
    text('Akhmad Fauzi', 72, 947, 86, '#ECEEF1', false, 600);
    text(t('card.alias'), 72, 1006, 44, '#A1A9B5');
    text(t('role.backend'), 72, 1080, 45);
    text(t('role.fullstack'), 72, 1136, 45);
    text(t('role.qa'), 72, 1192, 45);
    text(t('card.location'), 72, 1260, 42, '#A1A9B5');
    ctx.fillStyle = '#3DD68C'; ctx.beginPath(); ctx.arc(83, 1320, 10, 0, Math.PI * 2); ctx.fill();
    text(t('nav.status'), 110, 1334, 42);
    const foil = ctx.createLinearGradient(72, 0, w - 72, 0);
    foil.addColorStop(0, '#7b828b'); foil.addColorStop(.4, '#d0c8b4'); foil.addColorStop(.65, '#b98b42'); foil.addColorStop(1, '#7b828b');
    ctx.fillStyle = foil; ctx.fillRect(72, 1380, w - 144, 18);
  } else {
    text(t('card.stack'), 72, 290, 42, '#A1A9B5', true);
    text('Akhmad Fauzi', 72, 395, 78, '#ECEEF1', false, 600);
    ['NestJS', 'Laravel', 'PostgreSQL', t('tag.qa')].forEach((item, i) => {
      const x = 72, y = 455 + i * 105;
      ctx.strokeStyle = '#505865'; ctx.lineWidth = 2; ctx.strokeRect(x, y, w - 144, 85);
      text(item, x + 22, y + 57, 42, '#ECEEF1', true);
    });
    line(910);
    ['akhmadfauzy40@gmail.com', 'github.com/onicyborg', 'linkedin.com/in/geats'].forEach((item, i) => text(item, 72, 1000 + i * 80, 44, '#ECEEF1'));
    // Decorative barcode and ID, not encoded contact information or a credential.
    ctx.fillStyle = '#A1A9B5';
    for (let i = 0, x = 72; x < w - 72; i++) { const width = i % 3 === 0 ? 9 : 4; ctx.fillRect(x, 1255, width, 125); x += width + (i % 4 + 1) * 3; }
  }
  text('AF-2026-0001', 72, 1490, 28, '#A1A9B5', true);
}

export async function createCardScene(container, { canvas, context, onFlip, onFallback }) {
  const photo = new Image(); photo.src = 'ace.jpeg';
  await photo.decode();
  // Font readiness keeps the canvas lettering consistent with the HTML card.
  await document.fonts.ready;
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(0x000000, 0);
  canvas.setAttribute('role', 'button'); canvas.tabIndex = 0; canvas.setAttribute('aria-label', t('card.canvas'));
  canvas.setAttribute('aria-describedby', 'card-description');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
  camera.position.set(0, .3, 10.4); camera.lookAt(0, .3, 0);
  // A small studio reflection map avoids a room render and large HDR downloads.
  const studio = document.createElement('canvas'); studio.width = 256; studio.height = 128;
  const studioContext = studio.getContext('2d');
  studioContext.fillStyle = '#333943'; studioContext.fillRect(0, 0, 256, 128);
  studioContext.fillStyle = '#b7bdc5'; studioContext.fillRect(28, 24, 42, 72);
  studioContext.fillStyle = '#d5d0c5'; studioContext.fillRect(165, 10, 30, 95);
  const studioTexture = new THREE.CanvasTexture(studio);
  studioTexture.colorSpace = THREE.SRGBColorSpace;
  studioTexture.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromEquirectangular(studioTexture);
  scene.environment = environment.texture;
  studioTexture.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe8efff, 0x22252b, 1.1));
  const key = new THREE.DirectionalLight(0xffefd7, 1.8); key.position.set(-3, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xaac4ee, 1.7); rim.position.set(4, 2, -2); scene.add(rim);

  const pivot = new THREE.Group(); pivot.position.y = 3.1; scene.add(pivot);
  const card = new THREE.Group(); card.position.y = REST_Y; pivot.add(card);
  const bodyGeometry = new THREE.ExtrudeGeometry(roundedShape(WIDTH, HEIGHT, .15), { depth: .045, bevelEnabled: true, bevelSize: .015, bevelThickness: .012, bevelSegments: 2, steps: 1, curveSegments: 12 });
  bodyGeometry.translate(0, 0, -.0225);
  const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: 0x333944, metalness: .25, roughness: .43, clearcoat: .18, clearcoatRoughness: .32, envMapIntensity: .45 });
  card.add(new THREE.Mesh(bodyGeometry, bodyMaterial));
  const faceCanvases = [false, true].map(back => {
    const face = document.createElement('canvas'); face.width = 2048; face.height = 3168; drawFace(face, photo, back); return face;
  });
  const textures = faceCanvases.map(face => { const texture = new THREE.CanvasTexture(face); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); return texture; });
  const geometry = faceGeometry();
  textures.forEach((texture, i) => {
    const material = new THREE.MeshPhysicalMaterial({ map: texture, roughness: .64, clearcoat: .12, clearcoatRoughness: .4, envMapIntensity: .2, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: .3 });
    const face = new THREE.Mesh(geometry, material); face.position.z = i ? -.05 : .05; face.rotation.y = i ? Math.PI : 0; card.add(face);
  });
  const metal = new THREE.MeshStandardMaterial({ color: 0xadb4bf, roughness: .28, metalness: .92 });
  const clip = new THREE.Mesh(new THREE.TorusGeometry(.085, .024, 8, 20), metal); clip.position.set(0, HEIGHT / 2 + .09, 0); card.add(clip);
  const clamp = new THREE.Mesh(new THREE.BoxGeometry(.15, .21, .07), metal); clamp.position.set(0, HEIGHT / 2 + .22, 0); card.add(clamp);
  const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x3c414b, roughness: .9, metalness: .04 });
  const straps = [-1, 1].map(side => {
    const curve = new THREE.CubicBezierCurve3(new THREE.Vector3(side * .25, .35, -.05), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(25 * 2 * 3), 3).setUsage(THREE.DynamicDrawUsage));
    const indices = [];
    for (let i = 0; i < 24; i++) { const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    geometry.setIndex(indices);
    const mesh = new THREE.Mesh(geometry, strapMaterial); mesh.frustumCulled = false;
    pivot.add(mesh); return { side, curve, geometry };
  });
  strapMaterial.side = THREE.DoubleSide;
  const clipPoint = new THREE.Vector3(), curvePoint = new THREE.Vector3();
  function updateStraps() {
    card.updateMatrix(); clipPoint.set(0, HEIGHT / 2 + .32, 0).applyMatrix4(card.matrix);
    for (const { side, curve, geometry } of straps) {
      curve.v1.set(side * .25, clipPoint.y * .3, -.04);
      curve.v2.set(clipPoint.x + side * .12, clipPoint.y * .75, clipPoint.z);
      curve.v3.copy(clipPoint);
      const positions = geometry.attributes.position;
      for (let i = 0; i <= 24; i++) {
        curve.getPoint(i / 24, curvePoint);
        positions.setXYZ(i * 2, curvePoint.x - .025, curvePoint.y, curvePoint.z);
        positions.setXYZ(i * 2 + 1, curvePoint.x + .025, curvePoint.y, curvePoint.z);
      }
      positions.needsUpdate = true; geometry.computeVertexNormals();
    }
  }
  updateStraps();
  if (renderer.extensions.has('KHR_parallel_shader_compile')) await renderer.compileAsync(scene, camera);
  else renderer.compile(scene, camera);
  container.append(canvas);
  let disposed = false, frame = 0, visible = false, paused = false;
  let lastTime = 0, time = 0, targetTilt = 0, targetPitch = 0, flipTarget = 0;
  const offset = new THREE.Vector2(), velocity = new THREE.Vector2();
  let viewHeight = 6.4, horizontalLimit = .6;
  let pointer = null;
  const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
  const events = new AbortController();
  const listen = (target, type, handler) => target.addEventListener(type, handler, { signal: events.signal });
  function updateLanguage() {
    faceCanvases.forEach((face, i) => { drawFace(face, photo, Boolean(i)); textures[i].needsUpdate = true; });
    canvas.setAttribute('aria-label', t('card.canvas')); renderOnce();
  }
  listen(document.fonts, 'loadingdone', updateLanguage);
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, false); camera.aspect = width / height;
    // Keep the entire card in frame at narrow sizes, without covering adjacent text.
    viewHeight = Math.max(6.4, 3.35 / camera.aspect);
    camera.position.z = viewHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    horizontalLimit = Math.max(.18, (viewHeight * camera.aspect - WIDTH) / 2 - .16);
    offset.x = THREE.MathUtils.clamp(offset.x, -horizontalLimit, horizontalLimit);
    camera.updateProjectionMatrix(); renderOnce();
  }
  function renderOnce() { if (!disposed) { updateStraps(); renderer.render(scene, camera); } }
  function settling() { return offset.lengthSq() + velocity.lengthSq() > .00001; }
  function canAnimate() { return visible && !document.hidden && !paused && !disposed; }
  function tick(now) {
    frame = 0;
    if (!canAnimate()) return;
    const dt = Math.min((now - (lastTime || now)) / 1000, .033); lastTime = now; time += dt;
    if (!pointer?.dragging) {
      // An underdamped spring returns the displacement through rest, then settles.
      for (let remaining = dt; remaining > 0;) {
        const step = Math.min(remaining, 1 / 120); remaining -= step;
        velocity.x += (-32 * offset.x - 4.6 * velocity.x) * step;
        velocity.y += (-48 * offset.y - 4.2 * velocity.y) * step;
        offset.addScaledVector(velocity, step);
      }
      if (!settling()) { offset.set(0, 0); velocity.set(0, 0); }
    }
    card.position.set(offset.x, REST_Y + offset.y, 0);
    card.rotation.z = THREE.MathUtils.damp(card.rotation.z, -offset.x * .12 + (pointer ? 0 : Math.sin(time * .75) * .008), 8, dt);
    card.rotation.y = THREE.MathUtils.damp(card.rotation.y, flipTarget + targetTilt, 7, dt);
    card.rotation.x = THREE.MathUtils.damp(card.rotation.x, targetPitch, 6, dt);
    renderOnce(); frame = requestAnimationFrame(tick);
  }
  function updateLoop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastTime = 0;
    if (canAnimate()) frame = requestAnimationFrame(tick);
  }
  function hit(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(mouse, camera); return raycaster.intersectObject(card, true).length > 0;
  }
  function grab(event) {
    if (paused || pointer || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0) || (event.currentTarget === canvas && !hit(event))) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, start: offset.clone(), dragging: false, target: event.currentTarget, unit: viewHeight / canvas.getBoundingClientRect().height };
    velocity.set(0, 0); targetTilt = 0; targetPitch = 0;
    event.currentTarget.setPointerCapture(event.pointerId); updateLoop();
  }
  function move(event) {
    if (pointer && event.pointerId === pointer.id) {
      const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
      if (Math.hypot(dx, dy) > 6) pointer.dragging = true;
      if (!pointer.dragging) return;
      // Screen X grows right; world Y grows up. Direct manipulation stays under the pointer.
      offset.set(THREE.MathUtils.clamp(pointer.start.x + dx * pointer.unit, -horizontalLimit, horizontalLimit), THREE.MathUtils.clamp(pointer.start.y - dy * pointer.unit, -.8, .5));
      card.position.set(offset.x, REST_Y + offset.y, 0); renderOnce();
    } else if (event.pointerType === 'mouse' && event.currentTarget === canvas) {
      const rect = canvas.getBoundingClientRect();
      targetTilt = ((event.clientX - rect.left) / rect.width - .5) * .22;
      targetPitch = ((event.clientY - rect.top) / rect.height - .5) * .12;
    }
  }
  function release(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const tap = !pointer.dragging && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 8;
    const target = pointer.target;
    pointer = null;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    if (tap && event.type === 'pointerup' && target === canvas) onFlip();
    updateLoop();
  }
  listen(canvas, 'pointerdown', grab); listen(canvas, 'pointermove', move);
  listen(canvas, 'pointerup', release); listen(canvas, 'pointercancel', release);
  listen(canvas, 'lostpointercapture', () => { if (pointer) { pointer = null; updateLoop(); } });
  listen(canvas, 'keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onFlip(); }
    else if (event.key.toLowerCase() === 'p') { paused = !paused; updateLoop(); }
    else if (event.key === 'ArrowDown' && !paused) {
      event.preventDefault(); offset.y = -.75; velocity.set(0, 0); updateLoop();
    }
  });
  listen(canvas, 'pointerleave', () => { targetTilt = 0; targetPitch = 0; });
  listen(document, 'visibilitychange', updateLoop);
  listen(canvas, 'webglcontextlost', event => { event.preventDefault(); onFallback(); });
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateLoop(); }, { threshold: .05 });
  observer.observe(container); resize();
  return {
    setFlipped(flipped) {
      flipTarget = flipped ? Math.PI : 0;
      if (!canAnimate()) { card.rotation.y = flipTarget; renderOnce(); }
    },
    updateLanguage,
    dispose() {
      if (disposed) return; disposed = true;
      cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect(); events.abort();
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); });
      geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose());
      environment.dispose(); renderer.dispose(); canvas.remove();
    },
  };
}
