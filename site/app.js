/* SAToplam Information & Ideas — single-page app
   Reads questions.json + explanations.json (no answers.json) and
   renders topic list / question list / question detail with explanations.
   The correct-answer letter is intentionally never displayed.
*/

const TOPIC_ORDER = [
  { slug: "main_ideas",   title: "Main Ideas",
    blurb: "Identify the central claim a passage as a whole is making — the idea that ties every sentence together, not a stray detail." },
  { slug: "details",      title: "Details",
    blurb: "Locate a specific fact stated explicitly in the text and pick the option that restates only that fact, with no additions or distortions." },
  { slug: "inference",    title: "Inference",
    blurb: "Determine what the passage strongly implies but does not state outright — the option that completes the text or follows necessarily from it." },
  { slug: "support",      title: "Command of Evidence — Support",
    blurb: "Choose the finding that, if true, would most strengthen or directly back up an author's claim or hypothesis." },
  { slug: "weaken",       title: "Command of Evidence — Weaken",
    blurb: "Choose the finding that, if true, would most undermine, complicate, or call into question the claim or hypothesis being made." },
  { slug: "quotation",    title: "Quotation",
    blurb: "Pick the literary quotation whose content most directly illustrates a stated theme, character trait, or scholarly claim." },
  { slug: "graphs",       title: "Command of Evidence — Graphs",
    blurb: "Read a table or chart precisely and pick the option that uses only data the figure actually shows to complete the writer's statement." },
];

const TYPE_DEFINITION = {
  main_ideas: "A Main-Ideas question asks you to identify the single claim or argument that the passage as a whole is built to communicate. The correct option must cover the entire passage, not just one detail or example, and it cannot say anything stronger than what the passage actually claims.",
  details:    "A Details question asks you to find a fact that is stated directly in the text. The correct option restates that fact without adding new information, exaggerating, or making outside inferences. Anything that is partly correct and partly invented is wrong.",
  inference:  "An Inference question (often phrased as 'most logically completes the text') asks you to identify what must be true based on what the passage says. The correct option follows necessarily from the evidence the passage provides — it is not just plausible, it is the conclusion the passage is steering you toward.",
  support:    "A Command-of-Evidence (Support) question asks which finding, if true, would most strengthen the claim, hypothesis, or interpretation that the passage describes. The correct option directly matches every condition of the claim and provides exactly the kind of evidence the claim requires.",
  weaken:     "A Command-of-Evidence (Weaken) question asks which finding, if true, would most undermine the claim being made. The correct option directly contradicts the logic of the claim, exposes an alternative explanation, or removes a necessary condition the claim depends on.",
  quotation:  "A Quotation question asks you to choose the literary quotation whose content most directly illustrates a stated idea, theme, or scholarly conclusion. The correct option dramatizes the idea on the page itself — you should be able to point to the words that show the claim in action.",
  graphs:     "A Command-of-Evidence (Graphs) question asks you to read a chart or table precisely and select the option that completes the writer's statement using only what the figure literally shows. The correct option must be both fully supported by the data and consistent with the surrounding argument."
};

const state = {
  questions: [],
  byTopic: {},
  explanations: {},
  ready: false,
};

async function load() {
  const [qs, exps] = await Promise.all([
    fetch("data/questions.json").then(r => r.json()),
    fetch("data/explanations.json").then(r => r.json()).catch(() => ({})),
  ]);
  state.questions = qs;
  state.explanations = exps || {};
  state.byTopic = {};
  for (const q of qs) {
    (state.byTopic[q.topic_slug] ||= []).push(q);
  }
  for (const slug of Object.keys(state.byTopic)) {
    state.byTopic[slug].sort((a, b) => a.qnum_in_topic - b.qnum_in_topic);
  }
  state.ready = true;
  route();
}

function route() {
  if (!state.ready) return;
  const hash = location.hash || "#/";
  const main = document.getElementById("view");
  const crumb = document.getElementById("breadcrumb");
  if (hash === "#/" || hash === "") {
    crumb.innerHTML = "";
    renderHome(main);
    return;
  }
  const m = hash.match(/^#\/topic\/([a-z_]+)(?:\/(\d+))?$/);
  if (m) {
    const slug = m[1];
    const qnum = m[2] ? parseInt(m[2], 10) : null;
    if (qnum) renderQuestion(main, crumb, slug, qnum);
    else renderTopic(main, crumb, slug);
    return;
  }
  main.innerHTML = "<p>Page not found. <a href='#/'>Return home</a>.</p>";
}

function topicMeta(slug) {
  return TOPIC_ORDER.find(t => t.slug === slug) || { slug, title: slug, blurb: "" };
}

function escapeHtml(s) {
  return (s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderHome(main) {
  document.title = "SAToplam — Information & Ideas | Reasoning & Definitions";
  const cards = TOPIC_ORDER.map((t, i) => {
    const list = state.byTopic[t.slug] || [];
    const explainedCount = list.filter(q => hasExplanation(q)).length;
    return `
      <a class="topic-card" href="#/topic/${t.slug}">
        <div class="num">Section ${i + 1}</div>
        <div class="name">${escapeHtml(t.title)}</div>
        <div class="meta">${list.length} questions${explainedCount ? ` · ${explainedCount} with explanation` : ""}</div>
        <p class="muted" style="margin-top:8px">${escapeHtml(t.blurb)}</p>
      </a>
    `;
  }).join("");
  main.innerHTML = `
    <h1>Information &amp; Ideas</h1>
    <p class="lead">
      Every question from the SAToplam Reading Book's Information &amp; Ideas section, with a full prose explanation
      and a definition of the question type for each. <strong>Answer letters are deliberately not shown</strong> — the
      explanation walks you through the reasoning that points to the correct interpretation, so you can confirm your
      own choice rather than just memorising letters.
    </p>
    <div class="notice">
      <strong>How to use:</strong> read the passage, decide your answer, then read the explanation below to verify
      the reasoning. The explanation will describe the correct interpretation — without naming the letter — and tell
      you why the other readings collapse.
    </div>
    <div class="topic-grid">${cards}</div>
    <div class="tips">
      <h2>Reading-strategy reminders</h2>
      <ul>
        <li><strong>Cover everything, exaggerate nothing.</strong> A correct main-idea answer never says "only," "first," "always," or "best" unless the text really does.</li>
        <li><strong>Stick to the passage's own words.</strong> Inferences must follow from the evidence given, not from outside knowledge.</li>
        <li><strong>Match the claim, not just the topic.</strong> A "Support" or "Weaken" answer must speak to every part of the hypothesis, not just one half of it.</li>
        <li><strong>Use only the figure for graphs.</strong> A graph answer is wrong if it adds claims the chart cannot prove, even if those claims are true in real life.</li>
      </ul>
    </div>
  `;
}

function hasExplanation(q) {
  const e = state.explanations[`${q.topic_slug}:${q.qnum_in_topic}`];
  return e && (e.reasoning || e.why_correct);
}

function getExplanation(q) {
  return state.explanations[`${q.topic_slug}:${q.qnum_in_topic}`] || null;
}

function renderTopic(main, crumb, slug) {
  const meta = topicMeta(slug);
  const list = state.byTopic[slug] || [];
  document.title = `${meta.title} · SAToplam Information & Ideas`;
  crumb.innerHTML = `<a href="#/">Information &amp; Ideas</a> <span class="sep">›</span> ${escapeHtml(meta.title)}`;

  const items = list.map(q => {
    const preview = (q.passage || "").slice(0, 140) + ((q.passage || "").length > 140 ? "…" : "");
    const has = hasExplanation(q);
    return `
      <li>
        <a class="qn" href="#/topic/${slug}/${q.qnum_in_topic}">Q${q.qnum_in_topic}</a>
        <a class="preview" href="#/topic/${slug}/${q.qnum_in_topic}">${escapeHtml(preview || "(passage)")}</a>
        <span class="${has ? "has-exp" : "no-exp"}">${has ? "explanation" : "passage only"}</span>
      </li>
    `;
  }).join("");

  main.innerHTML = `
    <h1>${escapeHtml(meta.title)}</h1>
    <p class="lead">${escapeHtml(meta.blurb)}</p>
    <p class="muted">${list.length} questions in this section. Click any question to read the passage, the four options, and the full reasoning.</p>
    <div class="search-bar"><input id="filter" type="text" placeholder="Filter questions by passage text…" /></div>
    <ul class="question-list" id="qlist">${items}</ul>
  `;

  const input = document.getElementById("filter");
  const ql = document.getElementById("qlist");
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    for (const li of ql.children) {
      const t = li.textContent.toLowerCase();
      li.style.display = (!q || t.includes(q)) ? "" : "none";
    }
  });
}

function renderQuestion(main, crumb, slug, qnum) {
  const meta = topicMeta(slug);
  const list = state.byTopic[slug] || [];
  const q = list.find(x => x.qnum_in_topic === qnum);
  if (!q) {
    main.innerHTML = `<p>Question not found. <a href='#/topic/${slug}'>Back to ${escapeHtml(meta.title)}</a></p>`;
    return;
  }
  document.title = `${meta.title} · Q${qnum} · SAToplam`;
  crumb.innerHTML = `<a href="#/">Information &amp; Ideas</a> <span class="sep">›</span> <a href="#/topic/${slug}">${escapeHtml(meta.title)}</a> <span class="sep">›</span> Q${qnum}`;

  const exp = getExplanation(q);
  const def = (exp && exp.definition) || TYPE_DEFINITION[slug] || "";
  const reasoning = exp && (exp.reasoning || exp.why_correct);

  const opts = ["A", "B", "C", "D"].map(k => `
    <li>
      <span class="key">${k})</span>
      <span class="body">${escapeHtml(q.options[k] || "")}</span>
    </li>
  `).join("");

  const prev = list.find(x => x.qnum_in_topic === qnum - 1);
  const next = list.find(x => x.qnum_in_topic === qnum + 1);

  main.innerHTML = `
    <article class="question-detail">
      <div class="question-meta">${escapeHtml(meta.title)} · Question ${qnum} of ${list.length}</div>
      <h1>Passage &amp; Question</h1>
      <div class="question-passage">${escapeHtml(q.passage || "")}</div>
      <p class="question-prompt">${escapeHtml(q.prompt || "")}</p>
      <ul class="options">${opts}</ul>

      <section class="explanation">
        <h3>1 · What this question is asking — full definition</h3>
        <div class="definition">${escapeHtml(def)}</div>
        ${exp && exp.prompt_focus
          ? `<h3>2 · The specific job of this prompt</h3>${splitParas(exp.prompt_focus).map(p => `<p>${escapeHtml(p)}</p>`).join("")}`
          : ""}
        ${exp && exp.passage_breakdown
          ? `<h3>${exp.prompt_focus ? "3" : "2"} · Passage breakdown — what each part establishes</h3>${splitParas(exp.passage_breakdown).map(p => `<p>${escapeHtml(p)}</p>`).join("")}`
          : ""}
        <h3>${(exp && exp.prompt_focus ? 1 : 0) + (exp && exp.passage_breakdown ? 1 : 0) + 2} · Reasoning toward the correct interpretation</h3>
        ${reasoning
          ? splitParas(reasoning).map(p => `<p>${escapeHtml(p)}</p>`).join("")
          : `<p class="placeholder">Full reasoning paragraph for this question is not yet written. The definition above still tells you exactly what the question is asking and how to evaluate the four options.</p>`
        }
        ${exp && exp.distractors
          ? `<h3>${(exp && exp.prompt_focus ? 1 : 0) + (exp && exp.passage_breakdown ? 1 : 0) + 3} · Why each of the other readings fails</h3>${splitParas(exp.distractors).map(p => `<p>${escapeHtml(p)}</p>`).join("")}`
          : ""}
        ${exp && exp.takeaway
          ? `<h3>Takeaway</h3><p><em>${escapeHtml(exp.takeaway)}</em></p>`
          : ""}
      </section>

      <nav class="qnav">
        ${prev ? `<a href="#/topic/${slug}/${prev.qnum_in_topic}">← Q${prev.qnum_in_topic}</a>` : `<span></span>`}
        <a href="#/topic/${slug}">Back to ${escapeHtml(meta.title)}</a>
        ${next ? `<a href="#/topic/${slug}/${next.qnum_in_topic}">Q${next.qnum_in_topic} →</a>` : `<span></span>`}
      </nav>
    </article>
  `;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function splitParas(s) {
  return String(s).split(/\n{2,}/g).map(p => p.trim()).filter(Boolean);
}

window.addEventListener("hashchange", route);
load().catch(err => {
  document.getElementById("view").innerHTML = `<p class="placeholder">Failed to load data: ${escapeHtml(err.message || String(err))}</p>`;
});
