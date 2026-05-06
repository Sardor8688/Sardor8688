/* =============================================================
   The Serpent Club — Old Money Snake
   ============================================================= */

(() => {
  "use strict";

  // ---------- Config ----------
  const GRID = 20;                      // number of cells per side
  const CELL = 24;                      // px per cell (canvas is 480x480)
  const BASE_TICK_MS = 140;             // starting tempo
  const MIN_TICK_MS  = 60;              // fastest tempo
  const TEMPO_STEPS  = [
    { t: 130, name: "Largo" },
    { t: 115, name: "Andante" },
    { t: 100, name: "Allegretto" },
    { t: 85,  name: "Allegro" },
    { t: 70,  name: "Vivace" },
    { t: 60,  name: "Presto" },
  ];

  const COLORS = {
    feltDark:   "#10311f",
    feltLight:  "#1d4a2c",
    grid:       "rgba(212, 168, 75, 0.07)",
    gridStrong: "rgba(212, 168, 75, 0.14)",
    snakeBody:  "#cdb15c",  // antique gold
    snakeEdge:  "#8a6d2a",
    snakeHead:  "#e7c870",
    eyes:       "#0f2a1d",
    apple:      "#1f6b3a",  // emerald
    appleHi:    "#7fd58a",
    appleStem:  "#5b3a1f",
    crash:      "#6b1f1a",  // oxblood
  };

  // ---------- DOM ----------
  const canvas   = document.getElementById("board");
  const ctx      = canvas.getContext("2d");
  const scoreEl  = document.getElementById("score");
  const highEl   = document.getElementById("high-score");
  const lengthEl = document.getElementById("length");
  const tempoEl  = document.getElementById("tempo");
  const overlay  = document.getElementById("overlay");
  const startBtn = document.getElementById("start-btn");

  // ---------- HiDPI scaling ----------
  function setupHiDPI() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width  = GRID * CELL * dpr;
    canvas.height = GRID * CELL * dpr;
    canvas.style.width  = (GRID * CELL) + "px";
    canvas.style.height = (GRID * CELL) + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  setupHiDPI();
  window.addEventListener("resize", () => {
    setupHiDPI();
    draw(); // redraw at new resolution
  });

  // ---------- Game state ----------
  const STATE = {
    IDLE:    "idle",
    RUNNING: "running",
    PAUSED:  "paused",
    OVER:    "over",
  };

  let snake;          // array of {x, y}, head first
  let dir;            // {x, y}
  let pendingDir;     // queued direction change
  let apple;          // {x, y}
  let score;
  let high;
  let tickMs;
  let lastTick;
  let rafId = null;
  let state = STATE.IDLE;

  function reset() {
    const cx = Math.floor(GRID / 2);
    const cy = Math.floor(GRID / 2);
    snake = [
      { x: cx,     y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ];
    dir = { x: 1, y: 0 };
    pendingDir = null;
    score = 0;
    tickMs = BASE_TICK_MS;
    placeApple();
    updateLedger();
  }

  function placeApple() {
    while (true) {
      const x = Math.floor(Math.random() * GRID);
      const y = Math.floor(Math.random() * GRID);
      if (!snake.some(s => s.x === x && s.y === y)) {
        apple = { x, y };
        return;
      }
    }
  }

  function updateLedger() {
    scoreEl.textContent  = score;
    lengthEl.textContent = snake.length;
    highEl.textContent   = high;
    tempoEl.textContent  = tempoLabel(tickMs);
  }

  function tempoLabel(ms) {
    for (const step of TEMPO_STEPS) {
      if (ms >= step.t) return step.name;
    }
    return "Prestissimo";
  }

  // ---------- Persistence ----------
  function loadHigh() {
    try {
      const v = parseInt(localStorage.getItem("serpent-club:high") || "0", 10);
      return Number.isFinite(v) ? v : 0;
    } catch (_) { return 0; }
  }
  function saveHigh(v) {
    try { localStorage.setItem("serpent-club:high", String(v)); } catch (_) {}
  }
  high = loadHigh();

  // ---------- Input ----------
  const KEYS = {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    w: "up", W: "up", s: "down", S: "down", a: "left", A: "left", d: "right", D: "right",
  };
  const DIRS = {
    up:    { x:  0, y: -1 },
    down:  { x:  0, y:  1 },
    left:  { x: -1, y:  0 },
    right: { x:  1, y:  0 },
  };

  function queueDirection(name) {
    const next = DIRS[name];
    if (!next) return;
    const cur  = pendingDir || dir;
    // disallow 180° reversal
    if (cur.x + next.x === 0 && cur.y + next.y === 0) return;
    pendingDir = next;
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      togglePause();
      return;
    }
    if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      restart();
      return;
    }
    const name = KEYS[e.key];
    if (name) {
      e.preventDefault();
      if (state === STATE.IDLE) start();
      queueDirection(name);
    }
  }, { passive: false });

  startBtn.addEventListener("click", () => start());

  // touch buttons
  document.querySelectorAll(".touch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state === STATE.IDLE) start();
      queueDirection(btn.dataset.dir);
    });
  });

  // swipe controls on canvas
  let touchStart = null;
  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  canvas.addEventListener("touchend", (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) { touchStart = null; return; }
    if (state === STATE.IDLE) start();
    if (Math.abs(dx) > Math.abs(dy)) {
      queueDirection(dx > 0 ? "right" : "left");
    } else {
      queueDirection(dy > 0 ? "down" : "up");
    }
    touchStart = null;
  }, { passive: true });

  // ---------- Lifecycle ----------
  function start() {
    if (state === STATE.IDLE || state === STATE.OVER) {
      reset();
    }
    overlay.classList.add("hidden");
    state = STATE.RUNNING;
    lastTick = performance.now();
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function togglePause() {
    if (state === STATE.RUNNING) {
      state = STATE.PAUSED;
      showOverlay({
        eyebrow: "Intermission",
        title:   "Catch your breath.",
        body:    "The serpent rests with you. Press <em>Space</em> to resume.",
        button:  "Resume the Round",
      });
    } else if (state === STATE.PAUSED) {
      overlay.classList.add("hidden");
      state = STATE.RUNNING;
      lastTick = performance.now();
    }
  }

  function restart() {
    reset();
    state = STATE.RUNNING;
    overlay.classList.add("hidden");
    lastTick = performance.now();
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function gameOver() {
    state = STATE.OVER;
    if (score > high) {
      high = score;
      saveHigh(high);
    }
    updateLedger();

    showOverlay({
      eyebrow: "A Most Dignified End",
      title:   formatGameOverTitle(),
      body:    `Final score: <strong>${score}</strong> &middot; Length: <strong>${snake.length}</strong>` +
               `<br/>Personal best: <strong>${high}</strong>.`,
      button:  "Play Another Round",
    });
  }

  function formatGameOverTitle() {
    if (score === 0)   return "A regrettable opening.";
    if (score < 5)     return "A modest gathering.";
    if (score < 12)    return "Quite respectable.";
    if (score < 20)    return "Most distinguished.";
    if (score < 30)    return "An heirloom performance.";
    return "Dynastic, truly.";
  }

  function showOverlay({ eyebrow, title, body, button }) {
    overlay.innerHTML = `
      <div class="overlay-card">
        <p class="overlay-eyebrow">${eyebrow}</p>
        <h2 class="overlay-title">${title}</h2>
        <p class="overlay-body">${body}</p>
        <button id="start-btn" class="crest-btn" type="button">${button}</button>
        <p class="overlay-foot">Press <kbd>Space</kbd> to pause &middot; <kbd>R</kbd> to restart</p>
      </div>`;
    overlay.classList.remove("hidden");
    const btn = overlay.querySelector("#start-btn");
    btn.addEventListener("click", () => {
      if (state === STATE.PAUSED) {
        togglePause();
      } else {
        start();
      }
    });
  }

  // ---------- Tick ----------
  function loop(now) {
    rafId = requestAnimationFrame(loop);
    if (state !== STATE.RUNNING) {
      draw();
      return;
    }
    if (now - lastTick >= tickMs) {
      lastTick = now;
      step();
    }
    draw();
  }

  function step() {
    if (pendingDir) {
      dir = pendingDir;
      pendingDir = null;
    }
    const head = snake[0];
    const next = { x: head.x + dir.x, y: head.y + dir.y };

    // wall check
    if (next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID) {
      return gameOver();
    }
    // self-collision (the new head can move into the tail's old cell since the
    // tail moves on the same tick — unless we're growing)
    const eating = (next.x === apple.x && next.y === apple.y);
    const checkBody = eating ? snake : snake.slice(0, -1);
    if (checkBody.some(s => s.x === next.x && s.y === next.y)) {
      return gameOver();
    }

    snake.unshift(next);
    if (eating) {
      score += 1;
      // tempo: 5ms faster per emerald, with floor
      tickMs = Math.max(MIN_TICK_MS, BASE_TICK_MS - score * 5);
      placeApple();
    } else {
      snake.pop();
    }
    updateLedger();
  }

  // ---------- Drawing ----------
  function draw() {
    drawFelt();
    drawApple();
    drawSnake();
  }

  function drawFelt() {
    const w = GRID * CELL, h = GRID * CELL;
    // base felt gradient
    const g = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.75);
    g.addColorStop(0, COLORS.feltLight);
    g.addColorStop(1, COLORS.feltDark);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // subtle diagonal weave
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    for (let i = -h; i < w; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    ctx.restore();

    // grid (faint, gold)
    ctx.save();
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < GRID; i++) {
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, h);
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(w, i * CELL + 0.5);
    }
    ctx.stroke();
    ctx.restore();

    // border accent
    ctx.save();
    ctx.strokeStyle = COLORS.gridStrong;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
    ctx.restore();
  }

  function drawApple() {
    const cx = apple.x * CELL + CELL / 2;
    const cy = apple.y * CELL + CELL / 2;
    const r  = CELL * 0.36;

    // soft glow
    ctx.save();
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 2.4);
    glow.addColorStop(0, "rgba(127, 213, 138, 0.28)");
    glow.addColorStop(1, "rgba(127, 213, 138, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // emerald body (with facet highlight)
    ctx.save();
    const grad = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.5, 1, cx, cy, r);
    grad.addColorStop(0, COLORS.appleHi);
    grad.addColorStop(0.55, COLORS.apple);
    grad.addColorStop(1, "#0d3a1f");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // facet sparkle
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy - r * 0.45, r * 0.18, r * 0.10, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // tiny stem
    ctx.strokeStyle = COLORS.appleStem;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx + 4, cy - r - 4, cx + 6, cy - r - 1);
    ctx.stroke();
    ctx.restore();
  }

  function drawSnake() {
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const isHead = i === 0;
      const x = seg.x * CELL;
      const y = seg.y * CELL;
      drawSegment(x, y, isHead, i);
    }
  }

  function drawSegment(x, y, isHead, idx) {
    const pad = 2;
    const rx = x + pad;
    const ry = y + pad;
    const rs = CELL - pad * 2;
    const radius = isHead ? 8 : 6;

    // body fill — antique gold with subtle gradient
    ctx.save();
    const grad = ctx.createLinearGradient(rx, ry, rx, ry + rs);
    grad.addColorStop(0, isHead ? COLORS.snakeHead : "#d8bd6a");
    grad.addColorStop(1, isHead ? "#a07f33" : COLORS.snakeEdge);
    ctx.fillStyle = grad;
    roundRect(ctx, rx, ry, rs, rs, radius);
    ctx.fill();

    // edge stroke
    ctx.strokeStyle = "rgba(20, 30, 18, 0.55)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // soft highlight
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    roundRect(ctx, rx + 2, ry + 2, rs - 4, (rs - 4) / 2.4, radius - 2);
    ctx.fill();

    // scale dots
    if (!isHead && idx % 2 === 0) {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.arc(rx + rs / 2, ry + rs / 2, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // eyes for head, oriented to direction
    if (isHead) {
      const cx = rx + rs / 2;
      const cy = ry + rs / 2;
      const eyeOff = rs * 0.22;
      const eyeR = 2.2;

      let ex1, ey1, ex2, ey2;
      if (dir.x === 1) {
        ex1 = cx + eyeOff; ey1 = cy - eyeOff * 0.7;
        ex2 = cx + eyeOff; ey2 = cy + eyeOff * 0.7;
      } else if (dir.x === -1) {
        ex1 = cx - eyeOff; ey1 = cy - eyeOff * 0.7;
        ex2 = cx - eyeOff; ey2 = cy + eyeOff * 0.7;
      } else if (dir.y === -1) {
        ex1 = cx - eyeOff * 0.7; ey1 = cy - eyeOff;
        ex2 = cx + eyeOff * 0.7; ey2 = cy - eyeOff;
      } else {
        ex1 = cx - eyeOff * 0.7; ey1 = cy + eyeOff;
        ex2 = cx + eyeOff * 0.7; ey2 = cy + eyeOff;
      }
      ctx.fillStyle = "#f4ecd8";
      ctx.beginPath(); ctx.arc(ex1, ey1, eyeR + 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex2, ey2, eyeR + 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = COLORS.eyes;
      ctx.beginPath(); ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  // ---------- Boot ----------
  reset();
  draw();
  // start the RAF loop so we always render even when idle
  if (rafId === null) rafId = requestAnimationFrame(loop);
})();
