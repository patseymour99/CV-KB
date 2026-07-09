/* ==========================================================================
   charts.js — hand-rolled SVG charts, no libraries
   One horizontal "value identified" bar chart (single-measure magnitude →
   sequential one-hue ramp, more-is-darker) with hover/focus tooltips and a
   table-view toggle so no value is gated behind hover.
   ========================================================================== */

const Charts = (() => {
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* Ordinal blue ramps (validated light & dark: monotone L, ΔL ≥ .06,
     light end ≥ 2:1 on its surface, single hue). Index = magnitude rank. */
  const RAMP = {
    light: ["#86b6ef", "#3987e5", "#1c5cab"],
    dark:  ["#86b6ef", "#3987e5", "#184f95"],
  };

  const mode = () =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

  const el = (name, attrs = {}, parent) => {
    const node = document.createElementNS(SVG_NS, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (parent) parent.appendChild(node);
    return node;
  };

  /* ---------------- Tooltip (shared, single instance) ---------------- */
  let tipEl = null;
  const tip = {
    show(html, x, y) {
      if (!tipEl) {
        tipEl = document.createElement("div");
        tipEl.className = "viz-tooltip";
        tipEl.setAttribute("role", "status");
        document.body.appendChild(tipEl);
      }
      tipEl.innerHTML = html;
      tipEl.style.opacity = "1";
      const rect = tipEl.getBoundingClientRect();
      const pad = 12;
      let left = x + pad;
      if (left + rect.width > window.innerWidth - 8) left = x - rect.width - pad;
      let top = y - rect.height - pad;
      if (top < 8) top = y + pad;
      tipEl.style.transform = `translate(${Math.max(8, left)}px, ${top}px)`;
    },
    hide() {
      if (tipEl) tipEl.style.opacity = "0";
    },
  };

  const escText = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ------------- Horizontal bar chart: value per engagement ------------- */
  function valueBarChart(container, rows) {
    container.innerHTML = "";

    const data = [...rows].sort((a, b) => b.value - a.value);
    const max = Math.max(...data.map((d) => d.value));
    const ramp = RAMP[mode()];
    // Rank ascending so darkest = largest (more-is-darker).
    const rankColor = (i) => ramp[Math.min(ramp.length - 1, data.length - 1 - i)];

    const W = 720;
    const rowH = 56, barH = 22, labelW = 232, valueGutter = 88;
    const H = data.length * rowH + 8;
    const plotW = W - labelW - valueGutter;

    const svg = el("svg", {
      viewBox: `0 0 ${W} ${H}`,
      role: "img",
      "aria-label":
        "Bar chart of value identified per engagement: " +
        data.map((d) => `${d.name} ${d.display}`).join("; "),
      class: "viz-svg",
    });

    data.forEach((d, i) => {
      const y = i * rowH + (rowH - barH) / 2;
      const w = Math.max(6, (d.value / max) * plotW);
      const color = rankColor(i);

      const g = el("g", { class: "viz-row", tabindex: "0", role: "group" }, svg);
      g.setAttribute("aria-label", `${d.name}, ${d.client}: ${d.display}`);

      // Category label (text tokens, never series color)
      const label = el("text", {
        x: labelW - 12, y: y + barH / 2, "text-anchor": "end",
        class: "viz-label", dy: "0.35em",
      }, g);
      label.textContent = d.name;

      // Bar: square at baseline, 4px rounded data-end (path, not rect rx)
      const r = 4;
      el("path", {
        d: `M ${labelW} ${y} h ${w - r} a ${r} ${r} 0 0 1 ${r} ${r} v ${barH - 2 * r} a ${r} ${r} 0 0 1 ${-r} ${r} h ${-(w - r)} Z`,
        fill: color, class: "viz-bar",
      }, g);

      // Direct value label at the tip
      const value = el("text", {
        x: labelW + w + 10, y: y + barH / 2, class: "viz-value", dy: "0.35em",
      }, g);
      value.textContent = d.display;

      // Oversized transparent hit target for hover/focus
      const hit = el("rect", {
        x: 0, y: i * rowH, width: W, height: rowH, fill: "transparent",
        class: "viz-hit",
      }, g);

      const showTip = (cx, cy) =>
        tip.show(
          `<div class="viz-tip-value">${escText(d.display)}</div>` +
          `<div class="viz-tip-label">${escText(d.name)}</div>` +
          `<div class="viz-tip-sub">${escText(d.client)} · ${escText(d.kind)}</div>`,
          cx, cy
        );

      hit.addEventListener("pointermove", (e) => { g.classList.add("is-hover"); showTip(e.clientX, e.clientY); });
      hit.addEventListener("pointerleave", () => { g.classList.remove("is-hover"); tip.hide(); });
      g.addEventListener("focus", () => {
        const b = g.getBoundingClientRect();
        g.classList.add("is-hover");
        showTip(b.left + b.width / 2, b.top);
      });
      g.addEventListener("blur", () => { g.classList.remove("is-hover"); tip.hide(); });
    });

    container.appendChild(svg);
  }

  /* ---------------- Table view (the non-hover path to every value) ------- */
  function valueTable(container, rows) {
    container.innerHTML = "";
    const table = document.createElement("table");
    table.className = "viz-table";
    const cap = document.createElement("caption");
    cap.className = "sr-only";
    cap.textContent = "Value identified per engagement";
    table.appendChild(cap);

    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    ["Engagement", "Client", "Impact"].forEach((h) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = h;
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    [...rows].sort((a, b) => b.value - a.value).forEach((d) => {
      const tr = document.createElement("tr");
      [d.name, d.client, d.display].forEach((v, i) => {
        const td = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) td.scope = "row";
        td.textContent = v;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  /* ---------------- Career span strip (2018 → today) ---------------- */
  function careerStrip(container, spans, domain) {
    container.innerHTML = "";
    const W = 720, H = 96, top = 34, bandH = 16, gap = 6;
    const [d0, d1] = domain;
    const x = (yr) => ((yr - d0) / (d1 - d0)) * W;

    const svg = el("svg", {
      viewBox: `0 0 ${W} ${H}`, class: "viz-svg",
      role: "img",
      "aria-label": "Career timeline strip from 2018 to present: " +
        spans.map((s) => `${s.label} ${s.start}–${s.end}`).join("; "),
    }, container);

    // Year ticks (hairline, recessive)
    for (let yr = Math.ceil(d0); yr <= Math.floor(d1); yr++) {
      el("line", { x1: x(yr), y1: top - 6, x2: x(yr), y2: H - 18, class: "viz-grid" }, svg);
      // Anchor edge labels inward so they never clip at the viewBox bounds.
      const anchor = x(yr) < 20 ? "start" : x(yr) > W - 20 ? "end" : "middle";
      const t = el("text", { x: x(yr), y: H - 4, "text-anchor": anchor, class: "viz-tick" }, svg);
      t.textContent = String(yr);
    }

    const ramp = RAMP[mode()];
    spans.forEach((s, i) => {
      const y = top + (s.lane || 0) * (bandH + gap);
      const bx = x(s.startYear), bw = Math.max(8, x(s.endYear) - bx);
      const g = el("g", { class: "viz-row", tabindex: "0" }, svg);
      g.setAttribute("aria-label", `${s.label}, ${s.start} to ${s.end}`);
      el("rect", {
        x: bx, y, width: bw, height: bandH, rx: 4,
        fill: s.muted ? "var(--viz-muted-band)" : ramp[Math.min(i, ramp.length - 1)],
        class: "viz-bar",
      }, g);

      const showTip = (cx, cy) =>
        tip.show(
          `<div class="viz-tip-value">${escText(s.label)}</div>` +
          `<div class="viz-tip-sub">${escText(s.start)} – ${escText(s.end)} · ${escText(s.place)}</div>`,
          cx, cy
        );
      g.addEventListener("pointermove", (e) => { g.classList.add("is-hover"); showTip(e.clientX, e.clientY); });
      g.addEventListener("pointerleave", () => { g.classList.remove("is-hover"); tip.hide(); });
      g.addEventListener("focus", () => {
        const b = g.getBoundingClientRect();
        showTip(b.left + b.width / 2, b.top);
      });
      g.addEventListener("blur", () => { g.classList.remove("is-hover"); tip.hide(); });
    });
  }

  return { valueBarChart, valueTable, careerStrip };
})();
