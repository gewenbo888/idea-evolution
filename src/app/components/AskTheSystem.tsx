"use client";
import { useState } from "react";
import { ui, useLang, T } from "@/lib/i18n";

export function AskTheSystem() {
  const { lang } = useLang();
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [busy, setBusy] = useState(false);

  async function ask() {
    const question = q.trim(); if (!question) return;
    setBusy(true); setA("");
    try {
      const r = await fetch("/api/explain", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, lang }),
      });
      const j = await r.json();
      setA(j.answer || j.error || "—");
    } catch (e: any) {
      setA(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ask">
      <textarea value={q} onChange={e => setQ(e.target.value)} placeholder={T(ui.ask_placeholder, lang)} />
      <div className="row">
        <button onClick={ask} disabled={busy || !q.trim()}>{busy ? T(ui.ask_thinking, lang) : T(ui.ask_button, lang)}</button>
      </div>
      <div className="answer">
        {a ? a : <span className="placeholder">{lang === "zh" ? "把问题想象成一根穿越时代的线 — 系统会沿着它走。" : "Imagine your question as a thread across eras — the system will walk along it."}</span>}
      </div>
    </div>
  );
}
