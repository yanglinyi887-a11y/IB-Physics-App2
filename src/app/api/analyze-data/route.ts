import { getModel } from "@/lib/ai"
import { generateText } from "ai"
import { checkAuth, checkRateLimit } from "@/lib/server/guard"

interface Point { x: number; y: number }

export async function POST(req: Request) {
  const user = await checkAuth()
  if (!user) return Response.json({ error: "Please sign in" }, { status: 401 })
  if (!checkRateLimit(user.userId, user.tier)) {
    return Response.json({ error: "Quota exceeded. Upgrade to Pro for more." }, { status: 429 })
  }

  const { csv, xLabel, yLabel, model = "deepseek-chat" } = await req.json()
  if (!csv || csv.length < 10) return Response.json({ error: "Please provide CSV data" }, { status: 400 })

  const lines: string[] = csv.trim().split("\n")
  const headers: string[] = lines[0].split(",").map((h: string) => h.trim())
  const rows: number[][] = lines.slice(1).map((line: string) => line.split(",").map((v: string) => parseFloat(v.trim())))
  const xCol = 0; const yCol = Math.min(1, headers.length - 1); const n = rows.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  const points: Point[] = rows.map((r: number[]) => { sumX += r[xCol]; sumY += r[yCol]; sumXY += r[xCol]*r[yCol]; sumX2 += r[xCol]*r[xCol]; return { x: r[xCol], y: r[yCol] } })
  const slope = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX)
  const intercept = (sumY - slope*sumX) / n
  const yMean = sumY / n; let ssRes = 0, ssTot = 0
  points.forEach((p: Point) => { const yp = slope*p.x + intercept; ssRes += (p.y-yp)**2; ssTot += (p.y-yMean)**2 })
  const rSquared = 1 - ssRes/ssTot
  const residuals = points.map((p: Point) => p.y - (slope*p.x + intercept))
  const se = Math.sqrt(residuals.reduce((a: number, r: number) => a + r*r, 0) / (n-2))
  const meanX = sumX/n; const slopeSE = se / Math.sqrt(points.reduce((a: number, p: Point) => a + (p.x-meanX)**2, 0))

  return Response.json({
    points, slope: Number(slope.toFixed(4)), intercept: Number(intercept.toFixed(4)),
    rSquared: Number(rSquared.toFixed(4)), slopeUncertainty: Number(slopeSE.toFixed(4)),
    maxSlope: Number((slope+slopeSE).toFixed(4)), minSlope: Number((slope-slopeSE).toFixed(4)),
    xLabel: xLabel || headers[xCol], yLabel: yLabel || headers[yCol],
  })
}