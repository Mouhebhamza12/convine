/**
 * AndalusClothSim — Verlet-integration cloth physics for one curtain panel.
 *
 * Pure JS (no React / three). A grid of particles, top row pinned to the rod.
 * The single most important realism decision here: the folds are IRREGULAR.
 * Real velvet drapes never pleat at a uniform pitch, so the rest-state z is a
 * sum of incommensurate sines plus per-column seeded jitter — giving varying
 * fold widths, asymmetry and compression toward the heavy leading edge. The
 * measured 3D rest-lengths bake those irregular pleats in so the cloth holds
 * them while it sways and gathers.
 */

const CONFIG = {
  cols: 46,
  rows: 58,
  damping: 0.986,
  gravity: 0.0000023,
  constraintIterations: 14,
  windStrength: 0.0000125,
  windFrequency: 0.7,
};

export { CONFIG };

const TAU = Math.PI * 2;

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default class AndalusClothSim {
  constructor(side = 'left', viewportWidth = 2.8, viewportHeight = 2.05) {
    this.side = side;
    this.cols = CONFIG.cols;
    this.rows = CONFIG.rows;

    const overhangY = 0.22;
    this.panelHeight = viewportHeight + overhangY * 2;

    // each panel covers a little past half so the centre overlaps (no gap)
    const overlapX = 0.16;
    if (side === 'left') {
      this.xStart = -viewportWidth / 2 - 0.12; // past left edge
      this.xEnd = overlapX;
    } else {
      this.xStart = -overlapX;
      this.xEnd = viewportWidth / 2 + 0.12; // past right edge
    }

    this.yTop = viewportHeight / 2 + overhangY;
    this.yBottom = -viewportHeight / 2 - overhangY;

    this.openProgress = 0;
    this.settleAmplitude = 0;
    this.time = 0;
    this.points = [];

    this._initPoints();
  }

  /* ---- irregular fold profile across the panel width ---- */
  _foldZ(u, jitter) {
    const phase = this.side === 'left' ? 0.0 : 1.7;
    const shape =
      0.60 * Math.sin(u * TAU * 5.0 + phase) +
      0.28 * Math.sin(u * TAU * 8.3 + phase * 1.7 + 0.6) +
      0.16 * Math.sin(u * TAU * 3.1 + phase * 0.5 + 1.1);
    // heavier, deeper folds toward the inner (leading) edge
    const inner = this.side === 'left' ? u : 1 - u;
    const depth = 0.82 + 0.42 * inner;
    return (shape + jitter) * 0.052 * depth;
  }

  _initPoints() {
    const { cols, rows } = this;
    const spanX = this.xEnd - this.xStart;
    const spanY = this.yTop - this.yBottom;

    // per-column seeded jitter -> irregular fold widths / asymmetry
    const rand = seededRandom(this.side === 'left' ? 1337 : 24611);
    const jitter = new Float32Array(cols);
    for (let c = 0; c < cols; c++) jitter[c] = (rand() - 0.5) * 0.5;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const u = col / (cols - 1);
        const v = row / (rows - 1);
        const x = this.xStart + u * spanX;
        const y = this.yTop - v * spanY;
        // folds ramp in from the pinned rod over the first few rows
        const foldProgress = Math.min(1, row / 4);
        const z = this._foldZ(u, jitter[col]) * foldProgress;

        this.points.push({
          x, y, z,
          prevX: x, prevY: y, prevZ: z,
          pinned: row === 0,
          initX: x, initZ: z,
          col, row,
        });
      }
    }

    // bake measured rest-lengths so the irregular pleats are stable
    this.restLengthsH = new Float32Array(rows * (cols - 1));
    this.restLengthsV = new Float32Array((rows - 1) * cols);
    const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
    let h = 0;
    let vIdx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        if (col < cols - 1) this.restLengthsH[h++] = dist(this.points[idx], this.points[idx + 1]);
        if (row < rows - 1) this.restLengthsV[vIdx++] = dist(this.points[idx], this.points[idx + cols]);
      }
    }
  }

  /* ---- public API ---- */
  setOpenProgress(p) { this.openProgress = Math.max(0, Math.min(1, p)); }
  setSettleAmplitude(a) { this.settleAmplitude = a; }

  getBottomRowPositions() {
    const out = [];
    const base = (this.rows - 1) * this.cols;
    for (let col = 0; col < this.cols; col++) {
      const p = this.points[base + col];
      out.push({ x: p.x, y: p.y, z: p.z });
    }
    return out;
  }

  update(dt) {
    this.time += dt;
    const { points, openProgress } = this;
    const { damping, gravity, windStrength, windFrequency, constraintIterations } = CONFIG;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.pinned) { this._updatePinned(p); continue; }

      const vx = (p.x - p.prevX) * damping;
      const vy = (p.y - p.prevY) * damping;
      const vz = (p.z - p.prevZ) * damping;
      p.prevX = p.x; p.prevY = p.y; p.prevZ = p.z;

      p.y += vy - gravity;
      p.x += vx;
      p.z += vz;

      // gentle ambient sway while closed
      const wind = this.time * windFrequency + p.col * 0.16 + p.row * 0.07;
      p.z += Math.sin(wind) * windStrength;
      p.x += Math.cos(wind * 0.7) * windStrength * 0.3;

      if (openProgress > 0) this._applyGather(p, dt);
    }

    for (let it = 0; it < constraintIterations; it++) {
      this._solveForward();
      this._solveBackward();
    }
  }

  /* ---- pinned top row gathers toward the outer edge ---- */
  _updatePinned(p) {
    const t = this._ease(this.openProgress);
    const u = p.col / (this.cols - 1);
    const spanX = this.xEnd - this.xStart;
    const gatherRatio = 1 - t * 0.86; // bunch to 14% spread when fully open

    let newX;
    if (this.side === 'left') newX = this.xStart + u * spanX * gatherRatio;
    else newX = this.xEnd - (1 - u) * spanX * gatherRatio;

    // shiver / settle oscillation on the rod
    if (this.settleAmplitude > 0.001) {
      newX += Math.sin(this.time * 7.5 + u * 3) * this.settleAmplitude * 0.028;
    }

    p.prevX = p.x;
    p.x = newX;
    p.prevZ = p.z;
  }

  _applyGather(p, dt) {
    const t = this._ease(this.openProgress);
    const u = p.col / (this.cols - 1);
    const dtScale = dt / 0.0166;

    // free particles follow the gathering rod sideways
    const strength = 0.0019;
    if (this.side === 'left') p.x -= (1 - u) * t * strength * dtScale;
    else p.x += u * t * strength * dtScale;

    // spring back toward the initial pleat z so folds survive the gather
    p.z += (p.initZ - p.z) * 0.028 * dtScale;

    // tiny living sway
    const rowNorm = p.row / (this.rows - 1);
    p.z += Math.sin(p.col * 0.4 + this.time * 1.4 + rowNorm * 2) * 0.00004 * t * dtScale;
  }

  /* ---- constraint solver (bidirectional, removes bias) ---- */
  _satisfy(p1, p2, restLen) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.00001;
    const c = (d - restLen) / d / 2;
    if (!p1.pinned) { p1.x += dx * c; p1.y += dy * c; p1.z += dz * c; }
    if (!p2.pinned) { p2.x -= dx * c; p2.y -= dy * c; p2.z -= dz * c; }
  }

  _solveForward() {
    const { points, cols, rows } = this;
    let h = 0;
    let vIdx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        if (col < cols - 1) this._satisfy(points[idx], points[idx + 1], this.restLengthsH[h++]);
        if (row < rows - 1) this._satisfy(points[idx], points[idx + cols], this.restLengthsV[vIdx++]);
      }
    }
  }

  _solveBackward() {
    const { points, cols, rows } = this;
    for (let row = rows - 1; row >= 0; row--) {
      const hStart = row * (cols - 1);
      const vStart = row * cols;
      for (let col = cols - 1; col >= 0; col--) {
        const idx = row * cols + col;
        if (col < cols - 1) this._satisfy(points[idx], points[idx + 1], this.restLengthsH[hStart + col]);
        if (row < rows - 1) this._satisfy(points[idx], points[idx + cols], this.restLengthsV[vStart + col]);
      }
    }
  }

  /** power3.inOut */
  _ease(t) {
    if (t < 0.5) return 4 * t * t * t;
    return 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
