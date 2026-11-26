// ============ SETTINGS (edit these) ============
const SETTINGS = {
  friendName: 'bestie',          // shown in greetings
  fromName: 'Sofi',
  whatsapp: '',                  // your number for replies, international format without + or spaces, e.g. '4366012345678'
  year: 2026,
  peekKey: 'plopsecret'          // open any page with ?peek=plopsecret on YOUR phone to preview locked days
};

// ============ THE 24 DAYS ============
// slug = the page file name (slug.html) and the URL on the NFC chip
// outfit = colour of Plop's hat + scarf on that day's sticker
const DAYS = [
  { n: 1,  slug: '5fwyd', title: 'Welcome + a gift',         outfit: '#B5473A', sticker: 'Classic Plop' },
  { n: 2,  slug: '5uveu', title: 'Would you rather',          outfit: '#4F7A55', sticker: 'Pine Plop' },
  { n: 3,  slug: '6fgtf', title: 'Bucket list',               outfit: '#5B7FB0', sticker: 'Traveller Plop' },
  { n: 4,  slug: '6q6h7', title: 'A playlist for you',        outfit: '#8C6FA8', sticker: 'DJ Plop' },
  { n: 5,  slug: '7qbpw', title: 'Your birth chart',          outfit: '#2F3A66', sticker: 'Cosmic Plop' },
  { n: 6,  slug: '7yjxp', title: 'Pigeon Crossy Road',        outfit: '#E9B84A', sticker: 'Road Plop' },
  { n: 7,  slug: '8chem', title: 'A coupon',                  outfit: '#C98A5A', sticker: 'Latte Plop' },
  { n: 8,  slug: '8k8rb', title: 'Puzzle day',                outfit: '#6E8B3D', sticker: 'Thinking Plop' },
  { n: 9,  slug: '8myyp', title: 'Moodboard',                 outfit: '#D98BA6', sticker: 'Aesthetic Plop' },
  { n: 10, slug: '97b5r', title: 'Guess who texted this',     outfit: '#4A4A58', sticker: 'Detective Plop' },
  { n: 11, slug: 'ct396', title: 'Messages for you',          outfit: '#E07A5F', sticker: 'Mail Plop' },
  { n: 12, slug: 'e79he', title: 'Top 5 unhinged moments',    outfit: '#9B2D5C', sticker: 'Chaos Plop' },
  { n: 13, slug: 'et9px', title: 'Which pigeon are you?',     outfit: '#7FB7BE', sticker: 'Quiz Plop' },
  { n: 14, slug: 'hgfc7', title: 'Draw a card',               outfit: '#5A3E7A', sticker: 'Mystic Plop' },
  { n: 15, slug: 'hmdw5', title: 'The friendship awards',     outfit: '#D4A017', sticker: 'Award Plop' },
  { n: 16, slug: 'jk96f', title: 'Plop Casino',               outfit: '#1F6B4A', sticker: 'High-roller Plop' },
  { n: 17, slug: 'jp8rw', title: 'Plopdle',                   outfit: '#6AAA64', sticker: 'Wordle Plop' },
  { n: 18, slug: 'k4f6u', title: 'Our timeline',              outfit: '#A0522D', sticker: 'Memory Plop' },
  { n: 19, slug: 'mfksd', title: 'Remember when…',            outfit: '#C9A0DC', sticker: 'Nostalgic Plop' },
  { n: 20, slug: 'ura22', title: 'Spot the pigeon',           outfit: '#3E7CB1', sticker: 'Hidden Plop' },
  { n: 21, slug: 'vmtgm', title: 'Inside jokes dictionary',   outfit: '#F28C28', sticker: 'Scholar Plop' },
  { n: 22, slug: 'vvdtn', title: 'Things I love about you',   outfit: '#E05A7A', sticker: 'Heart Plop' },
  { n: 23, slug: 'wu552', title: 'Flappy Pigeon',             outfit: '#2E86AB', sticker: 'Flying Plop' },
  { n: 24, slug: 'wu9xm', title: 'Merry Christmas',           outfit: '#C8A951', sticker: 'Golden Plop' }
];

// ============ HELPERS ============
const store = {
  get(k, d) { try { const v = localStorage.getItem('plop.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('plop.' + k, JSON.stringify(v)); } catch (e) {} }
};

function isPeek() {
  const p = new URLSearchParams(location.search).get('peek');
  if (p === SETTINGS.peekKey) store.set('peek', true);
  if (p === 'off') store.set('peek', false);
  return store.get('peek', false);
}

// Which day of December is it in Vienna? 0 = before Dec 1, 25 = after Dec 24
function todayNumber() {
  const s = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(new Date()); // YYYY-MM-DD
  const [y, m, d] = s.split('-').map(Number);
  if (y < SETTINGS.year || (y === SETTINGS.year && m < 12)) return 0;
  if (y > SETTINGS.year) return 25;
  return Math.min(d, 25);
}

function isUnlocked(n) { return isPeek() || todayNumber() >= n; }
function dayByNumber(n) { return DAYS.find(d => d.n === n); }
function opened() { return store.get('opened', []); }

function dateLabel(n) {
  const d = new Date(Date.UTC(SETTINGS.year, 11, n, 12));
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
}

function whatsappLink(text) {
  const base = SETTINGS.whatsapp ? 'https://wa.me/' + SETTINGS.whatsapp : 'https://wa.me/';
  return base + '?text=' + encodeURIComponent(text);
}

// Best scores for the pigeon games: saveBest('crossy', 42)
function saveBest(game, score) {
  const best = store.get('best', {});
  if (!(game in best) || score > best[game]) { best[game] = score; store.set('best', best); return true; }
  return false;
}
function getBest(game) { return store.get('best', {})[game]; }

function toast(html) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = html;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3800);
}

function snow(count = 28) {
  const layer = document.createElement('div');
  layer.className = 'snow';
  for (let i = 0; i < count; i++) {
    const f = document.createElement('i');
    f.style.left = Math.random() * 100 + 'vw';
    f.style.animationDuration = 7 + Math.random() * 9 + 's';
    f.style.animationDelay = -Math.random() * 16 + 's';
    const s = Math.random() < .3 ? 6 : 4;
    f.style.width = f.style.height = s + 'px';
    layer.appendChild(f);
  }
  document.body.prepend(layer);
}

// ============ DAY PAGE ============
function initDay() {
  const n = Number(document.body.dataset.day);
  const day = dayByNumber(n);
  snow();

  const unlocked = isUnlocked(n);
  const head = document.getElementById('day-head');
  head.innerHTML = `
    <a class="back" href="./">&larr; calendar</a>
    <div class="day-badge">Day ${n}</div>
    <div class="plop-sm" id="plop-head"></div>
    <h1>${unlocked ? day.title : '???'}</h1>`;
  mountPlop(document.getElementById('plop-head'), { outfit: day.outfit });

  const content = document.getElementById('content');
  const foot = document.getElementById('day-foot');

  if (!unlocked) {
    content.remove();
    foot.innerHTML = `
      <div class="card locked">
        <h2>Not yet!</h2>
        <p>This door opens on <b>${dateLabel(n)}</b>.</p>
        <p class="muted">Plop is guarding it until then. No peeking.</p>
      </div>`;
    return;
  }

  content.classList.remove('hidden');
  const list = opened();
  if (!list.includes(n)) {
    list.push(n); store.set('opened', list);
    setTimeout(() => toast(`<div class="plop-xs">${plopSVG({ outfit: day.outfit })}</div><div><b>New sticker!</b><br>${day.sticker}</div>`), 900);
  }

  foot.innerHTML = `
    <a class="btn btn-reply" href="${whatsappLink('Day ' + n + ' (' + day.title + '): ')}" target="_blank" rel="noopener">Reply to ${SETTINGS.fromName} &hearts;</a>
    <a class="btn" href="./">See all doors</a>`;
}

// ============ ARCHIVE PAGE ============
function initArchive() {
  snow(36);
  isPeek();
  const today = todayNumber();
  const got = opened();
  mountPlop(document.getElementById('plop-hero'), { outfit: '#B5473A' });

  const sub = document.getElementById('sub');
  if (today === 0) sub.textContent = 'The first door opens on 1 December';
  else if (today >= 25) sub.textContent = 'Merry Christmas! All 24 doors are open';
  else sub.textContent = `Door ${today} of 24 is open today`;

  const grid = document.getElementById('doors');
  DAYS.forEach(d => {
    const unlocked = isUnlocked(d.n);
    const el = document.createElement(unlocked ? 'a' : 'div');
    el.className = 'door' + (unlocked ? (got.includes(d.n) ? ' open' : ' new') : ' shut') + (d.n === 24 ? ' gold' : '');
    if (unlocked) { el.href = d.slug + '.html'; el.style.setProperty('--outfit', d.outfit); }
    el.innerHTML = `<span>${d.n}</span>`;
    grid.appendChild(el);
  });

  const book = document.getElementById('stickers');
  DAYS.forEach(d => {
    const s = document.createElement('div');
    s.className = 'sticker' + (got.includes(d.n) ? ' have' : '');
    s.innerHTML = got.includes(d.n) ? plopSVG({ outfit: d.outfit }) : `<span>${d.n}</span>`;
    s.title = got.includes(d.n) ? d.sticker : '???';
    if (got.includes(d.n)) s.onclick = () => toast(`<div class="plop-xs">${plopSVG({ outfit: d.outfit })}</div><div><b>${d.sticker}</b><br>Day ${d.n}</div>`);
    book.appendChild(s);
  });
  document.getElementById('sticker-count').textContent = `${got.length} / 24`;

  const games = [['crossy', 'Crossy Road'], ['quiz', 'Which pigeon'], ['spot', 'Spot the pigeon'], ['flappy', 'Flappy Pigeon']];
  document.getElementById('stats').innerHTML = games.map(([k, name]) => {
    const b = getBest(k);
    return `<div class="stat"><span>${name}</span><b>${b === undefined ? '–' : b}</b></div>`;
  }).join('');
}
