import { openai } from "@/lib/ai"
import { streamText } from "ai"
import { checkAuth, checkRateLimit } from "@/lib/server/guard"

const SYSTEM_PROMPT = `You are an IB Physics IA coach. Guide students through writing their Internal Assessment.

Key rules:
- Ask guiding questions rather than giving direct answers
- Reference IB Physics IA criteria (Personal Engagement, Exploration, Analysis, Evaluation, Communication)
- Point out scoring implications when relevant
- Give structural advice: what goes where, how to format, what examiners look for
- Never fabricate data or write the student's conclusion for them
- Keep responses concise and actionable`

export async function POST(req: Request) {
  const user = await checkAuth()
  if (!user) return Response.json({ error: "Please sign in" }, { status: 401 })
  if (!checkRateLimit(user.userId, user.tier)) {
    return Response.json({ error: "Quota exceeded. Upgrade to Pro for more." }, { status: 429 })
  }

  const { messages } = await req.json()
  const result = streamText({
    model: openai("deepseek-chat"),
    system: SYSTEM_PROMPT,
    messages,
    temperature: 0.5,
    maxOutputTokens: 1500,
  })
  return result.toTextStreamResponse()
}