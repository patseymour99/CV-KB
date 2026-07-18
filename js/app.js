/* ==========================================================================
   app.js — renders every section from PROFILE and wires the interactions:
   theme, count-up stats, scrollspy, impact filters, skills evidence,
   command palette (⌘K), vCard download, chart/table toggle.
   ========================================================================== */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------- Theme ---------------------------- */
  const Theme = {
    KEY: "bk-theme",
    apply(mode) {
      document.documentElement.setAttribute("data-theme", mode);
      $("#theme-toggle").setAttribute("aria-pressed", String(mode === "dark"));
      renderCharts(); // ramps are mode-specific
    },
    init() {
      const saved = localStorage.getItem(this.KEY);
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", saved || system);
      $("#theme-toggle").addEventListener("click", (e) => this.toggle(e.clientX, e.clientY));
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem(this.KEY)) this.apply(e.matches ? "dark" : "light");
      });
    },
    toggle(cx, cy) {
      const flip = () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        localStorage.setItem(this.KEY, next);
        this.apply(next);
      };
      // Circular reveal via the View Transitions API — progressive enhancement.
      if (!document.startViewTransition || reducedMotion()) { flip(); return; }
      const x = cx || window.innerWidth - 46;
      const y = cy || 30;
      const vt = document.startViewTransition(flip);
      vt.ready
        .then(() => {
          const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            { duration: 480, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
          );
        })
        .catch(() => {}); // transition skipped — theme still applied
    },
  };

  /* ------------------------- Hero & stats ------------------------- */
  function renderHero() {
    $("#hero-name").textContent = PROFILE.name;
    $("#hero-title").textContent = PROFILE.title;
    $("#hero-firm").textContent = PROFILE.firm;
    $("#hero-summary").textContent = PROFILE.summary;
    $("#hero-location").textContent = PROFILE.location;
    $("#hero-email").href = `mailto:${PROFILE.email}`;

    const row = $("#stat-row");
    PROFILE.stats.forEach((s) => {
      const tile = document.createElement("div");
      tile.className = "stat-tile glow";
      tile.innerHTML =
        `<div class="stat-value"><span class="stat-number" data-target="${s.value}">0</span></div>` +
        `<div class="stat-label"></div><div class="stat-basis"></div>`;
      tile.querySelector(".stat-label").textContent = s.label;
      tile.querySelector(".stat-basis").textContent = s.basis;
      const num = tile.querySelector(".stat-number");
      num.dataset.prefix = s.prefix || "";
      num.dataset.suffix = s.suffix || "";
      num.textContent = `${s.prefix || ""}0${s.suffix || ""}`;
      row.appendChild(tile);
    });
  }

  function countUp(elm) {
    const target = Number(elm.dataset.target);
    const pre = elm.dataset.prefix, suf = elm.dataset.suffix;
    const fmt = (v) => `${pre}${Math.round(v).toLocaleString("en-GB")}${suf}`;
    if (reducedMotion()) { elm.textContent = fmt(target); return; }
    const dur = 1100;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      elm.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function observeStats() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          countUp(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    $$(".stat-number").forEach((n) => io.observe(n));
  }

  /* -------------------------- Experience -------------------------- */
  function renderExperience() {
    const list = $("#timeline");
    PROFILE.experience.forEach((job, idx) => {
      const item = document.createElement("article");
      item.className = "tl-item";
      item.innerHTML = `
        <div class="tl-marker" aria-hidden="true"></div>
        <div class="tl-card" data-idx="${idx}">
          <header class="tl-head">
            <div>
              <h3 class="tl-role"></h3>
              <p class="tl-org"></p>
            </div>
            <div class="tl-meta">
              <span class="tl-dates"></span>
              <span class="tl-loc"></span>
            </div>
          </header>
          <p class="tl-tagline"></p>
          <div class="tl-body" hidden>
            <ul class="tl-highlights"></ul>
            <div class="tl-progression" hidden></div>
            <div class="tl-tags"></div>
          </div>
          <button class="tl-toggle" type="button" aria-expanded="false">
            <span class="tl-toggle-label">Show highlights</span>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>`;
      $(".tl-role", item).textContent = job.role;
      $(".tl-org", item).textContent = `${job.org} · ${job.tagline}`;
      $(".tl-dates", item).textContent = `${job.start} – ${job.end}`;
      $(".tl-loc", item).textContent = job.location;
      $(".tl-tagline", item).textContent = job.summary;
      const ul = $(".tl-highlights", item);
      job.highlights.forEach((h) => {
        const li = document.createElement("li");
        li.textContent = h;
        ul.appendChild(li);
      });
      if (job.progression) {
        const prog = $(".tl-progression", item);
        prog.hidden = false;
        const label = document.createElement("span");
        label.className = "tl-prog-label";
        label.textContent = "Role progression";
        prog.appendChild(label);
        const track = document.createElement("ol");
        track.className = "tl-prog-track";
        job.progression.forEach((p) => {
          const li = document.createElement("li");
          li.textContent = p;
          track.appendChild(li);
        });
        prog.appendChild(track);
      }
      const tags = $(".tl-tags", item);
      job.tags.forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tags.appendChild(s);
      });
      const toggle = $(".tl-toggle", item);
      const body = $(".tl-body", item);
      toggle.addEventListener("click", () => {
        const openNow = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!openNow));
        body.hidden = openNow;
        $(".tl-toggle-label", item).textContent = openNow ? "Show highlights" : "Hide highlights";
      });
      // First card open by default
      if (idx === 0) toggle.click();
      list.appendChild(item);
    });
  }

  /* ------------------------ Impact explorer ------------------------ */
  let activeCategory = "all";

  function renderFilters() {
    const bar = $("#impact-filters");
    const count = $("#impact-count");
    PROFILE.engagementCategories.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "filter-chip" + (c.id === activeCategory ? " is-active" : "");
      b.textContent = c.label;
      b.setAttribute("aria-pressed", String(c.id === activeCategory));
      b.addEventListener("click", () => {
        activeCategory = c.id;
        $$(".filter-chip", bar).forEach((x) => {
          const on = x === b;
          x.classList.toggle("is-active", on);
          x.setAttribute("aria-pressed", String(on));
        });
        renderEngagements();
      });
      bar.insertBefore(b, count); // chips left, count pinned right
    });
  }

  function renderEngagements() {
    const grid = $("#impact-grid");
    grid.innerHTML = "";
    const rows = PROFILE.engagements.filter(
      (e) => activeCategory === "all" || e.category === activeCategory
    );
    rows.forEach((e) => {
      const card = document.createElement("article");
      card.className = "impact-card glow";
      card.id = `eng-${e.id}`;
      card.tabIndex = -1;
      card.innerHTML = `
        <div class="impact-value"></div>
        <h3 class="impact-name"></h3>
        <p class="impact-client"></p>
        <p class="impact-desc"></p>
        <div class="impact-foot">
          <span class="impact-role"></span>
          <span class="impact-region"></span>
        </div>`;
      $(".impact-value", card).textContent = e.valueLabel;
      $(".impact-name", card).textContent = e.name;
      $(".impact-client", card).textContent = e.client;
      $(".impact-desc", card).textContent = e.description;
      $(".impact-role", card).textContent = e.role;
      $(".impact-region", card).textContent = e.region;
      grid.appendChild(card);
    });
    $("#impact-count").textContent =
      rows.length === PROFILE.engagements.length
        ? `${rows.length} engagements`
        : `${rows.length} of ${PROFILE.engagements.length} engagements`;
  }

  /* ----------------------------- Charts ----------------------------- */
  function renderCharts() {
    const chartHost = $("#value-chart");
    if (!chartHost) return;
    const rows = PROFILE.engagements
      .filter((e) => e.valueEuroM)
      .map((e) => ({
        name: e.name,
        client: e.client,
        value: e.valueEuroM,
        display: `€${e.valueEuroM}M`,
        kind: e.metric.kind,
      }));
    Charts.valueBarChart(chartHost, rows);
    Charts.valueTable($("#value-table"), rows);

    Charts.careerStrip($("#career-strip"), [
      { label: "PK Követeléskezelő — Finance Analyst", start: "Apr 2020", end: "Apr 2021", startYear: 2020.25, endYear: 2021.25, place: "Budapest", lane: 0 },
      { label: "McKinsey — Analyst → Specialist", start: "May 2021", end: "May 2025", startYear: 2021.33, endYear: 2025.33, place: "Budapest", lane: 0 },
      { label: "McKinsey — Manager", start: "Jun 2025", end: "Present", startYear: 2025.42, endYear: 2026.55, place: "London", lane: 0 },
      { label: "Corvinus University of Budapest — BSc", startYear: 2018.67, endYear: 2022.08, place: "Budapest", lane: 1, muted: true },
    ], [2018, 2026.6]);
  }

  function wireChartToggle() {
    const btns = $$("[data-viz-view]");
    btns.forEach((b) =>
      b.addEventListener("click", () => {
        btns.forEach((x) => {
          const on = x === b;
          x.classList.toggle("is-active", on);
          x.setAttribute("aria-pressed", String(on));
        });
        const view = b.dataset.vizView;
        $("#value-chart").hidden = view !== "chart";
        $("#value-table").hidden = view !== "table";
      })
    );
  }

  /* ------------------------ Skills & evidence ------------------------ */
  function renderSkills() {
    const host = $("#skills-groups");
    const evidencePanel = $("#skill-evidence");

    PROFILE.skillGroups.forEach((g) => {
      const sec = document.createElement("div");
      sec.className = "skill-group";
      const h = document.createElement("h3");
      h.textContent = g.group;
      sec.appendChild(h);
      const wrap = document.createElement("div");
      wrap.className = "skill-chips";
      g.skills.forEach((s) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "skill-chip";
        b.textContent = s.name;
        b.addEventListener("click", () => showEvidence(s, b));
        wrap.appendChild(b);
      });
      sec.appendChild(wrap);
      host.appendChild(sec);
    });

    function showEvidence(skill, btn) {
      $$(".skill-chip").forEach((c) => c.classList.toggle("is-active", c === btn));
      const engs = skill.evidence
        .map((id) => PROFILE.engagements.find((e) => e.id === id))
        .filter(Boolean);

      evidencePanel.innerHTML = "";
      evidencePanel.hidden = false;

      const title = document.createElement("h4");
      title.textContent = skill.name;
      evidencePanel.appendChild(title);

      if (skill.note) {
        const p = document.createElement("p");
        p.className = "evidence-note";
        p.textContent = skill.note;
        evidencePanel.appendChild(p);
      }

      if (engs.length) {
        const label = document.createElement("p");
        label.className = "evidence-label";
        label.textContent = "Evidenced by";
        evidencePanel.appendChild(label);
        const ul = document.createElement("ul");
        ul.className = "evidence-list";
        engs.forEach((e) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `#eng-${e.id}`;
          a.textContent = `${e.name} — ${e.valueLabel}`;
          a.addEventListener("click", (ev) => {
            ev.preventDefault();
            activeCategory = "all";
            $$("#impact-filters .filter-chip").forEach((x, i) => {
              x.classList.toggle("is-active", i === 0);
              x.setAttribute("aria-pressed", String(i === 0));
            });
            renderEngagements();
            const card = $(`#eng-${e.id}`);
            if (card) {
              card.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
              card.classList.remove("is-flash");
              void card.offsetWidth; // restart animation
              card.classList.add("is-flash");
              card.focus({ preventScroll: true });
            }
          });
          li.appendChild(a);
          ul.appendChild(li);
        });
        evidencePanel.appendChild(ul);
      }
      evidencePanel.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "nearest" });
    }
  }

  /* --------------------- Education & other cards --------------------- */
  function renderEducation() {
    const e = PROFILE.education;
    $("#edu-school").textContent = e.school;
    $("#edu-degree").textContent = e.degree;
    $("#edu-dates").textContent = `${e.start} – ${e.end}`;
    $("#edu-gpa").textContent = e.gpa;
    const ul = $("#edu-highlights");
    e.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      ul.appendChild(li);
    });

    const x = PROFILE.extracurricular;
    $("#extra-org").textContent = x.org;
    $("#extra-role").textContent = x.role;
    $("#extra-dates").textContent = `${x.start} – ${x.end}`;
    const xul = $("#extra-highlights");
    x.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      xul.appendChild(li);
    });

    const langs = $("#lang-list");
    PROFILE.languages.forEach((l) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong></strong><span></span>`;
      li.querySelector("strong").textContent = l.name;
      li.querySelector("span").textContent = l.level;
      langs.appendChild(li);
    });

    const ints = $("#interest-list");
    PROFILE.interests.forEach((i) => {
      const li = document.createElement("li");
      const name = document.createElement("strong");
      name.textContent = `${i.icon} ${i.name}`;
      li.appendChild(name);
      if (i.note) {
        const note = document.createElement("span");
        note.textContent = i.note;
        li.appendChild(note);
      }
      ints.appendChild(li);
    });
  }

  /* --------------------------- Scrollspy --------------------------- */
  function scrollSpy() {
    const links = $$(".nav-link");
    const sections = links
      .map((l) => $(l.getAttribute("href")))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === `#${en.target.id}`)
            );
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ------------------------- vCard download ------------------------- */
  function downloadVCard() {
    const v = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${PROFILE.name}`,
      "N:Koji;Blanka;;;",
      `TITLE:${PROFILE.title}`,
      "ORG:McKinsey & Company",
      `EMAIL;TYPE=INTERNET:${PROFILE.email}`,
      `TEL;TYPE=CELL:${PROFILE.phone.replace(/\s/g, "")}`,
      `ADR;TYPE=WORK:;;;London;;;United Kingdom`,
      `URL:https://${PROFILE.website}`,
      "END:VCARD",
    ].join("\r\n");
    const blob = new Blob([v], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Blanka-Koji.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  async function copyEmail(btn) {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      toast("Email copied to clipboard");
    } catch {
      toast(PROFILE.email); // clipboard blocked — at least show it
    }
  }

  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2200);
  }

  /* ------------------------ Command palette ------------------------ */
  const Palette = (() => {
    let open = false;
    let items = [];
    let filtered = [];
    let selected = 0;

    const commands = () => [
      { label: "Go to Overview",    hint: "Section", run: () => go("#overview") },
      { label: "Go to Experience",  hint: "Section", run: () => go("#experience") },
      { label: "Go to Impact",      hint: "Section", run: () => go("#impact") },
      { label: "Go to Skills",      hint: "Section", run: () => go("#skills") },
      { label: "Go to Education",   hint: "Section", run: () => go("#education") },
      { label: "Ask the assistant", hint: "Chat",    run: () => ChatUI.open() },
      { label: "Start the 60-second tour", hint: "Tour", run: () => Tour.start() },
      { label: "Toggle dark mode",  hint: "Theme",   run: () => Theme.toggle() },
      { label: "Copy email address", hint: "Contact", run: () => copyEmail() },
      { label: "Download vCard",    hint: "Contact", run: () => downloadVCard() },
      { label: "Print / save as PDF", hint: "Export", run: () => window.print() },
      ...CHAT_SUGGESTIONS.map((q) => ({
        label: `Ask: ${q}`,
        hint: "Chat",
        run: () => { ChatUI.open(); ChatUI.send(q); },
      })),
    ];

    const go = (sel) => $(sel)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });

    const els = {};
    const render = () => {
      els.list.innerHTML = "";
      filtered.forEach((c, i) => {
        const li = document.createElement("li");
        li.className = "cp-item" + (i === selected ? " is-selected" : "");
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === selected));
        li.id = `cp-opt-${i}`;
        const l = document.createElement("span");
        l.textContent = c.label;
        const h = document.createElement("span");
        h.className = "cp-hint";
        h.textContent = c.hint;
        li.append(l, h);
        li.addEventListener("click", () => run(i));
        li.addEventListener("pointermove", () => {
          if (selected !== i) { selected = i; render(); }
        });
        els.list.appendChild(li);
      });
      els.input.setAttribute("aria-activedescendant", filtered.length ? `cp-opt-${selected}` : "");
      els.empty.hidden = filtered.length > 0;
    };

    const filter = () => {
      const q = els.input.value.trim().toLowerCase();
      filtered = !q
        ? items
        : items.filter((c) => {
            // subsequence match: "gimp" hits "Go to Impact"
            let i = 0;
            const s = c.label.toLowerCase();
            for (const ch of q) {
              i = s.indexOf(ch, i);
              if (i === -1) return false;
              i++;
            }
            return true;
          });
      selected = 0;
      render();
    };

    const run = (i) => {
      const cmd = filtered[i];
      close();
      if (cmd) setTimeout(() => cmd.run(), 10);
    };

    const openPalette = () => {
      items = commands();
      filtered = items;
      selected = 0;
      open = true;
      els.root.removeAttribute("hidden");
      els.input.value = "";
      render();
      els.input.focus();
    };

    const close = () => {
      open = false;
      els.root.setAttribute("hidden", "");
    };

    const init = () => {
      els.root = $("#cmdk");
      els.input = $("#cmdk-input");
      els.list = $("#cmdk-list");
      els.empty = $("#cmdk-empty");

      document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          open ? close() : openPalette();
        } else if (open && e.key === "Escape") {
          close();
        } else if (open && e.key === "ArrowDown") {
          e.preventDefault();
          selected = Math.min(filtered.length - 1, selected + 1);
          render();
        } else if (open && e.key === "ArrowUp") {
          e.preventDefault();
          selected = Math.max(0, selected - 1);
          render();
        } else if (open && e.key === "Enter") {
          e.preventDefault();
          run(selected);
        }
      });
      els.input.addEventListener("input", filter);
      els.root.addEventListener("click", (e) => {
        if (e.target === els.root) close();
      });
      $$("[data-open-palette]").forEach((b) => b.addEventListener("click", openPalette));
    };

    return { init, open: openPalette };
  })();

  /* --------------- Pointer glow + scroll progress (cheap) --------------- */
  function ambientFX() {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest?.(".glow");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });

    const bar = $("#scroll-progress");
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      bar.style.width = max > 0 ? `${(doc.scrollTop / max) * 100}%` : "0";
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* --------------------------- Guided tour --------------------------- */
  const Tour = (() => {
    const STEPS = [
      { sel: "#stat-row", title: "Impact at a glance", text: "Three headline numbers — and every one traces to a specific CV line, shown under each tile." },
      { sel: "#career-card", title: "A career in one strip", text: "2018 to today. Colour deepens with seniority; the grey band is her degree. Hover any band for details." },
      { sel: "#timeline", title: "The full story", text: "Five roles in five years, intern to Manager. Each card expands into quantified highlights." },
      { sel: "#value-card", title: "Value, visualised", text: "€850M+ identified across featured engagements, in a hand-built chart. Prefer raw numbers? Flip to the table view." },
      { sel: "#impact-grid", title: "Six featured engagements", text: "Filter by theme — growth strategy, cost & productivity, AI & digital, fintech M&A." },
      { sel: ".skills-layout", title: "Skills, with receipts", text: "No self-assessed star ratings. Click any skill and it lists the engagements that prove it." },
      { sel: "#chat-fab", title: "Ask anything", text: "An assistant answers questions about Blanka from her CV — instantly, privately, in your browser.", noScroll: true },
    ];
    const STEP_MS = 8000;
    let i = 0, active = false, timer = null, prevFocus = null;
    let els = {};

    const target = () => document.querySelector(STEPS[i].sel);

    const placeRing = () => {
      const t = target();
      if (!t) return;
      const r = t.getBoundingClientRect();
      const pad = 10;
      Object.assign(els.ring.style, {
        top: `${r.top - pad}px`,
        left: `${r.left - pad}px`,
        width: `${r.width + pad * 2}px`,
        height: `${r.height + pad * 2}px`,
      });
    };

    const armTimer = () => {
      clearTimeout(timer);
      els.progress.classList.remove("is-running");
      if (reducedMotion()) return; // no auto-advance for reduced-motion users
      void els.progress.offsetWidth; // restart the CSS progress animation
      els.progress.style.animationDuration = `${STEP_MS}ms`;
      els.progress.classList.add("is-running");
      timer = setTimeout(() => (i < STEPS.length - 1 ? goTo(i + 1) : end()), STEP_MS);
    };

    const goTo = (n) => {
      i = Math.max(0, Math.min(STEPS.length - 1, n));
      const step = STEPS[i];
      const t = target();
      if (!t) { end(); return; }
      if (!step.noScroll) t.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
      els.count.textContent = `Step ${i + 1} of ${STEPS.length}`;
      els.title.textContent = step.title;
      els.text.textContent = step.text;
      els.prev.disabled = i === 0;
      els.next.textContent = i === STEPS.length - 1 ? "Open the chat" : "Next";
      // Let the smooth scroll settle before framing the target.
      setTimeout(placeRing, step.noScroll || reducedMotion() ? 30 : 420);
      armTimer();
    };

    const start = () => {
      if (active) return;
      active = true;
      prevFocus = document.activeElement;
      if (ChatUI.isOpen()) ChatUI.close();
      els.root.removeAttribute("hidden");
      els.next.focus();
      goTo(0);
    };

    const end = (openChat) => {
      if (!active) return;
      active = false;
      clearTimeout(timer);
      els.progress.classList.remove("is-running");
      els.root.setAttribute("hidden", "");
      if (openChat) ChatUI.open();
      else if (prevFocus?.focus) prevFocus.focus();
    };

    const init = () => {
      els = {
        root: $("#tour"), ring: $("#tour-ring"), card: $("#tour-card"),
        count: $("#tour-count"), title: $("#tour-title"), text: $("#tour-text"),
        prev: $("#tour-prev"), next: $("#tour-next"), exit: $("#tour-exit"),
        progress: $("#tour-progress"),
      };
      els.prev.addEventListener("click", () => goTo(i - 1));
      els.next.addEventListener("click", () => (i === STEPS.length - 1 ? end(true) : goTo(i + 1)));
      els.exit.addEventListener("click", () => end());
      // Reading the card pauses auto-advance; leaving resumes it.
      els.card.addEventListener("pointerenter", () => { clearTimeout(timer); els.progress.classList.remove("is-running"); });
      els.card.addEventListener("pointerleave", () => { if (active) armTimer(); });
      document.addEventListener("keydown", (e) => {
        if (!active) return;
        if (e.key === "Escape") end();
        if (e.key === "ArrowRight") { e.preventDefault(); i === STEPS.length - 1 ? end(true) : goTo(i + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); goTo(i - 1); }
      });
      const reframe = () => { if (active) requestAnimationFrame(placeRing); };
      window.addEventListener("resize", reframe, { passive: true });
      window.addEventListener("scroll", reframe, { passive: true });
      $$("[data-start-tour]").forEach((b) =>
        b.addEventListener("click", (e) => { e.preventDefault(); start(); })
      );
    };

    return { init, start };
  })();

  /* ------------------------- Reveal on scroll ------------------------- */
  function revealOnScroll() {
    if (reducedMotion()) {
      $$(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* ------------------------------ Boot ------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    renderHero();
    renderExperience();
    renderFilters();
    renderEngagements();
    renderSkills();
    renderEducation();
    renderCharts();
    wireChartToggle();
    Theme.init();
    ChatUI.init();
    Palette.init();
    Tour.init();
    ambientFX();
    observeStats();
    scrollSpy();
    revealOnScroll();

    $("#vcard-btn").addEventListener("click", downloadVCard);
    $("#copy-email").addEventListener("click", () => copyEmail());
    $("#print-btn").addEventListener("click", () => window.print());
    $("#year").textContent = new Date().getFullYear();
  });
})();
