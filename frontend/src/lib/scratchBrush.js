/**
 * scratchBrush — realistic foil scratch-card coating + brush.
 *
 * The coating is no longer a flat CSS gradient. We load a real crinkled-foil
 * NORMAL map (ambientCG Foil002, CC0) and bake a *lit* metallic surface from it
 * at runtime — diffuse + specular against a moving light — so it reads as a
 * genuine sheet of gold foil with creases catching the light. Same lighting
 * principle as the WebGL curtain, done in a 2D canvas.
 */

/* ------------------------------------------------------------------ */
/*  Foil normal map (async) + lit-foil baking                          */
/* ------------------------------------------------------------------ */

const FOIL_NORMAL_SRC = '/textures/foil-normal.jpg';
const BAKE_SIZE = 512;

let foilNormalImg = null;
let foilNormalReady = false;
const readyListeners = new Set();
const bakedFoil = {}; // theme -> canvas

function loadFoilNormal() {
    if (foilNormalImg) {
        return;
    }
    foilNormalImg = new Image();
    foilNormalImg.crossOrigin = 'anonymous';
    foilNormalImg.onload = () => {
        foilNormalReady = true;
        readyListeners.forEach((fn) => fn());
        readyListeners.clear();
    };
    foilNormalImg.src = FOIL_NORMAL_SRC;
}

/* Per-theme metallic look. base = body tint, spec = highlight colour. */
const FOIL_LOOK = {
    velvet: {
        base: [188, 150, 72],
        spec: [255, 246, 214],
        ambient: 0.34,
        kd: 0.86,
        ks: 0.95,
        shininess: 24,
        sheen: ['#f6e4ad', '#b88b3e'],
    },
    bloom: {
        base: [214, 156, 128],
        spec: [255, 234, 224],
        ambient: 0.36,
        kd: 0.82,
        ks: 0.9,
        shininess: 22,
        sheen: ['#f7d9cf', '#c98a7a'],
    },
    noir: {
        base: [44, 42, 52],
        spec: [216, 178, 92],
        ambient: 0.42,
        kd: 0.55,
        ks: 1.0,
        shininess: 18,
        sheen: ['#3a3a46', '#15151c'],
    },
};

/** Bake a lit gold-foil tile for a theme from the crinkle normal map. */
function bakeFoil(theme) {
    const look = FOIL_LOOK[theme] ?? FOIL_LOOK.velvet;
    const canvas = document.createElement('canvas');
    canvas.width = BAKE_SIZE;
    canvas.height = BAKE_SIZE;
    const ctx = canvas.getContext('2d');

    // 1. Soft anisotropic sheen so the foil reflects a graded environment.
    const sheen = ctx.createLinearGradient(0, 0, BAKE_SIZE, BAKE_SIZE);
    sheen.addColorStop(0, look.sheen[0]);
    sheen.addColorStop(0.5, look.sheen[1]);
    sheen.addColorStop(1, look.sheen[0]);
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, BAKE_SIZE, BAKE_SIZE);
    const sheenData = ctx.getImageData(0, 0, BAKE_SIZE, BAKE_SIZE).data;

    // 2. Read the crinkle normals.
    ctx.drawImage(foilNormalImg, 0, 0, BAKE_SIZE, BAKE_SIZE);
    const src = ctx.getImageData(0, 0, BAKE_SIZE, BAKE_SIZE);
    const data = src.data;

    // Light + view vectors.
    const lx = -0.34, ly = -0.46, lz = 0.82;
    const ll = Math.hypot(lx, ly, lz);
    const Lx = lx / ll, Ly = ly / ll, Lz = lz / ll;
    // Half-vector between light and viewer (0,0,1).
    let Hx = Lx, Hy = Ly, Hz = Lz + 1;
    const hl = Math.hypot(Hx, Hy, Hz);
    Hx /= hl; Hy /= hl; Hz /= hl;

    const { base, spec, ambient, kd, ks, shininess } = look;

    for (let i = 0; i < data.length; i += 4) {
        // Decode GL normal.
        const nx = (data[i] / 255) * 2 - 1;
        const ny = (data[i + 1] / 255) * 2 - 1;
        const nz = (data[i + 2] / 255) * 2 - 1;

        const diff = Math.max(0, nx * Lx + ny * Ly + nz * Lz);
        let s = Math.max(0, nx * Hx + ny * Hy + nz * Hz);
        s = Math.pow(s, shininess) * ks;

        const light = ambient + diff * kd;

        // Body picks up the graded sheen tint, modulated by the lit body colour.
        const sr = sheenData[i] / 255;
        const sg = sheenData[i + 1] / 255;
        const sb = sheenData[i + 2] / 255;

        data[i] = Math.min(255, base[0] * light * (0.55 + sr * 0.65) + spec[0] * s);
        data[i + 1] = Math.min(255, base[1] * light * (0.55 + sg * 0.65) + spec[1] * s);
        data[i + 2] = Math.min(255, base[2] * light * (0.55 + sb * 0.65) + spec[2] * s);
        data[i + 3] = 255;
    }

    ctx.putImageData(src, 0, 0);
    return canvas;
}

function getBakedFoil(theme) {
    if (!foilNormalReady) {
        return null;
    }
    if (!bakedFoil[theme]) {
        bakedFoil[theme] = bakeFoil(theme);
    }
    return bakedFoil[theme];
}

/* ------------------------------------------------------------------ */
/*  Scratch brush stamp                                                */
/* ------------------------------------------------------------------ */

let cachedBrush = null;

function buildBrushTexture(stampW = 76, stampH = 34) {
    const canvas = document.createElement('canvas');
    canvas.width = stampW;
    canvas.height = stampH;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, stampW, stampH);

    // Bristle clusters — horizontal brush drag orientation
    for (let i = 0; i < 140; i++) {
        const x = Math.random() * stampW;
        const y = stampH / 2 + (Math.random() - 0.5) * stampH * 0.92;
        const bristleW = 1.2 + Math.random() * 2.8;
        const bristleH = 6 + Math.random() * 16;
        const tilt = (Math.random() - 0.5) * 0.55;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        ctx.globalAlpha = 0.12 + Math.random() * 0.38;
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(0, 0, bristleW, bristleH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Soft feathered edges so stamps blend
    ctx.globalCompositeOperation = 'destination-in';
    const fade = ctx.createRadialGradient(
        stampW / 2,
        stampH / 2,
        0,
        stampW / 2,
        stampH / 2,
        Math.max(stampW, stampH) * 0.55,
    );
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(0.72, 'rgba(0,0,0,0.85)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, stampW, stampH);
    ctx.globalCompositeOperation = 'source-over';

    return canvas;
}

export function getScratchBrush() {
    if (!cachedBrush) {
        cachedBrush = {
            texture: buildBrushTexture(),
            width: 76,
            height: 34,
        };
    }
    return cachedBrush;
}

/** Stamp textured brush at point, rotated to stroke angle */
export function paintTexturedBrush(ctx, x, y, angle = 0, scale = 1) {
    const brush = getScratchBrush();
    const w = brush.width * scale;
    const h = brush.height * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 0.82 + Math.random() * 0.18;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(brush.texture, -w / 2, -h / 2, w, h);
    ctx.restore();
    ctx.globalAlpha = 1;
}

/** Brush stroke between two points with texture stamps + light jitter */
export function paintScratchStroke(ctx, x1, y1, x2, y2, scale = 1) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const step = Math.max(2, 6 * scale);
    const steps = Math.max(1, Math.ceil(dist / step));

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const jitter = dist > 0 ? (Math.random() - 0.5) * 4 * scale : 0;
        const px = x1 + dx * t + Math.cos(angle + Math.PI / 2) * jitter;
        const py = y1 + dy * t + Math.sin(angle + Math.PI / 2) * jitter;
        const spin = angle + (Math.random() - 0.5) * 0.35;
        paintTexturedBrush(ctx, px, py, spin, scale * (0.92 + Math.random() * 0.16));
    }
}

export function measureScratchRatio(canvas, sampleStep = 10) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    let transparent = 0;
    let sampled = 0;

    for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
            const i = (y * width + x) * 4 + 3;
            sampled++;
            if (imageData.data[i] < 128) {
                transparent++;
            }
        }
    }

    return sampled ? transparent / sampled : 0;
}

export function setupCanvasSize(canvas, container) {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { ctx, width: rect.width, height: rect.height };
}

/* ------------------------------------------------------------------ */
/*  Coating drawing                                                    */
/* ------------------------------------------------------------------ */

/** Cover-draw the square foil tile into an arbitrary rect. */
function drawFoilCover(ctx, foil, width, height) {
    const scale = Math.max(width / foil.width, height / foil.height);
    const w = foil.width * scale;
    const h = foil.height * scale;
    ctx.drawImage(foil, (width - w) / 2, (height - h) / 2, w, h);
}

/** Engraved hint text — dark cut + light edge so it reads as pressed into foil. */
function engraveHint(ctx, text, cx, cy, theme) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (theme === 'noir') {
        ctx.font = '600 9px Cinzel, Georgia, serif';
    } else {
        ctx.font = 'italic 600 12px "Cormorant Garamond", serif';
    }
    ctx.fillStyle = 'rgba(60,40,12,0.32)';
    ctx.fillText(text, cx, cy + 0.6);
    ctx.fillStyle = 'rgba(255,248,228,0.30)';
    ctx.fillText(text, cx, cy - 0.4);
    ctx.restore();
}

/** Gradient fallback used until the foil normal map finishes loading. */
const FALLBACK_GRADIENT = {
    velvet: ['#ead9a8', '#c9a962', '#967832'],
    bloom: ['#f8dde0', '#e8b4b8', '#b86872'],
    noir: ['#252530', '#14141c', '#0a0a10'],
};

function drawFallback(ctx, width, height, theme) {
    const stops = FALLBACK_GRADIENT[theme] ?? FALLBACK_GRADIENT.velvet;
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, stops[0]);
    g.addColorStop(0.5, stops[1]);
    g.addColorStop(1, stops[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
}

/**
 * Draw the scratch coating. If the foil normal map isn't ready yet, paints a
 * gradient placeholder and registers `onReady` so the caller can redraw once
 * the real foil is baked.
 */
export function drawScratchOverlay(ctx, width, height, theme, onReady) {
    loadFoilNormal();

    ctx.save();
    // No shape clipping: the card element already masks the coating to a
    // circle/rounded-rect via border-radius + overflow:hidden. We MUST fill the
    // full canvas so it starts 100% opaque — otherwise the clipped-out corners
    // read as "already scratched" and the first touch instantly reveals.
    const cx = width / 2;
    const cy = height / 2;

    const foil = getBakedFoil(theme);
    if (foil) {
        drawFoilCover(ctx, foil, width, height);

        // Gentle radial centre glow so it looks softly spotlit.
        const glow = ctx.createRadialGradient(cx, cy * 0.7, 0, cx, cy, Math.max(width, height) * 0.75);
        glow.addColorStop(0, 'rgba(255,250,232,0.18)');
        glow.addColorStop(0.6, 'rgba(255,250,232,0)');
        glow.addColorStop(1, 'rgba(20,12,4,0.22)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        if (theme === 'noir') {
            ctx.strokeStyle = 'rgba(216,178,92,0.45)';
            ctx.lineWidth = 1;
            ctx.strokeRect(1, 1, width - 2, height - 2);
        }

        engraveHint(ctx, theme === 'noir' ? 'SWIPE' : 'swipe to reveal', cx, cy, theme);
    } else {
        drawFallback(ctx, width, height, theme);
        if (onReady) {
            readyListeners.add(onReady);
        }
    }

    ctx.restore();
}
