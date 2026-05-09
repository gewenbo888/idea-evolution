"use client";
import { useState } from "react";
import { IDEAS, type Idea } from "@/data/ideas";
import { ui, useLang, T } from "@/lib/i18n";

const AXES = [
  { key: "resonance",   label: ui.trait_resonance },
  { key: "simplicity",  label: ui.trait_simple },
  { key: "institution", label: ui.trait_inst },
  { key: "technology",  label: ui.trait_tech },
  { key: "adaptability",label: ui.trait_adapt },
  { key: "utility",     label: ui.trait_utility },
  { key: "narrative",   label: ui.trait_narrative },
  { key: "symbol",      label: ui.trait_symbol },
] as const;

export function IdeaRadar() {
  const { lang } = useLang();
  const [id, setId] = useState<string>("buddhism");
  const idea: Idea = IDEAS.find(i => i.id === id) ?? IDEAS[0];

  const size = 360, cx = size/2, cy = size/2, R = 130;
  const points = AXES.map((a, i) => {
    const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
    const v = (idea.traits as any)[a.key] / 100;
    return { x: cx + Math.cos(angle) * R * v, y: cy + Math.sin(angle) * R * v, angle, v };
  });
  const grid = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="radar-wrap">
      <div className="frame" style={{ padding: 12 }}>
        <svg width="100%" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Idea Score">
          <defs>
            <radialGradient id="rfill" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#38e6ff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#a06bff" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          {grid.map(g => (
            <polygon key={g}
              points={AXES.map((_, i) => {
                const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
                return `${cx + Math.cos(angle) * R * g},${cy + Math.sin(angle) * R * g}`;
              }).join(" ")}
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          ))}
          {AXES.map((a, i) => {
            const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
            const lx = cx + Math.cos(angle) * (R + 22);
            const ly = cy + Math.sin(angle) * (R + 22);
            return (
              <g key={a.key as string}>
                <line x1={cx} y1={cy} x2={cx + Math.cos(angle) * R} y2={cy + Math.sin(angle) * R} stroke="rgba(255,255,255,0.06)" />
                <text x={lx} y={ly} fontSize={11} fill="#cdd0e0" textAnchor="middle" dominantBaseline="middle">{T(a.label, lang)}</text>
              </g>
            );
          })}
          <polygon points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="url(#rfill)" stroke="#38e6ff" strokeWidth={1.5} />
          {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#38e6ff" />)}
        </svg>
      </div>

      <div className="radar-side">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {IDEAS.slice(0, 16).map(i => (
            <button key={i.id} className={`chip ${id === i.id ? "active" : ""}`} onClick={() => setId(i.id)} data-type={i.type}>
              {T(i.name, lang)}
            </button>
          ))}
        </div>
        <h3>{T(idea.name, lang)}</h3>
        <div className="desc">{T(idea.desc, lang)}</div>
        <div className="formula">{T(ui.sec4_formula, lang)}</div>
      </div>
    </div>
  );
}
