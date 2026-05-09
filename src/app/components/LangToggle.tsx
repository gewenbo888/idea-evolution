"use client";
import { useLang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle" role="tablist" aria-label="Language">
      <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-label="English">EN</button>
      <button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")} aria-label="中文">中文</button>
    </div>
  );
}
