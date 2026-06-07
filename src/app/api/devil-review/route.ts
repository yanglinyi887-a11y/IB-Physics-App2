import { openai } from "@/lib/ai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { content } = await req.json()
    if (!content || content.length < 100) {
      return Response.json({ error: "Draft too short" }, { status: 400 })
    }

    const rounds: string[] = []

    // Round 1: Standard scoring
    const r1 = await generateText({
      model: openai("gpt-4o-mini"),
      system: "You are an IB Physics IA examiner. Score this draft out of 24 across all 5 criteria. Give a concise score breakdown with 1-2 sentences per criterion. Keep under 500 words.",
      prompt: content.slice(0, 12000),
      temperature: 0.3,
      maxOutputTokens: 1500,
    })
    rounds.push(r1.text)

    // Round 2: Devil examiner - 5 deep questions
    const r2 = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are a notoriously strict IB Physics IA examiner. Your job is to find every weakness — no mercy.
Generate exactly 5 probing questions that expose gaps in the student's work. Each question should:
- Target a specific claim or omission
- Demand quantitative justification
- Expose where the student is coasting on assumptions
Format: Numbered list, each question 2-3 sentences. Be harsh but fair.`,
      prompt: `Draft:\n${content.slice(0, 8000)}\n\nRound 1 Scores:\n${r1.text}`,
      temperature: 0.6,
      maxOutputTokens: 1000,
    })
    rounds.push(r2.text)

    // Round 3: Synthesis
    const r3 = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are an IB Physics IA examiner delivering a final synthesis.
Based on the scoring and the devil examiner questions, give:
1. The single most critical weakness (1 paragraph)
2. What the student must do to jump from current score to a 7 (specific, actionable)
3. A realistic target score if all fixes are applied
Keep under 300 words. Be direct.`,
      prompt: `Draft summary:\n${content.slice(0, 4000)}\n\nRound 1:\n${r1.text}\n\nDevil Questions:\n${r2.text}`,
      temperature: 0.4,
      maxOutputTokens: 800,
    })
    rounds.push(r3.text)

    return Response.json({ rounds })
  } catch (error) {
    console.error("Devil review error:", error)
    return Response.json({ error: "Devil review failed" }, { status: 500 })
  }
}