/* SAToplam Information & Ideas — single-page app
   Reads questions.json + explanations.json (no answers.json) and
   renders topic list / question list / question detail with explanations.
   The correct-answer letter is intentionally never displayed.
*/

const TOPIC_ORDER = [
  // Section 1: Information and Ideas
  { slug: "main_ideas",   section: "info", title: "Asosiy g‘oya (Main Ideas)",
    blurb: "Matnning umumiy markaziy fikrini topish — har bir gapni bog‘lab turgan g‘oya, alohida bir detal emas." },
  { slug: "details",      section: "info", title: "Tafsilotlar (Details)",
    blurb: "Matnda to‘g‘ridan-to‘g‘ri aytilgan aniq faktni topib, hech narsa qo‘shmay yoki o‘zgartirmay aynan o‘sha faktni qaytaruvchi variantni tanlash." },
  { slug: "inference",    section: "info", title: "Mantiqiy xulosa (Inference)",
    blurb: "Matn aytmagan, ammo zaruriy ravishda kelib chiqadigan xulosani topish — matnni mantiqan tugatuvchi variant." },
  { slug: "support",      section: "info", title: "Dalil — Quvvatlash (Support)",
    blurb: "Berilgan da’vo yoki gipotezani eng kuchli tarzda mustahkamlovchi natijani tanlash." },
  { slug: "weaken",       section: "info", title: "Dalil — Zaiflashtirish (Weaken)",
    blurb: "Berilgan da’vo yoki gipotezani eng kuchli tarzda zaiflashtiruvchi yoki rad etuvchi natijani tanlash." },
  { slug: "quotation",    section: "info", title: "Iqtibos (Quotation)",
    blurb: "Aytilgan g‘oya, mavzu yoki xarakter xususiyatini eng aniq ko‘rsatuvchi adabiy iqtibosni tanlash." },
  { slug: "graphs",       section: "info", title: "Dalil — Grafiklar (Graphs)",
    blurb: "Jadval yoki diagrammani aniq o‘qib, faqat shu raqamlardan kelib chiqadigan va matn da’vosiga mos variantni tanlash." },
  // Section 2: Craft and Structure
  { slug: "main_purpose",       section: "craft", title: "Asosiy maqsad (Main Purpose)",
    blurb: "Muallif passajni nima uchun yozganini — matnning umumiy harakati va niyatini topish." },
  { slug: "overall_structure",  section: "craft", title: "Umumiy tuzilma (Overall Structure)",
    blurb: "Passajning bandlari qaysi tartibda nima qilayotganini — kompozitsion sxemani aniqlash." },
  { slug: "underlined_purpose", section: "craft", title: "Tagi chizilgan jumla (Underlined Purpose)",
    blurb: "Tagi chizilgan jumlaning matn argumenti uchun bajarayotgan vazifasini topish." },
  { slug: "cross_text",         section: "craft", title: "Ikki matn bog‘lanishi (Cross-Text)",
    blurb: "Ikki alohida matn (Text 1 va Text 2) mualliflari qaysi nuqtada kelishishini yoki farq qilishini topish." },
  { slug: "gap_filling",        section: "craft", title: "Bo‘shliqni to‘ldirish (Gap Filling)",
    blurb: "Passajdagi bo‘sh joyga eng aniq va mantiqiy mos so‘z yoki iborani tanlash — kontekst signallari asosida." },
  { slug: "synonyms",           section: "craft", title: "Kontekstda sinonim (Synonyms)",
    blurb: "Berilgan so‘zning passajdagi konkret kontekstdagi eng yaqin ma’nosini topish." },
];

const TYPE_DEFINITION = {
  main_ideas: "Asosiy g‘oya (Main Ideas) savoli sizdan butun matn nima haqida ekanligini, ya’ni matnning markaziy da’vosi yoki argumentini topishni so‘raydi. To‘g‘ri variant matnning HAMMA qismini qamrab olishi kerak — faqat bitta misol yoki tafsilot emas. Shuningdek u matn aslida aytmagan kuchliroq narsa ham ayta olmaydi (‘faqat’, ‘hech qachon’, ‘har doim’ kabi so‘zlardan ehtiyot bo‘ling).",
  details:    "Tafsilotlar (Details) savoli matnda to‘g‘ridan-to‘g‘ri yozilgan aniq faktni topishni talab qiladi. To‘g‘ri variant aynan o‘sha faktni qaytaradi — yangi ma’lumot qo‘shmaydi, oshirib yubormaydi va matndan tashqari taxminlar qilmaydi. Yarmi to‘g‘ri, yarmi o‘ylab topilgan har qanday variant noto‘g‘ri.",
  inference:  "Mantiqiy xulosa (Inference) savoli — odatda ‘matnni mantiqan tugatuvchi variantni tanlang’ tarzida beriladi — matn aytmagan, ammo aytganlaridan zaruriy ravishda kelib chiqadigan xulosani topishni so‘raydi. To‘g‘ri variant shunchaki ‘mumkin’ emas, balki matn yo‘naltirib turgan yagona xulosa bo‘lishi kerak.",
  support:    "Quvvatlash (Support) savoli — qaysi natija, agar to‘g‘ri bo‘lsa, da’voni yoki gipotezani eng kuchli tarzda quvvatlaydi, deb so‘raydi. To‘g‘ri variant da’voning HAR BIR shartiga aniq mos kelishi va aynan da’vo talab qilgan turdagi dalilni berishi kerak.",
  weaken:     "Zaiflashtirish (Weaken) savoli — qaysi natija da’voni eng kuchli tarzda zaiflashtiradi yoki rad etadi, deb so‘raydi. To‘g‘ri variant da’voning mantig‘iga to‘g‘ridan-to‘g‘ri qarshi chiqadi, muqobil tushuntirish ko‘rsatadi yoki da’vo bog‘liq bo‘lgan zaruriy shartni olib tashlaydi.",
  quotation:  "Iqtibos (Quotation) savoli aytilgan g‘oya, mavzu yoki xulosani eng yaqqol ko‘rsatuvchi adabiy iqtibosni tanlashni so‘raydi. To‘g‘ri iqtibos g‘oyani sahifaning o‘zida ‘sahnaga chiqaradi’ — unda aniq qaysi so‘zlar da’voni ko‘rsatayotganini ko‘rsatib bera olishingiz kerak.",
  graphs:     "Grafiklar (Graphs) savoli jadval yoki diagrammani aniq o‘qib, FAQAT figura ko‘rsatgan ma’lumotlardan kelib chiqadigan va matn argumentiga mos variantni tanlashni so‘raydi. To‘g‘ri variant ham raqamlar bilan to‘liq tasdiqlanadi, ham gipotezaning aynan shartiga mos keladi.",
  main_purpose:       "Main Purpose (asosiy maqsad) savoli muallifning passajni *nima uchun* yozganini topadi. To‘g‘ri javob butun matnning markaziy harakatini (tushuntirmoqda, taqqoslamoqda, da’vo qilmoqda, masala kiritmoqda va h.k.) tor doirada, haddan oshirmasdan ifodalashi kerak. Faqat bir parchani qamrab olgan, matnda bo‘lmagan da’vo qo‘shgan yoki haddan tashqari umumlashtirgan variantlar — yiqiladi.",
  overall_structure:  "Overall Structure (umumiy tuzilma) savoli passajning bandlari *qaysi tartibda* nima qilayotganini topadi. To‘g‘ri javob har bir bandning rolini va ular orasidagi mantiqiy bog‘lanishni (ta’rif → misol; muammo → yechim; jarayon → ahamiyat va h.k.) haqiqatga mos ravishda tasvirlashi kerak.",
  underlined_purpose: "Underlined Purpose (tagi chizilgan jumla maqsadi) savoli — *aynan tagi chizilgan* jumlaning butun matn ichidagi *vazifasini* aniqlaydi (misol keltirishmi, qarshi-fikr berishmi, asosiy da’voni quvvatlashmi va h.k.). To‘g‘ri javob jumlaning matn argumenti bilan o‘zaro ta’sirini aniq nomlashi kerak — uning mazmunini emas, balki ROLINI.",
  cross_text:         "Cross-Text Connection (ikki matn bog‘lanishi) savoli — Text 1 va Text 2 mualliflarining bir-biriga *kelishish, qarshi chiqish yoki to‘ldirish* munosabatini aniqlaydi. To‘g‘ri javob har ikki matnda ham mavjud bo‘lgan aniq fakt yoki fikrga asoslanadi.",
  gap_filling:        "Gap Filling (bo‘shliqni to‘ldirish) savoli — passajdagi bo‘sh joyga eng *mantiqiy va aniq* so‘z yoki iborani topishni so‘raydi. To‘g‘ri javob signal so‘zlar (but, however, because, for instance, despite) va atrofdagi gaplarning umumiy ma’nosi bilan to‘liq mos keladigan yagona variantdir.",
  synonyms:           "Most Nearly Means (kontekstdagi sinonim) savoli — passajdagi ma’lum so‘zning *aynan shu kontekstdagi* eng yaqin ma’nosini topadi. So‘zning lug‘aviy ma’nosi emas, kontekstdagi konkret ishlatilishi hal qiluvchidir."
};

const state = {
  questions: [],
  byTopic: {},
  explanations: {},
  ready: false,
};

async function load() {
  const [qs, exps, ans] = await Promise.all([
    fetch("data/questions.json").then(r => r.json()),
    fetch("data/explanations.json").then(r => r.json()).catch(() => ({})),
    fetch("data/answers.json").then(r => r.json()).catch(() => ({})),
  ]);
  state.questions = qs;
  state.explanations = exps || {};
  state.answers = ans || {};
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
  if (hash === "#/strategy") {
    crumb.innerHTML = `<a href="#/">SAToplam Reading</a> <span class="sep">›</span> Sirli qoidalar`;
    renderStrategy(main);
    return;
  }
  const ms = hash.match(/^#\/strategy\/([a-z_]+)$/);
  if (ms) {
    crumb.innerHTML = `<a href="#/">SAToplam Reading</a> <span class="sep">›</span> <a href="#/strategy">Sirli qoidalar</a> <span class="sep">›</span> ${escapeHtml(topicMeta(ms[1]).title)}`;
    renderStrategyTopic(main, ms[1]);
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
  main.innerHTML = "<p>Sahifa topilmadi. <a href='#/'>Bosh sahifaga qaytish</a>.</p>";
}

function topicMeta(slug) {
  return TOPIC_ORDER.find(t => t.slug === slug) || { slug, title: slug, blurb: "" };
}

function escapeHtml(s) {
  return (s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderHome(main) {
  document.title = "SAToplam Reading — Information & Ideas + Craft & Structure (o‘zbekcha)";
  const renderSection = (sectionKey, sectionTitle, sectionLead) => {
    const topics = TOPIC_ORDER.filter(t => t.section === sectionKey);
    const cards = topics.map((t, i) => {
      const list = state.byTopic[t.slug] || [];
      const explainedCount = list.filter(q => hasExplanation(q)).length;
      return `
        <a class="topic-card" href="#/topic/${t.slug}">
          <div class="num">${i + 1}-bo‘lim</div>
          <div class="name">${escapeHtml(t.title)}</div>
          <div class="meta">${list.length} ta savol${explainedCount ? ` · ${explainedCount} izoh bilan` : ""}</div>
          <p class="muted" style="margin-top:8px">${escapeHtml(t.blurb)}</p>
        </a>
      `;
    }).join("");
    return `
      <section class="section-block">
        <h2 class="section-title">${escapeHtml(sectionTitle)}</h2>
        <p class="muted">${escapeHtml(sectionLead)}</p>
        <div class="topic-grid">${cards}</div>
      </section>
    `;
  };
  const total = state.questions.length;
  main.innerHTML = `
    <h1>SAToplam Reading — o‘zbekcha</h1>
    <p class="lead">
      SAToplam Reading Book’ning <strong>Information &amp; Ideas</strong> va <strong>Craft &amp; Structure</strong> bo‘limlaridagi
      har bir savol — to‘liq o‘zbekcha izoh va savol turining ta’rifi bilan.
      <strong>Javob harflari (A/B/C/D) ataylab ko‘rsatilmaydi</strong> — izoh sizni to‘g‘ri talqinga yetaklaydi,
      shunda siz harfni yodlash o‘rniga o‘z fikringizni isbotlashni o‘rganasiz.
    </p>
    <div class="notice">
      <strong>Qanday foydalanish kerak:</strong> avval matnni o‘qing, javobingizni tanlang, so‘ng pastdagi izohni o‘qing.
      Izoh — qaysi talqin to‘g‘ri ekanini harfsiz tushuntiradi va boshqa variantlar nima uchun yiqilishini ko‘rsatadi.
      Jami: <strong>${total} ta savol</strong>, <strong>13 ta savol turi</strong>.
    </div>
    ${renderSection("info",  "Bo‘lim 1 — Information and Ideas",  "Matn ichidagi g‘oyalar va ma’lumotlarni topish, xulosalash, dalil keltirish va grafiklarni o‘qish bo‘yicha 7 ta savol turi.")}
    ${renderSection("craft", "Bo‘lim 2 — Craft and Structure",   "Muallif maqsadi, matn tuzilishi, jumlalarning vazifasi, ikki matn bog‘lanishi va kontekstdagi so‘z ma’nosi bo‘yicha 6 ta savol turi.")}
    <div class="tips">
      <h2>O‘qish strategiyasi — sirli qoidalar</h2>
      <ul>
        <li><strong>Hammasini qamrab ol, hech narsani oshirib yuborma.</strong> To‘g‘ri Main-Idea varianti hech qachon ‘faqat’, ‘birinchi’, ‘har doim’, ‘eng yaxshi’ deyilmaydi — agar matn shunday demagan bo‘lsa.</li>
        <li><strong>Matnning o‘z so‘zlariga yopishib qol.</strong> Inference faqat matn bergan dalillardan kelib chiqishi kerak — tashqi ma’lumotdan emas.</li>
        <li><strong>Mavzu emas, da’voni mosla.</strong> Support yoki Weaken variantlari gipotezaning HAR BIR qismiga gapirishi kerak — yarmiga emas.</li>
        <li><strong>Grafiklarda faqat raqam haqiqat.</strong> Graf javobi diagrammada ko‘rinmaydigan da’voni qo‘shsa — hayotda haqiqat bo‘lsa ham — noto‘g‘ri.</li>
        <li><strong>Iqtibosda matn ‘ko‘rsatishi’ kerak.</strong> ‘Aytaman’ degan so‘z emas, balki ‘ko‘rsatadigan’ harakat yoki tasvir bo‘lgan iqtibosni tanlang.</li>
      </ul>
      <p style="margin-top:14px"><a href="#/strategy"><strong>→ Har bir savol turi uchun to‘liq sirli qoidalar va maslahatlar</strong></a></p>
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
  crumb.innerHTML = `<a href="#/">SAToplam Reading</a> <span class="sep">›</span> ${escapeHtml(meta.title)}`;

  const items = list.map(q => {
    const preview = (q.passage || "").slice(0, 140) + ((q.passage || "").length > 140 ? "…" : "");
    const has = hasExplanation(q);
    return `
      <li>
        <a class="qn" href="#/topic/${slug}/${q.qnum_in_topic}">Q${q.qnum_in_topic}</a>
        <a class="preview" href="#/topic/${slug}/${q.qnum_in_topic}">${escapeHtml(preview || "(matn)")}</a>
        <span class="${has ? "has-exp" : "no-exp"}">${has ? "izoh bor" : "faqat matn"}</span>
      </li>
    `;
  }).join("");

  main.innerHTML = `
    <h1>${escapeHtml(meta.title)}</h1>
    <p class="lead">${escapeHtml(meta.blurb)}</p>
    <p class="muted">Bu bo‘limda ${list.length} ta savol bor. Har bir savolni bosib, matn, to‘rt variant va to‘liq mantiqiy izohni o‘qishingiz mumkin.</p>
    <p style="margin:6px 0 14px"><a href="#/strategy/${slug}"><strong>→ Bu turdagi savollarni tez yechish uchun sirli qoidalar</strong></a></p>
    <div class="search-bar"><input id="filter" type="text" placeholder="Matn bo‘yicha qidirish…" /></div>
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
  crumb.innerHTML = `<a href="#/">SAToplam Reading</a> <span class="sep">›</span> <a href="#/topic/${slug}">${escapeHtml(meta.title)}</a> <span class="sep">›</span> Q${qnum}`;

  const exp = getExplanation(q);
  const def = (exp && exp.definition) || TYPE_DEFINITION[slug] || "";
  const reasoning = exp && (exp.reasoning || exp.why_correct);

  const correctLetter = (state.answers[slug] || {})[String(qnum)] || null;

  const opts = ["A", "B", "C", "D"].map(k => `
    <li data-key="${k}">
      <span class="key">${k})</span>
      <span class="body">${escapeHtml(q.options[k] || "")}</span>
    </li>
  `).join("");

  const prev = list.find(x => x.qnum_in_topic === qnum - 1);
  const next = list.find(x => x.qnum_in_topic === qnum + 1);

  main.innerHTML = `
    <article class="question-detail">
      <div class="question-meta">${escapeHtml(meta.title)} · ${qnum}-savol / ${list.length}</div>
      <h1>Matn va savol</h1>
      <div class="question-passage">${escapeHtml(q.passage || "")}</div>
      <p class="question-prompt">${escapeHtml(q.prompt || "")}</p>
      <ul class="options" id="opts">${opts}</ul>
      ${correctLetter ? `
      <div class="answer-toggle">
        <button id="btn-show-answer" type="button" class="btn-answer">Javobni ko‘rish</button>
        <div id="answer-reveal" class="answer-reveal" hidden>
          <strong>To‘g‘ri javob:</strong> <span class="answer-letter">${correctLetter}</span>
        </div>
      </div>` : ""}

      <section class="explanation">
        <h3>1 · Bu savol nimani so‘rayapti — to‘liq ta’rif</h3>
        <div class="definition">${escapeHtml(def)}</div>
        ${exp && exp.prompt_focus
          ? `<h3>2 · Aynan shu savolning vazifasi</h3>${splitParas(exp.prompt_focus).map(p => `<p>${escapeHtml(p)}</p>`).join("")}`
          : ""}
        ${exp && exp.passage_breakdown
          ? `<h3>${exp.prompt_focus ? "3" : "2"} · Matnning tahlili — har qism nimani aytadi</h3>${splitParas(exp.passage_breakdown).map(p => `<p>${escapeHtml(p)}</p>`).join("")}`
          : ""}
        <h3>${(exp && exp.prompt_focus ? 1 : 0) + (exp && exp.passage_breakdown ? 1 : 0) + 2} · To‘g‘ri talqinga olib boruvchi mantiq</h3>
        ${reasoning
          ? splitParas(reasoning).map(p => `<p>${escapeHtml(p)}</p>`).join("")
          : `<p class="placeholder">Bu savolning to‘liq mantiqiy izohi hali yozilmagan. Yuqoridagi ta’rif baribir savolning nimani so‘rayotganini va to‘rtta variantni qanday baholashni ko‘rsatib turadi.</p>`
        }
        ${exp && exp.distractors
          ? `<h3>${(exp && exp.prompt_focus ? 1 : 0) + (exp && exp.passage_breakdown ? 1 : 0) + 3} · Boshqa variantlar nima uchun yiqiladi</h3>${splitParas(exp.distractors).map(p => `<p>${escapeHtml(p)}</p>`).join("")}`
          : ""}
        ${exp && exp.takeaway
          ? `<h3>Asosiy dars</h3><p><em>${escapeHtml(exp.takeaway)}</em></p>`
          : ""}
      </section>

      <nav class="qnav">
        ${prev ? `<a href="#/topic/${slug}/${prev.qnum_in_topic}">← Q${prev.qnum_in_topic}</a>` : `<span></span>`}
        <a href="#/topic/${slug}">${escapeHtml(meta.title)} ro‘yxatiga qaytish</a>
        ${next ? `<a href="#/topic/${slug}/${next.qnum_in_topic}">Q${next.qnum_in_topic} →</a>` : `<span></span>`}
      </nav>
    </article>
  `;
  // Wire up "Javobni ko'rish" toggle
  const btn = document.getElementById("btn-show-answer");
  if (btn) {
    btn.addEventListener("click", () => {
      const rev = document.getElementById("answer-reveal");
      const isHidden = rev.hasAttribute("hidden");
      if (isHidden) {
        rev.removeAttribute("hidden");
        btn.textContent = "Javobni yashirish";
        // Highlight the correct option in the list
        const li = document.querySelector(`#opts li[data-key="${correctLetter}"]`);
        if (li) li.classList.add("correct");
      } else {
        rev.setAttribute("hidden", "");
        btn.textContent = "Javobni ko‘rish";
        const li = document.querySelector(`#opts li[data-key="${correctLetter}"]`);
        if (li) li.classList.remove("correct");
      }
    });
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

function splitParas(s) {
  return String(s).split(/\n{2,}/g).map(p => p.trim()).filter(Boolean);
}

/* ===========================================================
   SIRLI QOIDALAR — har bir savol turi uchun chuqur strategiya
   =========================================================== */

const STRATEGY = {
  main_ideas: {
    name: "Asosiy g‘oya (Main Ideas)",
    intro:
      "Main Ideas savolida sizdan butun matnning ‘nima haqida’ ekanligini topish so‘raladi. Test ishlab chiqaruvchilar sizni adashtirish uchun matnda yorqin ko‘rinadigan misollarni javobga qo‘yadi — lekin to‘g‘ri javob har doim umumiy g‘oya, alohida bir misol emas.",
    rules: [
      {
        title: "Qoida 1 — Tor javobni rad et",
        body:
          "Agar variant matnda berilgan bitta misolni qaytarsa (masalan, faqat bitta tadqiqotchi yoki bitta yil), bu javob TOR. Main idea har doim umumlashtiruvchi bo‘lishi kerak. Qoida: ‘Bir misol → noto‘g‘ri’.",
      },
      {
        title: "Qoida 2 — Mutloq so‘zlardan ehtiyot bo‘l",
        body:
          "‘only / faqat’, ‘always / har doim’, ‘never / hech qachon’, ‘best / eng yaxshi’, ‘first / birinchi’ kabi so‘zlar variantda paydo bo‘lsa — matn ham aynan shu so‘zni ishlatganmi, tekshiring. Aks holda bu variant matndan kuchliroq da’vo qiladi va noto‘g‘ri.",
      },
      {
        title: "Qoida 3 — ‘Thus’, ‘therefore’, ‘in short’ marker so‘zlarini qidiring",
        body:
          "Matnning oxirida ‘thus’, ‘therefore’, ‘so’, ‘in short’ kabi xulosa belgilari bo‘lsa, ulardan keyingi gap — odatda matnning haqiqiy markaziy fikri. Asosiy g‘oya aynan shu yerda bo‘ladi.",
      },
      {
        title: "Qoida 4 — Ikki tomonni qamragan formuli",
        body:
          "Agar matn ‘some say X, but others say Y’ tuzilishida bo‘lsa, to‘g‘ri main idea — ikki tomonning kelishmovchiligi haqida bo‘ladi, hech qaysi tomonni tanlamaydi. ‘Critics disagree about…’ tipidagi javobni qidiring.",
      },
      {
        title: "Qoida 5 — Maslahat avval o‘qib, keyin variantlarga qara",
        body:
          "Variantlarga qarashdan oldin matnni o‘qib, ‘bu matn nimani aytmoqchi?’ degan savolga 1 jumlada javob bering. Shu jumlangizga eng yaqin variantni tanlang. Aks holda chiroyli yozilgan tor variant sizni adashtirishi mumkin.",
      },
    ],
  },

  details: {
    name: "Tafsilotlar (Details)",
    intro:
      "Details savolida matnda aniq yozilgan faktni topish kerak. To‘g‘ri javob — matnning so‘zlarini ‘parafraza’ qilingan, lekin hech narsa qo‘shilmagan. Yarmi to‘g‘ri, yarmi soxta variantlar — eng xavfli tuzoq.",
    rules: [
      {
        title: "Qoida 1 — Variantni ikki bo‘lakka ajrating",
        body:
          "Har bir variantni ‘And’ yoki ‘so‘ng’ orqali ikkiga bo‘ling. Ikkala bo‘lak ham matnda yozilgan bo‘lishi kerak. Agar bir bo‘lagi to‘g‘ri, ikkinchisi noto‘g‘ri bo‘lsa — bu variant noto‘g‘ri, qanchalik chiroyli ko‘rinmasin.",
      },
      {
        title: "Qoida 2 — ‘Suggests’, ‘probably’, ‘might’ — bu Inference, Details emas",
        body:
          "Details savoli matnda ochiq aytilgan narsa haqida. Agar variant ‘taxmin qiladi’, ‘ehtimol’, ‘mumkin’ tarzida yozilgan bo‘lsa — bu Details javobi emas (Inference uslubidagi tuzoq).",
      },
      {
        title: "Qoida 3 — Number/yil/joy nomlarini ikki marta tekshiring",
        body:
          "Sanalar (1924), foizlar (47%), va hududiy nomlar (Argentina vs. Argentinian Patagonia) — ko‘pincha o‘zgartirilgan bo‘ladi. Variantni matn bilan SO‘ZMA-SO‘Z taqqoslang.",
      },
      {
        title: "Qoida 4 — ‘Most’ vs. ‘all’, ‘some’ vs. ‘many’",
        body:
          "Matn ‘ko‘pchilik’ deyilsa, javob ‘hammasi’ deya olmaydi. Matn ‘ba’zi’ deyilsa, javob ‘ko‘pchilik’ deya olmaydi. Miqdor so‘zlari aniq mos kelishi shart.",
      },
      {
        title: "Qoida 5 — Birinchi javobni tanlamasdan, oxirigacha tekshiring",
        body:
          "Details savollarida 4 ta variantning ikkitasi ‘deyarli to‘g‘ri’ bo‘lib chiqishi mumkin. Faqat MATN AYNAN BERGAN faktni qaytaradigan variant — to‘g‘ri javob.",
      },
    ],
  },

  inference: {
    name: "Mantiqiy xulosa (Inference)",
    intro:
      "Inference savolida matn bevosita aytmagan, ammo aytganlaridan ZARURIY ravishda kelib chiqadigan xulosani topish kerak. Asosiy xato: ‘bu mumkin bo‘lishi’ degan variantni tanlash. To‘g‘ri javob — yagona mantiqiy xulosa.",
    rules: [
      {
        title: "Qoida 1 — ‘Yagona mantiqiy davom’ — boshqa variantlar imkonsiz bo‘lishi kerak",
        body:
          "Inference savolining sirini bilib oling: 4 ta variantning faqat 1 tasi matnga zid bo‘lmaydi yoki matndan ko‘chmaydi. Shu sababli variantni TASDIQLASHGA emas, INKOR ETISHGA harakat qiling — qaysi variantlar matn aytganlariga zid? Ulardan keyingisi javob.",
      },
      {
        title: "Qoida 2 — ‘Ko‘pchilik X qiladi’ tipidagi formulani izlang",
        body:
          "Matnda ‘A bu Y, B bu Z’ deyilgan bo‘lsa va ulardan boshqa hech narsa aytilmagan bo‘lsa, to‘g‘ri javob ‘A va B aksincha’ tipida bo‘ladi. ‘C ham Y bo‘lishi mumkin’ tarzdagi javoblar — matnga asoslanmagan, noto‘g‘ri.",
      },
      {
        title: "Qoida 3 — Strong words = noto‘g‘ri (odatda)",
        body:
          "‘will always’, ‘never’, ‘proves that’, ‘definitely’, ‘the only’ — bu so‘zlar matn aytmagan kuchli da’volar. Matn faqat tendentsiya yoki taklif bersa, to‘g‘ri javobda ‘may’, ‘likely’, ‘suggests that’, ‘could’ bo‘ladi.",
      },
      {
        title: "Qoida 4 — Karusel sxemasini izlang (compare/contrast)",
        body:
          "Matn ikki narsani solishtirsa (X past, Y baland; A oldin, B keyin), to‘g‘ri Inference javobi shu farqdan kelib chiqadi: ‘X kamroq Y dan’, yoki ‘A B’dan oldinroq paydo bo‘lgan’. Variantni shu sxemaga moslang.",
      },
      {
        title: "Qoida 5 — ‘Matn aynan shu xulosani aytadigan jumla bormi?’",
        body:
          "To‘g‘ri Inference javobini topgach, matnning oxirgi 1-2 jumlasini o‘qing. Ko‘pincha matnning oxirgi gapida ‘suggesting that…’, ‘leading to…’, ‘this implies…’ marker so‘zlari bo‘ladi va to‘g‘ri javob aynan shularga mos keladi.",
      },
    ],
  },

  support: {
    name: "Quvvatlash (Support)",
    intro:
      "Support savolida matnda aytilgan da’vo yoki gipotezani qaysi natija ENG KUCHLI tarzda quvvatlashini tanlash kerak. Sir: to‘g‘ri javob da’voning HAR BIR shartiga aniq mos kelishi shart — bitta qismiga emas.",
    rules: [
      {
        title: "Qoida 1 — Da’voning HAR BIR qismini ajratib ol",
        body:
          "Avval da’voni 2-3 qismga bo‘ling. Masalan: ‘X jarayoni Y sharoitda Z natijaga olib keladi.’ — bu yerda 3 ta shart bor: X jarayon, Y sharoit, Z natija. Variant HAMMA shartini gapirishi kerak. Faqat X yoki faqat Z haqida gapiruvchi variant — yarim javob, noto‘g‘ri.",
      },
      {
        title: "Qoida 2 — Yo‘nalish (direction) muhim",
        body:
          "Da’vo ‘ko‘payadi’ deyilsa, javob ‘ko‘paygan’ holatni ko‘rsatishi kerak. Da’vo ‘kamayadi’ deyilsa — ‘kamaygan’. Yo‘nalishni teskari qilgan variantlar (oddiy tuzoq) — noto‘g‘ri, hatto miqdor to‘g‘ri ko‘rinsa ham.",
      },
      {
        title: "Qoida 3 — Variantning matnga ‘ulashi’ kerak",
        body:
          "To‘g‘ri Support varianti matnning aniq sub’ekti, davri yoki sharti haqida bo‘ladi. ‘Boshqa narsa’ haqida bo‘lgan variant — qanchalik mantiqli ko‘rinmasin — gipotezaga tegmaydi va noto‘g‘ri.",
      },
      {
        title: "Qoida 4 — ‘Compared to / unlike’ formulani tanish",
        body:
          "Ko‘p Support savollari farqlash haqida (X Y dan farq qiladi). To‘g‘ri javobda ham aynan shu solishtirish bo‘ladi: ‘group A had Z but group B didn’t’. Bitta guruhni gapiruvchi variantlar yetarli emas.",
      },
      {
        title: "Qoida 5 — Eski tadqiqot vs. yangi natija",
        body:
          "Support savolida ko‘pincha ‘eski qarash X edi, yangi tadqiqot Y ni topdi’ tuzilishi bor. To‘g‘ri javob — yangi tadqiqotning natijasini gipotezaga AYNAN moslashtiruvchi natija. Eski qarashni quvvatlovchi variantlar — bu Weaken bo‘lishi mumkin.",
      },
    ],
  },

  weaken: {
    name: "Zaiflashtirish (Weaken)",
    intro:
      "Weaken savolida da’voni qaysi natija ENG KUCHLI tarzda zaiflashtirishini tanlash kerak. To‘g‘ri javob — da’voning mantig‘ini buzadigan, muqobil tushuntirish beruvchi yoki zaruriy shartni olib tashlovchi natija.",
    rules: [
      {
        title: "Qoida 1 — Da’vo aynan nimaga asoslangani aniqlang",
        body:
          "Weaken qilish uchun avval da’voning ‘qanday’ va ‘nima uchun’ ekanini bilish kerak. Masalan: ‘X paydo bo‘lgani uchun Y o‘sgan.’ — bu ‘X → Y’ sababiyat. To‘g‘ri Weaken javobi shu sababiyatni buzadi (boshqa sabab ko‘rsatadi yoki Y ning X siz ham o‘sganini aytadi).",
      },
      {
        title: "Qoida 2 — Muqobil tushuntirish (alternative cause)",
        body:
          "Eng kuchli Weaken — ‘aslida boshqa narsa shu natijaga olib kelgan’ tipida. Variant boshqa omilni ko‘rsatib, gipoteza shartini ortiqcha qilsa — bu eng kuchli Weaken.",
      },
      {
        title: "Qoida 3 — Yo‘nalishni teskari qil",
        body:
          "Da’vo ‘A → B’ deyilsa, Weaken: B aslida A’dan oldin sodir bo‘lgan, yoki A bo‘lganda B sodir bo‘lmagan, yoki A bo‘lmaganda ham B sodir bo‘lgan. Bu uchta yo‘nalish to‘g‘ri Weaken sxemasi.",
      },
      {
        title: "Qoida 4 — Faqat namuna hajmi (sample size) yetarli emas",
        body:
          "‘Sample size juda kichik’ — bu metodologik tanqid, lekin u da’voni mantiqan zaiflashtirmaydi (faqat ‘ehtimol kam’ deydi). To‘g‘ri Weaken da’voga ZID dalil ko‘rsatadi, ‘balki yetarli emas’ demaydi.",
      },
      {
        title: "Qoida 5 — Variantning matnga aloqasi bo‘lishi shart",
        body:
          "Weaken savolida ham da’voning aniq sub’ekti, davri yoki sharti haqida bo‘lishi kerak. ‘Boshqa hayvon’, ‘boshqa davr’ haqidagi variantlar — masala bilan bog‘liq emas, noto‘g‘ri.",
      },
    ],
  },

  quotation: {
    name: "Iqtibos (Quotation)",
    intro:
      "Quotation savolida da’vo (claim) berilgan, va siz matndagi qaysi iqtibos shu da’voni AMALDA KO‘RSATAYOTGANINI tanlashingiz kerak. Sir: iqtibos da’voni aytmasligi kerak — uni ‘sahnaga chiqarib ko‘rsatishi’ kerak.",
    rules: [
      {
        title: "Qoida 1 — Da’voni shartlarga ajrating",
        body:
          "Da’vo ‘establishes authority and credibility’ deyilsa, bu IKKI shart: (1) avtoritet o‘rnatadi, (2) ishonchni o‘rnatadi. Iqtibos ikkalasini ham ko‘rsatishi kerak. Faqat birini ko‘rsatuvchi iqtibos — yarim javob.",
      },
      {
        title: "Qoida 2 — ‘Tells’ vs. ‘Shows’",
        body:
          "Iqtibos ‘aytsa’ (‘I am brave’) — bu zaif javob. Iqtibos ‘ko‘rsatsa’ (qahramon xavfli vaziyatda harakat qilsa) — bu kuchli javob. Da’voni AMALDA dramatizatsiya qiluvchi iqtibosni qidiring.",
      },
      {
        title: "Qoida 3 — Da’vo ‘direct address’ deyilsa, ‘you / dear reader’ izlang",
        body:
          "Da’voning aniq lingvistik ko‘rsatkichi bor: ‘directly addresses the reader’ → ‘my dear reader’; ‘uses metaphor’ → o‘xshatish; ‘praises’ → ijobiy sifat so‘zlari. Da’voning tilini iqtibosning tilida toping.",
      },
      {
        title: "Qoida 4 — Iqtibos to‘g‘ri kontekstdan bo‘lishi shart",
        body:
          "Da’vo bitta personaj haqida bo‘lsa, iqtibos shu personajning so‘zlari yoki harakati bo‘lishi kerak — boshqa personaj haqida emas. Yana: da’vo ‘boshlanishida’ deyilsa, iqtibos boshlanishidan bo‘lishi kerak.",
      },
      {
        title: "Qoida 5 — Eng yaxshi iqtibos — to‘g‘ridan-to‘g‘ri va uzun bo‘lmaydi",
        body:
          "Uzun, ko‘p ma’noli iqtibos — odatda boshqa narsa haqida. Qisqa, da’voning aynan tilini takrorlovchi iqtibos — to‘g‘ri javob. ‘Bu iqtibos da’voni ochiq isbotlaydimi?’ degan savolga ‘ha’ desangiz — to‘g‘ri.",
      },
    ],
  },

  graphs: {
    name: "Grafiklar (Graphs)",
    intro:
      "Graphs savolida matn (claim) va jadval/diagramma berilgan. Siz matnni mantiqan tugatuvchi va FAQAT figura ko‘rsatgan raqamlarga asoslangan variantni tanlashingiz kerak. Sir: javob figurada KO‘RINISHI va matnda AYTILGANGA mos bo‘lishi shart — ikkalasi.",
    rules: [
      {
        title: "Qoida 1 — Avval matnni o‘qing, keyin grafikka qarang",
        body:
          "Grafika qarashdan oldin: matn nima haqida va qaysi yo‘nalishdagi natijani izlayapti? Masalan: ‘decreased OR remained the same from 2009 to 2013’ — bu sizning izlash filtringiz. Faqat shu shartga mos qatorni grafikadan toping.",
      },
      {
        title: "Qoida 2 — Raqamlar variantda aynan figuradagi raqam bo‘lishi kerak",
        body:
          "Variantda berilgan raqamni jadvaldan AYNAN topish kerak. Raqamni hisoblab chiqarish, taxminlash yoki yumaloqlashtirish — noto‘g‘ri. Variant raqami to‘liq mos kelishi yoki figura aniq oraliq bersa — shu oraliqqa tushishi kerak.",
      },
      {
        title: "Qoida 3 — Yo‘nalish va ishorani ikki marta tekshiring",
        body:
          "Matn ‘increased’ desa, variant ham ‘increased’ bo‘lishi kerak — kamayish ko‘rsatuvchi raqamlar yo‘q. ‘Decreased OR same’ — variant ikkala holatdan birini bermasligi mumkin (faqat birini bersa, yarim javob).",
      },
      {
        title: "Qoida 4 — ‘Hayotda haqiqat’ variantlardan ehtiyot bo‘ling",
        body:
          "Variantda yozilgan da’vo haqiqat bo‘lishi mumkin (real dunyoda), lekin agar grafikada bu raqam KO‘RINMASA — variant noto‘g‘ri. Faqat figurada bor narsa hisobga olinadi.",
      },
      {
        title: "Qoida 5 — Boshqa qatorlar — chetga olib qo‘yiluvchi tuzoq",
        body:
          "Grafikadagi boshqa qatorlardan olingan raqamlar — ko‘pincha noto‘g‘ri javob bo‘ladi. Matn so‘ragan AYNAN qatorga (mamlakat, yil, namuna) e’tibor bering. Boshqa qatordagi mos raqam — sizni adashtiruvchi tuzoq.",
      },
    ],
  },

  main_purpose: {
    name: "Asosiy maqsad (Main Purpose)",
    intro:
      "Main Purpose savolida muallif passajni nima uchun yozganini topish kerak. To‘g‘ri javob butun matnning markaziy harakatini (introduce, explain, compare, argue, illustrate va h.k.) tor doirada ifodalashi kerak — ortiqcha umumlashtirmasdan, kamaytirmasdan.",
    rules: [
      {
        title: "Qoida 1 — Birinchi va oxirgi gapni alohida o‘qing",
        body:
          "Main Purpose javobi odatda matnning birinchi gapidagi mavzu va oxirgi gapidagi xulosa orasidagi *harakat*ni tasvirlaydi. Birinchi gap mavzu doirasini, oxirgi gap esa yo‘nalishni belgilaydi — ikkalasini ham qamrab olgan variantni qidiring.",
      },
      {
        title: "Qoida 2 — Fe’ldan boshlanadigan variantning fe’li to‘g‘ri bo‘lsin",
        body:
          "Main Purpose variantlari odatda ‘To explain…’, ‘To compare…’, ‘To argue…’, ‘To describe…’ kabi fe’l bilan boshlanadi. Avval matnning *harakati* qaysi fe’lga to‘g‘ri kelishini aniqlang. ‘Argue’ — kuchli da’vo; ‘Explain’ — neytral; ‘Introduce’ — yangi mavzu kiritish.",
      },
      {
        title: "Qoida 3 — Tor variantlarni rad et",
        body:
          "Faqat bitta misol yoki bitta paragrafni qamrab oluvchi variant — tor. ‘To prove that X is unique’, ‘To explain why Y went extinct’ — agar matn umumiy mavzu haqida bo‘lsa, bu variantlar tor bo‘ladi.",
      },
      {
        title: "Qoida 4 — ‘Argue / prove / refute’ — matn aslida da’vo qilyaptimi?",
        body:
          "Matn faqat tushuntirsa, ‘argue’ yoki ‘prove’ varianti — kuchaytirilgan. To‘g‘ri javob ‘discuss’ yoki ‘explain’ bo‘lishi kerak. Aksincha, agar matnda aniq da’vo va dalillar bo‘lsa — ‘explain’ varianti zaif, ‘argue’ to‘g‘ri.",
      },
      {
        title: "Qoida 5 — ‘Introduce a new X’ varianti uchun ‘yangi’ so‘zini qidiring",
        body:
          "Variantda ‘a new fitness tracker’, ‘a recently discovered species’ kabi ‘new/recent’ so‘zlari bo‘lsa, matnda ham aniq ‘new/recent’ so‘zi yoki shunga teng ifoda bo‘lishi shart. Aks holda variant matndan ko‘chgan.",
      },
    ],
  },

  overall_structure: {
    name: "Umumiy tuzilma (Overall Structure)",
    intro:
      "Overall Structure savolida matnning bandlari qaysi tartibda nima qilayotganini topish kerak. To‘g‘ri javob har bir bandning *rolini* ketma-ket nomlaydi: ta’rif → misol; muammo → yechim; jarayon → ahamiyat va h.k.",
    rules: [
      {
        title: "Qoida 1 — Matnni 2-3 qismga bo‘lib oling",
        body:
          "Birinchi 1-2 gap nima qilyapti? O‘rta qism nima qilyapti? Oxirgi qism nima qilyapti? Variant ushbu 3 qismni *aynan* nomlashi kerak. Bittasi noto‘g‘ri bo‘lsa — variant butunlay yiqiladi.",
      },
      {
        title: "Qoida 2 — ‘Then…’ tartibiga yopishib qol",
        body:
          "Variantlar ko‘pincha ‘It first X, then Y, finally Z’ tarzida. Tartibni teskari qilib ko‘rsatuvchi variantlar — tuzoq. Matnda Y birinchi bo‘lsa, variantda ham Y birinchi bo‘lishi kerak.",
      },
      {
        title: "Qoida 3 — ‘History → research direction’ vs. ‘process → importance’",
        body:
          "Eng tez-tez uchraydigan ikki sxema: (a) jarayonni tasvirlaydi, keyin ahamiyatini ochadi; (b) tarixiy fonni beradi, keyin yangi tadqiqot taklif qiladi. Matn aniq qaysi sxemada ekanligini birinchi bo‘lib aniqlang.",
      },
      {
        title: "Qoida 4 — ‘Two sides’ tuzilishini taniring",
        body:
          "Agar matn ‘some say X, others say Y’ tuzilishida bo‘lsa, to‘g‘ri variant ‘presents two opposing views’ yoki ‘compares X and Y’ tarzida bo‘ladi. Bir tomonni tanlovchi variantlar — yiqiladi.",
      },
      {
        title: "Qoida 5 — Variantning HAR BIR fe’li tekshirib chiqilsin",
        body:
          "Variant ‘provides a history… and suggests a direction’ desa, matnda HAM ‘history’ qismi, HAM ‘direction’ qismi bo‘lishi kerak. Bir qismi yo‘q bo‘lsa — variant noto‘g‘ri.",
      },
    ],
  },

  underlined_purpose: {
    name: "Tagi chizilgan jumla (Underlined Purpose)",
    intro:
      "Underlined Purpose savolida tagi chizilgan jumlaning matn argumenti uchun *qanday vazifa bajarayotgani* (misol berish, qarshi-fikr, ta’rif berish, sababni ochish va h.k.) topiladi. To‘g‘ri javob jumlaning *rolini* nomlaydi — uning mazmunini emas.",
    rules: [
      {
        title: "Qoida 1 — Jumlaning oldidan va keyinidan o‘qing",
        body:
          "Tagi chizilgan jumla yolg‘iz turmaydi — uning oldidagi va keyingi gaplarda nima aytilgan? Agar oldindagi gap ‘umumiy da’vo’ bo‘lsa, tagi chizilgan jumla — *misol*. Agar oldindagi gap muammo bo‘lsa — tagi chizilgan jumla *yechim* yoki *sabab* bo‘lishi mumkin.",
      },
      {
        title: "Qoida 2 — ‘It illustrates’, ‘It supports’, ‘It contrasts’ — vazifa fe’llari",
        body:
          "Variantlar ‘It provides an example’, ‘It supports the claim’, ‘It introduces a counterargument’, ‘It defines a key term’, ‘It explains a cause’ tarzida fe’l bilan ifodalanadi. Eng to‘g‘ri fe’lni topish — birinchi vazifa.",
      },
      {
        title: "Qoida 3 — Variantning *mazmunini takrorlash* — tuzoq",
        body:
          "Tagi chizilgan jumlaning *o‘zini* qaytarib aytuvchi variant — bu vazifa emas, bu shunchaki paraphrase. Variant qisqa bo‘lib, jumla nima *qilayotganini* nomlashi kerak — uning so‘zlarini takrorlamasligi kerak.",
      },
      {
        title: "Qoida 4 — ‘With which the author disagrees’ — qarshi-fikrni topish",
        body:
          "Agar tagi chizilgan jumla matnning umumiy yo‘nalishiga ZID bo‘lsa, variantda ‘with which the author disagrees’ yoki ‘a counterclaim’ ifodasi bo‘lishi kerak. Matnda ‘however’, ‘but’, ‘in fact’ kabi belgilarga e’tibor bering.",
      },
      {
        title: "Qoida 5 — Misol — eng tez-tez uchraydigan vazifa",
        body:
          "Tagi chizilgan jumla aniq bir voqea, raqam yoki holat tasvirlasa — bu odatda *misol*. ‘It details an example that supports…’ varianti birinchi tekshiriladi.",
      },
    ],
  },

  cross_text: {
    name: "Ikki matn bog‘lanishi (Cross-Text)",
    intro:
      "Cross-Text savolida Text 1 va Text 2 mualliflari qaysi nuqtada *kelishishlarini* (yoki farq qilishlarini) topish kerak. To‘g‘ri javob har ikki matnda ham mavjud bo‘lgan aniq fakt yoki fikrga asoslanadi — bittasidagina aytilgan narsa noto‘g‘ri javob.",
    rules: [
      {
        title: "Qoida 1 — Avval har matnning markaziy fikrini bir gapda yozing",
        body:
          "Text 1 nimani da’vo qilyapti? Text 2 nimani da’vo qilyapti? Ikki gapni yonma-yon qo‘ying — kelishish nuqtasi shu yerda topiladi. Bu nuqta variant orqali aytilishi kerak.",
      },
      {
        title: "Qoida 2 — ‘Most likely agree’ vs. ‘would respond’ — savol turini ajrating",
        body:
          "Savol ‘most likely agree’ desa — ikkalasi ham qabul qilgan fikrni qidiring. ‘How would the author of Text 2 respond’ desa — Text 2 muallifining Text 1 ga qanday javob berishini tasavvur qiling (ko‘pincha — qarshi chiqish).",
      },
      {
        title: "Qoida 3 — Bitta matnda gaplashilgan narsa — yiqiladi",
        body:
          "Variantda aytilgan fakt faqat bitta matnda mavjud bo‘lsa — bu javob ikkala muallifga tegmaydi. Variantda aytilgan fakt har ikki matnda ham aniq yoki bilvosita aytilishi kerak.",
      },
      {
        title: "Qoida 4 — ‘Refined / improved’ — bittasi boshqasini takomillashtiradi",
        body:
          "Cross-Text savollarida ko‘pincha bir muallif boshqa muallifning fikrini ‘takomillashtirgan’ yoki ‘qo‘shimcha shart qo‘shgan’ bo‘ladi. ‘Could be refined to…’, ‘should be modified to…’ tipidagi variantlar shu sxemaga mos keladi.",
      },
      {
        title: "Qoida 5 — Faktlarni juftlashtir",
        body:
          "Variantning har bir bo‘lagini Text 1 va Text 2 da topishga harakat qiling. Bo‘lakning har biri ikkala matnda ham tasdiqlansa — javob to‘g‘ri. Bittasi yo‘qolsa — variant noto‘g‘ri.",
      },
    ],
  },

  gap_filling: {
    name: "Bo‘shliqni to‘ldirish (Gap Filling)",
    intro:
      "Gap Filling savolida bo‘sh joyga eng aniq mos so‘zni topish kerak. To‘g‘ri javob signal so‘zlar (but, however, because, for instance, despite, although) va atrofdagi gaplarning umumiy ma’nosi bilan to‘liq mos keladigan yagona variantdir.",
    rules: [
      {
        title: "Qoida 1 — Bo‘shliq atrofidagi signal so‘zni toping",
        body:
          "‘But’, ‘however’, ‘although’, ‘despite’ — bo‘shliqdan keyingi yoki oldingi qism bo‘shliq bilan *qarama-qarshi* ma’noda bo‘lishini ko‘rsatadi. ‘Because’, ‘therefore’, ‘thus’ — *sabab/natija*. ‘For instance’, ‘such as’ — *misol*. Signal yo‘nalishini buzmaydigan so‘zni tanlang.",
      },
      {
        title: "Qoida 2 — Tone (ohang) — ijobiy yoki salbiy",
        body:
          "Bo‘shliq atrofidagi gap ijobiy ohangda bo‘lsa (‘praise’, ‘admire’, ‘success’) — bo‘shliqqa ham ijobiy so‘z keladi. Salbiy ohangda bo‘lsa (‘criticize’, ‘fail’, ‘doubt’) — salbiy so‘z. Tonalni adashgan variantni darhol rad eting.",
      },
      {
        title: "Qoida 3 — Variantni gapga qo‘yib o‘qing",
        body:
          "Har bir variantni bo‘sh joyga qo‘yib, butun gapni 1 marta o‘qing. Mantiq buzilsa, ohang buzilsa yoki ortiqcha kuchli/yumshoq bo‘lsa — variant noto‘g‘ri. Faqat bitta variant gapni *to‘liq tabiiy* qiladi.",
      },
      {
        title: "Qoida 4 — So‘z aynan qaysi grammatik vazifada?",
        body:
          "Bo‘shliq sifat bo‘lishi kerakmi (ot oldidan), fe’lmi (sub’ektdan keyin), otmi yoki ravishmi? Variantning grammatik kategoriyasi noto‘g‘ri bo‘lsa — yiqiladi (kamdan-kam, lekin uchraydi).",
      },
      {
        title: "Qoida 5 — ‘Precisely / exactly / specifically’ savol qo‘shimchasiga yopishib qol",
        body:
          "Savolda ‘most logical and precise’ deyilsa — *kontekstga eng yaqin ma’noli* so‘zni qidiring. Umumiy ma’noli so‘z (‘good’, ‘important’) zaif; aniq, kuchli so‘z (‘affecting’, ‘pivotal’, ‘meticulous’) — to‘g‘ri.",
      },
    ],
  },

  synonyms: {
    name: "Kontekstda sinonim (Most Nearly Means)",
    intro:
      "Synonyms savolida berilgan so‘zning *passajdagi konkret ma’nosi*ga eng yaqin sinonim topiladi. So‘zning lug‘aviy ma’nosi emas — kontekstdagi ishlatilishi muhim. Bir so‘z bir necha ma’noga ega bo‘lishi mumkin; passaj qaysi ma’noni ishlatayotganini aniqlash birinchi vazifa.",
    rules: [
      {
        title: "Qoida 1 — So‘zni gapdan ajratmasdan o‘qing",
        body:
          "Tagi chizilgan so‘zni o‘rab turgan kamida 1 jumla oldin va 1 jumla keyin o‘qing. So‘z qaysi maydonda — ijobiy, salbiy, neytral — ishlatilyapti? Avval shuni aniqlang.",
      },
      {
        title: "Qoida 2 — Variantni gapga qo‘yib, ma’no o‘zgaradimi tekshiring",
        body:
          "Tagi chizilgan so‘zni har bir variant bilan almashtirib, gapni o‘qing. Ma’no o‘zgarmasa va ohang saqlansa — bu to‘g‘ri javob. Ma’no biroz farq qilsa, butun gap mantiqi buzilsa — yiqiladi.",
      },
      {
        title: "Qoida 3 — Lug‘aviy ‘to‘g‘ri’ — kontekst bo‘yicha ‘noto‘g‘ri’ bo‘lishi mumkin",
        body:
          "Variant so‘zining birinchi lug‘aviy ma’nosi to‘g‘ri ko‘rinishi mumkin, lekin shu kontekstga to‘g‘ri kelmasligi mumkin. Masalan, ‘undergone’ ‘experienced’ ham, ‘passed through’ ham bo‘lishi mumkin — kontekst qaysisini talab qilayotganini aniqlash kerak.",
      },
      {
        title: "Qoida 4 — Adabiy matnda — qadimiy yoki badiiy ma’no",
        body:
          "Passaj 19-asr yoki adabiy matn bo‘lsa, so‘zning *zamonaviy* ma’nosi emas, *o‘sha davrdagi* yoki *badiiy* ma’nosi izlanadi. Klassik adabiyot uslubiga mos keladigan variantni tanlang.",
      },
      {
        title: "Qoida 5 — Eng yumshoq, neytral variantni qidiring (odatda)",
        body:
          "Eng kuchli, eng dramatik so‘z (‘destroyed’, ‘obliterated’) — odatda noto‘g‘ri javob. Konkret kontekstga mos keladigan o‘rta kuchli, neytral so‘z (‘endured’, ‘experienced’) — to‘g‘ri.",
      },
    ],
  },
};

function renderStrategy(main) {
  document.title = "Sirli qoidalar — SAToplam Reading";
  const renderSection = (sectionKey, sectionTitle) => {
    const topics = TOPIC_ORDER.filter(t => t.section === sectionKey);
    const cards = topics.map((t, i) => `
      <a class="topic-card" href="#/strategy/${t.slug}">
        <div class="num">${i + 1}-bo‘lim</div>
        <div class="name">${escapeHtml(t.title)}</div>
        <div class="meta">${(STRATEGY[t.slug]?.rules?.length || 0)} ta sirli qoida</div>
        <p class="muted" style="margin-top:8px">${escapeHtml(STRATEGY[t.slug]?.intro?.slice(0, 150) || "")}…</p>
      </a>
    `).join("");
    return `
      <section class="section-block">
        <h2 class="section-title">${escapeHtml(sectionTitle)}</h2>
        <div class="topic-grid">${cards}</div>
      </section>
    `;
  };
  main.innerHTML = `
    <h1>Sirli qoidalar — har bir savol turini tez yechish</h1>
    <p class="lead">
      Quyidagi 13 ta bo‘lim har bir SAToplam Reading savolini eng tez va aniq yechish uchun amaliy qoidalardan iborat.
      Har bir qoida real SAT savollaridagi naqshlardan kelib chiqqan — yodlab oling, va savolni ko‘rgan zahoti qaysi
      qoidani qo‘llashni bilib olasiz.
    </p>
    ${renderSection("info",  "Bo‘lim 1 — Information and Ideas")}
    ${renderSection("craft", "Bo‘lim 2 — Craft and Structure")}
    <p style="margin-top:18px"><a href="#/">← Bosh sahifa</a></p>
  `;
}

function renderStrategyTopic(main, slug) {
  const meta = topicMeta(slug);
  const s = STRATEGY[slug];
  document.title = `${meta.title} — sirli qoidalar`;
  if (!s) {
    main.innerHTML = `<p>Bu bo‘lim uchun strategiya hali yozilmagan. <a href="#/strategy">Sirli qoidalar ro‘yxati</a></p>`;
    return;
  }
  const list = state.byTopic[slug] || [];
  main.innerHTML = `
    <article class="question-detail">
      <div class="question-meta">${escapeHtml(meta.title)} · sirli qoidalar</div>
      <h1>${escapeHtml(s.name)} — qanday tez yechish</h1>
      <p class="lead">${escapeHtml(s.intro)}</p>

      <section class="explanation">
        ${s.rules.map((r, i) => `
          <h3>${i + 1} · ${escapeHtml(r.title)}</h3>
          <p>${escapeHtml(r.body)}</p>
        `).join("")}
      </section>

      <nav class="qnav">
        <a href="#/strategy">← Boshqa bo‘limlarning sirli qoidalari</a>
        <a href="#/topic/${slug}">${escapeHtml(meta.title)} savollariga o‘tish (${list.length} ta)</a>
        <span></span>
      </nav>
    </article>
  `;
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", route);
load().catch(err => {
  document.getElementById("view").innerHTML = `<p class="placeholder">Failed to load data: ${escapeHtml(err.message || String(err))}</p>`;
});
