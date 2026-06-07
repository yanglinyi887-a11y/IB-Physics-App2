import { NextRequest, NextResponse } from "next/server"
import { getModel } from "@/lib/ai"
import { generateText } from "ai"
import { checkAuth, checkRateLimit } from "@/lib/server/guard"

const PROMPT = "Generate 5 IB Physics IA topics. For each include: title (research question), independent variable, dependent variable, key formula, equipment, and why it scores well (1 sentence). Output as JSON array. Pure JSON, no markdown."

export async function POST(req: NextRequest) {
  const user = await checkAuth()
  if (!user) return NextResponse.json({ error: "Please sign in" }, { status: 401 })
  if (!checkRateLimit(user.userId, user.tier)) {
    return NextResponse.json({ error: "Quota exceeded" }, { status: 429 })
  }

  const { area, level } = await req.json()
  if (!area) return NextResponse.json({ error: "Please select an area" }, { status: 400 })

  const prompt = PROMPT + " Area: " + area + ". Difficulty: " + (level || "basic") + "."

  try {
    const result = await generateText({
      model: getModel("gpt-5.4-mini"),
      prompt,
      temperature: 0.8,
      maxOutputTokens: 2000,
    })

    const text = result.text.trim()
    const jsonStart = text.indexOf("[")
    const jsonEnd = text.lastIndexOf("]") + 1
    if (jsonStart === -1 || jsonEnd === 0) {
      return NextResponse.json({ error: "AI returned invalid format" }, { status: 500 })
    }
    const topics = JSON.parse(text.slice(jsonStart, jsonEnd))
    return NextResponse.json({ topics })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Generation failed" }, { status: 500 })
  }
}
