"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Skull, GitCompare, TrendingUp, Check, Zap, Crown, QrCode } from "lucide-react"

const PLANS = [
  {
    name: "Free",
    price: "0",
    icon: Zap,
    color: "zinc",
    features: ["AI Coach 3?/??", "IA Editor", "Data Analysis", "Topic Generator", "Exemplar Library"],
    cta: "????",
  },
  {
    name: "Pro",
    price: "59",
    icon: Sparkles,
    color: "emerald",
    features: ["?? 8 ? AI ??", "AI Coach 50?/??", "Draft Review ??", "Data Analysis", "Exemplar ????"],
    cta: "???? Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "128",
    icon: Crown,
    color: "amber",
    features: ["Pro ????", "AI Coach 200?/??", "Devil ????", "Version Compare", "Weakness Analysis"],
    cta: "???? Premium",
  },
]

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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Pricing Section */}
      <div>
        <h1 className="text-2xl font-bold">????</h1>
        <p className="text-zinc-400 mt-1">???? AI ??????????</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {PLANS.map(plan => {
          const Icon = plan.icon
          return (
            <Card key={plan.name} className={`border-zinc-800 bg-zinc-900/50 relative ${
              plan.popular ? "ring-1 ring-emerald-500/50" : ""
            }`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs">??</Badge>
              )}
              <CardHeader className="text-center pb-2">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${
                  plan.color === "emerald" ? "text-emerald-400" :
                  plan.color === "amber" ? "text-amber-400" : "text-zinc-400"
                }`} />
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">?{plan.price}</span>
                  {plan.price !== "0" && <span className="text-zinc-400 text-sm">/?</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${
                  plan.name === "Free" ? "bg-zinc-800 text-zinc-400" :
                  plan.color === "emerald" ? "bg-emerald-500 hover:bg-emerald-400 text-black" :
                  "bg-amber-500 hover:bg-amber-400 text-black"
                }`} disabled={plan.name === "Free"}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Payment Method */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            ??????
          </CardTitle>
          <CardDescription>????????? yly20-17????????</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="w-48 h-48 bg-white rounded-xl p-2 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/qr.png" alt="?????" className="w-full h-full object-contain" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-zinc-300 font-medium">??????</p>
            <ol className="text-sm text-zinc-400 space-y-1">
              <li>1. ??????</li>
              <li>2. ???? <span className="text-emerald-400 font-medium">yly20-17</span></li>
              <li>3. ????????</li>
              <li>4. ??????????</li>
            </ol>
          </div>
          <p className="text-xs text-zinc-500">
            ??? 1 ?????????????? yly20-17?
          </p>
        </CardContent>
      </Card>

      {/* Premium Tools */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="devil" className="flex-1"><Skull className="w-4 h-4 mr-1" /> Devil ????</TabsTrigger>
          <TabsTrigger value="compare" className="flex-1"><GitCompare className="w-4 h-4 mr-1" /> ????</TabsTrigger>
          <TabsTrigger value="weakness" className="flex-1"><TrendingUp className="w-4 h-4 mr-1" /> ????</TabsTrigger>
        </TabsList>

        <TabsContent value="devil" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Skull className="w-5 h-5 text-red-400" /> Devil Examiner Deep Review</CardTitle>
              <CardDescription>
                AI ?????? IB ????? 3 ??????????????????
                <br /><Badge variant="outline" className="mt-2 text-amber-400 border-amber-500/30">Premium ??</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="???? IA ????? 100 ??..."
                className="min-h-[160px] bg-zinc-950 border-zinc-700 text-sm"
              />
              <Button onClick={runDevilReview} disabled={loading || content.length < 100} className="bg-red-500 hover:bg-red-400 text-white">
                {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Skull className="w-4 h-4 mr-1" />}
                {loading ? "???..." : "?? Devil ??"}
              </Button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {rounds.length > 0 && (
                <div className="space-y-3 mt-4">
                  {rounds.map((r, i) => (
                    <Card key={i} className="border-zinc-800 bg-zinc-950">
                      <CardHeader className="pb-2"><CardTitle className="text-sm">? {i + 1} ?</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-zinc-300 whitespace-pre-wrap">{r}</p></CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><GitCompare className="w-5 h-5 text-blue-400" /> ????</CardTitle>
              <CardDescription>???? IA ???????????</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versions.map(v => (
                  <div key={v.v} className="flex items-center gap-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-lg font-bold text-zinc-300">v{v.v}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-zinc-400">{v.date}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-400 text-xs">??: {v.score}/24</Badge>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-0.5">
                        {v.changes.map((c, i) => <li key={i}>- {c}</li>)}
                      </ul>
                    </div>
                    <div className="text-right">
                      <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
                      <span className="text-sm text-emerald-400 ml-1">+{v.v > 1 ? 3 : 0}</span>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-zinc-500 text-center">????????????????????</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weakness" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-400" /> ????</CardTitle>
              <CardDescription>AI ????? IA ???????????????????</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-5 gap-3">
                {[
                  { label: "????", score: "1/2", color: "red" },
                  { label: "??", score: "4/6", color: "amber" },
                  { label: "??", score: "5/6", color: "emerald" },
                  { label: "??", score: "3/6", color: "red" },
                  { label: "??", score: "3/4", color: "amber" },
                ].map(c => (
                  <Card key={c.label} className="border-zinc-800 bg-zinc-950 text-center p-4">
                    <p className="text-xs text-zinc-400 mb-1">{c.label}</p>
                    <p className={`text-lg font-bold ${
                      c.color === "red" ? "text-red-400" : c.color === "amber" ? "text-amber-400" : "text-emerald-400"
                    }`}>{c.score}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">????</p>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-4 text-center">????????? Devil ??????????</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
