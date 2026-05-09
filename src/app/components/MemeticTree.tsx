"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide,
  type SimulationNodeDatum, type SimulationLinkDatum,
} from "d3-force";
import { IDEAS, IdeaType } from "@/data/ideas";
import { ui, useLang, T } from "@/lib/i18n";

const TYPE_COLOR: Record<IdeaType, string> = {
  religion: "#ffb454", philosophy: "#38e6ff", ideology: "#ff5dd1",
  paradigm: "#61f5b3", meme: "#a06bff", symbol: "#ffffff",
};

type N = SimulationNodeDatum & { id: string; type: IdeaType; name: { en: string; zh: string }; year: number };
type L = SimulationLinkDatum<N>;

export function MemeticTree() {
  const wrap = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 540 });
  const [hover, setHover] = useState<string | null>(null);
  const { lang } = useLang();

  const { nodes, links } = useMemo(() => {
    const ns: N[] = IDEAS.map(i => ({ id: i.id, type: i.type, name: i.name, year: i.bornYear }));
    const ls: L[] = [];
    for (const i of IDEAS) for (const p of i.parents) {
      if (IDEAS.some(x => x.id === p)) ls.push({ source: p, target: i.id });
    }
    return { nodes: ns, links: ls };
  }, []);

  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      const w = e.contentRect.width; const h = Math.max(440, Math.round(w * 0.5));
      setSize({ w, h });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current; if (!svg) return;
    const W = size.w, H = size.h;
    const yearMin = Math.min(...nodes.map(n => n.year));
    const yearMax = Math.max(...nodes.map(n => n.year));
    const xOf = (year: number) => 60 + ((year - yearMin) / (yearMax - yearMin)) * (W - 120);

    // Initial positions: x by birth year (timeline axis), y centered with jitter.
    nodes.forEach((n) => { n.x = xOf(n.year); n.y = H / 2 + (Math.random() - 0.5) * H * 0.6; });

    const sim = forceSimulation<N>(nodes)
      .force("link", forceLink<N, L>(links).id(d => d.id).distance(80).strength(0.5))
      .force("charge", forceManyBody<N>().strength(-160))
      .force("center", forceCenter(W/2, H/2).strength(0.04))
      .force("collide", forceCollide<N>(18))
      .alpha(1).alphaDecay(0.02);

    // Constrain x to year axis each tick to keep timeline shape.
    sim.on("tick", () => {
      nodes.forEach(n => {
        const tx = xOf(n.year);
        if (typeof n.x === "number") n.x = n.x * 0.85 + tx * 0.15;
      });
      const linkEls = svg.querySelectorAll<SVGLineElement>(".link");
      linkEls.forEach((el, i) => {
        const l = links[i];
        const s = (l.source as N), t = (l.target as N);
        el.setAttribute("x1", String(s.x ?? 0)); el.setAttribute("y1", String(s.y ?? 0));
        el.setAttribute("x2", String(t.x ?? 0)); el.setAttribute("y2", String(t.y ?? 0));
      });
      const nodeEls = svg.querySelectorAll<SVGGElement>(".node");
      nodeEls.forEach((el, i) => {
        const n = nodes[i];
        el.setAttribute("transform", `translate(${n.x ?? 0},${n.y ?? 0})`);
      });
    });

    return () => { sim.stop(); };
  }, [size.w, size.h, nodes, links]);

  const yearMin = Math.min(...nodes.map(n => n.year));
  const yearMax = Math.max(...nodes.map(n => n.year));
  const ticks: number[] = [];
  for (let y = Math.ceil(yearMin / 500) * 500; y <= yearMax; y += 500) ticks.push(y);

  return (
    <div ref={wrap} className="frame tree-wrap">
      <span className="label">LINEAGE · {nodes.length} nodes · {links.length} edges</span>
      <svg ref={svgRef} width={size.w} height={size.h} role="img" aria-label="Memetic Lineage">
        <defs>
          <linearGradient id="link-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="#38e6ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a06bff" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Timeline axis */}
        <line x1={40} x2={size.w - 40} y1={size.h - 24} y2={size.h - 24} stroke="rgba(255,255,255,0.15)" />
        {ticks.map(y => {
          const x = 60 + ((y - yearMin) / (yearMax - yearMin)) * (size.w - 120);
          return (
            <g key={y} transform={`translate(${x},${size.h - 24})`}>
              <line y1={-4} y2={4} stroke="rgba(255,255,255,0.25)" />
              <text y={18} textAnchor="middle" fontSize={10} fill="#8a8aa0" fontFamily="JetBrains Mono">
                {y < 0 ? `${-y} BCE` : `${y}`}
              </text>
            </g>
          );
        })}

        {links.map((l, i) => (
          <line key={i} className="link" stroke="url(#link-g)" strokeWidth={1.2} opacity={0.7} />
        ))}

        {nodes.map((n, i) => (
          <g key={n.id} className="node"
             onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
             style={{ cursor: "pointer" }}>
            <circle r={hover === n.id ? 11 : 7} fill={TYPE_COLOR[n.type]} stroke="#0a0a0c" strokeWidth={1.5} />
            <text y={hover === n.id ? -16 : -12} textAnchor="middle" fontSize={hover === n.id ? 13 : 10}
                  fill="#e8e8ee" stroke="#000" strokeWidth={3} paintOrder="stroke" pointerEvents="none">
              {T(n.name, lang)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
