"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Skull, GitCompare, TrendingUp } from "lucide-react"

export default function PremiumPage() {
  const [activeTab, setActiveTab] = useState("devil")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [rounds, setRounds] = useState<string[]>([])
  const [error, setError] = useState("")

  const runDevilReview = async () => {
    if (!content.trim() || loading) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/devil-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setRounds(data.rounds)
    } catch { setError("Something went wrong") }
    finally { setLoading(false) }
  }

  const versions = [
    { v: 1, date: "2026-03-15", score: 15, changes: ["Initial draft"] },
    { v: 2, date: "2026-03-22", score: 18, changes: ["Added controlled variables detail", "Fixed apparatus uncertainties"] },
    { v: 3, date: "2026-03-29", score: 21, changes: ["Added Y-intercept physics explanation", "Expanded evaluation to 5 limitations"] },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Premium Tools</h1>
        <p className="text-zinc-400 mt-1">Advanced AI analysis for students aiming for a 7.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="devil" className="flex-1"><Skull className="w-4 h-4 mr-1" /> Devil Examiner</TabsTrigger>
          <TabsTrigger value="compare" className="flex-1"><GitCompare className="w-4 h-4 mr-1" /> Version Compare</TabsTrigger>
          <TabsTrigger value="weakness" className="flex-1"><TrendingUp className="w-4 h-4 mr-1" /> Weakness Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="devil" className="space-y-4 mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Skull className="w-5 h-5 text-red-400" /> Devil Examiner</CardTitle>
              <CardDescription>3-round deep review. AI plays a ruthless IB examiner and finds every weakness. Uses maximum analysis depth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={content} onChange={e => setContent(e.target.value)}
                placeholder="Paste your full IA draft here..."
                className="min-h-[150px] bg-zinc-900 border-zinc-700" />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button onClick={runDevilReview} disabled={loading || content.length < 100} className="w-full bg-red-500 hover:bg-red-400 text-white">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Skull className="w-4 h-4 mr-2" />}
                {loading ? "Running 3-round analysis..." : "Unleash the Devil Examiner"}
              </Button>
            </CardContent>
          </Card>

          {rounds.length === 3 && (
            <div className="space-y-4">
              <Card className="border-zinc-800 bg-zinc-900/50">
                <CardHeader><CardTitle className="text-sm text-zinc-400">Round 1: Score Breakdown</CardTitle></CardHeader>
                <CardContent><pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">{rounds[0]}</pre></CardContent>
              </Card>
              <Card className="border-red-500/30 bg-red-500/5">
                <CardHeader><CardTitle className="text-sm text-red-400 flex items-center gap-2"><Skull className="w-4 h-4" /> Round 2: Devil Questions</CardTitle></CardHeader>
                <CardContent><pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">{rounds[1]}</pre></CardContent>
              </Card>
              <Card className="border-emerald-500/30 bg-emerald-500/5">
                <CardHeader><CardTitle className="text-sm text-emerald-400">Round 3: Final Verdict</CardTitle></CardHeader>
                <CardContent><pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">{rounds[2]}</pre></CardContent>
              </Card>
              <Button variant="outline" className="w-full" onClick={() => { setRounds([]); setContent("") }}>Run Again</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compare" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><GitCompare className="w-5 h-5 text-blue-400" /> Version Comparison</CardTitle>
              <CardDescription>Track your IA improvement across multiple drafts. See what changed and where you still need work.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {versions.map((v, i) => (
                  <div key={v.v} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <Badge className="text-xs w-12 justify-center">v{v.v}</Badge>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{v.date}</span>
                        {i > 0 && (
                          <Badge variant="outline" className="text-emerald-400 text-xs">
                            +{v.score - versions[i-1].score} points
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{v.changes.join(" · ")}</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400">{v.score}/24</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <p className="text-sm text-zinc-300">
                  <span className="text-emerald-400 font-semibold">Trend:</span> Score improved from 15 to 21 (+6) over 3 versions.
                  The largest jump came between v1 and v2 (+3) by adding controlled variable details.
                  To reach 24, focus on further expanding Evaluation (currently 4/6).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weakness" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-400" /> Weakness Analysis</CardTitle>
              <CardDescription>AI tracks your performance across reviews to identify persistent weak spots.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { area: "Evaluation", score: 4, max: 6, status: "weak", detail: "Consistently scores 4/6 across 3 reviews. Only listing 3-4 limitations instead of 5-6. Improvements too generic." },
                { area: "Exploration", score: 5, max: 6, status: "moderate", detail: "Methodology is strong but missing justification for why specific instruments were chosen over alternatives." },
                { area: "Analysis", score: 5, max: 6, status: "moderate", detail: "Graphs are good but uncertainty propagation for derived quantities needs more explicit calculation." },
                { area: "Communication", score: 4, max: 4, status: "strong", detail: "Well-structured, proper terminology, consistent formatting." },
                { area: "Personal Engagement", score: 2, max: 2, status: "strong", detail: "Clear personal significance demonstrated." },
              ].map(w => (
                <div key={w.area} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Badge variant="outline" className={`text-xs shrink-0 ${w.status === "weak" ? "text-red-400 border-red-500/30" : w.status === "moderate" ? "text-amber-400 border-amber-500/30" : "text-emerald-400 border-emerald-500/30"}`}>
                    {w.score}/{w.max}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{w.area}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{w.detail}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/30">
                <p className="text-sm font-semibold text-emerald-400 mb-2">AI Recommendation</p>
                <p className="text-sm text-zinc-300">
                  Your priority should be Evaluation. Spend 2 days studying the 7-point exemplar Evaluations in the library.
                  Use the 4-dimension method (instrument, environment, assumptions, procedure) to generate at least 6 limitations.
                  For each, name a specific instrument-based improvement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}