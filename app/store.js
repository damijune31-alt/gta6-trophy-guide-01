// Progress saved in the browser (localStorage), exportable to a file and importable back.
export const STORE_KEY = 'leonida-legend-progress-v1';

// The demo seed: the first story beats and the easiest activities, in list order.
export const SEED_IDS = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 16, 20, 21];

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list.filter((n) => typeof n === 'number') : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function seedEarned(count) {
  const earned = new Set(SEED_IDS.slice(0, count));
  saveEarned(earned);
  return earned;
}

export function downloadProgress(earned) {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-legend-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function readProgressFile(file) {
  const data = JSON.parse(await file.text());
  const list = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(list)) throw new Error('not a progress file');
  return new Set(list.filter((n) => typeof n === 'number'));
}
