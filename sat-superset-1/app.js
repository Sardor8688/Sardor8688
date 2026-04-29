(function(){
  const problemsSection = document.getElementById("problems");
  const formulasSection = document.getElementById("formulas");
  const tipsSection = document.getElementById("tips");
  const nav = document.getElementById("nav-list");

  // Render problems
  window.PROBLEMS.forEach(p => {
    const el = document.createElement("article");
    el.className = "problem";
    el.id = `p-${p.id}`;
    el.innerHTML = `
      <h2><span class="pnum">#${p.id}</span> <span class="topic">${p.topic}</span></h2>
      <div class="statement">${p.statement}</div>
      <div class="block"><h4>Concepts & Definitions</h4><div>${p.concepts}</div></div>
      <div class="block"><h4>Walkthrough (reason it out)</h4><div>${p.walkthrough}</div></div>
      <div class="block"><h4>Formulas Used</h4><div>${p.formulas}</div></div>
      <div class="block"><h4>Pro Tip</h4><div>${p.tip}</div></div>
      <div class="answer-toggle">
        <button data-id="${p.id}">Reveal final answer</button>
        <span class="answer-reveal" id="ans-${p.id}">${p.answer}</span>
      </div>
    `;
    problemsSection.appendChild(el);
  });

  problemsSection.addEventListener("click", (e) => {
    if (e.target.matches("button[data-id]")) {
      const id = e.target.getAttribute("data-id");
      const span = document.getElementById(`ans-${id}`);
      span.classList.toggle("show");
      e.target.textContent = span.classList.contains("show") ? "Hide answer" : "Reveal final answer";
    }
  });

  // Render formulas
  window.FORMULAS.forEach(group => {
    const div = document.createElement("div");
    div.className = "formula-group";
    div.innerHTML = `<h3>${group.section}</h3><ul>${group.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    formulasSection.appendChild(div);
  });

  // Render tips
  window.TIPS.forEach(group => {
    const div = document.createElement("div");
    div.className = "tip-group";
    div.innerHTML = `<h3>${group.section}</h3><ul>${group.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    tipsSection.appendChild(div);
  });

  // Build sidebar
  const buildNav = (tab) => {
    nav.innerHTML = "";
    if (tab === "problems") {
      window.PROBLEMS.forEach(p => {
        const a = document.createElement("a");
        a.href = `#p-${p.id}`;
        a.innerHTML = `<span class="pnum">${p.id}.</span> ${p.topic}`;
        nav.appendChild(a);
      });
    } else if (tab === "formulas") {
      window.FORMULAS.forEach((g, i) => {
        const a = document.createElement("a");
        a.href = `#fg-${i}`;
        a.textContent = g.section;
        nav.appendChild(a);
      });
    } else if (tab === "tips") {
      window.TIPS.forEach((g, i) => {
        const a = document.createElement("a");
        a.href = `#tg-${i}`;
        a.textContent = g.section;
        nav.appendChild(a);
      });
    }
  };

  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      ["problems","formulas","tips"].forEach(t => {
        document.getElementById(t).style.display = (t === tab) ? "" : "none";
        document.getElementById(`title-${t}`).style.display = (t === tab) ? "" : "none";
      });
      buildNav(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Assign IDs to formula / tip groups for anchor nav
  Array.from(formulasSection.children).forEach((el, i) => el.id = `fg-${i}`);
  Array.from(tipsSection.children).forEach((el, i) => el.id = `tg-${i}`);

  // Default tab
  buildNav("problems");

  // KaTeX auto-render
  renderMathInElement(document.body, {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "\\[", right: "\\]", display: true},
      {left: "$", right: "$", display: false},
      {left: "\\(", right: "\\)", display: false}
    ],
    throwOnError: false
  });
})();
