/**
 * andalusTextures — procedural PBR maps for the Andalus velvet curtain.
 *
 * Research note (velvet realism): velvet is NOT a diffuse material. Its pile is
 * a forest of near-vertical micro-fibres, so it back-scatters light at grazing
 * angles (the bright "rim" you see on theatre drapes) and swallows light deep in
 * the folds. We reproduce that physically with three.js MeshPhysicalMaterial
 * `sheen` (Charlie BRDF) + `anisotropy` aligned to the vertical fibre direction,
 * fed by these maps:
 *   - normal     : fine vertical-fibre micro-relief (tiles)
 *   - roughness  : very rough velvet field + glossy gold trim bands (panel-scale)
 *   - metalness  : 0 over velvet, ~0.9 over the gold leading-edge + hem (panel-scale)
 *   - map (albedo): deep oxblood pile with subtle light/dark patches + engraved
 *                   gold trim bands with a Maghrebi arabesque motif (panel-scale)
 *
 * Everything is generated on a 2D canvas at runtime — no bundled PNGs, no flat
 * CSS gradients. The colour lives in the map so the material colour stays white.
 */
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Palette (oxblood velvet + Maghrebi gold)                           */
/* ------------------------------------------------------------------ */

export const ANDALUS_VELVET = {
  pile: [62, 12, 24],       // base oxblood pile colour (rgb)
  pileLit: [120, 30, 48],   // raised, light-catching pile
  pileDeep: [22, 4, 10],    // valley / shadow pile
  gold: '#caa24f',
  goldLight: '#f0dca0',
  goldDeep: '#6d521f',
  glow: '#ffd98a',
};

/* ------------------------------------------------------------------ */
/*  Seeded value-noise + fBm helpers                                   */
/* ------------------------------------------------------------------ */

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function makeNoiseGrid(size, seed) {
  const rand = seededRandom(seed);
  const grid = new Float32Array(size * size);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();
  return grid;
}

function sampleNoise(grid, size, x, y) {
  const fx = ((x % size) + size) % size;
  const fy = ((y % size) + size) % size;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const tx = fx - ix;
  const ty = fy - iy;
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);
  const idx = (r, c) => (r % size) * size + (c % size);
  const v00 = grid[idx(iy, ix)];
  const v10 = grid[idx(iy, ix + 1)];
  const v01 = grid[idx(iy + 1, ix)];
  const v11 = grid[idx(iy + 1, ix + 1)];
  return (v00 * (1 - sx) + v10 * sx) * (1 - sy) + (v01 * (1 - sx) + v11 * sx) * sy;
}

function fbm(grid, gridSize, x, y, octaves, lacunarity, gain) {
  let value = 0;
  let amp = 1;
  let freq = 1;
  let maxAmp = 0;
  for (let i = 0; i < octaves; i++) {
    value += sampleNoise(grid, gridSize, x * freq, y * freq) * amp;
    maxAmp += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return value / maxAmp;
}

const clamp255 = (v) => Math.max(0, Math.min(255, Math.floor(v)));

/* ------------------------------------------------------------------ */
/*  Trim-band geometry (shared by albedo / roughness / metalness)      */
/* ------------------------------------------------------------------ */

/**
 * The curtain UVs put u=0 at the panel's outer edge and u=1 at the inner
 * (centre-facing) leading edge for the LEFT panel; the RIGHT panel is mirrored.
 * CanvasTexture flipY means canvas-bottom == panel-bottom (the hem).
 * Returns the band rectangles in canvas pixels for a given side.
 */
function trimBands(w, h, side) {
  const lead = Math.round(w * 0.085); // leading vertical braid width
  const hem = Math.round(h * 0.07);   // bottom hem braid height
  const leadX = side === 'left' ? w - lead : 0; // inner edge side
  return {
    lead: { x: leadX, y: 0, w: lead, h, inner: side === 'left' ? leadX : lead },
    hem: { x: 0, y: h - hem, w, h: hem },
  };
}

/** A small Maghrebi eight-point star / quatrefoil motif for the braid. */
function drawArabesqueMotif(ctx, cx, cy, r, stroke) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1, r * 0.16);
  ctx.lineJoin = 'round';
  // two overlaid squares -> eight-point star
  for (let k = 0; k < 2; k++) {
    ctx.save();
    ctx.rotate((k * Math.PI) / 4);
    ctx.beginPath();
    ctx.rect(-r, -r, r * 2, r * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/*  Velvet albedo + roughness + metalness (panel-scale, side-aware)    */
/* ------------------------------------------------------------------ */

export function createVelvetSurface(resolution = 1024, side = 'left') {
  const albedo = document.createElement('canvas');
  const rough = document.createElement('canvas');
  const metal = document.createElement('canvas');
  for (const c of [albedo, rough, metal]) {
    c.width = resolution;
    c.height = resolution;
  }
  const aCtx = albedo.getContext('2d');
  const rCtx = rough.getContext('2d');
  const mCtx = metal.getContext('2d');

  // ---- velvet field via pixel noise (pile light/dark patches) ----
  const gA = makeNoiseGrid(64, 13);
  const gB = makeNoiseGrid(64, 91);
  const aImg = aCtx.createImageData(resolution, resolution);
  const rImg = rCtx.createImageData(resolution, resolution);
  const ad = aImg.data;
  const rd = rImg.data;
  const [pr, pg, pb] = ANDALUS_VELVET.pile;
  const [lr, lg, lb] = ANDALUS_VELVET.pileLit;
  const [dr, dg, db] = ANDALUS_VELVET.pileDeep;

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const i = (py * resolution + px) * 4;
      const u = px / resolution;
      const v = py / resolution;
      // broad pile patches (where the pile leans toward / away from us)
      const patch = fbm(gA, 64, u * 5, v * 7, 4, 2.0, 0.55);
      // fine vertical streak modulation (fibres run vertically)
      const streak = fbm(gB, 64, u * 90, v * 14, 2, 2.0, 0.5);
      const t = Math.min(1, Math.max(0, patch * 0.85 + streak * 0.15));
      // blend deep -> base -> lit
      let cr, cg, cb;
      if (t < 0.5) {
        const k = t / 0.5;
        cr = dr + (pr - dr) * k;
        cg = dg + (pg - dg) * k;
        cb = db + (pb - db) * k;
      } else {
        const k = (t - 0.5) / 0.5;
        cr = pr + (lr - pr) * k;
        cg = pg + (lg - pg) * k;
        cb = pb + (lb - pb) * k;
      }
      ad[i] = clamp255(cr);
      ad[i + 1] = clamp255(cg);
      ad[i + 2] = clamp255(cb);
      ad[i + 3] = 255;
      // roughness: velvet is very rough (0.88-0.97), slight variation
      const rv = clamp255((0.9 + (streak - 0.5) * 0.12) * 255);
      rd[i] = rv;
      rd[i + 1] = rv;
      rd[i + 2] = rv;
      rd[i + 3] = 255;
    }
  }
  aCtx.putImageData(aImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  // metalness field = 0 (pure black)
  mCtx.fillStyle = '#000';
  mCtx.fillRect(0, 0, resolution, resolution);

  // ---- gold trim bands (leading edge + hem) ----
  const bands = trimBands(resolution, resolution, side);

  const paintGoldAlbedo = (x, y, w, h, vertical) => {
    const g = vertical
      ? aCtx.createLinearGradient(x, 0, x + w, 0)
      : aCtx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, ANDALUS_VELVET.goldDeep);
    g.addColorStop(0.5, ANDALUS_VELVET.goldLight);
    g.addColorStop(1, ANDALUS_VELVET.goldDeep);
    aCtx.fillStyle = g;
    aCtx.fillRect(x, y, w, h);
    // engraved arabesque run
    const step = Math.round((vertical ? h : w) * 0.0);
    const motifR = (vertical ? w : h) * 0.3;
    const span = vertical ? h : w;
    const along = vertical ? x + w / 2 : y + h / 2;
    const count = Math.max(2, Math.round(span / (motifR * 3)));
    for (let k = 0; k < count; k++) {
      const p = ((k + 0.5) / count) * span;
      const cx = vertical ? along : p;
      const cy = vertical ? p : along;
      drawArabesqueMotif(aCtx, cx, cy, motifR, 'rgba(70,52,20,0.85)');
    }
    void step;
  };

  paintGoldAlbedo(bands.lead.x, bands.lead.y, bands.lead.w, bands.lead.h, true);
  paintGoldAlbedo(bands.hem.x, bands.hem.y, bands.hem.w, bands.hem.h, false);

  // matching glossy + metal in the same band rects
  rCtx.fillStyle = '#4d4d4d'; // ~0.30 roughness (glossy braid)
  rCtx.fillRect(bands.lead.x, bands.lead.y, bands.lead.w, bands.lead.h);
  rCtx.fillRect(bands.hem.x, bands.hem.y, bands.hem.w, bands.hem.h);
  mCtx.fillStyle = '#e6e6e6'; // ~0.9 metalness
  mCtx.fillRect(bands.lead.x, bands.lead.y, bands.lead.w, bands.lead.h);
  mCtx.fillRect(bands.hem.x, bands.hem.y, bands.hem.w, bands.hem.h);

  const mk = (canvas, srgb) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 4;
    return tex;
  };

  return {
    map: mk(albedo, true),
    roughnessMap: mk(rough, false),
    metalnessMap: mk(metal, false),
  };
}

/* ------------------------------------------------------------------ */
/*  Velvet fibre normal map (tiling)                                   */
/* ------------------------------------------------------------------ */

export function createVelvetNormal(resolution = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(resolution, resolution);
  const data = img.data;

  const gFine = makeNoiseGrid(64, 7);
  const gMed = makeNoiseGrid(64, 313);

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const i = (py * resolution + px) * 4;
      const u = px / resolution;
      const v = py / resolution;
      // vertical fibres: high horizontal frequency, low vertical frequency
      const fineX = fbm(gFine, 64, u * 140, v * 18, 3, 2.0, 0.5) - 0.5;
      const fineY = fbm(gMed, 64, u * 22, v * 120, 2, 2.0, 0.5) - 0.5;
      const medX = fbm(gMed, 64, u * 16, v * 9, 2, 2.0, 0.6) - 0.5;
      const nx = fineX * 0.55 + medX * 0.18;
      const ny = fineY * 0.30;
      data[i] = clamp255((nx + 0.5) * 255);
      data[i + 1] = clamp255((ny + 0.5) * 255);
      data[i + 2] = 235; // mostly facing out
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 8);
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------------ */
/*  Gold metal normal (for valance braid / hardware)                   */
/* ------------------------------------------------------------------ */

export function createGoldNormal(resolution = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(resolution, resolution);
  const data = img.data;
  const gA = makeNoiseGrid(32, 77);
  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const i = (py * resolution + px) * 4;
      const u = px / resolution;
      const v = py / resolution;
      const bump = fbm(gA, 32, u * 18, v * 18, 2, 2.0, 0.5) - 0.5;
      // braided twist: diagonal ridges
      const twist = Math.sin((u + v) * resolution * 0.25) * 0.06;
      data[i] = clamp255((bump * 0.3 + twist + 0.5) * 255);
      data[i + 1] = clamp255((bump * 0.3 - twist + 0.5) * 255);
      data[i + 2] = 230;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* ------------------------------------------------------------------ */
/*  Soft additive glow sprite (the warm light flooding from behind)    */
/* ------------------------------------------------------------------ */

export function createGlowSprite(resolution = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(
    resolution / 2, resolution / 2, 0,
    resolution / 2, resolution / 2, resolution / 2,
  );
  g.addColorStop(0, 'rgba(255,224,166,0.7)');
  g.addColorStop(0.3, 'rgba(255,198,118,0.38)');
  g.addColorStop(0.62, 'rgba(210,118,58,0.1)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, resolution, resolution);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** A tiny soft dot for floating dust motes in the light. */
export function createDustSprite(resolution = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(
    resolution / 2, resolution / 2, 0,
    resolution / 2, resolution / 2, resolution / 2,
  );
  g.addColorStop(0, 'rgba(255,240,210,1)');
  g.addColorStop(0.4, 'rgba(255,225,170,0.5)');
  g.addColorStop(1, 'rgba(255,225,170,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, resolution, resolution);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
