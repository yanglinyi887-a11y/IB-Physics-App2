import { getModel } from "@/lib/ai"
import { generateText } from "ai"
import { checkAuth, checkRateLimit } from "@/lib/server/guard"

const REVIEW_PROMPT = `You are an IB Physics IA examiner. Review the IA draft and output JSON:
{
  "totalScore": number,
  "grade": "1-7",
  "criteria": {
    "personalEngagement": { "score": number, "maxScore": 2, "strengths": ["..."], "weaknesses": ["..."], "suggestions": ["..."] },
    "exploration": { "score": number, "maxScore": 6, "strengths": ["..."], "weaknesses": ["..."], "suggestions": ["..."] },
    "analysis": { "score": number, "maxScore": 6, "strengths": ["..."], "weaknesses": ["..."], "suggestions": ["..."] },
    "evaluation": { "score": number, "maxScore": 6, "strengths": ["..."], "weaknesses": ["..."], "suggestions": ["..."] },
    "communication": { "score": number, "maxScore": 4, "strengths": ["..."], "weaknesses": ["..."], "suggestions": ["..."] }
  },
  "summary": "2-3 sentence overall assessment"
}`

export async function POST(req: Request) {
  const user = await checkAuth()
  if (!user) return Response.json({ error: "Please sign in" }, { status: 401 })
  if (!checkRateLimit(user.userId, user.tier)) {
    return Response.json({ error: "Quota exceeded. Upgrade to Pro for more." }, { status: 429 })
  }

  const { content, model = "gpt-5.4-mini" } = await req.json()
  if (!content || content.length < 50) return Response.json({ error: "Draft too short" }, { status: 400 })

  const result = await generateText({
    model: getModel(model),
    system: REVIEW_PROMPT,
    prompt: content.slice(0, 12000),
    temperature: 0.3,
    maxOutputTokens: 3000,
  })

  return Response.json(JSON.parse(result.text))
}