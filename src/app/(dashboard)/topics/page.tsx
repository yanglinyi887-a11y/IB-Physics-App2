"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"

const areas = ["Mechanics", "Thermal", "Electromagnetism", "Waves & Optics", "Other"]
const levels = [
  { id: "basic", label: "Basic", desc: "Verify textbook formulas with real data. Stable, easy to execute." },
  { id: "advanced", label: "Advanced", desc: "Explore non-linear relationships. Use linearization techniques." },
  { id: "expert", label: "Expert", desc: "Build your own model. High depth, higher risk." },
]

export default function TopicsPage() {
  const [step, setStep] = useState(0)
  const [area, setArea] = useState("")
  const [level, setLevel] = useState("")

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Topic Generator</h1>
        <p className="text-zinc-400 mt-1">Discover your IA topic in 3 steps.</p>
      </div>

      {step === 0 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader><CardTitle>Step 1: Choose your interest area</CardTitle><CardDescription>Which field of physics excites you most?</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {areas.map(a => (
              <Button key={a} variant={area === a ? "default" : "outline"} className="w-full justify-start" onClick={() => { setArea(a); setStep(1) }}>
                {a}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader><CardTitle>Step 2: Choose difficulty — {area}</CardTitle><CardDescription>All three levels can score a 7. Pick what you can execute well.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {levels.map(l => (
              <button key={l.id} onClick={() => { setLevel(l.id); setStep(2) }} className={`w-full text-left p-4 rounded-lg border transition-colors ${level === l.id ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 hover:border-zinc-700"}`}>
                <p className="font-medium">{l.label}</p>
                <p className="text-sm text-zinc-400 mt-1">{l.desc}</p>
              </button>
            ))}
            <Button variant="ghost" className="w-full" onClick={() => setStep(0)}>Back</Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader><CardTitle>Step 3: Your topics — {area} / {levels.find(l => l.id === level)?.label}</CardTitle><CardDescription>AI will generate 5 specific IA topics with variables, formulas, and equipment lists.</CardDescription></CardHeader>
          <CardContent className="space-y-4 text-center py-8">
            <Lightbulb className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-zinc-400">Connect your OpenAI API key to generate topics, or browse our pre-built topic library.</p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-black">Generate with AI</Button>
              <Button variant="outline">Browse topic library</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}