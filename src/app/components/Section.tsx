"use client";
import { ReactNode } from "react";
import { ui, useLang, T, Bi } from "@/lib/i18n";

type Key = keyof typeof ui;

export function Section({ id, titleKey, subKey, children }: { id: string; titleKey: Key; subKey: Key; children: ReactNode }) {
  const { lang } = useLang();
  return (
    <section id={id} className="section">
      <h2>{T(ui[titleKey] as Bi, lang)}</h2>
      <div className="sub">{T(ui[subKey] as Bi, lang)}</div>
      {children}
    </section>
  );
}
