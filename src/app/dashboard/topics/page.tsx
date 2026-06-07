"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Loader2, BookOpen, Beaker, ChevronRight } from "lucide-react"

const areas = ["Mechanics", "Thermal", "Electromagnetism", "Waves & Optics", "Other"]
const levels = [
  { id: "basic", label: "Basic", desc: "Verify textbook formulas with real data. Stable, easy to execute." },
  { id: "advanced", label: "Advanced", desc: "Explore non-linear relationships. Use linearization techniques." },
  { id: "expert", label: "Expert", desc: "Build your own model. High depth, higher risk." },
]

interface Topic {
  title: string
  independent: string
  dependent: string
  formula: string
  equipment: string
  scoreReason: string
}

const PRESET_TOPICS: Record<string, Record<string, Topic[]>> = {
  Mechanics: {
    basic: [
      { title: "How does pendulum length affect its period?", independent: "Length of pendulum", dependent: "Period of oscillation", formula: "T = 2\u03c0\u221a(L/g)", equipment: "String, mass, stopwatch, ruler, protractor", scoreReason: "Classic experiment with clear linearization via T\u00b2 vs L." },
      { title: "How does mass affect spring oscillation period?", independent: "Mass on spring", dependent: "Period of oscillation", formula: "T = 2\u03c0\u221a(m/k)", equipment: "Spring, masses, stopwatch, ruler", scoreReason: "Clean T\u00b2 vs m graph, easy to verify with known k." },
      { title: "How does ramp angle affect final velocity?", independent: "Angle of incline", dependent: "Final velocity", formula: "v\u00b2 = 2gL sin\u03b8", equipment: "Ramp, cart, light gates, protractor", scoreReason: "Energy conservation with measurable uncertainty." },
    ],
    advanced: [
      { title: "How does projectile launch angle affect range?", independent: "Launch angle", dependent: "Horizontal range", formula: "R = v\u00b2 sin(2\u03b8)/g", equipment: "Projectile launcher, meter stick, carbon paper, protractor", scoreReason: "Non-linear relationship, sin curve fitting shows analytical skill." },
      { title: "How does mass ratio affect velocity in elastic collisions?", independent: "Mass ratio m1/m2", dependent: "Final velocity of m1", formula: "v1\u2032 = (m1-m2)/(m1+m2) v1", equipment: "Air track, gliders, light gates, masses", scoreReason: "Tests conservation laws, linearizable via clever plotting." },
    ],
    expert: [
      { title: "How does air resistance affect terminal velocity of different objects?", independent: "Object shape/size", dependent: "Terminal velocity", formula: "v_t = \u221a(2mg/\u03c1AC_d)", equipment: "High-speed camera, meter ruler, varied objects, tracking software", scoreReason: "Real-world modeling, significant data processing, high personal engagement." },
    ],
  },
  Thermal: {
    basic: [
      { title: "How does water mass affect cooling rate?", independent: "Mass of water", dependent: "Cooling rate", formula: "dT/dt = -k(T - T_room)", equipment: "Beaker, thermometer, stopwatch, hot plate, balance", scoreReason: "Newton cooling law with clear exponential fit." },
      { title: "How does salt concentration affect boiling point?", independent: "Salt concentration", dependent: "Boiling point", formula: "\u0394T_b = i K_b m", equipment: "Beaker, thermometer, hot plate, salt, balance", scoreReason: "Colligative property with straightforward linear relationship." },
    ],
  },
  Electromagnetism: {
    basic: [
      { title: "How does wire length affect its resistance?", independent: "Length of wire", dependent: "Resistance", formula: "R = \u03c1L/A", equipment: "Nichrome wire, voltmeter, ammeter, power supply, ruler", scoreReason: "Ohm law, clean R vs L graph, classic IA benchmark." },
      { title: "How does number of coil turns affect induced EMF?", independent: "Number of turns", dependent: "Induced EMF", formula: "\u03b5 = -N d\u03a6/dt", equipment: "Coil, magnet, oscilloscope/voltmeter, ruler", scoreReason: "Faraday law with measurable proportional relationship." },
    ],
  },
  "Waves & Optics": {
    basic: [
      { title: "How does string tension affect standing wave frequency?", independent: "String tension", dependent: "Resonant frequency", formula: "f = (1/2L)\u221a(T/\u03bc)", equipment: "String, pulley, masses, vibration generator, frequency counter", scoreReason: "Clean f\u00b2 vs T graph, rich error analysis opportunities." },
      { title: "How does slit spacing affect double-slit fringe separation?", independent: "Slit spacing d", dependent: "Fringe separation \u0394y", formula: "\u0394y = \u03bbD/d", equipment: "Laser, double slits, screen, ruler", scoreReason: "\u0394y vs 1/d is linear, tests wave theory directly." },
    ],
  },
  Other: {
    basic: [
      { title: "How does temperature affect the viscosity of a fluid?", independent: "Temperature", dependent: "Terminal velocity of falling sphere", formula: "\u03b7 = 2r\u00b2(\u03c1_s-\u03c1_f)g / 9v", equipment: "Measuring cylinder, spheres, thermometer, stopwatch, hot plate", scoreReason: "Combines thermal and mechanics, rich data processing." },
    ],
  },
}

export default function TopicsPage() {
  const [step, setStep] = useState(0)
  const [area, setArea] = useState("")
  const [level, setLevel] = useState("")
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPreset, setShowPreset] = useState(false)

  const generateTopics = async () => {
    setLoading(true)
    setError("")
    setTopics([])
    try {
      const res = await fetch("/api/generate-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, level }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Generation failed"); setLoading(false); return }
      setTopics(data.topics)
    } catch {
      setError("Network error. Try again or browse the preset library.")
    }
    setLoading(false)
  }

  const loadPreset = () => {
    const presetArea = PRESET_TOPICS[area] || {}
    const presetLevel = presetArea[level] || presetArea["basic"] || []
    setTopics(presetLevel)
    setShowPreset(true)
  }

  const levelLabel = levels.find(l => l.id === level)?.label || ""

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
          <CardHeader><CardTitle>Step 2: Choose difficulty - {area}</CardTitle><CardDescription>All three levels can score a 7. Pick what you can execute well.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {levels.map(l => {
              const isSelected = level === l.id
              const borderClass = isSelected ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 hover:border-zinc-700"
              return (
                <button key={l.id} onClick={() => { setLevel(l.id); setStep(2) }} className={"w-full text-left p-4 rounded-lg border transition-colors " + borderClass}>
                  <p className="font-medium">{l.label}</p>
                  <p className="text-sm text-zinc-400 mt-1">{l.desc}</p>
                </button>
              )})}
            <Button variant="ghost" className="w-full" onClick={() => setStep(0)}>Back</Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader><CardTitle>Step 3: Your topics - {area} / {levelLabel}</CardTitle><CardDescription>
            {topics.length > 0 ? topics.length + " topics generated" : "Choose how to get your topics."}
          </CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {topics.length === 0 && !loading && (
              <div className="text-center py-8 space-y-4">
                <Lightbulb className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-zinc-400">Generate AI-powered topic suggestions or browse our pre-built library.</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={generateTopics} className="bg-emerald-500 hover:bg-emerald-400 text-black">
                    <Lightbulb className="w-4 h-4 mr-1" /> Generate with AI
                  </Button>
                  <Button variant="outline" onClick={loadPreset}>
                    <BookOpen className="w-4 h-4 mr-1" /> Browse topic library
                  </Button>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-2" />
                <p className="text-zinc-400">Generating topics...</p>
              </div>
            )}

            {topics.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-emerald-500/10 text-emerald-400 text-xs">
                    {showPreset ? "Preset Library" : "AI Generated"}
                  </Badge>
                  <span className="text-xs text-zinc-500">{topics.length} topics</span>
                </div>
                {topics.map((t, i) => (
                  <Card key={i} className="border-zinc-800 bg-zinc-950">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-white">{t.title}</h3>
                          <p className="text-xs text-emerald-400 mt-1">{t.scoreReason}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-zinc-900">
                          <span className="text-zinc-500">Independent:</span>
                          <p className="text-zinc-300">{t.independent}</p>
                        </div>
                        <div className="p-2 rounded bg-zinc-900">
                          <span className="text-zinc-500">Dependent:</span>
                          <p className="text-zinc-300">{t.dependent}</p>
                        </div>
                      </div>
                      <div className="text-xs p-2 rounded bg-zinc-900">
                        <span className="text-zinc-500">Key formula: </span>
                        <code className="text-zinc-300">{t.formula}</code>
                      </div>
                      <div className="text-xs p-2 rounded bg-zinc-900">
                        <span className="text-zinc-500">Equipment: </span>
                        <span className="text-zinc-300">{t.equipment}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex gap-2 justify-center pt-2">
                  <Button variant="outline" size="sm" onClick={() => { setTopics([]); setShowPreset(false); setError("") }}>
                    Try again
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setStep(0); setTopics([]); setArea(""); setLevel(""); }}>
                    Start over
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
