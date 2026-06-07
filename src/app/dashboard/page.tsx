"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, FileText, BarChart3, BookOpen, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-zinc-400 mt-1">Your IB Physics IA journey starts here.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/dashboard/editor">
          <Card className="border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><PlusCircle className="w-5 h-5 text-emerald-400" /></div>
              <div><p className="font-medium">New IA Project</p><p className="text-sm text-zinc-400">Start from scratch</p></div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/review">
          <Card className="border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-400" /></div>
              <div><p className="font-medium">Review Draft</p><p className="text-sm text-zinc-400">Upload .docx for AI feedback</p></div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/exemplars">
          <Card className="border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-purple-400" /></div>
              <div><p className="font-medium">Exemplar Library</p><p className="text-sm text-zinc-400">Annotated 7-point IAs</p></div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-lg">Your IA Projects</CardTitle>
          <CardDescription>No projects yet. Start your first IA below.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
            <PlusCircle className="w-8 h-8 text-zinc-500" />
          </div>
          <p className="text-zinc-400 mb-4">Create a new IA project to get AI-guided coaching through all 5 stages.</p>
          <Link href="/dashboard/editor">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black">
              <PlusCircle className="w-4 h-4 mr-2" /> New IA Project
            </Button>
          </Link>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold pt-4">Available Tools</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {tools.map(t => (
          <Card key={t.title} className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">{t.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{t.title}</p>
                  {t.badge && <Badge variant="outline" className="text-[10px] h-5">{t.badge}</Badge>}
                </div>
                <p className="text-sm text-zinc-400 mb-3">{t.desc}</p>
                <Link href={t.href}>
                  <Button variant="ghost" size="sm" className="text-emerald-400 h-7 px-0 hover:bg-transparent hover:text-emerald-300">
                    Open <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const tools = [
  { icon: "💡", title: "Topic Generator", desc: "Get 5 specific IA topic ideas with variables, formulas, and equipment lists.", badge: "Free", href: "/dashboard/topics" },
  { icon: "🤖", title: "AI Coach", desc: "Chat with an AI that knows IB Physics IA criteria inside out.", badge: "AI", href: "/dashboard/coach" },
  { icon: "📊", title: "Data Analysis", desc: "Upload CSV data. Get IB-compliant graphs with error bars and calculations.", badge: "Free", href: "/dashboard/analysis" },
  { icon: "📚", title: "Exemplar Reader", desc: "Read 7-point IAs with AI annotations explaining every scoring decision.", badge: "Free", href: "/dashboard/exemplars" },
  { icon: "👹", title: "Devil Examiner", desc: "3-round deep review. AI plays rigorous examiner and finds what you missed.", badge: "AI", href: "/dashboard/premium" },
  { icon: "📈", title: "Progress Tracker", desc: "Track your IA progress, set deadlines, and build a daily streak.", badge: "Free", href: "/dashboard/progress" },
]
