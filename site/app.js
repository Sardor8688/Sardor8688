/* SAToplam Information & Ideas — single-page app
   Reads questions.json + explanations.json (no answers.json) and
   renders topic list / question list / question detail with explanations.
   The correct-answer letter is intentionally never displayed.
*/

const TOPIC_ORDER = [
  { slug: "main_ideas",   title: "Asosiy g‘oya (Main Ideas)",
    blurb: "Matnning umumiy markaziy fikrini topish — har bir gapni bog‘lab turgan g‘oya, alohida bir detal emas." },
  { slug: "details",      title: "Tafsilotlar (Details)",
    blurb: "Matnda to‘g‘ridan-to‘g‘ri aytilgan aniq faktni topib, hech narsa qo‘shmay yoki o‘zgartirmay aynan o‘sha faktni qaytaruvchi variantni tanlash." },
  { slug: "inference",    title: "Mantiqiy xulosa (Inference)",
    blurb: "Matn aytmagan, ammo zaruriy ravishda kelib chiqadigan xulosani topish — matnni mantiqan tugatuvchi variant." },
  { slug: "support",      title: "Dalil — Quvvatlash (Support)",
    blurb: "Berilgan da’vo yoki gipotezani eng kuchli tarzda mustahkamlovchi natijani tanlash." },
  { slug: "weaken",       title: "Dalil — Zaiflashtirish (Weaken)",
    blurb: "Berilgan da’vo yoki gipotezani eng kuchli tarzda zaiflashtiruvchi yoki rad etuvchi natijani tanlash." },
  { slug: "quotation",    title: "Iqtibos (Quotation)",
    blurb: "Aytilgan g‘oya, mavzu yoki xarakter xususiyatini eng aniq ko‘rsatuvchi adabiy iqtibosni tanlash." },
  { slug: "graphs",       title: "Dalil — Grafiklar (Graphs)",
    blurb: "Jadval yoki diagrammani aniq o‘qib, faqat shu raqamlardan kelib chiqadigan va matn da’vosiga mos variantni tanlash." },
];

const TYPE_DEFINITION = {
  main_ideas: "Asosiy g‘oya (Main Ideas) savoli sizdan butun matn nima haqida ekanligini, ya’ni matnning markaziy da’vosi yoki argumentini topishni so‘raydi. To‘g‘ri variant matnning HAMMA qismini qamrab olishi kerak — faqat bitta misol yoki tafsilot emas. Shuningdek u matn aslida aytmagan kuchliroq narsa ham ayta olmaydi (‘faqat’, ‘hech qachon’, ‘har doim’ kabi so‘zlardan ehtiyot bo‘ling).",
  details:    "Tafsilotlar (Details) savoli matnda to‘g‘ridan-to‘g‘ri yozilgan aniq faktni topishni talab qiladi. To‘g‘ri variant aynan o‘sha faktni qaytaradi — yangi ma’lumot qo‘shmaydi, oshirib yubormaydi va matndan tashqari taxminlar qilmaydi. Yarmi to‘g‘ri, yarmi o‘ylab topilgan har qanday variant noto‘g‘ri.",
  inference:  "Mantiqiy xulosa (Inference) savoli — odatda ‘matnni mantiqan tugatuvchi variantni tanlang’ tarzida beriladi — matn aytmagan, ammo aytganlaridan zaruriy ravishda kelib chiqadigan xulosani topishni so‘raydi. To‘g‘ri variant shunchaki ‘mumkin’ emas, balki matn yo‘naltirib turgan yagona xulosa bo‘lishi kerak.",
  support:    "Quvvatlash (Support) savoli — qaysi natija, agar to‘g‘ri bo‘lsa, da’voni yoki gipotezani eng kuchli tarzda quvvatlaydi, deb so‘raydi. To‘g‘ri variant da’voning HAR BIR shartiga aniq mos kelishi va aynan da’vo talab qilgan turdagi dalilni berishi kerak.",
  weaken:     "Zaiflashtirish (Weaken) savoli — qaysi natija da’voni eng kuchli tarzda zaiflashtiradi yoki rad etadi, deb so‘raydi. To‘g‘ri variant da’voning mantig‘iga to‘g‘ridan-to‘g‘ri qarshi chiqadi, muqobil tushuntirish ko‘rsatadi yoki da’vo bog‘liq bo‘lgan zaruriy shartni olib tashlaydi.",
  quotation:  "Iqtibos (Quotation) savoli aytilgan g‘oya, mavzu yoki xulosani eng yaqqol ko‘rsatuvchi adabiy iqtibosni tanlashni so‘raydi. To‘g‘ri iqtibos g‘oyani sahifaning o‘zida ‘sahnaga chiqaradi’ — unda aniq qaysi so‘zlar da’voni ko‘rsatayotganini ko‘rsatib bera olishingiz kerak.",
  graphs:     "Grafiklar (Graphs) savoli jadval yoki diagrammani aniq o‘qib, FAQAT figura ko‘rsatgan ma’lumotlardan kelib chiqadigan va matn argumentiga mos variantni tanlashni so‘raydi. To‘g‘ri variant ham raqamlar bilan to‘liq tasdiqlanadi, ham gipotezaning aynan shartiga mos keladi."
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
  if (hash === "#/strategy") {
    crumb.innerHTML = `<a href="#/">Information &amp; Ideas</a> <span class="sep">›</span> Sirli qoidalar`;
    renderStrategy(main);
    return;
  }
  const ms = hash.match(/^#\/strategy\/([a-z_]+)$/);
  if (ms) {
    crumb.innerHTML = `<a href="#/">Information &amp; Ideas</a> <span class="sep">›</span> <a href="#/strategy">Sirli qoidalar</a> <span class="sep">›</span> ${escapeHtml(topicMeta(ms[1]).title)}`;
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
  document.title = "SAToplam — Information & Ideas | Reasoning & Definitions";
  const cards = TOPIC_ORDER.map((t, i) => {
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
  main.innerHTML = `
    <h1>Information &amp; Ideas — o‘zbekcha</h1>
    <p class="lead">
      SAToplam Reading Book’ning Information &amp; Ideas bo‘limidagi har bir savol —
      to‘liq o‘zbekcha izoh va savol turining ta’rifi bilan. <strong>Javob harflari (A/B/C/D) ataylab ko‘rsatilmaydi</strong> —
      izoh sizni to‘g‘ri talqinga yetaklaydi, shunda siz harfni yodlash o‘rniga o‘z fikringizni isbotlashni o‘rganasiz.
    </p>
    <div class="notice">
      <strong>Qanday foydalanish kerak:</strong> avval matnni o‘qing, javobingizni tanlang, so‘ng pastdagi izohni o‘qing.
      Izoh — qaysi talqin to‘g‘ri ekanini harfsiz tushuntiradi va boshqa variantlar nima uchun yiqilishini ko‘rsatadi.
    </div>
    <div class="topic-grid">${cards}</div>
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
  crumb.innerHTML = `<a href="#/">Information &amp; Ideas</a> <span class="sep">›</span> ${escapeHtml(meta.title)}`;

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
      <div class="question-meta">${escapeHtml(meta.title)} · ${qnum}-savol / ${list.length}</div>
      <h1>Matn va savol</h1>
      <div class="question-passage">${escapeHtml(q.passage || "")}</div>
      <p class="question-prompt">${escapeHtml(q.prompt || "")}</p>
      <ul class="options">${opts}</ul>

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
};

function renderStrategy(main) {
  document.title = "Sirli qoidalar — SAToplam Information & Ideas";
  const cards = TOPIC_ORDER.map((t, i) => `
    <a class="topic-card" href="#/strategy/${t.slug}">
      <div class="num">${i + 1}-bo‘lim</div>
      <div class="name">${escapeHtml(t.title)}</div>
      <div class="meta">${(STRATEGY[t.slug]?.rules?.length || 0)} ta sirli qoida</div>
      <p class="muted" style="margin-top:8px">${escapeHtml(STRATEGY[t.slug]?.intro?.slice(0, 150) || "")}…</p>
    </a>
  `).join("");
  main.innerHTML = `
    <h1>Sirli qoidalar — har bir savol turini tez yechish</h1>
    <p class="lead">
      Quyidagi 7 ta bo‘lim har bir Information & Ideas savolini eng tez va aniq yechish uchun amaliy qoidalardan iborat.
      Har bir qoida real SAT savollaridagi naqshlardan kelib chiqqan — yodlab oling, va savolni ko‘rgan zahoti qaysi
      qoidani qo‘llashni bilib olasiz.
    </p>
    <div class="topic-grid">${cards}</div>
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
