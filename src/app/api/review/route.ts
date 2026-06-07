import { openai } from "@/lib/ai"
import { generateText } from "ai"

const REVIEW_PROMPT = `You are an IB Physics IA examiner. Review the following IA draft and provide a detailed, structured scoring report.

Output EXACTLY this JSON format:
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
}

Be rigorous but fair. Each weakness must reference specific IB criteria. Each suggestion must be concrete and actionable.
If the draft is incomplete or very short, score accordingly and note what is missing.`

export async function POST(req: Request) {
  try {
    const { content } = await req.json()
    if (!content || content.length < 50) {
      return Response.json({ error: "Draft too short. Please provide at least 50 characters." }, { status: 400 })
    }

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: REVIEW_PROMPT,
      prompt: content.slice(0, 12000),
      temperature: 0.3,
      maxOutputTokens: 3000,
    })

    const parsed = JSON.parse(result.text)
    return Response.json(parsed)
  } catch (error) {
    console.error("Review error:", error)
    return Response.json({ error: "Review failed. Please try again." }, { status: 500 })
  }
}
