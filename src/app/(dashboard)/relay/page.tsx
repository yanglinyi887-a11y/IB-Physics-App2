"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Key, Plus, Trash2, TrendingUp } from "lucide-react"

const PROVIDER_OPTIONS = [
  { value: "DeepSeek", label: "DeepSeek", baseURL: "api.deepseek.com" },
  { value: "OpenAI", label: "OpenAI", baseURL: "api.openai.com" },
  { value: "Google", label: "Google Gemini", baseURL: "generativelanguage.googleapis.com" },
  { value: "Anthropic", label: "Anthropic Claude", baseURL: "api.anthropic.com" },
]

export default function RelayPage() {
  const [keys, setKeys] = useState<Array<{ id: string; provider: string; keyPreview: string; active: boolean; usedCost: number }>>([])
  const [newKey, setNewKey] = useState("")
  const [provider, setProvider] = useState("DeepSeek")

  const addKey = () => {
    if (!newKey.trim()) return
    setKeys(prev => [...prev, { id: crypto.randomUUID(), provider, keyPreview: newKey.slice(0, 12) + "...", active: true, usedCost: 0 }])
    setNewKey("")
  }
  const toggleKey = (id: string) => { setKeys(prev => prev.map(k => k.id === id ? { ...k, active: !k.active } : k)) }
  const removeKey = (id: string) => { setKeys(prev => prev.filter(k => k.id !== id)) }
  const totalUsed = keys.reduce((sum, k) => sum + k.usedCost, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Key className="w-6 h-6 text-emerald-400" /> API Relay Station</h1>
        <p className="text-zinc-400 mt-1">Multi-provider key pool. 9 models across DeepSeek, OpenAI, Gemini, Claude. Students pick any model — you pay wholesale, they pay retail.</p>
      </div>

      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div><p className="text-xs text-zinc-400 mb-1">You pay (wholesale)</p><p className="text-2xl font-bold text-emerald-400">0.001/k</p><p className="text-xs text-zinc-500">per 1K tokens avg</p></div>
            <div><p className="text-xs text-zinc-400 mb-1">Student pays (retail)</p><p className="text-2xl font-bold text-white">59-128</p><p className="text-xs text-zinc-500">per month, any model</p></div>
            <div><p className="text-xs text-zinc-400 mb-1">Your margin</p><p className="text-2xl font-bold text-amber-400">~85%</p><p className="text-xs text-zinc-500">gross profit</p></div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader><CardTitle className="text-lg">Add API Key</CardTitle><CardDescription>Buy keys from any provider or relay station and paste here.</CardDescription></CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Select value={provider} onValueChange={(v: string | null) => setProvider(v || "DeepSeek")}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700"><SelectValue /></SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900">
              {PROVIDER_OPTIONS.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="sk-... or AIza... or sk-ant-..." className="flex-1 min-w-[200px] bg-zinc-900 border-zinc-700 font-mono text-sm" />
          <Button onClick={addKey} className="bg-emerald-500 hover:bg-emerald-400 text-black"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Key Pool ({keys.length} keys)</CardTitle>
            <div className="flex items-center gap-2 text-sm"><TrendingUp className="w-4 h-4 text-zinc-400" /><span className="text-zinc-400">Total:</span><span className="font-mono text-amber-400">${totalUsed.toFixed(4)}</span></div>
          </div>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? <p className="text-center text-zinc-500 py-8">No keys yet. Add your first API key above.</p> : (
            <div className="space-y-2">
              {keys.map(k => (
                <div key={k.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-3"><Badge variant="outline" className="text-xs">{k.provider}</Badge><code className="text-sm text-zinc-300">{k.keyPreview}</code></div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">${k.usedCost.toFixed(4)} used</span>
                    <Badge className={`cursor-pointer text-xs ${k.active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`} onClick={() => toggleKey(k.id)}>{k.active ? "Active" : "Paused"}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeKey(k.id)} className="text-red-400 h-7 w-7 p-0"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader><CardTitle className="text-lg">How it works</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-300">
          <p>1. <strong>Buy API keys</strong> from any provider or relay station (api2d, openai-hk, etc.)</p>
          <p>2. <strong>Add keys here</strong> — system routes to the right provider automatically</p>
          <p>3. <strong>Students pick any model</strong> — DeepSeek, Gemini, Claude, GPT-4o — one price</p>
          <p>4. <strong>You keep the spread</strong> — wholesale API cost per student ~5-10/month</p>
        </CardContent>
      </Card>
    </div>
  )
}