import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sampleExemplars = [
  { id: "1", title: "Pendulum Period vs Length", topic: "Mechanics", score: 23, maxScore: 24, grade: "7" },
  { id: "2", title: "Cooling Curve of Water", topic: "Thermal", score: 24, maxScore: 24, grade: "7" },
  { id: "3", title: "Resistivity vs Temperature", topic: "Electromagnetism", score: 24, maxScore: 24, grade: "7" },
  { id: "4", title: "Speed of Sound in Resonance Tube", topic: "Waves & Optics", score: 22, maxScore: 24, grade: "7" },
  { id: "5", title: "Spring Constant Determination", topic: "Mechanics", score: 22, maxScore: 24, grade: "7" },
  { id: "6", title: "Magnetic Braking in Copper Tube", topic: "Electromagnetism", score: 23, maxScore: 24, grade: "7" },
]

export default function ExemplarsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exemplar Library</h1>
        <p className="text-zinc-400 mt-1">Real 7-point IAs with AI annotations explaining every scoring decision.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {sampleExemplars.map(e => (
          <Link key={e.id} href={`/exemplars/${e.id}`}>
            <Card className="border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">{e.topic}</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">{e.score}/{e.maxScore} — Grade {e.grade}</Badge>
                </div>
                <CardTitle className="text-base">{e.title}</CardTitle>
                <CardDescription>47 AI annotations • IB Official TSM</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}