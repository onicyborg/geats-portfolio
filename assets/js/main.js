import { PROJECTS } from './projects-data.js';
import { getLanguage, setLanguage, t, translate } from './i18n.js';

const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const copy = (key, tag = 'span', attrs = '') => `<${tag} data-i18n="${key}" ${attrs}>${escape(t(key))}</${tag}>`;
const tags = keys => keys.map(key => copy(key, 'li')).join('');
const tech = items => items.map(item => `<li>${escape(item)}</li>`).join('');
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';

const skills = [
  ['skills.core', ['PHP', 'Laravel', 'TypeScript', 'Nest.js', 'Prisma ORM'], ['tag.backend', 'tag.eloquent', 'tag.types']],
  ['skills.system', ['Linux Ubuntu', 'Kali Linux', 'Bash'], ['tag.environment', 'tag.dual', 'tag.bash']],
  ['skills.database', ['DBeaver', 'Bruno', 'Burp Suite', 'PostgreSQL', 'MySQL'], ['tag.relational', 'tag.apiTest', 'tag.penTest']],
  ['skills.workflow', ['GitHub CLI', 'Windsurf', 'Vercel', 'Swagger'], ['tag.version', 'tag.ai']],
];
$('#skills-table').innerHTML = skills.map(([title, tools, labels]) => `<article class="skill-row reveal">${copy(title, 'h3')}<div><p class="tools">${tools.map(escape).join(' <span aria-hidden="true">/</span> ')}</p><ul class="skill-tags">${tags(labels)}</ul></div></article>`).join('');
$('#skills-notes').innerHTML = [
  ['skills.special', 'skills.card5desc', [], ['tag.analysis', 'tag.qa', 'tag.prompt', 'tag.testCase', 'tag.bugLog']],
  ['skills.mobileTitle', 'skills.mobileDesc', ['Flutter', 'Dart'], ['tag.cross', 'tag.responsive', 'tag.codebase']],
].map(([title, description, tools, labels]) => `<article class="skill-note reveal"><span class="note-mark" aria-hidden="true">+</span>${copy(title, 'h3')}${copy(description, 'p')}${tools.length ? `<p class="tools">${tools.join(' <span aria-hidden="true">/</span> ')}</p>` : ''}<ul class="skill-tags">${tags(labels)}</ul></article>`).join('');
$('#services-list').innerHTML = [
  ['Laravel', 'PHP', 'Nest.js', 'Next.js', 'MySQL', 'PostgreSQL', 'REST API'],
  ['Nest.js', 'Laravel', 'Go', 'MySQL', 'PostgreSQL', 'REST API'],
  ['Flutter', 'Dart', 'tag.cross'],
  ['tag.bugFix', 'tag.integration', 'tag.architecture'],
].map((tools, i) => `<article class="service-row reveal"><span class="mono service-number" aria-hidden="true">${['A', 'B', 'C', 'D'][i]}</span>${copy(`svc${i + 1}.title`, 'h3')}<div>${copy(`svc${i + 1}.desc`, 'p')}<ul class="tech-list">${tools.map(tool => tool.startsWith('tag.') ? copy(tool, 'li') : `<li>${tool}</li>`).join('')}</ul></div></article>`).join('');
$('#timeline').innerHTML = [
  ['Papanclip', 'role.backend', 'exp.current', 'exp.team'],
  ['Altimeda Cipta Visitama', 'role.quality', 'exp.current'],
  ['exp.freelance', 'role.independent', 'exp.current'],
  ['Ismart Inter Global', 'role.quality', 'exp.past'],
  ['Ismart Inter Global', 'role.php', 'exp.past'],
  ['KAI DAOP 5 Purwokerto', 'role.intern', 'exp.internship'],
].map(([company, role, state, team], i) => `<article class="experience-item reveal"><div class="experience-meta">${copy(`exp${i + 1}.period`)}${copy(state, 'span', `class="state ${state === 'exp.current' ? 'current' : ''}"`)}</div>${company.startsWith('exp.') ? copy(company, 'h3') : `<h3>${company}</h3>`}${copy(role, 'p', 'class="experience-role"')}${team ? copy(team, 'p', 'class="team"') : ''}${copy(`exp${i + 1}.desc`, 'p', 'class="experience-description"')}</article>`).join('');

$('#projects-list').innerHTML = PROJECTS.map(project => `<button type="button" class="project-card" data-project="${project.slug}" aria-haspopup="dialog"><span class="project-heading"><span class="project-kicker">${copy('projects.label')} / ${project.number}</span><span class="project-name" id="name-${project.slug}">${escape(project.title)}</span></span><span><span class="project-summary" data-i18n="${project.summary}">${escape(t(project.summary))}</span><span class="project-tech">${project.tech.map(tool => `<span>${escape(tool)}</span>`).join('')}</span></span><span class="project-open">${copy('projects.open')}${arrow}</span></button>`).join('');

const menu = $('.menu-toggle');
const navigation = $('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open); });
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const dialog = $('#project-dialog');
const lightbox = $('#lightbox');
let activeProject = 0;
let projectTrigger = null;
let galleryVersion = 0;
let closeTimer;
let imageTrigger;
let returnHash = '#projects';

function lockScroll() { document.body.classList.toggle('scroll-locked', dialog.open || lightbox.open); }
function screenshotLabel(project, i) { return t('projects.screenshot', { title: project.title, number: String(i + 1).padStart(2, '0') }); }
function loadGallery(project) {
  const version = ++galleryVersion;
  document.querySelectorAll('.screenshot-slot').forEach((slot, i) => {
    const image = new Image(1600, 1000);
    image.loading = 'lazy'; image.decoding = 'async'; image.alt = screenshotLabel(project, i);
    image.onload = () => {
      if (version !== galleryVersion || !slot.isConnected) return;
      // Missing files are served as a transparent 1px SVG by serve.json / vercel.json.
      if (image.naturalWidth <= 1) { slot.querySelector('small').textContent = t('projects.empty'); image.remove(); return; }
      slot.querySelector('.slot-placeholder').hidden = true;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'screenshot-button';
      button.setAttribute('aria-label', t('projects.enlarge', { title: project.title, number: String(i + 1).padStart(2, '0') }));
      button.append(image); slot.append(button);
      button.addEventListener('click', () => {
        imageTrigger = button;
        $('#lightbox-image').src = image.src; $('#lightbox-image').alt = image.alt;
        $('#lightbox-title').textContent = image.alt;
        lightbox.showModal(); lockScroll(); $('#close-lightbox').focus();
      });
    };
    image.onerror = () => { if (version === galleryVersion && slot.isConnected) { slot.querySelector('small').textContent = t('projects.imageError'); image.remove(); } };
    // Hidden images still need a rendered box for native lazy loading to start.
    image.style.cssText = 'position:absolute;inset:0;opacity:0;pointer-events:none';
    slot.append(image);
    image.addEventListener('load', () => { image.removeAttribute('style'); }, { once: true });
    image.src = project.screenshots[i];
  });
}
function renderProject() {
  const project = PROJECTS[activeProject];
  const actions = [['live', 'projects.live'], ['repo', 'projects.repo']]
    .filter(([key]) => project.links[key])
    .map(([key, label]) => `<a class="button ${key === 'live' ? 'primary' : 'secondary'}" href="${escape(project.links[key])}" target="_blank" rel="noopener noreferrer">${escape(t(label))}</a>`);
  const hasPrivateAccess = !project.links.live || !project.links.repo;
  const privateNotice = hasPrivateAccess ? copy(project.links.live ? 'projects.privateSource' : 'projects.private', 'p', 'class="project-private"') : '';
  if (hasPrivateAccess) {
    const subject = encodeURIComponent(t('projects.contactSubject', { title: project.title }));
    actions.push(`<a class="button secondary" href="mailto:akhmadfauzy40@gmail.com?subject=${subject}">${escape(t('projects.contact'))}</a>`);
  }
  $('#project-number').textContent = `${t('projects.label')} / ${project.number}`;
  $('#project-position').textContent = `${activeProject + 1} / ${PROJECTS.length}`;
  $('#project-content').innerHTML = `<h2 id="project-title" tabindex="-1">${escape(project.title)}</h2>${copy(project.summary, 'p', 'class="modal-summary"')}<div class="modal-details"><div>${copy('projects.features', 'h3')}<ul class="features-list">${tags(project.features)}</ul></div><div>${copy('projects.stack', 'h3')}<ul class="tech-list">${tech(project.tech)}</ul>${project.role ? `<div class="project-role">${copy('projects.role', 'h3')}${copy(project.role, 'p')}</div>` : ''}</div></div>${copy('projects.gallery', 'h3', 'class="gallery-heading"')}<div class="gallery">${project.screenshots.map((path, i) => `<div class="screenshot-slot"><div class="slot-placeholder"><span class="mono">${escape(t('projects.slot', { number: String(i + 1).padStart(2, '0') }))}</span><small>${escape(t('projects.loading'))}</small></div></div>`).join('')}</div>${privateNotice}<div class="modal-actions">${actions.join('')}</div>`;
  loadGallery(project);
}
function openProject(index, trigger, updateHistory = true) {
  clearTimeout(closeTimer); dialog.classList.remove('closing');
  activeProject = index;
  if (!dialog.open) { projectTrigger = trigger || document.querySelector(`[data-project="${PROJECTS[index].slug}"]`); returnHash = location.hash.startsWith('#project=') ? '#projects' : location.hash; }
  renderProject();
  if (!dialog.open) dialog.showModal();
  lockScroll(); dialog.scrollTop = 0; $('#project-title').focus({ preventScroll: true });
  if (updateHistory) history.pushState({ portfolioProject: true, returnHash }, '', `#project=${PROJECTS[index].slug}`);
}
function finishClose() {
  dialog.classList.remove('closing');
  if (lightbox.open) lightbox.close();
  dialog.close(); lockScroll(); galleryVersion++;
  projectTrigger?.focus({ preventScroll: true });
}
function closeProject(updateHistory = true) {
  if (!dialog.open || dialog.classList.contains('closing')) return;
  if (updateHistory) {
    if (history.state?.portfolioProject) history.back();
    else history.replaceState(null, '', `${location.pathname}${location.search}${returnHash || '#projects'}`);
  }
  if (reducedMotion.matches) finishClose();
  else { dialog.classList.add('closing'); closeTimer = setTimeout(finishClose, 150); }
}
function syncHash() {
  const slug = location.hash.startsWith('#project=') ? location.hash.slice(9) : '';
  const index = PROJECTS.findIndex(project => project.slug === slug);
  if (index >= 0) { if (!dialog.open || activeProject !== index || dialog.classList.contains('closing')) openProject(index, null, false); }
  else closeProject(false);
}
$('#projects-list').addEventListener('click', event => { const button = event.target.closest('[data-project]'); if (button) openProject(PROJECTS.findIndex(project => project.slug === button.dataset.project), button); });
$('[data-close-project]').addEventListener('click', () => closeProject());
dialog.addEventListener('cancel', event => { event.preventDefault(); closeProject(); });
function backdropClose(element, action) {
  let beganOutside = false;
  const outside = event => { const r = element.getBoundingClientRect(); return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
  element.addEventListener('pointerdown', event => { beganOutside = event.target === element && outside(event); });
  element.addEventListener('click', event => { if (beganOutside && event.target === element && outside(event)) action(); beganOutside = false; });
}
backdropClose(dialog, () => closeProject());
function closeLightbox() { lightbox.close(); lockScroll(); imageTrigger?.focus(); }
$('#close-lightbox').addEventListener('click', closeLightbox);
lightbox.addEventListener('cancel', event => { event.preventDefault(); closeLightbox(); });
backdropClose(lightbox, closeLightbox);
for (const modal of [dialog, lightbox]) {
  modal.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusables = [...modal.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(el => el.getClientRects().length);
    const first = focusables[0], last = focusables.at(-1);
    if (event.shiftKey && (document.activeElement === first || !focusables.includes(document.activeElement))) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
}
function navigateProject(direction) {
  activeProject = (activeProject + direction + PROJECTS.length) % PROJECTS.length;
  history.replaceState(history.state, '', `#project=${PROJECTS[activeProject].slug}`);
  renderProject(); dialog.scrollTop = 0; $('#project-title').focus({ preventScroll: true });
}
$('#previous-project').addEventListener('click', () => navigateProject(-1));
$('#next-project').addEventListener('click', () => navigateProject(1));
window.addEventListener('hashchange', syncHash);
document.addEventListener('languagechange', () => { if (dialog.open) renderProject(); });
setLanguage(getLanguage());
syncHash();

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(element => { if (!reducedMotion.matches) element.classList.add('is-pending'); revealObserver.observe(element); });
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) document.querySelectorAll('.is-pending').forEach(el => el.classList.remove('is-pending')); });
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { navigation.querySelectorAll('a').forEach(a => { if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }
}), { rootMargin: '-15% 0px -65% 0px' });
document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));

let sceneController;
let flipped = false;
let sceneGeneration = 0;
function updateCardUI() {
  $('#id-front').hidden = flipped; $('#id-back').hidden = !flipped;
  translate($('.identity-stage'));
}
function flipCard() { flipped = !flipped; sceneController?.setFlipped(flipped); updateCardUI(); }
const fallbackCard = $('#card-fallback');
fallbackCard.tabIndex = 0;
fallbackCard.setAttribute('role', 'button');
fallbackCard.dataset.i18nAria = 'card.static';
fallbackCard.addEventListener('click', flipCard);
fallbackCard.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flipCard(); }
});
function staticCard() {
  sceneController?.dispose(); sceneController = null;
  $('#card-fallback').hidden = false; updateCardUI();
}
async function startScene() {
  const generation = ++sceneGeneration;
  staticCard();
  if (reducedMotion.matches || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) return;
  try {
    const { createCardScene } = await import('./scene.js');
    if (generation !== sceneGeneration || reducedMotion.matches) return;
    const canvas = document.createElement('canvas');
    const attributes = { alpha: true, antialias: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true };
    const context = canvas.getContext('webgl2', attributes) || canvas.getContext('webgl', attributes);
    if (!context) return;
    // Reuse the capability check's context instead of paying for a second GPU initialization.
    const controller = await createCardScene($('#card-stage'), { canvas, context, onFlip: flipCard, onFallback: staticCard });
    if (generation !== sceneGeneration || reducedMotion.matches) { controller.dispose(); return; }
    sceneController = controller; controller.setFlipped(flipped);
    $('#card-fallback').hidden = true; updateCardUI();
  } catch { staticCard(); }
}
document.addEventListener('languagechange', () => { updateCardUI(); sceneController?.updateLanguage(); });
reducedMotion.addEventListener('change', startScene);
window.addEventListener('pagehide', () => { sceneGeneration++; staticCard(); });
window.addEventListener('pageshow', event => { if (event.persisted) startScene(); });
if ('requestIdleCallback' in window) requestIdleCallback(startScene, { timeout: 1800 });
else setTimeout(startScene, 100);
