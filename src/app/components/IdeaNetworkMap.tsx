"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath, geoInterpolate } from "d3-geo";
import { feature } from "topojson-client";
import { IDEAS, IdeaType, type Idea } from "@/data/ideas";
import { ui, useLang, T } from "@/lib/i18n";

const TYPE_COLOR: Record<IdeaType, string> = {
  religion: "#ffb454", philosophy: "#38e6ff", ideology: "#ff5dd1",
  paradigm: "#61f5b3", meme: "#a06bff", symbol: "#ffffff",
};

const TYPES: IdeaType[] = ["religion","philosophy","ideology","paradigm","meme","symbol"];

export function IdeaNetworkMap() {
  const { lang } = useLang();
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 675 });
  const [filter, setFilter] = useState<IdeaType | "all">("all");
  const [hover, setHover] = useState<Idea | null>(null);
  const [selected, setSelected] = useState<Idea | null>(null);
  const [land, setLand] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")
      .then(r => r.json())
      .then(topo => { if (!cancelled) setLand(feature(topo, topo.objects.land)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      const w = e.contentRect.width; const h = Math.max(420, Math.round(w * 0.5625));
      setSize({ w, h });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const projection = useMemo(() => geoNaturalEarth1()
    .fitExtent([[20, 30], [size.w - 20, size.h - 20]], { type: "Sphere" } as any),
    [size.w, size.h]);
  const path = useMemo(() => geoPath(projection), [projection]);

  const visible = IDEAS.filter(i => filter === "all" || i.type === filter);
  const card = hover ?? selected;

  // For the chosen idea, compute spread arcs as smooth great-circle samples.
  const arcsFor = (idea: Idea) => {
    const a = projection([idea.origin[1], idea.origin[0]]);
    if (!a) return [];
    return idea.spread.map((s) => {
      const interp = geoInterpolate([idea.origin[1], idea.origin[0]], [s.coord[1], s.coord[0]]);
      const samples = 32;
      const pts = Array.from({ length: samples + 1 }, (_, k) => projection(interp(k / samples)));
      const valid = pts.filter(Boolean) as [number, number][];
      return { idea, target: s, points: valid };
    });
  };

  const focused = card ?? null;

  return (
    <>
      <div className="toolbar">
        <button className={`chip ${filter==="all"?"active":""}`} onClick={()=>setFilter("all")}>{T(ui.filters_all, lang)}</button>
        {TYPES.map(t => (
          <button key={t} className={`chip ${filter===t?"active":""}`} data-type={t} onClick={()=>setFilter(t)}>
            {T((ui as any)[`type_${t==="philosophy"?"philosophy":t}`] ?? { en: t, zh: t }, lang)}
          </button>
        ))}
      </div>
      <div ref={wrap} className="frame map-wrap">
        <span className="label">EARTH · {visible.length} ideas</span>
        <svg width={size.w} height={size.h} role="img" aria-label="Global Idea Network">
          <defs>
            <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor="#38e6ff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#a06bff" stopOpacity="0.15" />
            </linearGradient>
            <radialGradient id="pin" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sphere + graticule */}
          <path d={path({ type: "Sphere" } as any) || ""} fill="rgba(56,230,255,0.03)" stroke="rgba(56,230,255,0.18)" />
          {land && <path d={path(land) || ""} fill="rgba(160,107,255,0.08)" stroke="rgba(160,107,255,0.35)" strokeWidth={0.5} />}

          {/* Arcs for focused idea */}
          {focused && arcsFor(focused).map((a, i) => {
            const d = a.points.map((p, idx) => `${idx===0?"M":"L"}${p[0]},${p[1]}`).join(" ");
            return (
              <g key={`arc-${i}`}>
                <path d={d} fill="none" stroke="url(#arc)" strokeWidth={1.5} opacity={0.9} />
                {(() => {
                  const tp = projection([a.target.coord[1], a.target.coord[0]]);
                  if (!tp) return null;
                  return (
                    <g>
                      <circle cx={tp[0]} cy={tp[1]} r={3} fill="#a06bff" />
                      <circle cx={tp[0]} cy={tp[1]} r={6} fill="none" stroke="#a06bff" strokeOpacity={0.4} className="pulse" />
                      <text x={tp[0] + 8} y={tp[1] + 4} fontSize={10} fill="#cdd0e0">{T(a.target.label, lang)} · {a.target.year}</text>
                    </g>
                  );
                })()}
              </g>
            );
          })}

          {/* Origin pins */}
          {visible.map(i => {
            const p = projection([i.origin[1], i.origin[0]]);
            if (!p) return null;
            const isFocus = focused?.id === i.id;
            return (
              <g key={i.id} transform={`translate(${p[0]},${p[1]})`}
                 onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                 onClick={() => setSelected(s => s?.id === i.id ? null : i)}
                 style={{ cursor: "pointer" }}>
                <circle r={isFocus ? 10 : 5} fill="url(#pin)" opacity={0.9} />
                <circle r={isFocus ? 4 : 3} fill={TYPE_COLOR[i.type]} stroke="#000" strokeOpacity={0.6} strokeWidth={0.5} />
              </g>
            );
          })}
        </svg>

        {card && (
          <div className="detail-card" role="status">
            <div className="name">{T(card.name, lang)}</div>
            <div className="meta">
              <span style={{ color: TYPE_COLOR[card.type] }}>{T((ui as any)[`type_${card.type}`], lang)}</span>
              <span className="sep">·</span>
              <span>{T(ui.born, lang)} {card.bornYear < 0 ? `${-card.bornYear} BCE` : `${card.bornYear} CE`}</span>
              <span className="sep">·</span>
              <span>{T(card.originLabel, lang)}</span>
            </div>
            <div>{T(card.desc, lang)}</div>
          </div>
        )}
      </div>
    </>
  );
}
