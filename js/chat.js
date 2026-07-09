/* ==========================================================================
   chat.js — client-side retrieval assistant
   No backend, no API keys: a deterministic retrieval engine over CHAT_KB.
   Pipeline: normalise → tokenize → canonicalise synonyms → light stem →
   score every KB entry (regex intents + weighted keyword overlap + fuzzy
   token matching) → answer, or fall back gracefully with topic suggestions.
   ========================================================================== */

const ChatEngine = (() => {
  const STOPWORDS = new Set([
    "a","an","the","is","are","was","were","be","been","do","does","did","can",
    "could","would","should","will","shall","may","might","have","has","had",
    "i","you","we","they","he","it","me","my","your","of","to","in","on","at",
    "for","with","and","or","but","if","so","what","whats","which","how","when",
    "there","this","that","these","those","tell","give","show","please","us",
    "about","more","some","any","lot","bit","get","got","let","know","like",
  ]);

  const normalise = (s) =>
    s.toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[^a-z0-9&%+\-\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  /* Light stemmer — enough to unify plurals/gerunds without a library. */
  const stem = (w) => {
    if (w.length <= 3) return w;
    if (w.endsWith("ies") && w.length > 4) return w.slice(0, -3) + "y";
    if (w.endsWith("ing") && w.length > 5) return w.slice(0, -3);
    if (w.endsWith("ed") && w.length > 4) return w.slice(0, -2);
    if (w.endsWith("es") && w.length > 4) return w.slice(0, -2);
    if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
    return w;
  };

  const canon = (w) => CHAT_SYNONYMS[w] || w;

  const tokenize = (text) =>
    normalise(text)
      .split(" ")
      .filter((w) => w && !STOPWORDS.has(w))
      .map(canon)
      .map(stem)
      .map(canon); // canonicalise again post-stem (e.g. "promotions"→"promotion")

  /* Bounded Levenshtein for typo tolerance ("expereince" still matches). */
  const editDistance = (a, b, max = 2) => {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let rowMin = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(
          prev[j] + 1,
          cur[j - 1] + 1,
          prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
        rowMin = Math.min(rowMin, cur[j]);
      }
      if (rowMin > max) return max + 1; // early exit — row can't recover
      prev = cur;
    }
    return prev[b.length];
  };

  /* Pre-tokenize KB keyword lists once (stemmed) for fair matching. */
  const KB = CHAT_KB.map((entry) => {
    const kw = {};
    for (const [k, weight] of Object.entries(entry.keywords || {})) {
      kw[stem(canon(k))] = Math.max(kw[stem(canon(k))] || 0, weight);
    }
    return { ...entry, kw, kwTokens: Object.keys(kw) };
  });

  const scoreEntry = (entry, tokens, rawQuery) => {
    let score = 0;
    const matched = new Set();

    for (const rx of entry.intents || []) {
      if (rx.test(rawQuery)) { score += 8; break; }
    }
    for (const t of tokens) {
      if (entry.kw[t] !== undefined) {
        if (!matched.has(t)) { score += entry.kw[t]; matched.add(t); }
        continue;
      }
      if (t.length < 5) continue; // fuzzy only on longer tokens — fewer false hits
      for (const k of entry.kwTokens) {
        if (k.length >= 5 && editDistance(t, k) <= (t.length > 7 ? 2 : 1)) {
          if (!matched.has(k)) { score += entry.kw[k] * 0.7; matched.add(k); }
          break;
        }
      }
    }
    // Small boost when several distinct keywords hit — topical confidence.
    if (matched.size >= 2) score += matched.size;
    return score;
  };

  /* Conversational niceties handled before retrieval. */
  const SMALL_TALK = [
    {
      rx: /^(hi|hey|hello|good (morning|afternoon|evening)|howdy|yo)\b/i,
      reply: () =>
        "Hello! I'm Blanka's CV assistant — ask me anything about her experience, impact, education or skills. Try one of the suggestions below to get started.",
    },
    {
      rx: /^(thanks|thank you|cheers|great|awesome|nice|cool|perfect)\b/i,
      reply: () =>
        "You're welcome! Anything else you'd like to know about Blanka? Her **contact details** are one question away.",
    },
    {
      rx: /(who|what) are you\b|are you (an? )?(ai|bot|robot|human)/i,
      reply: () =>
        "I'm a lightweight assistant built into this dashboard — a retrieval engine running entirely in your browser over a structured knowledge base of **Blanka's CV**. No data leaves this page. Ask me about her experience, results, education, skills or how to reach her.",
    },
    {
      rx: /^(bye|goodbye|see you|later)\b/i,
      reply: () =>
        "Goodbye! If you'd like to follow up with Blanka directly: **kojiblanka36@gmail.com**.",
    },
  ];

  const FALLBACK =
    "I don't have that in Blanka's CV, so I won't guess. I can help with:\n\n" +
    "- Her **experience** at McKinsey and before\n" +
    "- **Results** — the €460M+ of value identified\n" +
    "- **AI & fintech** work\n" +
    "- **Education**, **skills**, **languages** and **interests**\n" +
    "- **Contact details**\n\n" +
    "For anything beyond the CV, ask her directly at **kojiblanka36@gmail.com**.";

  const FALLBACK_FOLLOWUPS = [
    "Give me a 30-second summary",
    "What has she achieved at McKinsey?",
    "How can I contact her?",
  ];

  function ask(query) {
    const rawQuery = normalise(query);
    if (!rawQuery) {
      return { answer: "Type a question about Blanka — or tap a suggestion below.", followups: CHAT_SUGGESTIONS.slice(0, 3), source: null };
    }

    for (const st of SMALL_TALK) {
      if (st.rx.test(query.trim())) {
        return { answer: st.reply(), followups: CHAT_SUGGESTIONS.slice(0, 3), source: null };
      }
    }

    const tokens = tokenize(query);
    const ranked = KB
      .map((entry) => ({ entry, score: scoreEntry(entry, tokens, rawQuery) }))
      .sort((a, b) => b.score - a.score);

    const best = ranked[0];
    const threshold = 4;

    if (!best || best.score < threshold) {
      return { answer: FALLBACK, followups: FALLBACK_FOLLOWUPS, source: null };
    }

    // If the runner-up is nearly as relevant, surface it as a follow-up path.
    const followups = [...(best.entry.followups || [])];
    const second = ranked[1];
    if (second && second.score >= threshold && second.score >= best.score * 0.75) {
      const hint = (second.entry.followups || [])[0];
      if (hint && !followups.includes(hint)) followups.push(hint);
    }

    return {
      answer: best.entry.answer,
      source: best.entry.source || null,
      followups: followups.slice(0, 3),
    };
  }

  return { ask, tokenize };
})();

/* ==========================================================================
   Chat UI — panel, message stream, typing indicator, streamed rendering.
   All user/KB text is inserted via textContent; markdown-lite formatting is
   applied only after HTML-escaping (see mdLite).
   ========================================================================== */

const ChatUI = (() => {
  let openState = false;
  let els = {};
  let history = [];

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* Markdown-lite: escape first, then allow only **bold**, line-break lists
     and paragraph splits. Nothing else is interpreted — safe by construction. */
  const mdLite = (raw) => {
    const blocks = esc(raw).split(/\n{2,}/).map((block) => {
      const lines = block.split("\n");
      const isList = lines.every((l) => /^(-|\d+\.)\s/.test(l.trim()));
      if (isList) {
        const ordered = /^\d+\./.test(lines[0].trim());
        const items = lines
          .map((l) => `<li>${l.trim().replace(/^(-|\d+\.)\s*/, "")}</li>`)
          .join("");
        return ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
      }
      return `<p>${lines.join("<br>")}</p>`;
    });
    return blocks.join("").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  };

  const scrollToEnd = () => {
    els.stream.scrollTop = els.stream.scrollHeight;
  };

  const addMessage = (who, html, source) => {
    const wrap = document.createElement("div");
    wrap.className = `chat-msg chat-msg--${who}`;
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerHTML = html;
    wrap.appendChild(bubble);
    if (source) {
      const cite = document.createElement("div");
      cite.className = "chat-source";
      cite.textContent = `From: ${source}`;
      wrap.appendChild(cite);
    }
    els.stream.appendChild(wrap);
    scrollToEnd();
    return bubble;
  };

  const setSuggestions = (list) => {
    els.suggest.innerHTML = "";
    (list || []).forEach((q) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chat-chip";
      b.textContent = q;
      b.addEventListener("click", () => send(q));
      els.suggest.appendChild(b);
    });
  };

  const typingIndicator = () => {
    const wrap = document.createElement("div");
    wrap.className = "chat-msg chat-msg--bot";
    wrap.innerHTML =
      '<div class="chat-bubble chat-typing" aria-label="Assistant is typing"><span></span><span></span><span></span></div>';
    els.stream.appendChild(wrap);
    scrollToEnd();
    return wrap;
  };

  /* Stream the answer in word-chunks for a live feel (skipped for
     reduced-motion users, who get the full answer at once). */
  const streamAnswer = (html, source, done) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      addMessage("bot", html, source);
      if (done) done();
      return;
    }
    const bubbleWrap = document.createElement("div");
    bubbleWrap.className = "chat-msg chat-msg--bot";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubbleWrap.appendChild(bubble);
    els.stream.appendChild(bubbleWrap);

    // Reveal by cloning the final DOM and progressively unhiding text nodes.
    bubble.innerHTML = html;
    const walker = document.createTreeWalker(bubble, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const originals = nodes.map((n) => n.nodeValue);
    nodes.forEach((n) => (n.nodeValue = ""));

    let ni = 0, ci = 0;
    const tick = () => {
      let budget = 3 + Math.floor(Math.random() * 3); // words per tick
      while (budget > 0 && ni < nodes.length) {
        const target = originals[ni];
        const nextSpace = target.indexOf(" ", ci + 1);
        const sliceEnd = nextSpace === -1 ? target.length : nextSpace;
        nodes[ni].nodeValue = target.slice(0, sliceEnd);
        ci = sliceEnd;
        budget--;
        if (ci >= target.length) { ni++; ci = 0; }
      }
      scrollToEnd();
      if (ni < nodes.length) {
        setTimeout(tick, 24);
      } else {
        if (source) {
          const cite = document.createElement("div");
          cite.className = "chat-source";
          cite.textContent = `From: ${source}`;
          bubbleWrap.appendChild(cite);
        }
        scrollToEnd();
        if (done) done();
      }
    };
    tick();
  };

  let busy = false;
  const send = (text) => {
    const q = (text ?? els.input.value).trim();
    if (!q || busy) return;
    els.input.value = "";
    els.input.focus();
    busy = true;
    setSuggestions([]);
    addMessage("user", mdLite(q));
    history.push({ role: "user", text: q });

    const indicator = typingIndicator();
    const { answer, source, followups } = ChatEngine.ask(q);
    const thinkMs = 350 + Math.min(500, answer.length / 4);

    setTimeout(() => {
      indicator.remove();
      streamAnswer(mdLite(answer), source, () => {
        setSuggestions(followups);
        busy = false;
      });
      history.push({ role: "bot", text: answer });
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 60 : thinkMs);
  };

  const open = (prefill) => {
    openState = true;
    els.panel.classList.add("is-open");
    els.fab.classList.add("is-hidden");
    els.panel.removeAttribute("hidden");
    document.body.classList.add("chat-open-mobile");
    if (prefill) {
      els.input.value = prefill;
    }
    setTimeout(() => els.input.focus(), 80);
    if (!history.length) {
      addMessage(
        "bot",
        mdLite(
          "Hi — I'm **Blanka's CV assistant**. I answer from her CV, right here in your browser.\n\nAsk me about her experience, results, education or skills — or start with a suggestion below."
        )
      );
      setSuggestions(CHAT_SUGGESTIONS);
    }
  };

  const close = () => {
    openState = false;
    els.panel.classList.remove("is-open");
    els.fab.classList.remove("is-hidden");
    document.body.classList.remove("chat-open-mobile");
    setTimeout(() => { if (!openState) els.panel.setAttribute("hidden", ""); }, 250);
    els.fab.focus();
  };

  const toggle = () => (openState ? close() : open());

  const init = () => {
    els = {
      fab: document.getElementById("chat-fab"),
      panel: document.getElementById("chat-panel"),
      stream: document.getElementById("chat-stream"),
      input: document.getElementById("chat-input"),
      form: document.getElementById("chat-form"),
      suggest: document.getElementById("chat-suggestions"),
      closeBtn: document.getElementById("chat-close"),
    };
    els.fab.addEventListener("click", () => open());
    els.closeBtn.addEventListener("click", close);
    els.form.addEventListener("submit", (e) => { e.preventDefault(); send(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && openState) close();
    });
    document.querySelectorAll("[data-open-chat]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        open(el.getAttribute("data-open-chat") || undefined);
      })
    );
  };

  return { init, open, close, toggle, send, isOpen: () => openState };
})();
