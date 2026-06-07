import { openai } from "@/lib/ai"
import { generateText } from "ai"

interface Point { x: number; y: number }

export async function POST(req: Request) {
  try {
    const { csv, xLabel, yLabel } = await req.json()
    if (!csv || csv.length < 10) {
      return Response.json({ error: "Please provide CSV data" }, { status: 400 })
    }

    const lines: string[] = csv.trim().split("\n")
    const headers: string[] = lines[0].split(",").map((h: string) => h.trim())
    const rows: number[][] = lines.slice(1).map((line: string) => line.split(",").map((v: string) => parseFloat(v.trim())))

    const xCol = 0
    const yCol = Math.min(1, headers.length - 1)
    const n = rows.length
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
    const points: Point[] = rows.map((r: number[]) => {
      sumX += r[xCol]; sumY += r[yCol]; sumXY += r[xCol] * r[yCol]; sumX2 += r[xCol] * r[xCol]
      return { x: r[xCol], y: r[yCol] }
    })
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    const yMean = sumY / n
    let ssRes = 0, ssTot = 0
    points.forEach((p: Point) => {
      const yPred = slope * p.x + intercept
      ssRes += (p.y - yPred) ** 2
      ssTot += (p.y - yMean) ** 2
    })
    const rSquared = 1 - ssRes / ssTot

    const residuals: number[] = points.map((p: Point) => p.y - (slope * p.x + intercept))
    const se = Math.sqrt(residuals.reduce((a: number, r: number) => a + r * r, 0) / (n - 2))
    const meanX = sumX / n
    const slopeSE = se / Math.sqrt(points.reduce((a: number, p: Point) => a + (p.x - meanX) ** 2, 0))

    const aiResult = await generateText({
      model: openai("gpt-4o-mini"),
      system: "You are an IB Physics IA data analyst. Interpret the regression results briefly. Explain what the slope and y-intercept physically represent. Flag any concerns. Keep under 150 words.",
      prompt: `Data: ${headers[xCol]} vs ${headers[yCol]}
Slope: ${slope.toFixed(4)}
Intercept: ${intercept.toFixed(4)}
R-squared: ${rSquared.toFixed(4)}
Slope uncertainty: ${slopeSE.toFixed(4)}
${xLabel ? `X: ${xLabel}` : ""}${yLabel ? `Y: ${yLabel}` : ""}`,
      temperature: 0.3,
      maxOutputTokens: 300,
    })

    return Response.json({
      points,
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(4)),
      rSquared: Number(rSquared.toFixed(4)),
      slopeUncertainty: Number(slopeSE.toFixed(4)),
      maxSlope: Number((slope + slopeSE).toFixed(4)),
      minSlope: Number((slope - slopeSE).toFixed(4)),
      interpretation: aiResult.text,
      xLabel: xLabel || headers[xCol],
      yLabel: yLabel || headers[yCol],
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json({ error: "Analysis failed" }, { status: 500 })
  }
}
