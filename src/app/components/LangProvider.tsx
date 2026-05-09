"use client";
import { useState, useEffect, ReactNode } from "react";
import { LangContext, Lang } from "@/lib/i18n";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "en" || saved === "zh") setLang(saved);
    else if (typeof navigator !== "undefined" && navigator.language?.startsWith("zh")) setLang("zh");
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    }
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}
