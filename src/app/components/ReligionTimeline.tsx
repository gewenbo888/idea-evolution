"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath, geoInterpolate } from "d3-geo";
import { feature } from "topojson-client";
import { IDEAS } from "@/data/ideas";
import { ui, useLang, T } from "@/lib/i18n";

const RELIGION_IDS = ["buddhism", "christianity", "islam", "confucianism", "hinduism", "judaism"];
const COLORS: Record<string,string> = {
  buddhism: "#ffb454", christianity: "#ff8a4c", islam: "#61f5b3",
  confucianism: "#ff5dd1", hinduism: "#a06bff", judaism: "#38e6ff",
};

export function ReligionTimeline() {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 540 });
  const [year, setYear] = useState(2000);
  const [playing, setPlaying] = useState(false);
  const [land, setLand] = useState<any>(null);
  const { lang } = useLang();

  useEffect(() => {
    let c = false;
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json").then(r => r.json())
      .then(t => { if (!c) setLand(feature(t, t.objects.land)); }).catch(() => {});
    return () => { c = true; };
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

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setYear(y => (y >= 2024 ? -1500 : y + 25)), 80);
    return () => clearInterval(id);
  }, [playing]);

  const projection = useMemo(() => geoNaturalEarth1()
    .fitExtent([[20, 30], [size.w - 20, size.h - 20]], { type: "Sphere" } as any),
    [size.w, size.h]);
  const path = useMemo(() => geoPath(projection), [projection]);

  const religions = IDEAS.filter(i => RELIGION_IDS.includes(i.id));

  return (
    <div ref={wrap} className="frame timeline-wrap">
      <span className="label">PROPAGATION · {year < 0 ? `${-year} BCE` : `${year} CE`}</span>
      <svg width={size.w} height={size.h - 56} role="img" aria-label="Religion Propagation">
        <path d={path({ type: "Sphere" } as any) || ""} fill="rgba(56,230,255,0.03)" stroke="rgba(56,230,255,0.18)" />
        {land && <path d={path(land) || ""} fill="rgba(160,107,255,0.08)" stroke="rgba(160,107,255,0.3)" strokeWidth={0.5} />}

        {religions.map(r => {
          const visibleSpread = r.spread.filter(s => s.year <= year);
          if (year < r.bornYear) return null;
          const origin = projection([r.origin[1], r.origin[0]]);
          const color = COLORS[r.id];
          return (
            <g key={r.id}>
              {visibleSpread.map((s, idx) => {
                const interp = geoInterpolate([r.origin[1], r.origin[0]], [s.coord[1], s.coord[0]]);
                const samples = 24;
                const pts = Array.from({ length: samples + 1 }, (_, k) => projection(interp(k / samples))).filter(Boolean) as [number,number][];
                const d = pts.map((p, i) => `${i===0?"M":"L"}${p[0]},${p[1]}`).join(" ");
                const tp = projection([s.coord[1], s.coord[0]]);
                return (
                  <g key={idx} opacity={0.85}>
                    <path d={d} fill="none" stroke={color} strokeWidth={1.2} opacity={0.8} />
                    {tp && <circle cx={tp[0]} cy={tp[1]} r={3} fill={color} />}
                  </g>
                );
              })}
              {origin && (
                <g>
                  <circle cx={origin[0]} cy={origin[1]} r={6} fill={color} stroke="#000" strokeWidth={1} />
                  <text x={origin[0] + 9} y={origin[1] + 4} fontSize={11} fill="#e8e8ee"
                        stroke="#000" strokeWidth={3} paintOrder="stroke">
                    {T(r.name, lang)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="timeline-controls">
        <button onClick={() => setPlaying(p => !p)}>{playing ? "❚❚" : "▶"}</button>
        <span className="year mono">{year < 0 ? `${-year} BCE` : `${year} CE`}</span>
        <input type="range" min={-1500} max={2024} value={year} onChange={e => setYear(parseInt(e.target.value))} />
        <button onClick={() => setYear(-1500)}>↺</button>
      </div>
    </div>
  );
}
