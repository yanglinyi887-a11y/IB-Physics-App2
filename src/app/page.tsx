import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PRICING } from "@/lib/constants"

export default async function LandingPage() {
  const session = await auth()
  if (session?.user) redirect("/dashboard")

  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">Physics IA</span>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link href="/register"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <Badge className="mb-6" variant="secondary">IB Physics HL/SL Internal Assessment</Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Your AI coach for a<br />
          <span className="text-emerald-400">7-point Physics IA</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-4">
          Upload your draft, get instant IB-criteria-aligned feedback. 
          Generate graphs from CSV data. Read annotated 7-point exemplars.
        </p>
        <p className="text-sm text-emerald-400/80 font-medium mb-10">
          No API key. No prompt engineering. No setup. We handle the AI - you focus on physics.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register"><Button size="lg" className="text-base px-8">Start free trial</Button></Link>
          <Link href="/login"><Button size="lg" variant="outline" className="text-base px-8">Sign in</Button></Link>
        </div>
        <p className="text-sm text-zinc-500 mt-4">7-day Pro trial. No credit card required.</p>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to nail your IA</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">You bring the physics. We bring the AI.</h3>
          <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
            No OpenAI account needed. No API keys to configure. No prompt engineering to learn. 
            We run the AI infrastructure - you just upload your draft, ask a question, or paste your data. 
            It is like having an IB examiner on speed dial, minus the hourly rate.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-zinc-400 text-center mb-12">Start free. Upgrade when you are ready.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-zinc-800 p-6 flex flex-col">
            <h3 className="font-semibold text-lg">Free</h3>
            <p className="text-3xl font-bold mt-2">$0</p>
            <p className="text-zinc-400 text-sm mt-1 mb-6">Try it out</p>
            <ul className="space-y-3 text-sm text-zinc-300 mb-8 flex-1">
              <li>3 topic suggestions</li>
              <li>1 AI draft review</li>
              <li>3 exemplars (5 annotations each)</li>
              <li>IA structure templates</li>
            </ul>
            <Link href="/register"><Button variant="outline" className="w-full">Get started</Button></Link>
          </div>
          <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 p-6 flex flex-col relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black">Most popular</Badge>
            <h3 className="font-semibold text-lg">Pro</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold">${PRICING.pro.current}</span>
              <span className="text-zinc-500 line-through text-sm">${PRICING.pro.original}</span>
              <span className="text-zinc-400 text-sm">/mo</span>
            </div>
            <p className="text-zinc-400 text-sm mt-1 mb-6">or ${PRICING.pro.yearly}/year (${PRICING.pro.monthlyEquivalent}/mo)</p>
            <ul className="space-y-3 text-sm text-zinc-300 mb-8 flex-1">
              <li>Unlimited AI coaching dialogue</li>
              <li>Unlimited draft reviews</li>
              <li>CSV-to-graph data analysis</li>
              <li>Full exemplar library + annotations</li>
              <li>AI-guided exemplar reading</li>
              <li>Progress tracking</li>
              <li>Word export</li>
            </ul>
            <Link href="/register"><Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black">Start 7-day free trial</Button></Link>
          </div>
          <div className="rounded-xl border border-zinc-800 p-6 flex flex-col">
            <h3 className="font-semibold text-lg">Premium</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold">${PRICING.premium.current}</span>
              <span className="text-zinc-500 line-through text-sm">${PRICING.premium.original}</span>
              <span className="text-zinc-400 text-sm">/mo</span>
            </div>
            <p className="text-zinc-400 text-sm mt-1 mb-6">or ${PRICING.premium.yearly}/year (${PRICING.premium.monthlyEquivalent}/mo)</p>
            <ul className="space-y-3 text-sm text-zinc-300 mb-8 flex-1">
              <li>Everything in Pro</li>
              <li>Devil Examiner deep review</li>
              <li>Priority queue, always fast</li>
              <li>Version comparison</li>
              <li>Weakness analysis reports</li>
              <li>LaTeX / premium PDF export</li>
              <li>No daily usage limits</li>
            </ul>
            <Link href="/register"><Button variant="outline" className="w-full">Start 7-day free trial</Button></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 px-6 text-center text-sm text-zinc-500">
        Physics IA Coach. Built for IB students.<br />
        AI is a coach, not a ghostwriter. Academic integrity matters.
      </footer>
    </main>
  )
}

const features = [
  { icon: "??", title: "AI Draft Review", desc: "Upload your .docx and get a detailed IB-criteria score breakdown in seconds. Know exactly what to fix." },
  { icon: "??", title: "Data Analysis", desc: "Upload CSV experiment data. Auto-generate IB-compliant graphs with error bars, best-fit lines, and uncertainty calculations." },
  { icon: "??", title: "Annotated Exemplars", desc: "Read real 7-point IAs with 35-50 AI annotations per paper. Learn what examiners actually reward." },
  { icon: "??", title: "Progress Tracking", desc: "Set your deadline. Get a week-by-week plan. Never fall behind on your IA again." },
  { icon: "??", title: "Topic Generator", desc: "Stuck on what to investigate? Tell us your interest area and difficulty level. Get 5 specific, realistic IA topics." },
  { icon: "?", title: "Zero Setup", desc: "We run the AI infrastructure. No API keys, no OpenAI account, no prompt engineering. You just write physics." },
]