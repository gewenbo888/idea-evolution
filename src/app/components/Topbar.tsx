"use client";
import { ui, useLang, T } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";

const NAV = [
  { id: "network",  key: "nav_map" as const },
  { id: "lineage",  key: "nav_tree" as const },
  { id: "religion", key: "nav_religion" as const },
  { id: "score",    key: "nav_philo" as const },
  { id: "systems",  key: "nav_meme" as const },
  { id: "ask",      key: "nav_ai" as const },
];

export function Topbar() {
  const { lang } = useLang();
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <a href="#" className="brand">
          <span className="glyph" />
          <span>{T(ui.brand, lang)}</span>
        </a>
        <div className="nav-pills" aria-label="Sections">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`}>{T(ui[n.key], lang)}</a>
          ))}
        </div>
        <LangToggle />
      </div>
    </div>
  );
}
