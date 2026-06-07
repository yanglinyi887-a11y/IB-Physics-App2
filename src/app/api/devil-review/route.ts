import { openai } from "@/lib/ai"
import { generateText } from "ai"
import { checkAuth, checkRateLimit } from "@/lib/server/guard"

export async function POST(req: Request) {
  const user = await checkAuth()
  if (!user) return Response.json({ error: "Please sign in" }, { status: 401 })
  if (!checkRateLimit(user.userId, user.tier)) {
    return Response.json({ error: "Quota exceeded. Upgrade to Pro for more." }, { status: 429 })
  }

  const { content } = await req.json()
  if (!content || content.length < 100) return Response.json({ error: "Draft too short" }, { status: 400 })

  const rounds: string[] = []
  const r1 = await generateText({ model: openai("deepseek-chat"), system: "Score this IA draft out of 24. Keep under 500 words.", prompt: content.slice(0,12000), temperature: 0.3, maxOutputTokens: 1500 })
  rounds.push(r1.text)
  const r2 = await generateText({ model: openai("deepseek-chat"), system: "You are a strict IB examiner. Generate 5 probing questions that expose gaps. Be harsh.", prompt: `Draft:\n${content.slice(0,8000)}\n\nScores:\n${r1.text}`, temperature: 0.6, maxOutputTokens: 1000 })
  rounds.push(r2.text)
  const r3 = await generateText({ model: openai("deepseek-chat"), system: "Give final verdict: critical weakness, what to fix for a 7, target score. Under 300 words.", prompt: `${content.slice(0,4000)}\n\n${r1.text}\n\n${r2.text}`, temperature: 0.4, maxOutputTokens: 800 })
  rounds.push(r3.text)

  return Response.json({ rounds })
}