/* ==========================================================================
   data.js — single source of truth
   Every section of the dashboard (hero, timeline, impact, skills, chat)
   renders from this one structured model. Edit here, the UI follows.
   ========================================================================== */

const PROFILE = {
  name: "Blanka Koji",
  monogram: "BK",
  title: "Strategy & Banking Consultant",
  firm: "Manager · McKinsey & Company",
  location: "London, UK",
  email: "kojiblanka36@gmail.com",
  phone: "+44 7483 513948",
  summary:
    "Strategy and banking specialist with 5+ years at McKinsey & Company, advising C-suite and board-level stakeholders at leading European and Middle Eastern banks on performance diagnostics, digital strategy and productivity. Trusted thought partner to senior leaders — bringing structure to complex topics, aligning stakeholders and using data-driven analysis to inform strategic decisions, prioritisation and execution.",

  // Hero KPI row — every figure traces back to a CV line (see `basis`).
  stats: [
    { id: "years",   value: 5,    suffix: "+",   label: "Years in strategy consulting", basis: "McKinsey, May 2021 – present" },
    { id: "value",   value: 460,  prefix: "€", suffix: "M+", label: "Value identified across featured engagements", basis: "€300M + €100M + €60M" },
    { id: "roles",   value: 4,    suffix: "",    label: "Promotions in under 5 years", basis: "Intern → Analyst → Senior Analyst → Specialist → Manager" },
    { id: "fintech", value: 6600, suffix: "+",   label: "Fintechs mapped & screened", basis: "5,000+ database + 1,600 targets" },
  ],

  experience: [
    {
      id: "mck-manager",
      org: "McKinsey & Company",
      role: "Manager",
      start: "Jun 2025", end: "Present",
      startYear: 2025.42, endYear: 2026.5,
      location: "London, UK",
      tagline: "Bank productivity & digital performance for senior leadership teams",
      summary:
        "Support leading banks to improve productivity and digital performance — helping senior leadership teams identify value-creation opportunities, prioritise management actions and improve execution across complex transformation agendas.",
      highlights: [
        "Led a project team to develop a 5-year North Star strategy for a major European retail bank — board-level KPIs plus a tactical implementation roadmap, resulting in a €300M revenue uplift.",
        "Quantified value-at-stake for a market-leading Kuwaiti bank's AI agenda, identifying ~20–30% operating-cost savings and ~5–8% revenue-uplift potential to inform senior leadership investment decisions.",
        "Led the cost & productivity diagnostics workstream in a large Irish bank's transformation, identifying a €100M cost opportunity while independently driving the workplan and CXO-1 stakeholder alignment.",
      ],
      tags: ["Bank strategy", "AI value-at-stake", "Cost & productivity", "C-suite advisory"],
    },
    {
      id: "mck-specialist",
      org: "McKinsey & Company",
      role: "Specialist — Banking Innovation",
      progression: ["Fintech Analyst Intern", "Fintech Analyst", "Senior Analyst", "Specialist — Banking Innovation"],
      start: "May 2021", end: "May 2025",
      startYear: 2021.33, endYear: 2025.33,
      location: "Budapest, Hungary",
      tagline: "Banking & fintech strategy, M&A — EMEA Fintech Practice",
      summary:
        "Advised financial-services clients globally on banking and fintech strategy and M&A, and supported client development within the McKinsey EMEA Fintech Practice — engaging directly with fintech scale-up executives and investors.",
      highlights: [
        "Developed a 5-year merchant-acquiring strategy for a market-leading CEE bank, using comprehensive diagnostics to identify key strategic opportunities and unlock €60M in incremental revenue potential.",
        "Created a fintech investment strategy for a UAE investment company — built a database of 1,600 potential targets across fintech sub-sectors and shortlisted the 20 with the best investment fit.",
        "Managed a cross-functional team to build McKinsey's database of 5,000+ fintech startups across 40+ sub-sectors, designed to surface innovation trends and streamline fintech M&A market scans.",
      ],
      tags: ["Fintech strategy", "M&A screening", "Payments", "Data products"],
    },
    {
      id: "pk-intern",
      org: "PK Követeléskezelő Zrt.",
      role: "Finance Intern",
      start: "Apr 2020", end: "Apr 2021",
      startYear: 2020.25, endYear: 2021.25,
      location: "Budapest, Hungary",
      tagline: "Debt portfolio transactions & financial planning",
      summary:
        "Focused on debt-package sales and loan-portfolio transactions at a Hungarian debt-management firm.",
      highlights: [
        "Performed market and cost-benefit analyses and collateral valuation in the acquisition of the firm's largest loan portfolio to date — 400+ loans.",
        "Supported financial planning and forecasting, and prepared C-suite presentations on portfolio performance.",
      ],
      tags: ["Loan portfolios", "Valuation", "Financial planning"],
    },
  ],

  // Impact explorer — each engagement is filterable and linked to skills.
  engagements: [
    {
      id: "north-star",
      client: "Major European retail bank",
      name: "5-year North Star strategy",
      category: "strategy",
      region: "Europe",
      role: "Project-team lead",
      valueEuroM: 300,
      valueLabel: "€300M revenue uplift",
      metric: { value: 300, unit: "€M", kind: "Revenue uplift" },
      description:
        "Led the project team developing a board-level 5-year strategy: North Star ambition, board KPIs and a tactical implementation roadmap the bank could execute against.",
      skills: ["Strategic problem solving", "Senior stakeholder communication", "Cross-functional execution"],
    },
    {
      id: "kuwait-ai",
      client: "Market-leading Kuwaiti bank",
      name: "AI agenda value-at-stake",
      category: "ai",
      region: "Middle East",
      role: "Value quantification lead",
      valueEuroM: null,
      valueLabel: "20–30% opex savings · 5–8% revenue uplift potential",
      metric: { value: 30, unit: "%", kind: "Operating-cost saving potential" },
      description:
        "Quantified the value-at-stake of the bank's AI agenda — sizing ~20–30% operating-cost savings and ~5–8% revenue-uplift potential to give senior leadership a fact base for investment decisions.",
      skills: ["Analytical rigour", "Strategic problem solving", "AI & automation"],
    },
    {
      id: "irish-diagnostics",
      client: "Large Irish bank",
      name: "Cost & productivity diagnostics",
      category: "cost",
      region: "Europe",
      role: "Workstream lead",
      valueEuroM: 100,
      valueLabel: "€100M cost opportunity",
      metric: { value: 100, unit: "€M", kind: "Cost opportunity" },
      description:
        "Led the cost & productivity diagnostics workstream of a bank-wide transformation — identified a €100M cost opportunity while independently driving the workplan and aligning CXO-1 stakeholders.",
      skills: ["Analytical rigour", "Senior stakeholder communication", "Strong ownership"],
    },
    {
      id: "merchant-acquiring",
      client: "Market-leading CEE bank",
      name: "Merchant-acquiring strategy",
      category: "strategy",
      region: "Europe",
      role: "Strategy development",
      valueEuroM: 60,
      valueLabel: "€60M incremental revenue potential",
      metric: { value: 60, unit: "€M", kind: "Revenue potential" },
      description:
        "Developed a 5-year merchant-acquiring strategy grounded in comprehensive diagnostics, identifying the strategic moves that unlock €60M in incremental revenue.",
      skills: ["Strategic problem solving", "Analytical rigour", "Results orientation"],
    },
    {
      id: "uae-fintech",
      client: "UAE investment company",
      name: "Fintech investment strategy",
      category: "ma",
      region: "Middle East",
      role: "Strategy & screening",
      valueEuroM: null,
      valueLabel: "1,600 targets screened → 20 best-fit",
      metric: { value: 1600, unit: "", kind: "Targets screened" },
      description:
        "Built a fintech investment strategy on top of a purpose-built database of 1,600 potential targets across sub-sectors, converging on the 20 with the strongest investment fit.",
      skills: ["Analytical rigour", "Attention to detail", "Results orientation"],
    },
    {
      id: "fintech-db",
      client: "McKinsey EMEA Fintech Practice",
      name: "Global fintech database",
      category: "ma",
      region: "Global",
      role: "Cross-functional team lead",
      valueEuroM: null,
      valueLabel: "5,000+ startups · 40+ sub-sectors",
      metric: { value: 5000, unit: "", kind: "Startups mapped" },
      description:
        "Managed a cross-functional team building McKinsey's database of 5,000+ fintech startups across 40+ sub-sectors — used to surface innovation trends and streamline M&A market scans.",
      skills: ["Cross-functional execution", "Strong ownership", "AI & automation"],
    },
  ],

  engagementCategories: [
    { id: "all",      label: "All engagements" },
    { id: "strategy", label: "Growth strategy" },
    { id: "cost",     label: "Cost & productivity" },
    { id: "ai",       label: "AI & digital" },
    { id: "ma",       label: "Fintech & M&A" },
  ],

  // Skills — no invented proficiency percentages; each skill is backed by
  // evidence (engagement ids and/or CV lines), surfaced on click.
  skillGroups: [
    {
      group: "Consulting craft",
      skills: [
        { name: "Strategic problem solving",        evidence: ["north-star", "merchant-acquiring", "kuwait-ai"] },
        { name: "Analytical rigour",                 evidence: ["irish-diagnostics", "uae-fintech", "kuwait-ai", "merchant-acquiring"] },
        { name: "Senior stakeholder communication",  evidence: ["north-star", "irish-diagnostics"], note: "Trusted thought partner to C-suite and board-level stakeholders; CXO-1 alignment." },
        { name: "Cross-functional execution",        evidence: ["fintech-db", "north-star"] },
      ],
    },
    {
      group: "Ways of working",
      skills: [
        { name: "Strong ownership",     evidence: ["irish-diagnostics", "fintech-db"], note: "Independently drove workplans and stakeholder alignment." },
        { name: "Attention to detail",  evidence: ["uae-fintech"] },
        { name: "Results orientation",  evidence: ["merchant-acquiring", "uae-fintech"] },
      ],
    },
    {
      group: "Tools & technology",
      skills: [
        { name: "AI & automation", evidence: ["kuwait-ai", "fintech-db"], note: "AI-assisted workflow automation using Claude Code and Cursor — this dashboard is part of that toolkit." },
        { name: "MS Excel",        evidence: [], note: "Advanced modelling — diagnostics, valuation and forecasting across engagements." },
        { name: "PowerPoint",      evidence: [], note: "Board- and C-suite-level storyline and page craft." },
      ],
    },
  ],

  education: {
    school: "Corvinus Business School",
    degree: "BSc in Business and Management (in English)",
    start: "Sep 2018", end: "Jan 2022",
    gpa: "4.5 / 5.0 cumulative GPA",
    highlights: [
      "Received a state scholarship for scoring a 5.0/5.0 GPA in four consecutive semesters.",
      "Excelled in Strategy and Innovation, Corporate Finance and Managerial Accounting.",
    ],
  },

  extracurricular: {
    org: "Budapest Business Club",
    role: "Sales Associate → Sales Project Manager",
    start: "Oct 2018", end: "Oct 2019",
    highlights: [
      "Sales Associate at one of Corvinus' biggest student associations, connecting top-performing students with corporate employers.",
      "Led a team of 5 as Sales Project Manager for the 2019 Corvinus Career & Business Festival — 40+ corporate partners, 5,000+ attendees.",
    ],
  },

  languages: [
    { name: "Hungarian", level: "Native" },
    { name: "English",   level: "Full professional proficiency" },
  ],

  interests: [
    { name: "Tennis",       icon: "🎾" },
    { name: "Running",      icon: "🏃‍♀️" },
    { name: "Volunteering", icon: "🤝", note: "English tutor for primary-school children in an underserved local community" },
  ],
};

/* ==========================================================================
   Chat knowledge base
   Each entry: keywords (token → weight), optional regex intents (strong
   signal), an answer in markdown-lite, a source attribution, and follow-up
   suggestions. Scored by js/chat.js.
   ========================================================================== */

const CHAT_KB = [
  {
    id: "summary",
    intents: [/who is blanka/, /tell me about (her|blanka|yourself)/, /(overview|summary|background|profile|introduc)/, /^about$/],
    keywords: { summary: 5, overview: 5, background: 4, introduction: 4, about: 3, profile: 4, who: 2, blanka: 1 },
    answer:
      "**Blanka Koji** is a strategy and banking specialist with **5+ years at McKinsey & Company**, currently a **Manager in London**. She advises C-suite and board-level stakeholders at leading European and Middle Eastern banks on performance diagnostics, digital strategy and productivity.\n\nSenior leaders use her as a thought partner because she brings structure to complex topics, aligns stakeholders, and grounds strategic decisions in data-driven analysis.",
    source: "Professional summary",
    followups: ["What has she achieved at McKinsey?", "What is her biggest engagement?", "How can I contact her?"],
  },
  {
    id: "current-role",
    intents: [/current (role|job|position)/, /what does she do now/, /where does she work/],
    keywords: { current: 4, now: 3, today: 3, role: 3, position: 3, manager: 4, london: 3, work: 2, job: 3, doing: 2 },
    answer:
      "Blanka is a **Manager at McKinsey & Company in London** (since June 2025). She supports leading banks on **productivity and digital performance** — helping senior leadership teams identify value-creation opportunities, prioritise management actions and improve execution across complex transformation agendas.",
    source: "Experience — McKinsey Manager",
    followups: ["What results has she delivered?", "What was her path to Manager?"],
  },
  {
    id: "mckinsey",
    intents: [/mckinsey/, /consult(ing|ant)/],
    keywords: { mckinsey: 5, consulting: 4, consultant: 4, firm: 3, company: 2, experience: 2, career: 2 },
    answer:
      "Blanka has spent **5+ years at McKinsey & Company** across two offices:\n\n- **London (Jun 2025 – present)** — Manager, serving banks on productivity and digital performance.\n- **Budapest (May 2021 – May 2025)** — rose from Fintech Analyst Intern through Fintech Analyst and Senior Analyst to **Specialist in Banking Innovation**, advising financial-services clients globally within the EMEA Fintech Practice.\n\nThat's **4 promotions in under 5 years** — a consistently steep trajectory.",
    source: "Experience — McKinsey & Company",
    followups: ["What is her biggest engagement?", "Tell me about her fintech work"],
  },
  {
    id: "achievements",
    intents: [/biggest (win|achievement|impact|project|engagement)/, /(proudest|top|key|main) (achievement|accomplishment|result|project)/, /what has she (delivered|achieved|accomplished)/],
    keywords: { achievement: 5, achieved: 6, achieve: 5, accomplishment: 5, accomplished: 5, impact: 4, result: 4, delivered: 4, win: 3, value: 3, project: 3, engagement: 3, biggest: 3, best: 3, proud: 3 },
    answer:
      "Across her featured engagements Blanka has identified **€460M+ in value** for banking clients:\n\n- **€300M revenue uplift** — led the team developing a 5-year North Star strategy for a major European retail bank, including board-level KPIs and an implementation roadmap.\n- **€100M cost opportunity** — led the cost & productivity diagnostics workstream in a large Irish bank's transformation, driving the workplan and CXO-1 alignment independently.\n- **€60M incremental revenue** — built a 5-year merchant-acquiring strategy for a market-leading CEE bank.\n- **20–30% opex savings potential** — quantified the value-at-stake of a leading Kuwaiti bank's AI agenda.",
    source: "Impact — featured engagements",
    followups: ["Tell me about the AI work", "What's her fintech background?"],
  },
  {
    id: "ai-work",
    intents: [/\bai\b/, /artificial intelligence/, /gen(erative)? ?ai/, /automation/],
    keywords: { ai: 5, artificial: 4, intelligence: 3, genai: 5, automation: 4, digital: 3, claude: 4, cursor: 4, technology: 2, tech: 2 },
    answer:
      "AI shows up in Blanka's work in two ways:\n\n- **Advising on AI strategy** — she quantified the value-at-stake of a market-leading Kuwaiti bank's AI agenda, sizing **~20–30% operating-cost savings and ~5–8% revenue uplift** to inform leadership investment decisions.\n- **Practising it herself** — she uses **AI-assisted workflow automation with Claude Code and Cursor** in her day-to-day toolkit. This interactive dashboard (and the assistant you're talking to) was built as part of that practice.",
    source: "Experience & Tools",
    followups: ["How was this site built?", "What other tools does she use?"],
  },
  {
    id: "fintech",
    intents: [/fintech/, /m&a/, /payments|acquiring/, /start-?ups?/],
    keywords: { fintech: 5, startup: 4, startups: 4, payments: 4, acquiring: 4, merchant: 4, ma: 3, mna: 3, acquisition: 3, investment: 3, innovation: 3, database: 3, scaleup: 3 },
    answer:
      "Fintech was the core of Blanka's Budapest years (2021–2025), within the **McKinsey EMEA Fintech Practice**:\n\n- Built a **fintech investment strategy for a UAE investment company** — a database of 1,600 potential targets, converged to a shortlist of the 20 best-fit.\n- Managed a cross-functional team building McKinsey's **database of 5,000+ fintech startups across 40+ sub-sectors**, used to spot innovation trends and streamline M&A scans.\n- Developed a **5-year merchant-acquiring strategy** for a market-leading CEE bank worth €60M in incremental revenue.\n\nShe worked directly with fintech scale-up executives and investors throughout.",
    source: "Experience — Banking Innovation Specialist",
    followups: ["What did she do before McKinsey?", "What are her main strengths?"],
  },
  {
    id: "before-mckinsey",
    intents: [/before mckinsey/, /first (job|role)/, /pk k/i, /debt|loan portfolio/],
    keywords: { before: 3, first: 3, intern: 3, internship: 3, debt: 4, loan: 4, portfolio: 3, pk: 4, finance: 2, valuation: 3 },
    answer:
      "Before McKinsey, Blanka was a **Finance Intern at PK Követeléskezelő Zrt.** in Budapest (Apr 2020 – Apr 2021), a debt-management firm. She worked on debt-package sales and loan-portfolio transactions — including market and cost-benefit analysis and **collateral valuation for the firm's largest-ever portfolio acquisition (400+ loans)** — and prepared C-suite presentations on portfolio performance.",
    source: "Experience — PK Követeléskezelő",
    followups: ["Where did she study?", "What has she achieved at McKinsey?"],
  },
  {
    id: "education",
    intents: [/educat/, /universit|college|school|degree|study|studied/, /gpa|grades/],
    keywords: { education: 5, university: 4, college: 4, school: 3, degree: 4, study: 3, studied: 3, gpa: 5, corvinus: 5, bsc: 4, grades: 4, academic: 3, scholarship: 4 },
    answer:
      "Blanka holds a **BSc in Business and Management (taught in English)** from **Corvinus Business School** in Budapest (2018–2022), graduating with a **4.5/5.0 cumulative GPA**.\n\nShe received a **state scholarship for scoring a perfect 5.0/5.0 GPA in four consecutive semesters**, and excelled in Strategy and Innovation, Corporate Finance and Managerial Accounting.",
    source: "Education",
    followups: ["What did she do alongside her studies?", "What languages does she speak?"],
  },
  {
    id: "extracurricular",
    intents: [/extracurricular/, /business club/, /student (association|life)/, /leadership outside/],
    keywords: { extracurricular: 5, club: 4, student: 3, association: 3, festival: 4, volunteer: 3, budapest: 2, university: 1 },
    answer:
      "Alongside her studies, Blanka was active in the **Budapest Business Club** (2018–2019), one of Corvinus' biggest student associations:\n\n- As **Sales Associate**, she connected top-performing students with corporate employers.\n- As **Sales Project Manager**, she led a team of 5 organising the **2019 Corvinus Career & Business Festival** — 40+ corporate partners and 5,000+ attendees.\n\nShe also volunteers as an **English tutor for primary-school children** in an underserved local community.",
    source: "Extracurricular",
    followups: ["What are her interests?", "What are her main strengths?"],
  },
  {
    id: "skills",
    intents: [/skills?|strengths?|good at|competenc/],
    keywords: { skills: 5, strengths: 5, strong: 3, competencies: 4, qualities: 4, capable: 3, abilities: 4 },
    answer:
      "Blanka's core strengths, each evidenced by her track record:\n\n- **Strategic problem solving** — North Star and merchant-acquiring strategies worth €360M combined.\n- **Analytical rigour** — €100M cost diagnostic; 1,600-target investment screen.\n- **Senior stakeholder communication** — trusted by C-suite, board and CXO-1 stakeholders.\n- **Strong ownership & cross-functional execution** — independently drove workplans; led cross-functional teams.\n- **Attention to detail & results orientation** — consistently quantified, decision-ready output.\n\nExplore the **Skills** section of this dashboard — each skill links to the engagements that prove it.",
    source: "Skills & evidence",
    followups: ["What tools does she use?", "What has she achieved at McKinsey?"],
  },
  {
    id: "tools",
    intents: [/tools?|software|excel|powerpoint|office/],
    keywords: { tools: 5, excel: 5, powerpoint: 5, office: 4, software: 4, claude: 4, cursor: 4, code: 3 },
    answer:
      "Blanka's toolkit combines the consulting classics with a modern AI workflow:\n\n- **MS Excel** — modelling, diagnostics, valuation and forecasting.\n- **PowerPoint / MS Office** — board-grade storylines and pages.\n- **AI-assisted workflow automation** — using **Claude Code and Cursor** to automate and accelerate analysis. This dashboard is a working example.",
    source: "Other — Tools",
    followups: ["How was this site built?", "Tell me about her AI work"],
  },
  {
    id: "languages",
    intents: [/languages?|hungarian|english|speak/],
    keywords: { languages: 5, language: 5, hungarian: 5, english: 4, speak: 4, speaks: 4, bilingual: 4 },
    answer:
      "Blanka speaks **Hungarian (native)** and **English (full professional proficiency)** — she studied her degree in English and has worked in English-speaking client environments throughout her McKinsey career.",
    source: "Other — Languages",
    followups: ["Where is she based?", "Where did she study?"],
  },
  {
    id: "interests",
    intents: [/interests?|hobb|outside work|free time|fun/],
    keywords: { interests: 5, hobbies: 5, hobby: 5, tennis: 5, running: 4, volunteering: 4, fun: 3, personal: 3, outside: 2 },
    answer:
      "Outside work, Blanka plays **tennis**, goes **running**, and **volunteers as an English tutor** for primary-school children in an underserved local community.",
    source: "Other — Interests",
    followups: ["What are her main strengths?", "How can I contact her?"],
  },
  {
    id: "contact",
    intents: [/contact|reach|email|phone|call|get in touch|hire/],
    keywords: { contact: 5, email: 5, phone: 5, call: 4, reach: 4, touch: 4, number: 3, hire: 3, interview: 3, available: 3 },
    answer:
      "You can reach Blanka directly:\n\n- **Email:** kojiblanka36@gmail.com\n- **Phone:** +44 7483 513948\n- **Location:** London, UK\n\nThe **Contact** button in the header also lets you copy her email or download a vCard in one click.",
    source: "Contact details",
    followups: ["Give me a quick summary of her profile", "Why should we hire her?"],
  },
  {
    id: "location",
    intents: [/where (is she|does she live|is she based)/, /location|based|city/],
    keywords: { location: 5, based: 5, live: 4, lives: 4, city: 3, london: 4, uk: 3, relocate: 3 },
    answer:
      "Blanka is based in **London, UK**, where she works as a Manager at McKinsey & Company. Before London she spent four years in **Budapest, Hungary** with McKinsey.",
    source: "Contact details",
    followups: ["What does she do in London?", "How can I contact her?"],
  },
  {
    id: "why-hire",
    intents: [/why (should|would) (we|i|anyone) hire/, /what makes her (different|special|stand out)/, /unique|stand ?out|differentiator/],
    keywords: { hire: 5, why: 2, special: 4, unique: 4, different: 4, standout: 5, differentiator: 5, fit: 3, candidate: 3 },
    answer:
      "Three things set Blanka apart:\n\n1. **Steep, proven trajectory** — 4 promotions in under 5 years at McKinsey, from intern to Manager, with a move from Budapest to the London office.\n2. **Quantified impact** — €460M+ of value identified across strategy, cost and AI engagements, always tied to decisions leadership actually took.\n3. **Consulting craft + modern tooling** — board-level communication and analytical rigour, combined with hands-on AI-assisted workflows (Claude Code, Cursor). This dashboard is a small proof of that mindset.",
    source: "Synthesised from full profile",
    followups: ["What has she achieved at McKinsey?", "How can I contact her?"],
  },
  {
    id: "promotions",
    intents: [/promot/, /career (path|progression|trajectory)/, /how did she (grow|progress|advance)/],
    keywords: { promotion: 5, promotions: 5, promoted: 5, progression: 4, trajectory: 4, career: 3, path: 3, growth: 3, advance: 3 },
    answer:
      "Blanka's McKinsey trajectory has been consistently steep — **five roles in five years**:\n\n1. Fintech Analyst Intern (2021)\n2. Fintech Analyst\n3. Senior Analyst\n4. Specialist — Banking Innovation\n5. **Manager** (2025, with a move to the London office)\n\nEach step came with broader ownership — from analyst work, to leading workstreams, to leading project teams and owning CXO-level relationships.",
    source: "Experience — role progression",
    followups: ["What does she do as a Manager?", "What has she achieved at McKinsey?"],
  },
  {
    id: "clients",
    intents: [/clients?|banks?|sectors?|industr/, /who does she (work|advise)/],
    keywords: { clients: 5, client: 5, banks: 4, bank: 4, banking: 4, sector: 4, industry: 4, europe: 3, middle: 3, east: 2, kuwait: 4, ireland: 4, irish: 4, uae: 4, cee: 4, geography: 3 },
    answer:
      "Blanka advises **banks and financial institutions across Europe and the Middle East**:\n\n- A major **European retail bank** (5-year North Star strategy)\n- A **large Irish bank** (transformation cost diagnostics)\n- A market-leading **Kuwaiti bank** (AI value-at-stake)\n- A market-leading **CEE bank** (merchant-acquiring strategy)\n- A **UAE investment company** (fintech investment strategy)\n\nHer stakeholders are typically **C-suite, board members and CXO-1 leaders**.",
    source: "Impact — featured engagements",
    followups: ["What results did she deliver?", "Tell me about the AI work"],
  },
  {
    id: "site",
    intents: [/this (site|website|dashboard|page|app)/, /how (was|is) this (built|made)/, /who (built|made) this/, /tech stack/],
    keywords: { site: 4, website: 5, dashboard: 4, built: 4, made: 3, stack: 4, code: 3, javascript: 4, react: 3, framework: 3 },
    answer:
      "This dashboard is a **zero-dependency, hand-built single-page app**: semantic HTML, modern CSS (design tokens, light/dark theming) and vanilla JavaScript — no frameworks, no chart libraries, no tracking.\n\nHighlights: custom SVG charts with accessible tooltips and a table view, a spotlight-guided **60-second tour**, a command palette (**⌘K**), an evidence-linked skills explorer, and this assistant — a client-side retrieval engine over a structured knowledge base of Blanka's CV. It reflects how she works: **AI-assisted development with Claude Code**, with the structure and quality checks done properly.",
    source: "About this dashboard",
    followups: ["Tell me about her AI work", "Give me a quick summary of her profile"],
  },
];

/* Suggested conversation starters shown in the chat UI. */
const CHAT_SUGGESTIONS = [
  "Give me a 30-second summary",
  "What has she achieved at McKinsey?",
  "Tell me about her AI work",
  "Why should we hire her?",
  "Where did she study?",
  "How can I contact her?",
];

/* Synonym map — query tokens are canonicalised before scoring. */
const CHAT_SYNONYMS = {
  cv: "summary", resume: "summary", bio: "summary",
  uni: "university", grad: "degree", graduated: "degree", masters: "degree", bachelor: "bsc", bachelors: "bsc",
  job: "role", jobs: "role", employer: "company", employers: "company", employment: "career",
  telephone: "phone", mobile: "phone", cell: "phone", mail: "email",
  genai: "ai", ml: "ai", llm: "ai", gpt: "ai", chatbot: "ai", artificial: "ai",
  mergers: "ma", acquisitions: "acquisition", "m&a": "ma",
  paytech: "fintech", neobank: "fintech", neobanks: "fintech",
  strengths: "skills", strength: "skills", weaknesses: "skills", competency: "skills",
  hobby: "interests", hobbies: "interests", sports: "interests", sport: "interests",
  lives: "based", residing: "based", city: "location", country: "location",
  wage: "hire", salary: "hire", compensation: "hire",
  girl: "blanka", she: "blanka", her: "blanka", woman: "blanka",
  achievements: "achievement", accomplishments: "accomplishment", impacts: "impact", results: "result",
  promoted: "promotion", promotions: "promotion",
  talk: "speak", talks: "speak", fluent: "languages",
};
