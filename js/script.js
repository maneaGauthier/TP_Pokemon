const API_BASE = 'https://pokebuildapi.fr/api/v1';

const key = (s) =>
  (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const TYPE_COLORS = {
  plante:   '#6dbf76',
  poison:   '#b666d2',
  feu:      '#fb923c',
  eau:      '#60a5fa',
  electrik: '#fcd34d',
  insecte:  '#9bd14b',
  normal:   '#b9b9b9',
  sol:      '#e0b26d',
  roche:    '#c7b78b',
  fee:      '#f5a1d8',
  combat:   '#ef4444',
  psy:      '#f472b6',
  spectre:  '#7c3aed',
  glace:    '#93c5fd',
  dragon:   '#60a5fa',
  acier:    '#9ca3af',
  vol:      '#93c5fd',
  tenebres: '#475569'
};

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
};
const relLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map(v => v / 255);
  const lin = srgb.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};
const bestTextColor = (bg) => (relLuminance(bg) > 0.5 ? '#111827' : '#ffffff');

function themeFromTypes(types = []) {
  const first = key(types[0]?.name);
  const second = key(types[1]?.name);
  const c1 = TYPE_COLORS[second] || TYPE_COLORS[first] || 'lightgray';
  return { cardBg: c1, border: c1, picture: `${c1}33` };
}

function buildCard(p) {
  const article = document.createElement('article');
  const typesArr = Array.isArray(p.apiTypes) ? p.apiTypes : [];
  const typesIcons = typesArr.map(t => `<img src="${t.image}" alt="${t.name}" title="${t.name}">`).join('');
  article.innerHTML = `
    <figure>
      <picture><img src="${p.image}" alt="Image ${p.name}" /></picture>
      <figcaption>
        <h2>${p.name}</h2>
        <ol>
          <li>Points de vie : ${p.stats?.HP ?? '-'}</li>
          <li>Attaque : ${p.stats?.attack ?? '-'}</li>
          <li>Défense : ${p.stats?.defense ?? '-'}</li>
          <li>Attaque spécial : ${p.stats?.special_attack ?? '-'}</li>
          <li>Vitesse : ${p.stats?.speed ?? '-'}</li>
        </ol>
        <div class="type-icons">${typesIcons}</div>
      </figcaption>
    </figure>
  `;
  const theme = themeFromTypes(typesArr);
  article.style.background = theme.cardBg;
  article.style.borderColor = theme.border;
  article.querySelector('picture').style.backgroundColor = theme.picture;
  article.style.boxShadow = `-1px 2px 13px 0 rgba(0,0,0,.74), 0 0 0 6px ${theme.border}33 inset`;
  return article;
}

function renderCards(pokemons) {
  const main = document.querySelector('main');
  main.innerHTML = '';
  pokemons.forEach(p => main.appendChild(buildCard(p)));
}

const cacheByGen = new Map();

const fetchByGeneration = async (gen) => {
  if (cacheByGen.has(gen)) return cacheByGen.get(gen);
  const url = `${API_BASE}/pokemon/generation/${gen}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  cacheByGen.set(gen, data);
  return data;
};

const fetchAllGenerations = async () => {
  const gens = Array.from({ length: 8 }, (_, i) => i + 1);
  const data = await Promise.all(gens.map(g => fetchByGeneration(g)));
  return data.flat();
};

const unique = (list) => {
  const map = new Map();
  list.forEach(p => { if (!map.has(p.pokedexId)) map.set(p.pokedexId, p); });
  return [...map.values()];
};

const deriveTypes = (list) => {
  const m = new Map();
  list.forEach(p =>
    (p.apiTypes || []).forEach(t => {
      const k = key(t.name);
      if (!m.has(k)) m.set(k, { k, label: t.name, color: TYPE_COLORS[k] || '#d1d5db' });
    })
  );
  return [...m.values()].sort((a, b) => a.label.localeCompare(b.label, 'fr'));
};

const filterByTypesAND = (selSet) => (list) =>
  selSet.size === 0
    ? list
    : list.filter(p => {
        const ks = new Set((p.apiTypes || []).map(t => key(t.name)));
        for (const t of selSet) if (!ks.has(t)) return false;
        return true;
      });

const stat = (p, k) => Number(p?.stats?.[k] ?? 0);
const cmpStr = (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' });
const cmpNum = (a, b) => a - b;

const sortByKey = (sortKey) => (list) => {
  if (sortKey === 'none') return list.slice();
  const arr = [...list];
  const by = {
    name:    (p) => p.name || '',
    hp:      (p) => stat(p, 'HP'),
    attack:  (p) => stat(p, 'attack'),
    defense: (p) => stat(p, 'defense'),
    speed:   (p) => stat(p, 'speed')
  }[sortKey] || ((p) => p.name || '');
  const cmp = (a, b) => {
    const va = by(a), vb = by(b);
    return typeof va === 'number' ? cmpNum(va, vb) : cmpStr(String(va), String(vb));
  };
  return arr.sort(cmp);
};

const pipeline = (selTypes, sortK) => (list) =>
  sortByKey(sortK)( filterByTypesAND(selTypes)( list ) );

function renderTypeChips(types, selectedSet) {
  const container = document.querySelector('#typeChips');
  container.innerHTML = '';
  const mkBtn = (label, value, color) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.type = 'button';
    btn.dataset.type = value;
    btn.textContent = label;
    btn.setAttribute('aria-pressed', String(selectedSet.has(value)));
    if (color) {
      btn.style.background = color;
      btn.style.borderColor = color;
      btn.style.color = bestTextColor(color);
    }
    if (selectedSet.has(value)) btn.classList.add('active');
    return btn;
  };
  const allActive = selectedSet.size === 0;
  const allBtn = mkBtn('Tous', '__ALL__', '#e5e7eb');
  allBtn.classList.toggle('active', allActive);
  allBtn.setAttribute('aria-pressed', String(allActive));
  container.appendChild(allBtn);
  types.forEach(t => container.appendChild(mkBtn(t.label, t.k, t.color)));
}

const State = {
  gen: '1',
  selTypes: new Set(),
  sortKey: 'none'
};

async function loadAndRender() {
  const main = document.querySelector('main');
  main.innerHTML = '<p style="padding:2rem">Chargement…</p>';
  try {
    const raw = State.gen === 'all' ? await fetchAllGenerations() : await fetchByGeneration(parseInt(State.gen, 10));
    const base = unique(raw);
    const types = deriveTypes(base);
    const valid = new Set(types.map(t => t.k));
    State.selTypes = new Set([...State.selTypes].filter(k => valid.has(k)));
    renderTypeChips(types, State.selTypes);
    const result = pipeline(State.selTypes, State.sortKey)(base);
    main.innerHTML = '';
    if (result.length === 0) {
      main.innerHTML = `<p style="padding:2rem">Aucun Pokémon ne correspond à ces filtres.</p>`;
      return;
    }
    renderCards(result);
  } catch (e) {
    console.error(e);
    main.innerHTML = `<p style="padding:2rem">Impossible de charger la génération ${State.gen === 'all' ? 'toutes' : State.gen}.</p>`;
  }
}

function setupUI() {
  const genSelect  = document.querySelector('#generationSelect');
  const sortSelect = document.querySelector('#sortSelect');
  const chips      = document.querySelector('#typeChips');

  if (!genSelect.options.length) {
    const optAll = document.createElement('option');
    optAll.value = 'all';
    optAll.textContent = 'Toutes les générations';
    genSelect.appendChild(optAll);
    for (let g = 1; g <= 8; g++) {
      const opt = document.createElement('option');
      opt.value = String(g);
      opt.textContent = `Génération ${g}`;
      genSelect.appendChild(opt);
    }
  }
  genSelect.value = String(State.gen);

  const sortOptions = [
    { value: 'none',    label: 'Par défaut (ordre API)' },
    { value: 'name',    label: 'Nom' },
    { value: 'hp',      label: 'Points de vie' },
    { value: 'attack',  label: 'Attaque' },
    { value: 'defense', label: 'Défense' },
    { value: 'speed',   label: 'Vitesse' }
  ];
  if (!sortSelect.options.length) {
    sortOptions.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      sortSelect.appendChild(opt);
    });
  }
  sortSelect.value = State.sortKey;

  genSelect.addEventListener('change', (e) => {
    const v = e.target.value;
    State.gen = v === 'all' ? 'all' : String(parseInt(v, 10));
    loadAndRender();
  });

  sortSelect.addEventListener('change', (e) => {
    State.sortKey = e.target.value;
    loadAndRender();
  });

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('button.chip');
    if (!btn) return;
    const value = btn.dataset.type;
    if (value === '__ALL__') {
      State.selTypes.clear();
    } else {
      if (State.selTypes.has(value)) State.selTypes.delete(value);
      else State.selTypes.add(value);
    }
    loadAndRender();
  });
}

setupUI();
loadAndRender();
