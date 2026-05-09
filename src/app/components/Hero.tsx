"use client";
import { ui, useLang, T } from "@/lib/i18n";

export function Hero() {
  const { lang } = useLang();
  return (
    <section className="hero">
      <h1>
        <span className="grad">{T(ui.brand, lang)}</span>
      </h1>
      <p className="lede">{T(ui.tagline, lang)}</p>
      <div className="thesis">
        <div style={{ fontSize: 20, fontWeight: 600 }}>{T(ui.thesis, lang)}</div>
        <div style={{ marginTop: 8, color: "#9da0b3" }}>{T(ui.thesis_long, lang)}</div>
      </div>
    </section>
  );
}
