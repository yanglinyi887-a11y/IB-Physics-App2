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
    features: ["AI Coach 3��/Сʱ", "IA Editor", "Data Analysis", "Topic Generator", "Exemplar Library"],
    cta: "Current Plan",
  },
  {
    name: "Pro",
    price: "59",
    icon: Sparkles,
    color: "emerald",
    features: ["ȫ�� 9 �� AI ģ��", "AI Coach 50��/Сʱ", "Draft Review ����", "Data Analysis", "Exemplar ȫ����"],
    cta: "ɨ������ Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "128",
    icon: Crown,
    color: "amber",
    features: ["Pro ȫ������", "AI Coach 200��/Сʱ", "Devil �����������", "Version Compare", "Weakness Analysis"],
    cta: "ɨ������ Premium",
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
        <h1 className="text-2xl font-bold">Upgrade Your Account</h1>
        <p className="text-zinc-400 mt-1">Get unlimited AI coaching and advanced review tools.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {PLANS.map(plan => {
          const Icon = plan.icon
          return (
            <Card key={plan.name} className={`border-zinc-800 bg-zinc-900/50 relative ${
              plan.popular ? "ring-1 ring-emerald-500/50" : ""
            }`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs">Most Popular</Badge>
              )}
              <CardHeader className="text-center pb-2">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${
                  plan.color === "emerald" ? "text-emerald-400" :
                  plan.color === "amber" ? "text-amber-400" : "text-zinc-400"
                }`} />
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">¥{plan.price}</span>
                  {plan.price !== "0" && <span className="text-zinc-400 text-sm">/��</span>}
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
        <CardHeader className="text-center">
          <QrCode className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
          <CardTitle>WeChat Pay / Alipay</CardTitle>
          <CardDescription>Scan the QR code to pay. Send a screenshot + your email to get upgraded within 24 hours.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <img
              src="/qr.png"
              alt="WeChat Pay QR Code"
              className="w-48 h-48 rounded-xl border border-zinc-700 object-contain bg-white p-1"
            />
          <div className="w-48 h-48 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-900 hidden">
            <div className="text-center">
              <QrCode className="w-12 h-12 text-zinc-600 mx-auto mb-1" />
              <p className="text-xs text-zinc-500">Add qr.png to public/</p>
            </div>
          </div>
          <div className="text-sm text-zinc-400 text-center space-y-1">
            <p>1. Scan QR code and pay <strong className="text-emerald-400">¥59 (Pro)</strong> or <strong className="text-amber-400">¥128 (Premium)</strong></p>
            <p>2. Add WeChat: <code className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">yly20-17</code></p>
            <p>3. Send your <strong>registered email</strong> and chosen plan</p>
            <p>Your account will be upgraded within a few hours.</p>
          </div>
        </CardContent>
      </Card>

      {/* Tools Section */}
      <div className="pt-4">
        <h2 className="text-xl font-bold mb-4">Premium Tools</h2>
        <p className="text-zinc-400 -mt-3 mb-6">Available to Premium users. Upgrade above to unlock.</p>
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
              <CardDescription>3-round deep review. AI plays a ruthless IB examiner and finds every weakness.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste your IA draft here (min 100 characters)..."
                className="min-h-[160px] bg-zinc-950 border-zinc-700 text-sm"
              />
              <Button onClick={runDevilReview} disabled={loading || content.length < 100} className="bg-red-500 hover:bg-red-400 text-white">
                {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Skull className="w-4 h-4 mr-1" />}
                {loading ? "Analyzing..." : "Run Devil Review"}
              </Button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {rounds.length > 0 && (
                <div className="space-y-3 mt-4">
                  {rounds.map((r, i) => (
                    <Card key={i} className="border-zinc-800 bg-zinc-950">
                      <CardHeader className="pb-2"><CardTitle className="text-sm">Round {i + 1}</CardTitle></CardHeader>
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
              <CardTitle className="flex items-center gap-2"><GitCompare className="w-5 h-5 text-blue-400" /> Version Compare</CardTitle>
              <CardDescription>Track your IA improvements across drafts.</CardDescription>
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
                        <Badge className="bg-emerald-500/10 text-emerald-400 text-xs">Score: {v.score}/24</Badge>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-0.5">
                        {v.changes.map((c, i) => <li key={i}>• {c}</li>)}
                      </ul>
                    </div>
                    <div className="text-right">
                      <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
                      <span className="text-sm text-emerald-400 ml-1">+{v.v > 1 ? 3 : 0}</span>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-zinc-500 text-center">This is a demo. Your actual versions will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weakness" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-400" /> Weakness Analysis</CardTitle>
              <CardDescription>AI identifies your weakest areas across all IA criteria and suggests targeted improvements.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-5 gap-3">
                {[
                  { label: "Personal Engagement", score: "1/2", color: "red" },
                  { label: "Exploration", score: "4/6", color: "amber" },
                  { label: "Analysis", score: "5/6", color: "emerald" },
                  { label: "Evaluation", score: "3/6", color: "red" },
                  { label: "Communication", score: "3/4", color: "amber" },
                ].map(c => (
                  <Card key={c.label} className="border-zinc-800 bg-zinc-950 text-center p-4">
                    <p className="text-xs text-zinc-400 mb-1">{c.label}</p>
                    <p className={`text-lg font-bold ${
                      c.color === "red" ? "text-red-400" : c.color === "amber" ? "text-amber-400" : "text-emerald-400"
                    }`}>{c.score}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Demo data</p>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-4 text-center">This is demo data. Run Devil Review to get real analysis.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
