"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, TrendingUp } from "lucide-react"

interface AnalysisResult {
  points: Array<{ x: number; y: number }>
  slope: number
  intercept: number
  rSquared: number
  slopeUncertainty: number
  maxSlope: number
  minSlope: number
  interpretation: string
  xLabel: string
  yLabel: string
}

export default function AnalysisPage() {
  const [csv, setCsv] = useState("")
  const [xLabel, setXLabel] = useState("")
  const [yLabel, setYLabel] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!csv.trim() || loading) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/analyze-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, xLabel, yLabel }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Analysis failed"); return }
      setResult(data)
    } catch { setError("Something went wrong") }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Analysis</h1>
        <p className="text-zinc-400 mt-1">Upload CSV data. Get IB-compliant analysis with regression, uncertainty, and AI interpretation.</p>
      </div>

      {!result ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle>Upload your data</CardTitle>
            <CardDescription>Paste CSV format: first column = independent variable, second = dependent variable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>X-axis label</Label><Input value={xLabel} onChange={e => setXLabel(e.target.value)} placeholder="e.g. Length (m)" className="mt-1 bg-zinc-900 border-zinc-700" /></div>
              <div><Label>Y-axis label</Label><Input value={yLabel} onChange={e => setYLabel(e.target.value)} placeholder="e.g. Period (s)" className="mt-1 bg-zinc-900 border-zinc-700" /></div>
            </div>
            <Textarea value={csv} onChange={e => setCsv(e.target.value)}
              placeholder="length_m,period_s&#10;0.5,1.42&#10;0.6,1.55&#10;0.7,1.68&#10;0.8,1.79&#10;0.9,1.90&#10;1.0,2.01"
              className="min-h-[180px] font-mono text-sm bg-zinc-900 border-zinc-700" />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button onClick={handleAnalyze} disabled={loading || csv.length < 10} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
              {loading ? "Analyzing..." : "Analyze Data"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Graph preview */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{result.yLabel} vs {result.xLabel}</h3>
                <Badge variant="outline">R² = {result.rSquared.toFixed(4)}</Badge>
              </div>
              <svg viewBox="0 0 400 250" className="w-full h-64 bg-zinc-950 rounded-lg border border-zinc-800">
                {/* Axes */}
                <line x1="50" y1="210" x2="370" y2="210" stroke="#52525b" strokeWidth="1" />
                <line x1="50" y1="20" x2="50" y2="210" stroke="#52525b" strokeWidth="1" />
                {/* Data points */}
                {result.points.map((p, i) => {
                  const px = 50 + ((p.x - Math.min(...result.points.map(q => q.x))) / (Math.max(...result.points.map(q => q.x)) - Math.min(...result.points.map(q => q.x)) || 1)) * 300
                  const py = 210 - ((p.y - Math.min(...result.points.map(q => q.y))) / (Math.max(...result.points.map(q => q.y)) - Math.min(...result.points.map(q => q.y)) || 1)) * 180
                  return <circle key={i} cx={px} cy={py} r="4" fill="#34d399" />
                })}
                {/* Best fit line */}
                {(() => {
                  const xMin = Math.min(...result.points.map(p => p.x))
                  const xMax = Math.max(...result.points.map(p => p.x))
                  const yAtXMin = result.slope * xMin + result.intercept
                  const yAtXMax = result.slope * xMax + result.intercept
                  const yDataMin = Math.min(...result.points.map(p => p.y))
                  const yDataMax = Math.max(...result.points.map(p => p.y))
                  const yRange = yDataMax - yDataMin || 1
                  const px1 = 50
                  const py1 = 210 - ((yAtXMin - yDataMin) / yRange) * 180
                  const px2 = 370
                  const py2 = 210 - ((yAtXMax - yDataMin) / yRange) * 180
                  return <line x1={px1} y1={py1} x2={px2} y2={py2} stroke="#34d399" strokeWidth="2" />
                })()}
                {/* Labels */}
                <text x="210" y="240" textAnchor="middle" fill="#a1a1aa" fontSize="11">{result.xLabel}</text>
                <text x="15" y="120" textAnchor="middle" fill="#a1a1aa" fontSize="11" transform="rotate(-90, 15, 120)">{result.yLabel}</text>
              </svg>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-sm text-zinc-400">Regression Results</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-zinc-500">Slope</span><p className="font-mono text-emerald-400">{result.slope}</p></div>
                  <div><span className="text-zinc-500">Intercept</span><p className="font-mono text-emerald-400">{result.intercept}</p></div>
                  <div><span className="text-zinc-500">R-squared</span><p className="font-mono">{result.rSquared.toFixed(4)}</p></div>
                  <div><span className="text-zinc-500">Slope ±</span><p className="font-mono text-amber-400">±{result.slopeUncertainty.toFixed(4)}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-sm text-zinc-400">Three-Line Method</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-zinc-500">Best slope</span><p className="font-mono text-emerald-400">{result.slope.toFixed(4)}</p></div>
                  <div><span className="text-zinc-500">Max slope</span><p className="font-mono">{result.maxSlope.toFixed(4)}</p></div>
                  <div><span className="text-zinc-500">Min slope</span><p className="font-mono">{result.minSlope.toFixed(4)}</p></div>
                  <div><span className="text-zinc-500">Delta slope</span><p className="font-mono text-amber-400">±{result.slopeUncertainty.toFixed(4)}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Interpretation */}
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-sm text-emerald-400">AI Interpretation</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{result.interpretation}</p>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" onClick={() => { setResult(null); setCsv("") }}>
            Analyze New Data
          </Button>
        </div>
      )}
    </div>
  )
}