// Plop the pigeon — pixel sprite + tiny renderer
// Each letter is one pixel colour (see PLOP_PALETTE). "." is transparent.
const PLOP_SPRITE = [
"...................KKKK...........",
"..................KWWWWK..........",
"...........KKKKKKKWWwWWK..........",
".........KKRRRRRRKWWWwK...........",
"........KRRRRRRRRRKKKK............",
".......KRRRRRRRRRRrK..............",
"......KRRRRRRRRRRRRrK.............",
".....KWWWWWWWWWWWWWWWK............",
"....KWWwWWWWWwWWWWwWWWK...........",
"....KKLLLLGGGGGGGGGGKK............",
"...KLLGOOOOGGGGGGGGGGK............",
"...KLGOEEWWOGGGGGGGGGGK...........",
"..KLGGOEEWWOGGGGGGGGGGK...........",
".KYKGGOEEEEOGGGGGGGGGGK...........",
".KYYKGOWEEEOBBGGGGGGGGGK..........",
"..KYYKGOOOOGBBGGGGGGGGGKK.........",
"...KKRRRRRRRRRRRRRRRRKTPGKK.......",
"....KrRRRRRRRRRRRRRRrKPTGGGK......",
"....KKKrRRRRrKKKKKKKKggggKKKKK....",
"...KGGKRRrKGGGKgggggggggggggKgK...",
"..KGGGKRRRKGGGKggggdddddgggggGdKK.",
"..KLLLKRRrKGGKgggggggggggggggKgggK",
"..KLLLKRRRKLGGggggggggddddddgGgggK",
"..KLLLKrRrKGGGgggggggggggggggGKKK.",
"..KLLLKWKWKLGGGgggggggggggggGGK...",
"..KLLLLLLLLGGGGGGGggggggggggggK...",
"...KLLLLLLLLGGGGGGGGGGGggggggK....",
"....KLLLLLLGGGGGGGGGGGGgggggK.....",
".....KgggggggggggggggggggggK......",
"......KKgggggggggggggggggKK.......",
"........KKgggggggggggggKK.........",
"..........KKKKKKOKKKKKOK..........",
"..............KOOOK.KOOOK........."
];

const PLOP_PALETTE = {
  K: '#3A2A20', W: '#FFF8EC', w: '#E2D6C4', Y: '#E9B84A', E: '#281C16',
  B: '#E79A8C', P: '#8C6FA8', T: '#5E9C8A', O: '#D98B5A',
  R: '#B5473A', G: '#A9A6B3'
};

function _shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * f))));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}

// opts: { outfit: '#hex' (hat + scarf colour), blink: bool, flip: bool }
function plopSVG(opts = {}) {
  const pal = Object.assign({}, PLOP_PALETTE);
  if (opts.outfit) pal.R = opts.outfit;
  const col = c => c === 'r' ? _shade(pal.R, .76) : c === 'g' ? _shade(pal.G, .85)
    : c === 'd' ? _shade(pal.G, .66) : c === 'L' ? _shade(pal.G, 1.18) : pal[c];
  let rects = '';
  PLOP_SPRITE.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      let c = row[x];
      if (c === '.') continue;
      if (opts.blink && y >= 11 && y <= 14 && x >= 7 && x <= 10) c = (y === 13 ? 'K' : 'G');
      rects += `<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${col(c)}"/>`;
    }
  });
  const t = opts.flip ? ' transform="translate(34 0) scale(-1 1)"' : '';
  return `<svg viewBox="0 0 34 33" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g${t}>${rects}</g></svg>`;
}

// Put a living (blinking) Plop into an element
function mountPlop(el, opts = {}) {
  if (!el) return;
  const draw = blink => { el.innerHTML = plopSVG(Object.assign({}, opts, { blink })); };
  draw(false);
  setInterval(() => { draw(true); setTimeout(() => draw(false), 150); }, 3000 + Math.random() * 1500);
}
