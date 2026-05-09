"use client";
import { useLang, T, type Bi } from "@/lib/i18n";

type Card = { num: string; title: Bi; body: Bi; live?: boolean };

const CARDS: Card[] = [
  { num: "01",
    title: { en: "Global Idea Network",       zh: "全球观念网络" },
    body:  { en: "Geography of every meme that mattered. Origins, routes, frontiers.",
              zh: "每一个重要迷因的地理 — 起源、路线、前沿。" }, live: true },
  { num: "02",
    title: { en: "Memetic Lineage",           zh: "迷因谱系" },
    body:  { en: "Every idea has parents. Watch the family tree of human thought.",
              zh: "每个观念都有先祖。观察人类思想的家谱。" }, live: true },
  { num: "03",
    title: { en: "Religion Propagation",      zh: "宗教传播" },
    body:  { en: "Six great faiths radiating across millennia of trade routes and empires.",
              zh: "六大信仰沿数千年的商路与帝国辐射。" }, live: true },
  { num: "04",
    title: { en: "Philosophy & Ideology",     zh: "哲学与意识形态" },
    body:  { en: "From Greek city-state debates to AI ethics — the long argument continues.",
              zh: "从希腊城邦辩论到 AI 伦理 — 漫长的辩论从未停止。" } },
  { num: "05",
    title: { en: "Internet Meme Civilization",zh: "互联网迷因文明" },
    body:  { en: "Image macros, TikTok formats, AI slop — high-speed evolutionary pressure.",
              zh: "图像迷因、TikTok 格式、AI 流水内容 — 高速演化压力。" } },
  { num: "06",
    title: { en: "Scientific Paradigms",      zh: "科学范式" },
    body:  { en: "How worldviews die: not by argument, but by their adherents retiring.",
              zh: "世界观如何消亡 — 不是被驳倒，而是支持者退场。" } },
  { num: "07",
    title: { en: "Symbols & Compression",     zh: "符号与压缩" },
    body:  { en: "Why a cross beats a thousand words. Bandwidth choices that hold civilizations together.",
              zh: "为何一个十字胜过千言。维系文明的带宽选择。" } },
  { num: "08",
    title: { en: "Narrative Warfare",         zh: "叙事战争" },
    body:  { en: "Propaganda, censorship, AI persuasion. Stories as weapons of state.",
              zh: "宣传、审查、AI 劝服 — 作为国家武器的故事。" } },
  { num: "09",
    title: { en: "AI & Future Ideologies",    zh: "AI 与未来意识形态" },
    body:  { en: "What happens when ideologies are produced by non-humans at near-zero cost?",
              zh: "当意识形态由非人类近乎零成本生产时，会发生什么？" } },
  { num: "10",
    title: { en: "Civilization Memory",       zh: "文明记忆" },
    body:  { en: "Tablets, scrolls, libraries, the internet, blockchain. The history of remembering.",
              zh: "泥板、卷轴、图书馆、互联网、区块链 — 一部记忆史。" } },
];

export function SystemsGrid() {
  const { lang } = useLang();
  return (
    <div className="systems-grid">
      {CARDS.map(c => (
        <div key={c.num} className={`system-card${c.live ? " live" : ""}`}>
          <div className="num">SYSTEM {c.num}</div>
          <h3>{T(c.title, lang)}</h3>
          <p>{T(c.body, lang)}</p>
          <span className="badge">{c.live ? (lang === "zh" ? "已上线" : "LIVE") : (lang === "zh" ? "扩展中" : "EXTENDING")}</span>
        </div>
      ))}
    </div>
  );
}
