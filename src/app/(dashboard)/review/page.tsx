"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Loader2, FileText, Sparkles, ChevronDown, ChevronUp } from "lucide-react"

interface ReviewResult {
  totalScore: number
  grade: string
  criteria: Record<string, { score: number; maxScore: number; strengths: string[]; weaknesses: string[]; suggestions: string[] }>
  summary: string
}

const CRITERIA_LABELS: Record<string, string> = {
  personalEngagement: "Personal Engagement",
  exploration: "Exploration",
  analysis: "Analysis",
  evaluation: "Evaluation",
  communication: "Communication",
}

export default function ReviewPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const handleReview = async () => {
    if (!content.trim() || loading) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Review failed"); return }
      setResult(data)
    } catch { setError("Something went wrong") }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Draft Review</h1>
        <p className="text-zinc-400 mt-1">Paste your IA draft below and get IB-criteria-aligned feedback in seconds.</p>
      </div>

      {!result ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader><CardTitle>Submit your draft</CardTitle><CardDescription>Paste your IA text (any section or full draft). Minimum 50 characters.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste your IA draft here...&#10;&#10;Example:&#10;Research Question: How does the length of a simple pendulum affect its period?&#10;&#10;Introduction: The simple pendulum is a classic physics experiment..."
              className="min-h-[200px] bg-zinc-900 border-zinc-700"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button onClick={handleReview} disabled={loading || content.length < 50} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {loading ? "Analyzing..." : "Review My Draft"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Score overview */}
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-zinc-400">Estimated Score</p>
                  <p className="text-4xl font-bold text-emerald-400">{result.totalScore}<span className="text-lg text-zinc-500">/24</span></p>
                </div>
                <Badge className="text-lg px-4 py-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Grade {result.grade}</Badge>
              </div>
              <Progress value={(result.totalScore / 24) * 100} className="h-2" />
              <p className="text-sm text-zinc-400 mt-3">{result.summary}</p>
            </CardContent>
          </Card>

          {/* Criteria breakdown */}
          <Tabs defaultValue="personalEngagement" className="w-full">
            <TabsList className="w-full bg-zinc-900 border border-zinc-800">
              {Object.entries(CRITERIA_LABELS).map(([key, label]) => (
                <TabsTrigger key={key} value={key} className="flex-1 text-xs">
                  {label} ({result.criteria[key]?.score}/{result.criteria[key]?.maxScore})
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(CRITERIA_LABELS).map(([key, label]) => {
              const c = result.criteria[key]
              if (!c) return null
              return (
                <TabsContent key={key} value={key}>
                  <Card className="border-zinc-800 bg-zinc-900/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{label}</h3>
                        <Badge variant={c.score === c.maxScore ? "default" : "outline"}>{c.score}/{c.maxScore}</Badge>
                      </div>
                      {c.strengths.length > 0 && (
                        <div><p className="text-xs text-emerald-400 font-medium mb-1">Strengths</p>
                          <ul className="space-y-1">{c.strengths.map((s, i) => <li key={i} className="text-sm text-zinc-300 flex gap-2"><span className="text-emerald-400">+</span> {s}</li>)}</ul>
                        </div>
                      )}
                      {c.weaknesses.length > 0 && (
                        <div><p className="text-xs text-red-400 font-medium mb-1">Weaknesses</p>
                          <ul className="space-y-1">{c.weaknesses.map((w, i) => <li key={i} className="text-sm text-zinc-300 flex gap-2"><span className="text-red-400">-</span> {w}</li>)}</ul>
                        </div>
                      )}
                      {c.suggestions.length > 0 && (
                        <div><p className="text-xs text-blue-400 font-medium mb-1">Suggestions</p>
                          <ul className="space-y-1">{c.suggestions.map((s, i) => <li key={i} className="text-sm text-zinc-300 flex gap-2"><span className="text-blue-400">→</span> {s}</li>)}</ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>

          <Button variant="outline" className="w-full" onClick={() => { setResult(null); setContent("") }}>
            Review Another Draft
          </Button>
        </div>
      )}
    </div>
  )
}