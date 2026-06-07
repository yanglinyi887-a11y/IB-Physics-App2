"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Flame, CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { IA_STAGES } from "@/lib/constants"

const STAGE_LABELS: Record<string, string> = {
  stage0: "Topic Discovery",
  stage1: "Research Design",
  stage2: "Data Analysis",
  stage3: "Conclusion",
  stage4: "Evaluation",
}

export default function ProgressPage() {
  const [deadline, setDeadline] = useState("")
  const [stages, setStages] = useState<Record<string, number>>({})
  const [streak, setStreak] = useState(0)
  const [lastCheckin, setLastCheckin] = useState("")
  const [checkedToday, setCheckedToday] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("ia-progress")
    if (saved) {
      const data = JSON.parse(saved)
      setStages(data.stages || {})
      setDeadline(data.deadline || "")
    }
    const s = localStorage.getItem("ia-streak")
    if (s) {
      const d = JSON.parse(s)
      setStreak(d.streak || 0)
      setLastCheckin(d.lastCheckin || "")
      setCheckedToday(d.lastCheckin === new Date().toDateString())
    }
  }, [])

  const updateStage = (key: string, value: number) => {
    const next = { ...stages, [key]: Math.min(100, Math.max(0, value)) }
    setStages(next)
    localStorage.setItem("ia-progress", JSON.stringify({ stages: next, deadline }))
  }

  const checkin = () => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let newStreak = streak
    if (lastCheckin === today) return
    if (lastCheckin === yesterday) newStreak = streak + 1
    else newStreak = 1
    setStreak(newStreak)
    setLastCheckin(today)
    setCheckedToday(true)
    localStorage.setItem("ia-streak", JSON.stringify({ streak: newStreak, lastCheckin: today }))
  }

  const handleDeadlineChange = (v: string) => {
    setDeadline(v)
    const saved = localStorage.getItem("ia-progress")
    const data = saved ? JSON.parse(saved) : {}
    localStorage.setItem("ia-progress", JSON.stringify({ ...data, deadline: v }))
  }

  const daysLeft = deadline ? Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000) : null
  const totalProgress = Object.values(stages).length > 0
    ? Math.round(Object.values(stages).reduce((a, b) => a + b, 0) / Object.values(stages).length)
    : 0
  const isBehind = daysLeft !== null && daysLeft < 60 && totalProgress < 50

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Progress Tracker</h1>
          <p className="text-zinc-400 mt-1">Track your IA progress and stay on schedule.</p>
        </div>
        <Button onClick={checkin} disabled={checkedToday} variant={checkedToday ? "outline" : "default"}
          className={checkedToday ? "" : "bg-emerald-500 hover:bg-emerald-400 text-black"}>
          {checkedToday ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Flame className="w-4 h-4 mr-1" />}
          {checkedToday ? "Checked in today" : "Daily Check-in"}
        </Button>
      </div>

      {/* Streak + Deadline row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold">{streak}</p>
              <p className="text-xs text-zinc-400">day streak</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <Label className="text-xs text-zinc-400">IA Deadline</Label>
            <Input type="date" value={deadline} onChange={e => handleDeadlineChange(e.target.value)}
              className="mt-1 bg-zinc-900 border-zinc-700 h-9" />
          </CardContent>
        </Card>
        <Card className={`border-zinc-800 bg-zinc-900/50 ${isBehind ? "border-red-500/30" : ""}`}>
          <CardContent className="p-4 flex items-center gap-3">
            {isBehind ? <AlertTriangle className="w-8 h-8 text-red-400" /> : <Clock className="w-8 h-8 text-zinc-400" />}
            <div>
              <p className={`text-2xl font-bold ${isBehind ? "text-red-400" : ""}`}>{daysLeft ?? "—"}</p>
              <p className="text-xs text-zinc-400">{isBehind ? "days left — behind!" : "days remaining"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall progress */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-lg">Overall Progress</CardTitle>
          <CardDescription>{totalProgress}% complete</CardDescription>
        </CardHeader>
        <CardContent><Progress value={totalProgress} className="h-3" /></CardContent>
      </Card>

      {/* Stage progress */}
      <div className="space-y-3">
        {IA_STAGES.map(s => {
          const pct = stages[s.id] || 0
          return (
            <Card key={s.id} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs w-8 justify-center">S{s.number}</Badge>
                    <span className="font-medium text-sm">{STAGE_LABELS[s.id]}</span>
                  </div>
                  <span className="text-sm text-zinc-400">{pct}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0" max="100" value={pct}
                    onChange={e => updateStage(s.id, parseInt(e.target.value))}
                    className="flex-1 h-2 rounded-lg appearance-none bg-zinc-800 cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
                  />
                  <Input
                    type="number" min="0" max="100" value={pct}
                    onChange={e => updateStage(s.id, parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-xs text-center bg-zinc-900 border-zinc-700"
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}