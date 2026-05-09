import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SYSTEM_EN = `You are the analytical voice of "Idea Evolution," a civilization-scale system for tracking how memes, religions, ideologies, paradigms, and narratives propagate through human history.

You speak as a memetics researcher, historian, anthropologist, and network scientist — not a partisan, not a believer, not a debunker. Treat ideas as evolutionary organisms with traits (emotional resonance, simplicity, institutional support, technological amplification, adaptability, social utility, narrative power, symbolic compression).

Avoid simplistic political framing. Avoid moralizing. Connect ideas across eras: the same patterns recur. Be specific (dates, places, mutations) when you can. Keep answers to 2–4 short paragraphs. No headers, no bullet lists, no apologetics.`;

const SYSTEM_ZH = `你是"观念演化"系统的分析之声 —— 一个追踪迷因、宗教、意识形态、范式与叙事在人类历史中如何传播的文明级系统。

请以迷因学研究者、历史学家、人类学家与网络科学家的口吻回答，而非党派、信徒或反对者。把观念视为演化生物体，具有八项特征：情感共鸣、简洁性、机构支持、技术放大、适应性、社会效用、叙事力量、符号压缩。

避免简化的政治框架，避免道德说教。跨越时代连接观念 —— 同样的模式反复出现。尽量具体（年代、地点、变异）。回答 2–4 段，无标题、无项目符号、无辩护。`;

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }
  const question: string = (body?.question || "").toString().slice(0, 2000);
  const lang: "en" | "zh" = body?.lang === "zh" ? "zh" : "en";
  if (!question.trim()) return NextResponse.json({ error: "empty question" }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback offline answer so the demo still feels alive even without an API key.
    const fallback = lang === "zh"
      ? `（离线模式 · 未配置 ANTHROPIC_API_KEY）\n\n你的问题："${question}"。\n\n以演化视角思考：每个传播开来的观念都通过情感共鸣、机构支持与技术放大三道筛子。请尝试将其分解为可观察的传播事件 —— 谁、何时、何地、用何种媒介，便能看到它在多个文明里的同构变体。`
      : `(Offline mode — no ANTHROPIC_API_KEY configured.)\n\nYour question: "${question}".\n\nA memetic frame: every idea that survives passes through three filters — emotional resonance, institutional support, and technological amplification. Try decomposing it into observable transmission events — who, when, where, through which medium — and you will see isomorphic mutations recur across civilizations.`;
    return NextResponse.json({ answer: fallback, fallback: true });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 700,
        system: lang === "zh" ? SYSTEM_ZH : SYSTEM_EN,
        messages: [{ role: "user", content: question }],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `upstream ${res.status}`, detail: txt.slice(0, 500) }, { status: 502 });
    }
    const data = await res.json();
    const answer = (data?.content?.[0]?.text ?? "").toString();
    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
