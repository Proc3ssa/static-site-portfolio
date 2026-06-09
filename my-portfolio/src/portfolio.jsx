import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0D1117",
  canvas: "#0D1117",
  node: "#161B22",
  nodeBorder: "#30363D",
  nodeActive: "#1C2128",
  blue: "#58A6FF",
  green: "#3FB950",
  amber: "#D29922",
  red: "#F85149",
  purple: "#BC8CFF",
  text: "#E6EDF3",
  muted: "#8B949E",
  grid: "#161B22",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  .mono { font-family: 'JetBrains Mono', monospace; }

  .canvas {
    min-height: 100vh;
    background-color: ${COLORS.bg};
    background-image:
      linear-gradient(${COLORS.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px);
    background-size: 40px 40px;
    position: relative;
  }

  /* NODE BASE */
  .node {
    background: ${COLORS.node};
    border: 1px solid ${COLORS.nodeBorder};
    border-radius: 6px;
    position: relative;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .node:hover {
    border-color: ${COLORS.blue};
    box-shadow: 0 0 0 1px ${COLORS.blue}33, 0 8px 32px #00000066;
  }
  .node-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 10px 4px;
    border-bottom: 1px solid ${COLORS.nodeBorder};
    color: ${COLORS.muted};
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .node-label .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* PORT */
  .port {
    width: 10px; height: 10px;
    border-radius: 50%;
    border: 2px solid ${COLORS.blue};
    background: ${COLORS.bg};
    position: absolute;
    cursor: pointer;
    transition: background 0.15s;
  }
  .port:hover { background: ${COLORS.blue}; }
  .port-right { right: -5px; top: 50%; transform: translateY(-50%); }
  .port-left  { left: -5px;  top: 50%; transform: translateY(-50%); }
  .port-bottom { bottom: -5px; left: 50%; transform: translateX(-50%); }
  .port-top    { top: -5px;  left: 50%; transform: translateX(-50%); }

  /* BADGE */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 500;
    padding: 3px 9px;
    border-radius: 4px;
    border: 1px solid;
  }

  /* CONNECTOR SVG */
  .connectors {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 0 24px;
    height: 48px;
    background: ${COLORS.bg}cc;
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${COLORS.nodeBorder};
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 600;
    color: ${COLORS.blue};
    display: flex; align-items: center; gap: 8px;
  }
  .nav-links {
    display: flex; gap: 4px;
  }
  .nav-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: ${COLORS.muted};
    background: none; border: none; cursor: pointer;
    padding: 5px 12px;
    border-radius: 4px;
    transition: color 0.15s, background 0.15s;
  }
  .nav-link:hover, .nav-link.active {
    color: ${COLORS.text};
    background: ${COLORS.nodeBorder};
  }

  /* STATUS BAR */
  .statusbar {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 26px;
    background: ${COLORS.node};
    border-top: 1px solid ${COLORS.nodeBorder};
    display: flex; align-items: center; gap: 20px;
    padding: 0 16px;
    z-index: 100;
  }
  .status-item {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500;
    color: ${COLORS.muted};
    display: flex; align-items: center; gap: 5px;
  }
  .status-item .online { color: ${COLORS.green}; }

  /* MAIN LAYOUT */
  .page { padding: 80px 0 50px; }

  /* HERO SECTION */
  .hero-wrap {
    display: flex; justify-content: center;
    padding: 48px 24px 0;
  }
  .hero-node {
    width: min(680px, 100%);
  }
  .hero-body {
    padding: 28px 32px;
    display: grid; grid-template-columns: 1fr auto;
    gap: 24px; align-items: start;
  }
  .hero-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    line-height: 1.1;
    color: ${COLORS.text};
    letter-spacing: -0.02em;
  }
  .hero-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 400;
    color: ${COLORS.blue};
    margin-top: 8px;
  }
  .hero-desc {
    font-size: 14px; line-height: 1.7;
    color: ${COLORS.muted};
    margin-top: 14px;
    max-width: 440px;
  }
  .hero-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: ${COLORS.muted};
    text-align: right;
    display: flex; flex-direction: column; gap: 6px;
  }
  .hero-meta span { display: block; }
  .hero-meta .val { color: ${COLORS.green}; }
  .hero-footer {
    padding: 12px 32px;
    border-top: 1px solid ${COLORS.nodeBorder};
    display: flex; gap: 8px; flex-wrap: wrap;
  }

  /* SECTION LAYOUT */
  .section-row {
    display: flex; justify-content: center; gap: 20px;
    padding: 20px 24px 0;
    flex-wrap: wrap;
    position: relative; z-index: 1;
  }

  /* SKILLS NODE */
  .skills-node { width: min(340px, 100%); }
  .skill-group { padding: 14px 18px; }
  .skill-group-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600;
    color: ${COLORS.amber};
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 10px;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 3px 9px;
    border-radius: 3px;
    border: 1px solid ${COLORS.nodeBorder};
    color: ${COLORS.text};
    background: ${COLORS.bg};
    transition: border-color 0.15s, color 0.15s;
    cursor: default;
  }
  .skill-tag:hover { border-color: ${COLORS.blue}; color: ${COLORS.blue}; }
  .skill-divider {
    height: 1px; background: ${COLORS.nodeBorder};
    margin: 0;
  }

  /* PROJECTS NODE */
  .projects-node { width: min(320px, 100%); }
  .project-item {
    padding: 14px 18px;
    border-bottom: 1px solid ${COLORS.nodeBorder};
    transition: background 0.15s;
    cursor: pointer;
  }
  .project-item:last-child { border-bottom: none; }
  .project-item:hover { background: ${COLORS.nodeActive}; }
  .project-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 600;
    color: ${COLORS.text};
  }
  .project-desc {
    font-size: 12px; color: ${COLORS.muted};
    margin-top: 4px; line-height: 1.5;
  }
  .project-tags { margin-top: 8px; display: flex; gap: 5px; flex-wrap: wrap; }
  .project-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 3px;
    border: 1px solid;
  }

  /* EXPERIENCE NODE */
  .exp-node { width: min(420px, 100%); }
  .exp-item {
    padding: 14px 18px;
    border-bottom: 1px solid ${COLORS.nodeBorder};
  }
  .exp-item:last-child { border-bottom: none; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
  .exp-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 600; color: ${COLORS.text};
  }
  .exp-period {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: ${COLORS.amber};
    white-space: nowrap;
  }
  .exp-company {
    font-size: 12px; color: ${COLORS.blue};
    margin-top: 2px;
  }
  .exp-desc {
    font-size: 12px; color: ${COLORS.muted};
    margin-top: 6px; line-height: 1.6;
  }

  /* CONTACT NODE */
  .contact-node { width: min(300px, 100%); }
  .contact-item {
    padding: 12px 18px;
    border-bottom: 1px solid ${COLORS.nodeBorder};
    display: flex; align-items: center; gap: 10px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .contact-item:last-child { border-bottom: none; }
  .contact-item:hover { background: ${COLORS.nodeActive}; }
  .contact-icon {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; color: ${COLORS.blue};
    width: 20px;
  }
  .contact-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600;
    color: ${COLORS.muted}; letter-spacing: 0.08em;
    text-transform: uppercase;
    width: 70px;
  }
  .contact-value {
    font-size: 13px; color: ${COLORS.text};
  }

  /* METRICS NODE */
  .metrics-node { width: min(220px, 100%); }
  .metric-item {
    padding: 16px 18px;
    border-bottom: 1px solid ${COLORS.nodeBorder};
    display: flex; flex-direction: column; gap: 2px;
  }
  .metric-item:last-child { border-bottom: none; }
  .metric-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 26px; font-weight: 700;
    color: ${COLORS.blue}; line-height: 1;
  }
  .metric-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: ${COLORS.muted};
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* ANNOTATION */
  .annotation {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: ${COLORS.muted}44;
    position: absolute; pointer-events: none;
    letter-spacing: 0.05em;
  }

  /* SYSTEM BOUNDARY */
  .system-boundary {
    display: flex; justify-content: center;
    padding: 20px 24px 0;
  }
  .boundary-inner {
    width: min(760px, 100%);
    border: 1px dashed ${COLORS.nodeBorder};
    border-radius: 8px;
    padding: 20px;
    position: relative;
  }
  .boundary-title {
    position: absolute; top: -10px; left: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600;
    color: ${COLORS.muted};
    background: ${COLORS.bg};
    padding: 0 8px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .boundary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  /* SCROLL SMOOTH */
  html { scroll-behavior: smooth; }

  @media (max-width: 600px) {
    .hero-body { grid-template-columns: 1fr; }
    .hero-meta { text-align: left; }
    .section-row { padding: 16px 12px 0; gap: 12px; }
  }
`;

// SVG connector between two DOM elements
function ConnectorLayer({ connections }) {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const compute = () => {
      const result = [];
      for (const { from, to, color } of connections) {
        const a = document.getElementById(from);
        const b = document.getElementById(to);
        if (!a || !b) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const x1 = ra.left + ra.width / 2;
        const y1 = ra.top + ra.height;
        const x2 = rb.left + rb.width / 2;
        const y2 = rb.top;
        const cp = Math.abs(y2 - y1) * 0.5;
        result.push({ x1, y1, x2, y2, cp, color });
      }
      setLines(result);
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute);
    return () => { window.removeEventListener("resize", compute); window.removeEventListener("scroll", compute); };
  }, [connections]);

  return (
    <svg className="connectors" style={{ position: "fixed" }}>
      <defs>
        {["blue","green","amber"].map(c => (
          <marker key={c} id={`arrow-${c}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={c === "blue" ? COLORS.blue : c === "green" ? COLORS.green : COLORS.amber} opacity="0.5" />
          </marker>
        ))}
      </defs>
      {lines.map((l, i) => (
        <path
          key={i}
          d={`M${l.x1},${l.y1} C${l.x1},${l.y1 + l.cp} ${l.x2},${l.y2 - l.cp} ${l.x2},${l.y2}`}
          fill="none"
          stroke={l.color || COLORS.blue}
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.35"
          markerEnd={`url(#arrow-blue)`}
        />
      ))}
    </svg>
  );
}

function NodeLabel({ color, label, icon }) {
  return (
    <div className="node-label mono">
      <span className="dot" style={{ background: color }} />
      {icon && <span>{icon}</span>}
      {label}
    </div>
  );
}

function Port({ side }) {
  return <span className={`port port-${side}`} />;
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString("en-US", { hour12: false, timeZone: "Africa/Accra" }) + " GMT");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const connections = [
    { from: "port-hero-b", to: "port-skills-t", color: COLORS.blue },
    { from: "port-hero-b2", to: "port-exp-t", color: COLORS.green },
    { from: "port-skills-b", to: "port-contact-t", color: COLORS.amber },
  ];

  const skills = {
    "Frontend": ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vite"],
    "Backend": ["Node.js", "Python", "REST APIs", "GraphQL", "PostgreSQL"],
    "DevOps & Cloud": ["Docker", "AWS", "CI/CD", "Nginx", "Linux"],
    "Architecture": ["Microservices", "Event-driven", "System Design", "API Gateway"],
  };

  const projects = [
    {
      name: "infra-monitor",
      desc: "Real-time infrastructure monitoring dashboard for distributed systems.",
      tags: ["React", "WebSockets", "Go"],
      color: COLORS.blue,
    },
    {
      name: "api-gateway-oss",
      desc: "Lightweight open-source API gateway with rate limiting and auth.",
      tags: ["Node.js", "Redis", "Docker"],
      color: COLORS.green,
    },
    {
      name: "Faisal-ui",
      desc: "Design system and component library built for West African SaaS products.",
      tags: ["React", "Storybook", "TypeScript"],
      color: COLORS.purple,
    },
    {
      name: "data-pipeline-kit",
      desc: "Modular ETL toolkit for small teams working with African payment data.",
      tags: ["Python", "Airflow", "PostgreSQL"],
      color: COLORS.amber,
    },
  ];

  const experience = [
    {
      role: "Senior Software Engineer",
      company: "Fintech Startup · Accra, GH",
      period: "2022 – present",
      desc: "Architecting scalable payment infrastructure serving 100k+ transactions/month across Ghana, Nigeria, and Kenya.",
    },
    {
      role: "Full-Stack Engineer",
      company: "Agency · Kumasi, GH",
      period: "2019 – 2022",
      desc: "Built and shipped 20+ web products for clients in education, logistics, and e-commerce verticals.",
    },
    {
      role: "Junior Developer",
      company: "KNUST Innovation Lab",
      period: "2017 – 2019",
      desc: "Developed research tools and web apps for university departments and local NGOs.",
    },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-id">
          <span style={{ color: COLORS.green }}>●</span>
          <span>portfolio.sys</span>
          <span style={{ color: COLORS.nodeBorder, fontWeight: 300 }}>/</span>
          <span style={{ color: COLORS.muted, fontWeight: 400 }}>v2.4.1</span>
        </div>
        <div className="nav-links">
          {["about", "skills", "projects", "experience", "contact"].map(s => (
            <button
              key={s}
              className={`nav-link mono ${activeSection === s ? "active" : ""}`}
              onClick={() => { setActiveSection(s); document.getElementById(s)?.scrollIntoView({ behavior: "smooth" }); }}
            >
              {s}
            </button>
          ))}
        </div>
      </nav>

      <div className="canvas">
        <div className="page">

          {/* ── HERO NODE ── */}
          <div className="hero-wrap" id="about">
            <div className="node hero-node" style={{ zIndex: 1 }}>
              <NodeLabel color={COLORS.green} label="IDENTITY_NODE" icon="◈" />
              <Port side="bottom" />
              <span id="port-hero-b" style={{ position: "absolute", bottom: -5, left: "35%", width: 10, height: 10 }} />
              <span id="port-hero-b2" style={{ position: "absolute", bottom: -5, left: "65%", width: 10, height: 10 }} />

              <div className="hero-body">
                <div>
                  <div className="hero-name">Faisal<br />Asante</div>
                  <div className="hero-title">// Software Architect · Systems Engineer</div>
                  <div className="hero-desc">
                    Building resilient distributed systems and developer tools from Kumasi, Ghana.
                    Focused on infrastructure that scales across African markets.
                  </div>
                  <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className="badge mono" style={{ color: COLORS.green, borderColor: COLORS.green + "44", background: COLORS.green + "11" }}>
                      ● available for work
                    </span>
                    <span className="badge mono" style={{ color: COLORS.blue, borderColor: COLORS.blue + "44", background: COLORS.blue + "11" }}>
                      ⌖ Kumasi, GH
                    </span>
                  </div>
                </div>
                <div className="hero-meta mono">
                  <span className="muted">uptime</span>
                  <span className="val">99.97%</span>
                  <span style={{ marginTop: 10 }} className="muted">region</span>
                  <span className="val">af-west-1</span>
                  <span style={{ marginTop: 10 }} className="muted">clock</span>
                  <span className="val" style={{ fontSize: 10 }}>{clock}</span>
                </div>
              </div>
              <div className="hero-footer">
                {["problem-solver", "open-source", "mentor", "speaker"].map(t => (
                  <span key={t} className="skill-tag mono">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── SKILLS + METRICS ROW ── */}
          <div className="section-row" id="skills">
            {/* Skills Node */}
            <div className="node skills-node" style={{ zIndex: 1 }}>
              <span id="port-skills-t" style={{ position: "absolute", top: -5, left: "50%", width: 10, height: 10 }} />
              <span id="port-skills-b" style={{ position: "absolute", bottom: -5, left: "50%", width: 10, height: 10 }} />
              <NodeLabel color={COLORS.blue} label="SKILLS_MODULE" icon="⬡" />
              {Object.entries(skills).map(([group, tags], i, arr) => (
                <div key={group}>
                  <div className="skill-group">
                    <div className="skill-group-title">{group}</div>
                    <div className="skill-tags">
                      {tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
                    </div>
                  </div>
                  {i < arr.length - 1 && <div className="skill-divider" />}
                </div>
              ))}
            </div>

            {/* Metrics Node */}
            <div className="node metrics-node" style={{ zIndex: 1, alignSelf: "flex-start" }}>
              <NodeLabel color={COLORS.amber} label="METRICS" icon="⬢" />
              {[
                { val: "7+", label: "years_experience" },
                { val: "30+", label: "projects_shipped" },
                { val: "12", label: "open_source_repos" },
                { val: "3", label: "countries_deployed" },
              ].map(m => (
                <div key={m.label} className="metric-item">
                  <div className="metric-val mono">{m.val}</div>
                  <div className="metric-label mono">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PROJECTS + EXPERIENCE ROW ── */}
          <div className="section-row" id="projects">
            {/* Projects Node */}
            <div className="node projects-node" style={{ zIndex: 1 }}>
              <NodeLabel color={COLORS.purple} label="PROJECT_REGISTRY" icon="▣" />
              {projects.map(p => (
                <div key={p.name} className="project-item">
                  <div className="project-name mono">{p.name}</div>
                  <div className="project-desc">{p.desc}</div>
                  <div className="project-tags">
                    {p.tags.map(t => (
                      <span key={t} className="project-tag mono"
                        style={{ color: p.color, borderColor: p.color + "44", background: p.color + "0D", fontSize: 10 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Node */}
            <div className="node exp-node" style={{ zIndex: 1 }} id="experience">
              <span id="port-exp-t" style={{ position: "absolute", top: -5, left: "50%", width: 10, height: 10 }} />
              <NodeLabel color={COLORS.green} label="EXPERIENCE_LOG" icon="▤" />
              {experience.map(e => (
                <div key={e.role} className="exp-item">
                  <div className="exp-header">
                    <div className="exp-role mono">{e.role}</div>
                    <div className="exp-period mono">{e.period}</div>
                  </div>
                  <div className="exp-company">{e.company}</div>
                  <div className="exp-desc">{e.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SYSTEM BOUNDARY: CONTACT ── */}
          <div className="system-boundary" id="contact" style={{ paddingBottom: 40 }}>
            <div className="boundary-inner">
              <div className="boundary-title">CONTACT_INTERFACE</div>

              {/* Contact Node inside boundary */}
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
                <div className="node contact-node" style={{ zIndex: 1 }}>
                  <span id="port-contact-t" style={{ position: "absolute", top: -5, left: "50%", width: 10, height: 10 }} />
                  <NodeLabel color={COLORS.red} label="ENDPOINTS" icon="⬡" />
                  {[
                    { icon: "@", label: "email", value: "Faisal@example.com" },
                    { icon: "⌥", label: "github", value: "github.com/Faisal" },
                    { icon: "⊞", label: "linkedin", value: "linkedin.com/in/Faisal" },
                    { icon: "◎", label: "location", value: "Kumasi, Ghana" },
                  ].map(c => (
                    <div key={c.label} className="contact-item">
                      <div className="contact-icon mono">{c.icon}</div>
                      <div className="contact-label mono">{c.label}</div>
                      <div className="contact-value">{c.value}</div>
                    </div>
                  ))}
                </div>

                {/* Status node */}
                <div className="node" style={{ width: "min(280px,100%)", alignSelf: "flex-start", zIndex: 1 }}>
                  <NodeLabel color={COLORS.amber} label="SYSTEM_STATUS" icon="◈" />
                  <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { service: "open_to_work", status: "ACTIVE", color: COLORS.green },
                      { service: "freelance_projects", status: "ACTIVE", color: COLORS.green },
                      { service: "mentorship", status: "LIMITED", color: COLORS.amber },
                      { service: "full_time_roles", status: "OPEN", color: COLORS.blue },
                    ].map(s => (
                      <div key={s.service} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="mono" style={{ fontSize: 11, color: COLORS.muted }}>{s.service}</span>
                        <span className="badge mono" style={{ fontSize: 10, color: s.color, borderColor: s.color + "44", background: s.color + "11" }}>
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STATUS BAR */}
      <div className="statusbar">
        <div className="status-item mono">
          <span className="online">●</span>
          <span>ONLINE</span>
        </div>
        <div className="status-item mono">⌖ af-west-1 / kumasi</div>
        <div className="status-item mono">◈ 4 modules loaded</div>
        <div className="status-item mono" style={{ marginLeft: "auto" }}>
          portfolio.sys · {clock}
        </div>
      </div>
    </>
  );
}
