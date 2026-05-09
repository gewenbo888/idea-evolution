"use client";
import { ui, useLang, T } from "@/lib/i18n";

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="footer">
      <div className="row">
        <div>{T(ui.footer, lang)}</div>
        <div className="mono" style={{ opacity: 0.7 }}>{lang === "zh" ? "psyverse.fun" : "psyverse.fun"}</div>
      </div>
    </footer>
  );
}
