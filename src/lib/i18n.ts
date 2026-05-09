"use client";
import { createContext, useContext } from "react";

export type Lang = "en" | "zh";

export type Bi = { en: string; zh: string };
export const T = (b: Bi, lang: Lang) => b[lang];

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en", setLang: () => {},
});
export const useLang = () => useContext(LangContext);

// UI strings.
export const ui = {
  brand:        { en: "Idea Evolution",                                    zh: "观念演化" },
  tagline:      { en: "The civilization-scale system of memes, religions, ideologies, paradigms, and narratives.",
                   zh: "迷因、宗教、意识形态、范式与叙事的文明级系统。" },
  thesis:       { en: "Civilization is built by shared stories.",          zh: "文明由共享的故事构建。" },
  thesis_long:  { en: "The most powerful ideas are not always the most true — they are the most transmissible. Human history is the evolution and competition of mental worlds.",
                   zh: "最强大的观念未必最正确 — 而是最易传播。人类历史是心智世界的演化与竞争。" },

  nav_map:      { en: "Network",        zh: "网络" },
  nav_tree:     { en: "Lineage",        zh: "谱系" },
  nav_religion: { en: "Religion",       zh: "宗教" },
  nav_philo:    { en: "Philosophy",     zh: "哲学" },
  nav_meme:     { en: "Internet",       zh: "互联网" },
  nav_paradigm: { en: "Paradigm",       zh: "范式" },
  nav_symbol:   { en: "Symbol",         zh: "符号" },
  nav_war:      { en: "Narrative War",  zh: "叙事战争" },
  nav_ai:       { en: "AI Future",      zh: "AI 未来" },
  nav_memory:   { en: "Memory",         zh: "记忆" },

  sec1_title:   { en: "Global Idea Network",         zh: "全球观念网络" },
  sec1_sub:     { en: "Where ideas were born. Where they spread. Where they collided.",
                   zh: "观念诞生何处，蔓延何方，碰撞何时。" },
  sec2_title:   { en: "Memetic Lineage",              zh: "迷因谱系" },
  sec2_sub:     { en: "Every idea descends from earlier ideas. Mutation is the rule, not the exception.",
                   zh: "每个观念都源自先前的观念。变异是常态，而非例外。" },
  sec3_title:   { en: "Religion Propagation",         zh: "宗教传播" },
  sec3_sub:     { en: "Watch the great faiths radiate across centuries.",
                   zh: "观察伟大信仰在数百年间的辐射。" },
  sec4_title:   { en: "Idea Survival Probability",    zh: "观念存活概率" },
  sec4_formula: { en: "Resonance + Simplicity + Institutions + Technology + Adaptability + Utility + Narrative + Symbol",
                   zh: "情感共鸣 + 简洁性 + 机构支持 + 技术放大 + 适应性 + 社会效用 + 叙事力量 + 符号压缩" },
  sec5_title:   { en: "Other Systems",                zh: "其他系统" },
  sec5_sub:     { en: "Each is a lens onto the same evolutionary substrate.",
                   zh: "每一项都是同一演化基底的不同棱镜。" },
  sec6_title:   { en: "Ask the System",               zh: "向系统提问" },
  sec6_sub:     { en: "An AI trained as memetics researcher, historian, anthropologist, network scientist.",
                   zh: "一个集迷因学研究者、历史学家、人类学家与网络科学家于一身的 AI。" },

  filters_all:  { en: "All",            zh: "全部" },
  type_religion:{ en: "Religion",       zh: "宗教" },
  type_philosophy:{ en: "Philosophy",   zh: "哲学" },
  type_ideology:{ en: "Ideology",       zh: "意识形态" },
  type_paradigm:{ en: "Paradigm",       zh: "范式" },
  type_meme:    { en: "Meme",           zh: "迷因" },
  type_symbol:  { en: "Symbol",         zh: "符号" },

  trait_resonance: { en: "Resonance",   zh: "共鸣" },
  trait_simple:    { en: "Simplicity",  zh: "简洁" },
  trait_inst:      { en: "Institution", zh: "机构" },
  trait_tech:      { en: "Technology",  zh: "技术" },
  trait_adapt:     { en: "Adaptability",zh: "适应" },
  trait_utility:   { en: "Utility",     zh: "效用" },
  trait_narrative: { en: "Narrative",   zh: "叙事" },
  trait_symbol:    { en: "Symbol",      zh: "符号" },

  born:         { en: "Born",           zh: "诞生" },
  origin:       { en: "Origin",         zh: "起源" },
  parents:      { en: "Ancestors",      zh: "祖先" },
  spread:       { en: "Spread",         zh: "传播" },
  ask_placeholder: { en: "How did Buddhism reach Japan? Why did Marxism mutate into so many forms?",
                     zh: "佛教如何传到日本？马克思主义为何分化出如此多形态？" },
  ask_button:   { en: "Ask",            zh: "提问" },
  ask_thinking: { en: "Connecting eras…", zh: "连接时代中…" },

  footer:       { en: "Part of the Psyverse — a portfolio of civilization-scale systems by Gewenbo.",
                   zh: "Psyverse 之一 — 宋文博的文明级系统作品集。" },
} as const;
