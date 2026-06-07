"use client"
import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ArrowLeft, ChevronRight, MessageCircle, Lightbulb, AlertCircle, PenLine, Target, Eye } from "lucide-react"
import { exemplarData, type Exemplar, type Annotation } from "@/lib/exemplar-data"

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Target }> = {
  structure: { label: "Structure", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", icon: Target },
  scoring: { label: "Scoring Key", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30", icon: Target },
  technical: { label: "Technical", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", icon: Target },
  language: { label: "Language", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", icon: Target },
  improvement: { label: "Room to Improve", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", icon: Target },
}

const TYPE_ICONS: Record<string, string> = {
  structure: "🟢",
  scoring: "🟣",
  technical: "🔵",
  language: "🟡",
  improvement: "🔴",
}

function highlightText(text: string, annotations: Annotation[], onClick: (a: Annotation) => void) {
  // Simple approach: render paragraphs and mark annotation locations with badges
  const paragraphs = text.split("\n")
  let annIdx = 0
  
  return paragraphs.map((para, pi) => {
    const trimmed = para.trim()
    if (!trimmed) return <br key={pi} />
    
    // Check if any annotation starts in this paragraph range
    const paraAnnotations: Annotation[] = []
    // Simple heuristic: match annotations by searching for their highlight text
    for (const ann of annotations) {
      if (trimmed.includes(ann.highlightText.substring(0, 30))) {
        paraAnnotations.push(ann)
      }
    }

    if (paraAnnotations.length === 0) {
      if (trimmed.startsWith("## ")) return <h2 key={pi} className="text-lg font-bold mt-6 mb-2 text-white">{trimmed.slice(3)}</h2>
      if (trimmed.startsWith("### ")) return <h3 key={pi} className="text-base font-semibold mt-4 mb-1 text-zinc-200">{trimmed.slice(4)}</h3>
      if (trimmed.startsWith("|")) return <p key={pi} className="text-xs font-mono text-zinc-400 my-1">{trimmed}</p>
      if (trimmed.startsWith("- ")) return <p key={pi} className="text-sm text-zinc-300 ml-4">• {trimmed.slice(2)}</p>
      return <p key={pi} className="text-sm text-zinc-300 leading-relaxed my-1">{trimmed}</p>
    }

    return (
      <div key={pi} className="relative group my-2">
        {trimmed.startsWith("## ") ? (
          <h2 className="text-lg font-bold mt-6 mb-2 text-white inline">{trimmed.slice(3)}</h2>
        ) : trimmed.startsWith("### ") ? (
          <h3 className="text-base font-semibold mt-4 mb-1 text-zinc-200 inline">{trimmed.slice(4)}</h3>
        ) : trimmed.startsWith("|") ? (
          <p className="text-xs font-mono text-zinc-400">{trimmed}</p>
        ) : (
          <p className="text-sm text-zinc-300 leading-relaxed inline">{trimmed}</p>
        )}
        {paraAnnotations.map(a => (
          <button
            key={a.id}
            onClick={() => onClick(a)}
            className={`inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-xs ${TYPE_CONFIG[a.type].bg} ${TYPE_CONFIG[a.type].color} hover:opacity-80 transition-opacity`}
          >
            {TYPE_ICONS[a.type]} <span className="hidden sm:inline">{TYPE_CONFIG[a.type].label}</span>
          </button>
        ))}
      </div>
    )
  })
}

export default function ExemplarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const exemplar = exemplarData.find(e => e.id === id)
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null)
  const [mode, setMode] = useState<"free" | "guided">("free")
  const [guidedIdx, setGuidedIdx] = useState(0)

  if (!exemplar) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <p className="text-zinc-400">Exemplar not found.</p>
        <Link href="/dashboard/exemplars"><Button variant="link" className="mt-2">Back to library</Button></Link>
      </div>
    )
  }

  const ann = selectedAnnotation

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/exemplars">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Library</Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">{exemplar.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">{exemplar.topic}</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                {exemplar.score}/{exemplar.maxScore} — Grade {exemplar.grade}
              </Badge>
              <span className="text-xs text-zinc-500">{exemplar.annotations.length} annotations</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={mode === "free" ? "default" : "outline"} size="sm" onClick={() => setMode("free")}>
            <Eye className="w-4 h-4 mr-1" /> Free
          </Button>
          <Button variant={mode === "guided" ? "default" : "outline"} size="sm" onClick={() => { setMode("guided"); setGuidedIdx(0) }}>
            <Lightbulb className="w-4 h-4 mr-1" /> Guided
          </Button>
        </div>
      </div>

      {/* Score bar */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "PE", score: "2/2", pct: 100 },
          { label: "Exp", score: "6/6", pct: 100 },
          { label: "Ana", score: "6/6", pct: 100 },
          { label: "Eva", score: "5/6", pct: 83 },
          { label: "Com", score: "4/4", pct: 100 },
        ].map(c => (
          <div key={c.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">{c.label}</span>
            <span className="text-sm font-mono text-emerald-400">{c.score}</span>
            <div className="w-12 h-1.5 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.pct}%` }} /></div>
          </div>
        ))}
      </div>

      {/* Content + annotation panel */}
      <div className="flex gap-6">
        {/* Main content */}
        <div className={`${ann ? "flex-[3]" : "flex-1"} transition-all`}>
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-6 max-h-[calc(100vh-220px)] overflow-y-auto">
              {mode === "guided" ? (
                <div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-sm text-emerald-400">AI Guide</span>
                      <span className="text-xs text-zinc-500 ml-auto">{guidedIdx + 1}/{exemplar.annotations.length}</span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-3">
                      {guidedIdx === 0
                        ? "Welcome! Let's explore this IA together. I'll walk you through each scoring highlight. First, let's look at how the Introduction scores Personal Engagement marks. Find the 🟣 badge and click it."
                        : `Now look at annotation ${guidedIdx + 1}. Find the ${TYPE_ICONS[exemplar.annotations[guidedIdx].type]} badge in the text and click to learn more.`}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled={guidedIdx === 0} onClick={() => setGuidedIdx(guidedIdx - 1)}>Previous</Button>
                      <Button size="sm" disabled={guidedIdx >= exemplar.annotations.length - 1} onClick={() => setGuidedIdx(guidedIdx + 1)}>
                        Next <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  {highlightText(exemplar.content, exemplar.annotations, (a) => {
                    setSelectedAnnotation(a)
                    const idx = exemplar.annotations.findIndex(x => x.id === a.id)
                    if (idx >= 0) setGuidedIdx(idx)
                  })}
                </div>
              ) : (
                highlightText(exemplar.content, exemplar.annotations, setSelectedAnnotation)
              )}
            </CardContent>
          </Card>
        </div>

        {/* Annotation detail panel */}
        {ann && (
          <div className="flex-[2]">
            <div className="sticky top-20 space-y-4">
              <Card className={`border ${TYPE_CONFIG[ann.type].bg}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${TYPE_CONFIG[ann.type].bg} ${TYPE_CONFIG[ann.type].color} border-current`}>
                      {TYPE_ICONS[ann.type]} {TYPE_CONFIG[ann.type].label}
                    </Badge>
                    <button onClick={() => setSelectedAnnotation(null)} className="text-xs text-zinc-500 hover:text-zinc-300">Close</button>
                  </div>

                  <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">Highlighted text</p>
                    <p className="text-sm text-zinc-200 italic">"{ann.highlightText}"</p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Why this works</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{ann.whyGood}</p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 mb-1">How to apply this</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{ann.howToApply}</p>
                  </div>

                  <div className="bg-zinc-950 rounded-lg p-3">
                    <p className="text-xs text-zinc-500 mb-1">IB Criterion</p>
                    <p className="text-xs text-zinc-400 font-mono">{ann.criteriaRef}</p>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="w-3 h-3 mr-1" /> Ask AI to explain further
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}