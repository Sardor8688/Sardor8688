/* =============================================================
   The Serpent Club — Snake Multiverse
   Skins: Old Money, Iron Man, Spider-Man, Hulk, Captain America,
          Thanos, Black Panther, Cyber Modern
   ============================================================= */

(() => {
  "use strict";

  // =============================================================
  //  Config
  // =============================================================
  const GRID = 20;                      // cells per side
  const CELL = 24;                      // px per cell (canvas 480x480 logical)
  const BASE_TICK_MS = 140;
  const MIN_TICK_MS  = 60;
  const TEMPO_STEPS  = [
    { t: 130, name: "Largo" },
    { t: 115, name: "Andante" },
    { t: 100, name: "Allegretto" },
    { t: 85,  name: "Allegro" },
    { t: 70,  name: "Vivace" },
    { t: 60,  name: "Presto" },
  ];

  // =============================================================
  //  Skins — text + palette + drawing flavor
  // =============================================================
  /**
   * Each skin defines:
   *   text:    visible copy that replaces masthead / overlay / colophon
   *   palette: canvas colors for snake / apple / board accents
   *   apple:   shape style ('emerald' | 'arc' | 'web' | 'gamma' | 'star' | 'stone' | 'vibranium' | 'chip')
   *   snake:   body style ('scale' | 'plate' | 'web' | 'rage' | 'shield' | 'gauntlet' | 'cloak' | 'glow')
   *   tempos:  override default tempo names (optional)
   *   tempoName: callable to pick a tempo word from ms (optional)
   */
  const SKINS = {
    "old-money": {
      text: {
        eyebrow:   "Members Only · Est. MMXXV",
        wordmark:  "The Serpent Club",
        tagline:   "<em>An Exercise in Patience &amp; Quiet Fortune</em>",
        ledgerL:   "Ledger",
        ledgerR:   "House Rules",
        seal:      "S·C",
        rules: [
          "One does not strike the walls.",
          "One does not consume oneself.",
          "One collects emeralds with composure.",
          "The tempo quickens. So shall you.",
        ],
        overlay: {
          eyebrow: "Welcome",
          title:   "Pour yourself a drink.",
          body:    "Guide the serpent with the arrow keys, or <em>W · A · S · D</em>. Collect the heirloom emeralds. Decline the walls.",
          start:   "Begin the Round",
          resume:  "Resume the Round",
          again:   "Play Another Round",
          pause:   { eyebrow: "Intermission", title: "Catch your breath.", body: "The serpent rests with you. Press <em>Space</em> to resume." },
          over:    { eyebrow: "A Most Dignified End" },
        },
        endTitles: ["A regrettable opening.", "A modest gathering.", "Quite respectable.", "Most distinguished.", "An heirloom performance.", "Dynastic, truly."],
        colophon: 'Bound &amp; Pressed by The Serpent Club · <span class="amp">&amp;</span> · A Private Pastime',
        colophonMono: "No. 001 · First Edition · MMXXV",
      },
      palette: {
        feltDark: "#10311f", feltLight: "#1d4a2c",
        grid: "rgba(212,168,75,0.07)", grid2: "rgba(212,168,75,0.14)",
        snakeBody: "#cdb15c", snakeHead: "#e7c870", snakeEdge: "#8a6d2a", eye: "#0f2a1d",
        accent: "#d4a84b",
        appleCore: "#1f6b3a", appleHi: "#7fd58a", appleStem: "#5b3a1f",
        particle: "#7fd58a",
      },
      apple: "emerald",
      snake: "scale",
    },

    "iron-man": {
      text: {
        eyebrow:   "STARK INDUSTRIES · MK. LXXXV",
        wordmark:  "Iron Serpent",
        tagline:   "Genius. Billionaire. <em>Anaconda.</em>",
        ledgerL:   "Telemetry",
        ledgerR:   "Mission Brief",
        seal:      "ARC",
        rules: [
          "Do not breach the perimeter.",
          "Do not coil into your own armor.",
          "Collect arc reactors. Charge ahead.",
          "JARVIS will accelerate the tempo.",
        ],
        overlay: {
          eyebrow: "JARVIS Online",
          title:   "Suit up.",
          body:    "Arc reactor charged. Use arrows or <em>WASD</em>. <em>Space</em> to pause. Don't crash the prototype, sir.",
          start:   "Engage Thrusters",
          resume:  "Re-engage",
          again:   "Reboot the Suit",
          pause:   { eyebrow: "System Halt", title: "Power conserved.", body: "Hold position. Press <em>Space</em> to resume." },
          over:    { eyebrow: "Mission Compromised" },
        },
        endTitles: ["Prototype destroyed.", "Minor structural damage.", "Acceptable performance.", "Stark-grade execution.", "Avengers-tier flight.", "I AM IRON SNAKE."],
        colophon: 'Powered by an arc reactor · <span class="amp">⚡</span> · Stark Tower',
        colophonMono: "MARK LXXXV · v.2099",
      },
      palette: {
        feltDark: "#1a0a0a", feltLight: "#3a0d0d",
        grid: "rgba(255,196,0,0.08)", grid2: "rgba(255,196,0,0.18)",
        snakeBody: "#c41e1e", snakeHead: "#ff3838", snakeEdge: "#7a0d0d", eye: "#fff",
        accent: "#ffc400", accent2: "#00d4ff",
        appleCore: "#00d4ff", appleHi: "#88f0ff", appleStem: "#003355",
        particle: "#ffc400",
      },
      apple: "arc",
      snake: "plate",
    },

    "spider-man": {
      text: {
        eyebrow:   "FRIENDLY NEIGHBORHOOD · QUEENS, NY",
        wordmark:  "Web Crawler",
        tagline:   "With great length comes <em>great responsibility</em>.",
        ledgerL:   "Spider-Stats",
        ledgerR:   "Spider-Sense",
        seal:      "SM",
        rules: [
          "Don't hit the buildings.",
          "Don't get tangled in your own web.",
          "Collect web cartridges. Sling more.",
          "Spider-sense tingles faster as you grow.",
        ],
        overlay: {
          eyebrow: "Spider-Sense",
          title:   "Thwip.",
          body:    "Sling through the city. Arrows or <em>WASD</em>. <em>Space</em> to hang for a sec. Don't get clotheslined.",
          start:   "Sling Web",
          resume:  "Keep Swinging",
          again:   "One More Round",
          pause:   { eyebrow: "Mid-Air", title: "Hangin' out.", body: "Press <em>Space</em> to keep swinging." },
          over:    { eyebrow: "Splat." },
        },
        endTitles: ["My bad, my bad.", "Rookie swing.", "Solid round, true believer.", "Daily Bugle headline.", "Spectacular Spider-Snake.", "AMAZING. FANTASTIC. ULTIMATE."],
        colophon: 'Web fluid by Parker Industries · <span class="amp">🕷</span> · Queens',
        colophonMono: "ISSUE #001 · MARVEL COMICS",
      },
      palette: {
        feltDark: "#0a0e26", feltLight: "#1a2966",
        grid: "rgba(255,255,255,0.06)", grid2: "rgba(255,255,255,0.14)",
        snakeBody: "#dc283c", snakeHead: "#ff3a4f", snakeEdge: "#88151f", eye: "#ffffff",
        accent: "#0a3d99", accent2: "#ffffff",
        appleCore: "#ffffff", appleHi: "#cce4ff", appleStem: "#0a3d99",
        particle: "#ffffff",
      },
      apple: "web",
      snake: "web",
    },

    "hulk": {
      text: {
        eyebrow:   "GAMMA LAB · CODE GREEN",
        wordmark:  "SMASH SERPENT",
        tagline:   "Snake angry. Snake hungry. <em>SNAKE SMASH.</em>",
        ledgerL:   "GAMMA STATS",
        ledgerR:   "HULK RULES",
        seal:      "γ",
        rules: [
          "HULK NO HIT WALL.",
          "HULK NO BITE HULK.",
          "HULK SMASH GAMMA STONE.",
          "HULK GET FAST. HULK GET MAD.",
        ],
        overlay: {
          eyebrow: "GAMMA SURGE",
          title:   "HULK READY.",
          body:    "Use arrow keys. Or <em>WASD</em>. <em>Space</em> to puny pause. <em>R</em> to start over. HULK SMASH PUNY GREEN ORBS.",
          start:   "HULK SMASH",
          resume:  "HULK CONTINUE",
          again:   "HULK SMASH AGAIN",
          pause:   { eyebrow: "PUNY PAUSE", title: "HULK WAIT.", body: "HULK PRESS SPACE TO SMASH MORE." },
          over:    { eyebrow: "HULK FALL." },
        },
        endTitles: ["HULK DISAPPOINT.", "HULK OKAY.", "HULK STRONG.", "HULK STRONGEST.", "HULK BEST.", "HULK STRONGEST THERE IS."],
        colophon: 'Gamma-irradiated by Banner Labs · <span class="amp">γ</span> · CODE GREEN',
        colophonMono: "INCREDIBLE · ISSUE #001",
      },
      palette: {
        feltDark: "#081a08", feltLight: "#1a3a1a",
        grid: "rgba(127,232,90,0.10)", grid2: "rgba(127,232,90,0.24)",
        snakeBody: "#5fb83a", snakeHead: "#7fe85a", snakeEdge: "#2a5a1a", eye: "#1a0a3a",
        accent: "#7a3aff", accent2: "#7fe85a",
        appleCore: "#7a3aff", appleHi: "#c89aff", appleStem: "#3a1a7a",
        particle: "#7fe85a",
      },
      apple: "gamma",
      snake: "rage",
    },

    "captain-america": {
      text: {
        eyebrow:   "S.H.I.E.L.D. · SENTINEL OF LIBERTY",
        wordmark:  "Star-Spangled Snake",
        tagline:   "<em>I can do this all day.</em>",
        ledgerL:   "Mission Stats",
        ledgerR:   "Code of Honor",
        seal:      "★",
        rules: [
          "Hold the line.",
          "Don't bite your own shield.",
          "Collect the stars of liberty.",
          "On your left.",
        ],
        overlay: {
          eyebrow: "Avengers Assemble",
          title:   "Shield up.",
          body:    "Arrows or <em>WASD</em> to move. <em>Space</em> to regroup. Stay sharp, soldier.",
          start:   "Move Out",
          resume:  "Resume the Mission",
          again:   "Run It Back",
          pause:   { eyebrow: "Standing Down", title: "Hold position.", body: "Press <em>Space</em> to move out again." },
          over:    { eyebrow: "Mission Failed" },
        },
        endTitles: ["Soldier down.", "We'll regroup.", "Solid hustle, soldier.", "Avengers-grade work.", "Steve would be proud.", "On your left."],
        colophon: 'Property of S.H.I.E.L.D. · <span class="amp">★</span> · Sentinel of Liberty',
        colophonMono: "ISSUE #1941 · CLASSIFIED",
      },
      palette: {
        feltDark: "#0a1340", feltLight: "#15276b",
        grid: "rgba(255,255,255,0.10)", grid2: "rgba(255,255,255,0.22)",
        snakeBody: "#dc283c", snakeHead: "#ffffff", snakeEdge: "#88151f", eye: "#0a1340",
        accent: "#ffffff", accent2: "#dc283c",
        appleCore: "#ffffff", appleHi: "#fff8cc", appleStem: "#dc283c",
        particle: "#ffffff",
      },
      apple: "star",
      snake: "shield",
    },

    "thanos": {
      text: {
        eyebrow:   "TITAN · THE MAD SERPENT",
        wordmark:  "Infinity Serpent",
        tagline:   "<em>Perfectly balanced, as all snakes should be.</em>",
        ledgerL:   "Stones",
        ledgerR:   "Inevitabilities",
        seal:      "∞",
        rules: [
          "Half of all walls must be avoided.",
          "Do not consume yourself. Reality will fold.",
          "Collect the Infinity Stones.",
          "Inevitable acceleration awaits.",
        ],
        overlay: {
          eyebrow: "On Titan",
          title:   "Your destiny awaits.",
          body:    "Use arrows or <em>WASD</em>. <em>Space</em> to pause. <em>R</em> to restart. The path to balance is long.",
          start:   "I am Inevitable",
          resume:  "Continue the Quest",
          again:   "Snap Again",
          pause:   { eyebrow: "Stillness", title: "The universe holds its breath.", body: "Press <em>Space</em> to continue." },
          over:    { eyebrow: "Reality Folds" },
        },
        endTitles: ["A small price.", "Balance, partly.", "Ascending Titan.", "Mind. Soul. Body.", "Six stones, nearly.", "PERFECTLY BALANCED."],
        colophon: 'Forged in the fires of Nidavellir · <span class="amp">∞</span> · Titan',
        colophonMono: "INFINITY SAGA · VOL. ∞",
      },
      palette: {
        feltDark: "#170a26", feltLight: "#3a1a55",
        grid: "rgba(212,168,75,0.10)", grid2: "rgba(212,168,75,0.24)",
        snakeBody: "#a060d8", snakeHead: "#c889e8", snakeEdge: "#5a2a88", eye: "#1a0a2a",
        accent: "#d4a84b", accent2: "#ffd870",
        appleCore: "#ffaa1a", appleHi: "#ffe066", appleStem: "#aa6600",
        particle: "#ffd870",
      },
      apple: "stone",
      snake: "gauntlet",
    },

    "black-panther": {
      text: {
        eyebrow:   "WAKANDA FOREVER · VIBRANIUM SPEC.",
        wordmark:  "Vibranium Serpent",
        tagline:   "<em>In time of war we live in peace.</em>",
        ledgerL:   "Tribal Council",
        ledgerR:   "Way of the Panther",
        seal:      "W",
        rules: [
          "Honor the borders of the Golden City.",
          "Coil with discipline.",
          "Collect vibranium shards.",
          "Move like a panther.",
        ],
        overlay: {
          eyebrow: "Wakanda",
          title:   "Show them who you are.",
          body:    "Stalk with arrows or <em>WASD</em>. <em>Space</em> to hold the council. <em>R</em> to begin again.",
          start:   "Take the Throne",
          resume:  "Hunt Onward",
          again:   "Challenge Again",
          pause:   { eyebrow: "Council", title: "The tribes gather.", body: "Press <em>Space</em> to resume the hunt." },
          over:    { eyebrow: "The Hunt Ends" },
        },
        endTitles: ["A modest hunt.", "Respectable.", "Worthy of the council.", "King-tier.", "Wakanda-grade.", "WAKANDA FOREVER."],
        colophon: "Crafted by Shuri's lab · <span class=\"amp\">W</span> · Wakanda",
        colophonMono: "BIRNIN ZANA · VIBRANIUM SPEC.",
      },
      palette: {
        feltDark: "#06060a", feltLight: "#1a1a2a",
        grid: "rgba(160,108,255,0.08)", grid2: "rgba(160,108,255,0.20)",
        snakeBody: "#3a1a7a", snakeHead: "#6a3aff", snakeEdge: "#1a0a3a", eye: "#a06cff",
        accent: "#a06cff", accent2: "#c89aff",
        appleCore: "#a06cff", appleHi: "#d8b8ff", appleStem: "#3a1a7a",
        particle: "#a06cff",
      },
      apple: "vibranium",
      snake: "cloak",
    },

    "cyber": {
      text: {
        eyebrow:   "NEO TOKYO · 2099",
        wordmark:  "NEON.SNAKE",
        tagline:   "<em>ghost in the grid</em>",
        ledgerL:   "STATS.SYS",
        ledgerR:   "PROTOCOL",
        seal:      "01",
        rules: [
          "boundary == lethal()",
          "self_collision: TRUE → game_over()",
          "consume(token) → score += 1",
          "tick_ms -= 5  per cycle",
        ],
        overlay: {
          eyebrow: "BOOT.SEQUENCE",
          title:   "JACK IN.",
          body:    "Move with arrows or <em>WASD</em>. <em>Space</em> halts execution. <em>R</em> reinitializes.",
          start:   "INITIATE",
          resume:  "RESUME PROCESS",
          again:   "REBOOT",
          pause:   { eyebrow: "PROC.HALT", title: "PAUSED.", body: "Press <em>SPACE</em> to resume." },
          over:    { eyebrow: "FATAL.ERR" },
        },
        endTitles: ["RUNTIME ERROR.", "CONNECTION DROPPED.", "STABLE.RUN.", "OVERCLOCKED.", "GHOST_PROTOCOL.", "ROOT.ACCESS.GRANTED"],
        colophon: 'Compiled in Neo Tokyo · <span class="amp">◆</span> · build 2099.04',
        colophonMono: "v0.99.7-NEON · MIT-X",
      },
      palette: {
        feltDark: "#040814", feltLight: "#0a1428",
        grid: "rgba(0,240,255,0.12)", grid2: "rgba(0,240,255,0.28)",
        snakeBody: "#00f0ff", snakeHead: "#88ffff", snakeEdge: "#0066aa", eye: "#040814",
        accent: "#ff00aa", accent2: "#88ffff",
        appleCore: "#ff00aa", appleHi: "#ff88dd", appleStem: "#aa0066",
        particle: "#00f0ff",
      },
      apple: "chip",
      snake: "glow",
    },
  };

  const SKIN_ORDER = ["old-money", "iron-man", "spider-man", "hulk", "captain-america", "thanos", "black-panther", "cyber"];
  let currentSkinKey = "old-money";

  // =============================================================
  //  DOM
  // =============================================================
  const canvas    = document.getElementById("board");
  const ctx       = canvas.getContext("2d");
  const fxLayer   = document.getElementById("fx-layer");
  const boardMat  = document.getElementById("board-mat");
  const scoreEl   = document.getElementById("score");
  const highEl    = document.getElementById("high-score");
  const lengthEl  = document.getElementById("length");
  const tempoEl   = document.getElementById("tempo");
  const overlay   = document.getElementById("overlay");
  const overlayEyebrow = document.getElementById("overlay-eyebrow");
  const overlayTitle   = document.getElementById("overlay-title");
  const overlayBody    = document.getElementById("overlay-body");
  const startBtn  = document.getElementById("start-btn");
  const eyebrowEl = document.getElementById("eyebrow");
  const wordmark  = document.getElementById("wordmark");
  const taglineEl = document.getElementById("tagline");
  const ledgerLT  = document.getElementById("ledger-title-left");
  const ledgerRT  = document.getElementById("ledger-title-right");
  const sealMono  = document.getElementById("seal-mono");
  const rulesEl   = document.getElementById("rules");
  const colophonLine = document.getElementById("colophon-line");
  const colophonMono = document.getElementById("colophon-mono");
  const soundBtn  = document.getElementById("sound-toggle");
  const soundState= document.getElementById("sound-state");
  const skinChips = document.querySelectorAll(".skin-chip");

  // =============================================================
  //  HiDPI
  // =============================================================
  function setupHiDPI() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width  = GRID * CELL * dpr;
    canvas.height = GRID * CELL * dpr;
    canvas.style.width  = (GRID * CELL) + "px";
    canvas.style.height = (GRID * CELL) + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  setupHiDPI();
  window.addEventListener("resize", () => { setupHiDPI(); draw(); });

  // =============================================================
  //  Game state
  // =============================================================
  const STATE = { IDLE: "idle", RUNNING: "running", PAUSED: "paused", OVER: "over" };

  let snake, dir, pendingDir, apple, score, high, tickMs, lastTick;
  let rafId = null;
  let state = STATE.IDLE;
  let tickFrame = 0;       // increments per movement step (for animation phase)
  let appleAnimT = 0;      // continuously increasing for apple bobbing/glow

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

  function updateLedger(bump) {
    scoreEl.textContent  = score;
    lengthEl.textContent = snake.length;
    highEl.textContent   = high;
    tempoEl.textContent  = tempoLabel(tickMs);
    if (bump === "score") flashEl(scoreEl);
  }
  function flashEl(el) {
    el.classList.add("bump");
    setTimeout(() => el.classList.remove("bump"), 220);
  }

  function tempoLabel(ms) {
    for (const step of TEMPO_STEPS) if (ms >= step.t) return step.name;
    return "Prestissimo";
  }

  // =============================================================
  //  Persistence
  // =============================================================
  function loadHigh() {
    try { return parseInt(localStorage.getItem("serpent-club:high") || "0", 10) || 0; }
    catch (_) { return 0; }
  }
  function saveHigh(v) { try { localStorage.setItem("serpent-club:high", String(v)); } catch (_) {} }

  function loadSkin() {
    try {
      const v = localStorage.getItem("serpent-club:skin");
      return SKINS[v] ? v : "old-money";
    } catch (_) { return "old-money"; }
  }
  function saveSkin(v) { try { localStorage.setItem("serpent-club:skin", v); } catch (_) {} }

  function loadMute() {
    try { return localStorage.getItem("serpent-club:mute") === "1"; } catch (_) { return false; }
  }
  function saveMute(v) { try { localStorage.setItem("serpent-club:mute", v ? "1" : "0"); } catch (_) {} }

  high = loadHigh();
  let muted = loadMute();

  // =============================================================
  //  Audio (Web Audio API — no external assets)
  // =============================================================
  let audioCtx = null;
  function ac() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (_) { audioCtx = null; }
    }
    return audioCtx;
  }

  function beep({ freq = 440, dur = 0.08, type = "sine", gain = 0.04, slide = 0 } = {}) {
    if (muted) return;
    const c = ac(); if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), c.currentTime + dur);
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + dur + 0.02);
  }

  function sfxMove() { beep({ freq: 320, dur: 0.04, type: "square", gain: 0.012 }); }
  function sfxEat()  {
    beep({ freq: 720, dur: 0.10, type: "triangle", gain: 0.06, slide: 540 });
    setTimeout(() => beep({ freq: 1320, dur: 0.08, type: "sine", gain: 0.04 }), 70);
  }
  function sfxDie()  {
    beep({ freq: 220, dur: 0.18, type: "sawtooth", gain: 0.08, slide: -160 });
    setTimeout(() => beep({ freq: 90, dur: 0.30, type: "sawtooth", gain: 0.07, slide: -50 }), 180);
  }
  function sfxStart(){
    beep({ freq: 520, dur: 0.06, type: "triangle", gain: 0.04 });
    setTimeout(() => beep({ freq: 780, dur: 0.08, type: "triangle", gain: 0.05 }), 80);
  }
  function sfxSkin() {
    beep({ freq: 880, dur: 0.06, type: "sine", gain: 0.03 });
    setTimeout(() => beep({ freq: 1320, dur: 0.05, type: "sine", gain: 0.025 }), 60);
  }

  // =============================================================
  //  Skin application
  // =============================================================
  function applySkin(key, { silent = false } = {}) {
    if (!SKINS[key]) key = "old-money";
    currentSkinKey = key;
    document.body.dataset.skin = key;
    const t = SKINS[key].text;

    eyebrowEl.textContent = t.eyebrow;
    wordmark.textContent  = t.wordmark;
    taglineEl.innerHTML   = t.tagline;
    ledgerLT.textContent  = t.ledgerL;
    ledgerRT.textContent  = t.ledgerR;
    sealMono.innerHTML    = t.seal;
    rulesEl.innerHTML     = t.rules.map(r => `<li>${r}</li>`).join("");
    colophonLine.innerHTML = t.colophon;
    colophonMono.textContent = t.colophonMono;

    // overlay text — only if currently idle/over (don't stomp on pause / running views)
    if (state === STATE.IDLE) {
      overlayEyebrow.textContent = t.overlay.eyebrow;
      overlayTitle.textContent   = t.overlay.title;
      overlayBody.innerHTML      = t.overlay.body;
      startBtn.textContent       = t.overlay.start;
    } else if (state === STATE.OVER) {
      // After gameOver(), overlay innerHTML was rebuilt, so we re-render it
      // with the new skin's text via showOverlay()
      const titleIdx = Math.min(t.endTitles.length - 1,
        score === 0 ? 0 : score < 5 ? 1 : score < 12 ? 2 : score < 20 ? 3 : score < 30 ? 4 : 5);
      showOverlay({
        eyebrow: t.overlay.over.eyebrow,
        title:   t.endTitles[titleIdx],
        body:    `Final score: <strong>${score}</strong> &middot; Length: <strong>${snake.length}</strong>` +
                 `<br/>Personal best: <strong>${high}</strong>.`,
        button:  t.overlay.again,
      });
    }

    // active chip
    skinChips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.skin === key);
    });

    saveSkin(key);
    if (!silent) sfxSkin();
    // restart paper pop animation
    document.querySelector(".paper").style.animation = "none";
    void document.querySelector(".paper").offsetWidth;
    document.querySelector(".paper").style.animation = "";
    draw();
  }

  // =============================================================
  //  Input
  // =============================================================
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
    const next = DIRS[name]; if (!next) return;
    const cur  = pendingDir || dir;
    if (cur.x + next.x === 0 && cur.y + next.y === 0) return;
    pendingDir = next;
    sfxMove();
  }

  window.addEventListener("keydown", (e) => {
    // skin hotkeys 1–8
    if (e.key >= "1" && e.key <= "9") {
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < SKIN_ORDER.length) {
        e.preventDefault();
        applySkin(SKIN_ORDER[idx]);
        return;
      }
    }
    if (e.key === "m" || e.key === "M") { e.preventDefault(); toggleMute(); return; }
    if (e.key === " " || e.code === "Space") { e.preventDefault(); togglePause(); return; }
    if (e.key === "r" || e.key === "R")     { e.preventDefault(); restart(); return; }
    const name = KEYS[e.key];
    if (name) {
      e.preventDefault();
      if (state === STATE.IDLE) start();
      queueDirection(name);
    }
  }, { passive: false });

  startBtn.addEventListener("click", () => start());

  // skin chips
  skinChips.forEach((chip) => {
    chip.addEventListener("click", () => applySkin(chip.dataset.skin));
  });

  // sound toggle
  soundBtn.addEventListener("click", () => toggleMute());
  function toggleMute() {
    muted = !muted;
    saveMute(muted);
    soundBtn.setAttribute("aria-pressed", String(!muted));
    soundState.textContent = muted ? "Off" : "On";
    if (!muted) sfxSkin();
  }
  // initial UI state for sound
  soundBtn.setAttribute("aria-pressed", String(!muted));
  soundState.textContent = muted ? "Off" : "On";

  // touchpad
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
    if (Math.abs(dx) > Math.abs(dy)) queueDirection(dx > 0 ? "right" : "left");
    else                              queueDirection(dy > 0 ? "down" : "up");
    touchStart = null;
  }, { passive: true });

  // =============================================================
  //  Lifecycle
  // =============================================================
  function start() {
    if (state === STATE.IDLE || state === STATE.OVER) reset();
    overlay.classList.add("hidden");
    state = STATE.RUNNING;
    lastTick = performance.now();
    sfxStart();
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }
  function togglePause() {
    if (state === STATE.RUNNING) {
      state = STATE.PAUSED;
      const t = SKINS[currentSkinKey].text;
      showOverlay({ eyebrow: t.overlay.pause.eyebrow, title: t.overlay.pause.title,
                    body: t.overlay.pause.body, button: t.overlay.resume });
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
    sfxStart();
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }
  function gameOver() {
    state = STATE.OVER;
    if (score > high) { high = score; saveHigh(high); }
    updateLedger();
    sfxDie();
    boardMat.classList.add("shake");
    setTimeout(() => boardMat.classList.remove("shake"), 420);

    const t = SKINS[currentSkinKey].text;
    const titleIdx = Math.min(t.endTitles.length - 1,
      score === 0 ? 0 : score < 5 ? 1 : score < 12 ? 2 : score < 20 ? 3 : score < 30 ? 4 : 5);
    showOverlay({
      eyebrow: t.overlay.over.eyebrow,
      title:   t.endTitles[titleIdx],
      body:    `Final score: <strong>${score}</strong> &middot; Length: <strong>${snake.length}</strong>` +
               `<br/>Personal best: <strong>${high}</strong>.`,
      button:  t.overlay.again,
    });
  }
  function showOverlay({ eyebrow, title, body, button }) {
    overlay.innerHTML = `
      <div class="overlay-card">
        <p class="overlay-eyebrow">${eyebrow}</p>
        <h2 class="overlay-title">${title}</h2>
        <p class="overlay-body">${body}</p>
        <button id="start-btn" class="crest-btn" type="button">${button}</button>
        <p class="overlay-foot">
          <kbd>Space</kbd> pause &middot; <kbd>R</kbd> restart &middot;
          <kbd>1</kbd>&ndash;<kbd>8</kbd> skin &middot; <kbd>M</kbd> mute
        </p>
      </div>`;
    overlay.classList.remove("hidden");
    const btn = overlay.querySelector("#start-btn");
    btn.addEventListener("click", () => {
      if (state === STATE.PAUSED) togglePause();
      else                         start();
    });
  }

  // =============================================================
  //  Particles + score popups (DOM-based)
  // =============================================================
  function spawnParticles(cell, count = 14) {
    const cx = cell.x * CELL + CELL / 2 + 18; // +18 because fx-layer is inset 18px from board-mat
    const cy = cell.y * CELL + CELL / 2 + 18;
    const skin = SKINS[currentSkinKey].palette;
    const colors = [skin.particle, skin.appleHi, skin.accent, skin.accent2 || skin.appleHi];
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "fx-particle";
      const color = colors[i % colors.length];
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
      const speed = 60 + Math.random() * 90;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed - 10;
      const dur = 600 + Math.random() * 220;
      const size = 4 + Math.random() * 4;
      p.style.left = (cx - size / 2) + "px";
      p.style.top  = (cy - size / 2) + "px";
      p.style.width = p.style.height = size + "px";
      p.style.background = color;
      p.style.boxShadow = `0 0 8px ${color}`;
      p.style.transition = `transform ${dur}ms cubic-bezier(.22,.61,.36,1), opacity ${dur}ms ease-out`;
      fxLayer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random()*360}deg)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), dur + 60);
    }
  }
  function spawnPopup(cell, text) {
    const cx = cell.x * CELL + CELL / 2 + 18;
    const cy = cell.y * CELL + 18;
    const el = document.createElement("div");
    el.className = "fx-popup";
    el.innerHTML = text;
    el.style.left = cx + "px";
    el.style.top  = cy + "px";
    fxLayer.appendChild(el);
    setTimeout(() => el.remove(), 820);
  }

  // =============================================================
  //  Tick
  // =============================================================
  function loop(now) {
    rafId = requestAnimationFrame(loop);
    appleAnimT = now;
    if (state !== STATE.RUNNING) { draw(); return; }
    if (now - lastTick >= tickMs) { lastTick = now; step(); }
    draw();
  }

  function step() {
    if (pendingDir) { dir = pendingDir; pendingDir = null; }
    const head = snake[0];
    const next = { x: head.x + dir.x, y: head.y + dir.y };

    if (next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID) return gameOver();
    const eating    = (next.x === apple.x && next.y === apple.y);
    const checkBody = eating ? snake : snake.slice(0, -1);
    if (checkBody.some(s => s.x === next.x && s.y === next.y)) return gameOver();

    snake.unshift(next);
    if (eating) {
      score += 1;
      tickMs = Math.max(MIN_TICK_MS, BASE_TICK_MS - score * 5);
      spawnParticles(next);
      spawnPopup(next, "+1");
      sfxEat();
      placeApple();
    } else {
      snake.pop();
    }
    tickFrame++;
    updateLedger(eating ? "score" : null);
  }

  // =============================================================
  //  Drawing
  // =============================================================
  function draw() {
    drawFelt();
    drawApple();
    drawSnake();
  }

  function drawFelt() {
    const palette = SKINS[currentSkinKey].palette;
    const w = GRID * CELL, h = GRID * CELL;

    const g = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.75);
    g.addColorStop(0, palette.feltLight);
    g.addColorStop(1, palette.feltDark);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // skin-specific overlays
    if (currentSkinKey === "spider-man") {
      drawSpiderWeb(w, h, palette);
    } else if (currentSkinKey === "captain-america") {
      drawStripes(w, h, palette);
    } else if (currentSkinKey === "cyber") {
      drawScanlines(w, h, palette);
    } else if (currentSkinKey === "iron-man") {
      drawHexes(w, h, palette);
    } else if (currentSkinKey === "thanos") {
      drawCosmic(w, h, palette);
    } else if (currentSkinKey === "black-panther") {
      drawTriangles(w, h, palette);
    } else if (currentSkinKey === "hulk") {
      drawCracks(w, h, palette);
    } else {
      drawWeave(w, h);
    }

    // grid
    ctx.save();
    ctx.strokeStyle = palette.grid;
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
    ctx.strokeStyle = palette.grid2;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
    ctx.restore();
  }

  // ---------- Background variants ----------
  function drawWeave(w, h) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    for (let i = -h; i < w; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawSpiderWeb(w, h, palette) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1;
    const cx = w / 2, cy = h / 2;
    // radial spokes
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * w, cy + Math.sin(a) * w);
      ctx.stroke();
    }
    // concentric arcs
    for (let r = 40; r < w; r += 50) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawStripes(w, h, palette) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = "#dc283c";
    for (let i = 0; i < h; i += 48) {
      ctx.fillRect(0, i, w, 24);
    }
    ctx.restore();
  }
  function drawScanlines(w, h, palette) {
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = palette.accent;
    for (let i = 0; i < h; i += 4) ctx.fillRect(0, i, w, 1);
    // moving vertical sweep
    const sweepX = ((appleAnimT / 6) % (w + 80)) - 40;
    const grd = ctx.createLinearGradient(sweepX, 0, sweepX + 80, 0);
    grd.addColorStop(0, "rgba(0,240,255,0)");
    grd.addColorStop(0.5, "rgba(0,240,255,0.10)");
    grd.addColorStop(1, "rgba(0,240,255,0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = grd;
    ctx.fillRect(sweepX, 0, 80, h);
    ctx.restore();
  }
  function drawHexes(w, h, palette) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1;
    const r = 18;
    const dx = r * Math.sqrt(3);
    const dy = r * 1.5;
    for (let row = 0; row * dy < h + r; row++) {
      for (let col = 0; col * dx < w + dx; col++) {
        const cx = col * dx + (row % 2 === 1 ? dx / 2 : 0);
        const cy = row * dy;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = Math.PI / 6 + (Math.PI / 3) * k;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function drawCosmic(w, h, palette) {
    ctx.save();
    // stars
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = palette.accent;
    // Use deterministic-ish star positions seeded by (i)
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 73) % w);
      const sy = ((i * 137 + 41) % h);
      const tw = ((Math.sin(appleAnimT * 0.002 + i) + 1) / 2) * 0.8 + 0.2;
      ctx.globalAlpha = 0.10 + tw * 0.18;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.restore();
  }
  function drawTriangles(w, h, palette) {
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1;
    const s = 36;
    for (let y = 0; y < h; y += s) {
      for (let x = 0; x < w; x += s) {
        const flip = ((x / s) + (y / s)) % 2 === 0;
        ctx.beginPath();
        if (flip) {
          ctx.moveTo(x, y); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.closePath();
        } else {
          ctx.moveTo(x + s, y); ctx.lineTo(x + s, y + s); ctx.lineTo(x, y + s); ctx.closePath();
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function drawCracks(w, h, palette) {
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.5;
    // a few jagged lightning cracks
    const cracks = [
      [[w*0.1,0], [w*0.18,h*0.2], [w*0.12,h*0.4], [w*0.22,h*0.6], [w*0.16,h]],
      [[w*0.78,0], [w*0.84,h*0.18], [w*0.74,h*0.36], [w*0.86,h*0.55], [w*0.78,h]],
      [[0,h*0.5], [w*0.18,h*0.46], [w*0.34,h*0.58], [w*0.52,h*0.46], [w,h*0.55]],
    ];
    for (const c of cracks) {
      ctx.beginPath();
      ctx.moveTo(c[0][0], c[0][1]);
      for (let i = 1; i < c.length; i++) ctx.lineTo(c[i][0], c[i][1]);
      ctx.stroke();
    }
    ctx.restore();
  }

  // =============================================================
  //  Apple drawing — variant per skin
  // =============================================================
  function drawApple() {
    const skin = SKINS[currentSkinKey];
    const cx = apple.x * CELL + CELL / 2;
    const cy = apple.y * CELL + CELL / 2;
    const r  = CELL * 0.36;
    const pulse = 1 + Math.sin(appleAnimT / 220) * 0.05;

    switch (skin.apple) {
      case "arc":      return drawArcReactor(cx, cy, r * pulse, skin.palette);
      case "web":      return drawWebOrb(cx, cy, r * pulse, skin.palette);
      case "gamma":    return drawGammaCore(cx, cy, r * pulse, skin.palette);
      case "star":     return drawStar(cx, cy, r * pulse * 1.05, skin.palette);
      case "stone":    return drawInfinityStone(cx, cy, r * pulse, skin.palette);
      case "vibranium":return drawVibranium(cx, cy, r * pulse, skin.palette);
      case "chip":     return drawChip(cx, cy, r * pulse, skin.palette);
      case "emerald":
      default:         return drawEmerald(cx, cy, r * pulse, skin.palette);
    }
  }

  function drawAppleGlow(cx, cy, r, color, alpha = 0.32) {
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 2.4);
    glow.addColorStop(0, hexA(color, alpha));
    glow.addColorStop(1, hexA(color, 0));
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2); ctx.fill();
  }
  function hexA(hex, a) {
    if (hex.startsWith("rgba")) return hex;
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(x => x + x).join("");
    const r = parseInt(h.slice(0,2), 16), g = parseInt(h.slice(2,4), 16), b = parseInt(h.slice(4,6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function drawEmerald(cx, cy, r, p) {
    drawAppleGlow(cx, cy, r, p.appleHi, 0.28);
    const grad = ctx.createRadialGradient(cx - r*0.4, cy - r*0.5, 1, cx, cy, r);
    grad.addColorStop(0, p.appleHi);
    grad.addColorStop(0.55, p.appleCore);
    grad.addColorStop(1, "#0d3a1f");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath(); ctx.ellipse(cx - r*0.35, cy - r*0.45, r*0.18, r*0.10, -0.6, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = p.appleStem; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.quadraticCurveTo(cx + 4, cy - r - 4, cx + 6, cy - r - 1); ctx.stroke();
  }
  function drawArcReactor(cx, cy, r, p) {
    drawAppleGlow(cx, cy, r, p.appleHi, 0.6);
    const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.3, p.appleHi);
    grad.addColorStop(0.85, p.appleCore);
    grad.addColorStop(1, p.appleStem);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    // triangle pattern
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (Math.PI*2/3)*i + appleAnimT/600;
      const x1 = cx + Math.cos(a) * r * 0.65;
      const y1 = cy + Math.sin(a) * r * 0.65;
      const x2 = cx + Math.cos(a + Math.PI*2/3) * r * 0.65;
      const y2 = cy + Math.sin(a + Math.PI*2/3) * r * 0.65;
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.95)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2); ctx.stroke();
  }
  function drawWebOrb(cx, cy, r, p) {
    drawAppleGlow(cx, cy, r, p.appleCore, 0.32);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(10,61,153,0.85)"; ctx.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI/3)*i + appleAnimT/800;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * (0.35 + k*0.22), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  }
  function drawGammaCore(cx, cy, r, p) {
    drawAppleGlow(cx, cy, r, p.appleHi, 0.55);
    const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.4, p.appleHi);
    grad.addColorStop(1, p.appleCore);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    // gamma symbol-ish
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 2; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - r*0.4, cy - r*0.5);
    ctx.lineTo(cx + r*0.4, cy - r*0.5);
    ctx.moveTo(cx + r*0.1, cy - r*0.5);
    ctx.lineTo(cx - r*0.2, cy + r*0.5);
    ctx.stroke();
  }
  function drawStar(cx, cy, r, p) {
    drawAppleGlow(cx, cy, r, p.appleHi, 0.4);
    ctx.fillStyle = "#0a3d99";
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 1.5;
    ctx.stroke();
    // five-point star
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    const spikes = 5;
    const outer = r * 0.78, inner = r * 0.32;
    for (let i = 0; i < spikes * 2; i++) {
      const rr = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / spikes) * i - Math.PI / 2;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1; ctx.stroke();
  }
  function drawInfinityStone(cx, cy, r, p) {
    drawAppleGlow(cx, cy, r, p.appleHi, 0.5);
    // gem facets
    const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    grad.addColorStop(0, p.appleHi);
    grad.addColorStop(0.5, p.appleCore);
    grad.addColorStop(1, p.appleStem);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r * 0.85, cy - r * 0.3);
    ctx.lineTo(cx + r * 0.6, cy + r * 0.85);
    ctx.lineTo(cx - r * 0.6, cy + r * 0.85);
    ctx.lineTo(cx - r * 0.85, cy - r * 0.3);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = 1; ctx.stroke();
    // facet lines
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r * 0.85);
    ctx.moveTo(cx + r * 0.85, cy - r * 0.3); ctx.lineTo(cx - r * 0.6, cy + r * 0.85);
    ctx.moveTo(cx - r * 0.85, cy - r * 0.3); ctx.lineTo(cx + r * 0.6, cy + r * 0.85);
    ctx.stroke();
  }
  function drawVibranium(cx, cy, r, p) {
    drawAppleGlow(cx, cy, r, p.appleHi, 0.55);
    const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
    grad.addColorStop(0, p.appleHi);
    grad.addColorStop(0.6, p.appleCore);
    grad.addColorStop(1, p.appleStem);
    ctx.fillStyle = grad;
    // hex shard
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + (Math.PI / 3) * k + appleAnimT/1200;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1;
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + (Math.PI / 3) * k + appleAnimT/1200;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }
  }
  function drawChip(cx, cy, r, p) {
    drawAppleGlow(cx, cy, r, p.appleCore, 0.55);
    const s = r * 1.4;
    ctx.fillStyle = p.appleCore;
    ctx.fillRect(cx - s/2, cy - s/2, s, s);
    ctx.strokeStyle = p.appleHi; ctx.lineWidth = 1.2;
    ctx.strokeRect(cx - s/2, cy - s/2, s, s);
    // pins
    ctx.strokeStyle = p.accent2 || p.appleHi;
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) {
      const o = i * (s * 0.32);
      ctx.beginPath();
      ctx.moveTo(cx - s/2 - 4, cy + o); ctx.lineTo(cx - s/2, cy + o);
      ctx.moveTo(cx + s/2, cy + o);     ctx.lineTo(cx + s/2 + 4, cy + o);
      ctx.moveTo(cx + o, cy - s/2 - 4); ctx.lineTo(cx + o, cy - s/2);
      ctx.moveTo(cx + o, cy + s/2);     ctx.lineTo(cx + o, cy + s/2 + 4);
      ctx.stroke();
    }
    // inner core
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - 3, cy - 3, 6, 6);
  }

  // =============================================================
  //  Snake drawing — variant per skin
  // =============================================================
  function drawSnake() {
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const isHead = i === 0;
      drawSegment(seg.x * CELL, seg.y * CELL, isHead, i);
    }
  }

  function drawSegment(x, y, isHead, idx) {
    const skin = SKINS[currentSkinKey];
    const p = skin.palette;
    const pad = 2;
    const rx = x + pad, ry = y + pad;
    const rs = CELL - pad * 2;
    const radius = isHead ? 8 : 6;

    ctx.save();
    if (currentSkinKey === "cyber") {
      // Glow shadow
      ctx.shadowColor = p.snakeBody;
      ctx.shadowBlur = isHead ? 16 : 8;
    }

    const grad = ctx.createLinearGradient(rx, ry, rx, ry + rs);
    grad.addColorStop(0, isHead ? p.snakeHead : lighten(p.snakeBody, 0.05));
    grad.addColorStop(1, isHead ? darken(p.snakeBody, 0.18) : p.snakeEdge);
    ctx.fillStyle = grad;
    roundRect(ctx, rx, ry, rs, rs, radius);
    ctx.fill();

    ctx.strokeStyle = "rgba(20,30,18,0.55)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.shadowBlur = 0;

    // soft top highlight
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    roundRect(ctx, rx + 2, ry + 2, rs - 4, (rs - 4) / 2.4, radius - 2);
    ctx.fill();

    // skin-specific body texture
    if (!isHead) {
      switch (skin.snake) {
        case "plate":    drawPlateAccent(rx, ry, rs, p, idx); break;
        case "web":      drawWebAccent(rx, ry, rs, p, idx); break;
        case "rage":     drawRageAccent(rx, ry, rs, p, idx); break;
        case "shield":   drawShieldAccent(rx, ry, rs, p, idx); break;
        case "gauntlet": drawGauntletAccent(rx, ry, rs, p, idx); break;
        case "cloak":    drawCloakAccent(rx, ry, rs, p, idx); break;
        case "glow":     drawGlowAccent(rx, ry, rs, p, idx); break;
        case "scale":
        default:
          if (idx % 2 === 0) {
            ctx.fillStyle = "rgba(0,0,0,0.18)";
            ctx.beginPath();
            ctx.arc(rx + rs/2, ry + rs/2, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
      }
    }

    if (isHead) drawHead(rx, ry, rs, p);
    ctx.restore();
  }

  function drawHead(rx, ry, rs, p) {
    const cx = rx + rs / 2, cy = ry + rs / 2;
    const eyeOff = rs * 0.22;
    const eyeR = 2.2;
    let ex1, ey1, ex2, ey2;
    if (dir.x === 1) {
      ex1 = cx + eyeOff; ey1 = cy - eyeOff*0.7; ex2 = cx + eyeOff; ey2 = cy + eyeOff*0.7;
    } else if (dir.x === -1) {
      ex1 = cx - eyeOff; ey1 = cy - eyeOff*0.7; ex2 = cx - eyeOff; ey2 = cy + eyeOff*0.7;
    } else if (dir.y === -1) {
      ex1 = cx - eyeOff*0.7; ey1 = cy - eyeOff; ex2 = cx + eyeOff*0.7; ey2 = cy - eyeOff;
    } else {
      ex1 = cx - eyeOff*0.7; ey1 = cy + eyeOff; ex2 = cx + eyeOff*0.7; ey2 = cy + eyeOff;
    }
    const eyeWhite = (currentSkinKey === "spider-man" || currentSkinKey === "iron-man") ? "#ffffff" : "#f4ecd8";
    ctx.fillStyle = eyeWhite;
    ctx.beginPath(); ctx.arc(ex1, ey1, eyeR + 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ex2, ey2, eyeR + 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = p.eye;
    ctx.beginPath(); ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2); ctx.fill();
  }

  // body accent variants
  function drawPlateAccent(rx, ry, rs, p, idx) {
    if (idx % 2 === 0) {
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 1;
      ctx.strokeRect(rx + 4, ry + 4, rs - 8, rs - 8);
      ctx.fillStyle = p.accent;
      ctx.fillRect(rx + rs/2 - 1, ry + rs/2 - 1, 2, 2);
    }
  }
  function drawWebAccent(rx, ry, rs, p, idx) {
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rx + 4, ry + 4); ctx.lineTo(rx + rs - 4, ry + rs - 4);
    ctx.moveTo(rx + rs - 4, ry + 4); ctx.lineTo(rx + 4, ry + rs - 4);
    ctx.stroke();
  }
  function drawRageAccent(rx, ry, rs, p, idx) {
    if (idx % 2 === 0) {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(rx + 4, ry + 6, rs - 8, 2);
      ctx.fillRect(rx + 4, ry + rs - 8, rs - 8, 2);
    }
  }
  function drawShieldAccent(rx, ry, rs, p, idx) {
    if (idx % 3 === 0) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(rx + rs/2, ry + rs/2, rs * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0a3d99";
      ctx.beginPath();
      ctx.arc(rx + rs/2, ry + rs/2, rs * 0.10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function drawGauntletAccent(rx, ry, rs, p, idx) {
    // little gem dots in alternating colors
    const colors = ["#ffaa1a", "#3aaaff", "#3a3aff", "#ff3a3a", "#aa3aff", "#7aff7a"];
    if (idx % 2 === 0) {
      ctx.fillStyle = colors[idx % colors.length];
      ctx.beginPath();
      ctx.arc(rx + rs/2, ry + rs/2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.accent; ctx.lineWidth = 0.8; ctx.stroke();
    }
  }
  function drawCloakAccent(rx, ry, rs, p, idx) {
    ctx.strokeStyle = "rgba(160,108,255,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rx + 4, ry + 6); ctx.lineTo(rx + rs/2, ry + rs - 6); ctx.lineTo(rx + rs - 4, ry + 6);
    ctx.stroke();
  }
  function drawGlowAccent(rx, ry, rs, p, idx) {
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(rx + 3, ry + 3, rs - 6, rs - 6);
  }

  // color helpers
  function hexToRgb(hex) {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  function rgbToHex(r,g,b) {
    const c = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2,"0");
    return "#" + c(r) + c(g) + c(b);
  }
  function lighten(hex, amt) {
    if (!hex.startsWith("#")) return hex;
    const [r,g,b] = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
  }
  function darken(hex, amt) {
    if (!hex.startsWith("#")) return hex;
    const [r,g,b] = hexToRgb(hex);
    return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
  }

  function roundRect(c, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.lineTo(x + w - rr, y);
    c.quadraticCurveTo(x + w, y, x + w, y + rr);
    c.lineTo(x + w, y + h - rr);
    c.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    c.lineTo(x + rr, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - rr);
    c.lineTo(x, y + rr);
    c.quadraticCurveTo(x, y, x + rr, y);
    c.closePath();
  }

  // =============================================================
  //  Boot
  // =============================================================
  reset();
  applySkin(loadSkin(), { silent: true });
  draw();
  if (rafId === null) rafId = requestAnimationFrame(loop);
})();
