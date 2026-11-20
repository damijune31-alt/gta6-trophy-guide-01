// Rendering: checklist rows, the guide detail pane, the roadmap and the missables page.
// The spoiler rule hides a story trophy's name and description until it is earned.
import { saveEarned } from './store.js';

export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
export const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

export const ROADMAP = [
  { stage: 1, title: 'Play the story', text: 'Chapters 1 to 4, the named missions, and the final mission last. Chapter and mission trophies pop as you play — nothing here can be missed.', ids: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 7] },
  { stage: 2, title: 'Strangers & choices', text: 'Finish all stranger strands before the final mission, in case a strand locks after the story ends — the official descriptions do not say, so treat the finale as the point of no return. Choices count toward Actions Speak Louder as you go.', ids: [22, 23, 24, 26, 27, 25, 48] },
  { stage: 3, title: 'Activities & skills', text: 'Try every activity once, then gold the Shooting Range, win the drone races and the 20 different races, and set up the partner and one-time moments (Hot Together, Retail Therapy, Sneakthief, Catch Me If You Can).', ids: [16, 17, 18, 19, 20, 21, 28, 33, 34, 36, 37, 39, 40, 41, 46, 47, 49, 51] },
  { stage: 4, title: 'Collectibles & counts', text: 'Cards, WAiNK It locations, vehicles, areas, garages and the long counts: 250 stunts, 50 challenges, 100 vehicles, $250,000 laundered, $100,000 spent. Pick up everything you pass from the start so this stage is short.', ids: [15, 30, 31, 32, 35, 38, 42, 43, 44, 45, 50, 52, 53, 54, 55] },
  { stage: 5, title: 'Cleanup & platinum', text: '100% Completion, then the platinum. Whatever the checklist still shows open is the cleanup list — the last few percent are almost always collectibles or a counted grind.', ids: [14, 29, 1] },
];

export function isStoryHidden(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function trophyMatches(trophy, filters, earned) {
  if (filters.kind !== 'all') {
    if (filters.kind === 'missable' && !trophy.missable) return false;
    if (filters.kind !== 'missable' && trophy.kind !== filters.kind) return false;
  }
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.hideEarned && earned.has(trophy.id)) return false;
  if (filters.search) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(filters.search)) return false;
  }
  return true;
}

export function renderChecklist(trophies, filters, earned, selectedId, onSelect, onToggle) {
  const rows = document.getElementById('rows');
  rows.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!trophyMatches(t, filters, earned)) continue;
    shown += 1;
    const tr = document.createElement('tr');
    if (t.id === selectedId) tr.classList.add('selected');
    const hidden = isStoryHidden(t, filters.spoiler, earned);
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', () => onToggle(t.id, box.checked));
    box.addEventListener('click', (e) => e.stopPropagation());
    const tdBox = document.createElement('td');
    tdBox.append(box);
    const tdName = document.createElement('td');
    const name = document.createElement('div');
    name.className = 'tname';
    name.textContent = hidden ? 'Hidden trophy' : t.name;
    if (t.missable && !hidden) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = 'MISSABLE';
      name.append(tag);
    }
    if (t.countLabel) {
      const count = document.createElement('span');
      count.className = 'count';
      count.textContent = t.countLabel;
      name.append(count);
    }
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    desc.textContent = hidden ? 'Complete the story to reveal this trophy.' : t.description;
    tdName.append(name, desc);
    const tdGrade = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = `${GRADE_LETTER[t.grade]} · ${t.grade}`;
    tdGrade.append(badge);
    const tdGuide = document.createElement('td');
    tdGuide.className = 'tguide';
    tdGuide.textContent = hidden ? 'Hidden until earned.' : t.guide;
    tr.append(tdBox, tdName, tdGrade, tdGuide);
    tr.addEventListener('click', () => onSelect(t.id));
    rows.append(tr);
  }
  document.getElementById('shownCount').textContent = `Showing ${shown} of ${trophies.length} trophies`;
}

export function renderDetail(trophy, earned, spoilerOn) {
  const pane = document.getElementById('detail');
  pane.replaceChildren();
  const hidden = isStoryHidden(trophy, spoilerOn, earned);
  const h = document.createElement('h2');
  h.textContent = hidden ? 'Hidden trophy' : trophy.name;
  const badge = document.createElement('span');
  badge.className = `badge ${trophy.grade}`;
  badge.textContent = `${GRADE_LETTER[trophy.grade]} · ${trophy.grade}`;
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden ? 'Official description hidden until this trophy is earned.' : `“${trophy.description}” — official description`;
  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.textContent = hidden ? 'Hidden until earned.' : trophy.guide;
  pane.append(h, badge, official, guideTitle, guide);
  if (trophy.missable && !hidden) {
    const note = document.createElement('p');
    note.className = 'note';
    note.textContent = 'Missable: tied to a single story moment or a setup you can fail. If you miss it, set it up again or replay the moment — it is not lost for good.';
    pane.append(note);
  }
  if (trophy.countLabel) {
    const countTitle = document.createElement('h3');
    countTitle.textContent = 'PSN target';
    const count = document.createElement('p');
    count.textContent = trophy.countLabel;
    pane.append(countTitle, count);
  }
  const srcTitle = document.createElement('h3');
  srcTitle.textContent = 'Sources';
  const list = document.createElement('ul');
  for (const s of trophy.sources) {
    const li = document.createElement('li');
    li.textContent = s;
    list.append(li);
  }
  pane.append(srcTitle, list);
  const stage = ROADMAP.find((s) => s.ids.includes(trophy.id));
  if (stage) {
    const stageTitle = document.createElement('h3');
    stageTitle.textContent = 'Roadmap';
    const stageText = document.createElement('p');
    stageText.textContent = `Stage ${stage.stage} — ${stage.title}.`;
    pane.append(stageTitle, stageText);
  }
}

export function renderRoadmap(trophies, earned) {
  const host = document.getElementById('roadmap');
  host.replaceChildren();
  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP) {
    const card = document.createElement('div');
    card.className = 'stage';
    const h = document.createElement('h2');
    const num = document.createElement('span');
    num.textContent = `Stage ${stage.stage} — `;
    h.append(num, document.createTextNode(stage.title));
    const p = document.createElement('p');
    p.textContent = stage.text;
    const chips = document.createElement('div');
    chips.className = 'chips';
    for (const id of stage.ids) {
      const t = byId.get(id);
      if (!t) continue;
      const chip = document.createElement('span');
      chip.className = `chip${earned.has(id) ? ' done' : ''}`;
      chip.textContent = `${earned.has(id) ? '✓ ' : ''}${t.name} (${GRADE_LETTER[t.grade]})`;
      chips.append(chip);
    }
    card.append(h, p, chips);
    host.append(card);
  }
}

export function renderMissables(trophies, earned, onSelect) {
  const host = document.getElementById('missables');
  host.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const card = document.createElement('div');
    card.className = 'miss';
    const h = document.createElement('h2');
    h.textContent = `${t.name} `;
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = GRADE_LETTER[t.grade];
    h.append(badge);
    if (earned.has(t.id)) {
      const done = document.createElement('span');
      done.className = 'tag';
      done.textContent = 'EARNED';
      h.append(done);
    }
    const p = document.createElement('p');
    p.textContent = t.guide;
    const why = document.createElement('p');
    why.className = 'tdesc';
    why.textContent = `Official description: “${t.description}”`;
    card.append(h, p, why);
    card.addEventListener('click', () => onSelect(t.id));
    card.style.cursor = 'pointer';
    host.append(card);
  }
}
