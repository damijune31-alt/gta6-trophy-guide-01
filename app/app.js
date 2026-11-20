// Leonida Legend boot: loads the trophy list, wires the tracker, tabs and filters,
// and reads screenshot presets from the URL (?view, ?detail, ?seed, ?spoiler, ?kind, ?grade).
import { loadEarned, saveEarned, seedEarned, downloadProgress, readProgressFile } from './store.js';
import { renderChecklist, renderDetail, renderRoadmap, renderMissables } from './views.js';

const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = loadEarned();
if (params.has('seed')) {
  const n = Number(params.get('seed'));
  if (Number.isInteger(n) && n > 0) earned = seedEarned(Math.min(n, trophies.length));
}

const filters = {
  search: '',
  kind: params.get('kind') ?? 'all',
  grade: params.get('grade') ?? 'all',
  spoiler: params.get('spoiler') === 'on',
  hideEarned: false,
};
let selectedId = Number(params.get('detail') ?? 15);
if (!trophies.some((t) => t.id === selectedId)) selectedId = trophies[0].id;
let view = params.get('view') ?? 'checklist';
if (!['checklist', 'roadmap', 'missables'].includes(view)) view = 'checklist';

const searchInput = document.getElementById('search');
const kindSelect = document.getElementById('kind');
const gradeSelect = document.getElementById('grade');
const spoilerBox = document.getElementById('spoiler');
const hideEarnedBox = document.getElementById('hideEarned');
kindSelect.value = filters.kind;
gradeSelect.value = filters.grade;
spoilerBox.checked = filters.spoiler;

function updateScore() {
  const total = trophies.length;
  const counts = { platinum: [0, 1], gold: [0, 2], silver: [0, 6], bronze: [0, 46] };
  for (const t of trophies) if (earned.has(t.id)) counts[t.grade][0] += 1;
  document.getElementById('earnedCount').textContent = `${earned.size} of ${total} earned`;
  document.getElementById('earnedBar').style.width = `${Math.round((earned.size / total) * 100)}%`;
  document.getElementById('gradeCounts').textContent =
    `P ${counts.platinum[0]}/${counts.platinum[1]} · G ${counts.gold[0]}/${counts.gold[1]} · S ${counts.silver[0]}/${counts.silver[1]} · B ${counts.bronze[0]}/${counts.bronze[1]}`;
}

function showView(name) {
  view = name;
  for (const tab of document.querySelectorAll('#tabs button')) {
    tab.classList.toggle('active', tab.dataset.view === name);
  }
  for (const section of document.querySelectorAll('.view')) section.hidden = section.id !== `view-${name}`;
  render();
}

function render() {
  updateScore();
  if (view === 'roadmap') renderRoadmap(trophies, earned);
  else if (view === 'missables') renderMissables(trophies, earned, (id) => { selectedId = id; showView('checklist'); });
  else {
    renderChecklist(trophies, filters, earned, selectedId, (id) => { selectedId = id; render(); }, (id, on) => {
      if (on) earned.add(id);
      else earned.delete(id);
      saveEarned(earned);
      render();
    });
    const selected = trophies.find((t) => t.id === selectedId) ?? trophies[0];
    renderDetail(selected, earned, filters.spoiler);
  }
}

for (const tab of document.querySelectorAll('#tabs button')) {
  tab.addEventListener('click', () => showView(tab.dataset.view));
}
searchInput.addEventListener('input', () => { filters.search = searchInput.value.trim().toLowerCase(); render(); });
kindSelect.addEventListener('change', () => { filters.kind = kindSelect.value; render(); });
gradeSelect.addEventListener('change', () => { filters.grade = gradeSelect.value; render(); });
spoilerBox.addEventListener('change', () => { filters.spoiler = spoilerBox.checked; render(); });
hideEarnedBox.addEventListener('change', () => { filters.hideEarned = hideEarnedBox.checked; render(); });
document.getElementById('export').addEventListener('click', () => downloadProgress(earned));
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    earned = await readProgressFile(file);
    saveEarned(earned);
  } catch {
    alert('That file is not a Leonida Legend progress export.');
  }
  render();
});

showView(view);
