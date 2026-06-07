"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Plus, Trash2, Zap, Globe, Cpu } from "lucide-react"

const ALL_MODELS = [
  { icon: "⚡", name: "DeepSeek-V3", provider: "DeepSeek" },
  { icon: "🧠", name: "DeepSeek-R1", provider: "DeepSeek" },
  { icon: "🌐", name: "Gemini 2.0 Flash", provider: "Google" },
  { icon: "🌟", name: "Gemini 2.5 Pro", provider: "Google" },
  { icon: "📝", name: "Claude 3.5 Haiku", provider: "Anthropic" },
  { icon: "🎯", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { icon: "💎", name: "Claude 4 Opus", provider: "Anthropic" },
  { icon: "🔮", name: "GPT-4o Mini", provider: "OpenAI" },
  { icon: "✨", name: "GPT-4o", provider: "OpenAI" },
]

export default function RelayPage() {
  const [keys, setKeys] = useState<Array<{ id: string; label: string; keyPreview: string; active: boolean }>>([])
  const [newKey, setNewKey] = useState("")
  const [keyLabel, setKeyLabel] = useState("")

  const addKey = () => { if (!newKey.trim()) return; setKeys(prev => [...prev, { id: crypto.randomUUID(), label: keyLabel || "Relay Key", keyPreview: newKey.slice(0, 15) + "...", active: true }]); setNewKey(""); setKeyLabel("") }
  const toggleKey = (id: string) => { setKeys(prev => prev.map(k => k.id === id ? { ...k, active: !k.active } : k)) }
  const removeKey = (id: string) => { setKeys(prev => prev.filter(k => k.id !== id)) }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Key className="w-6 h-6 text-emerald-400" /> API Relay Station</h1>
        <p className="text-zinc-400 mt-1">One key, 9 models. Buy from api2d.com, paste here, done.</p>
      </div>

      <Tabs defaultValue="setup">
        <TabsList className="w-full bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="setup" className="flex-1"><Zap className="w-4 h-4 mr-1" /> Setup</TabsTrigger>
          <TabsTrigger value="models" className="flex-1"><Cpu className="w-4 h-4 mr-1" /> Models (9)</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4 mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-lg">Add Relay Key</CardTitle>
              <CardDescription>
                Go to{" "}
                <a href="https://api2d.com" target="_blank" className="text-emerald-400 hover:underline font-medium">api2d.com</a>
                {" "}(WeChat/Alipay) and get an API key. Paste it here. All 9 models work through one key.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Input value={keyLabel} onChange={e => setKeyLabel(e.target.value)} placeholder="Label (e.g. api2d-pro)" className="w-[180px] bg-zinc-900 border-zinc-700 text-sm" />
                  <Input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="sk-..." className="flex-1 bg-zinc-900 border-zinc-700 font-mono text-sm" />
                  <Button onClick={addKey} className="bg-emerald-500 hover:bg-emerald-400 text-black"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                </div>
                <p className="text-xs text-zinc-500">
                  Then add to Vercel env: <code className="text-emerald-400">RELAY_BASE_URL</code> = <code className="text-zinc-300">https://api.api2d.com/v1</code>{" "}
                  <code className="text-emerald-400">RELAY_KEY</code> = your key
                </p>
              </div>
            </CardContent>
          </Card>

          {keys.length > 0 && (
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader><CardTitle className="text-lg">Saved Keys</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {keys.map(k => (
                    <div key={k.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-zinc-300">{k.label}</span>
                        <code className="text-sm text-zinc-500">{k.keyPreview}</code>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`cursor-pointer text-xs ${k.active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`} onClick={() => toggleKey(k.id)}>{k.active ? "Active" : "Paused"}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeKey(k.id)} className="text-red-400 h-7 w-7 p-0"><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader><CardTitle className="text-lg">How it works</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <p><strong className="text-emerald-400">1. Buy one key</strong> from api2d.com (WeChat/Alipay, ¥50 goes a long way)</p>
              <p><strong className="text-emerald-400">2. Paste it here + set Vercel env vars</strong> — RELAY_BASE_URL + RELAY_KEY</p>
              <p><strong className="text-emerald-400">3. All 9 models work instantly</strong> — DeepSeek, Gemini, Claude, GPT-4o — through one key</p>
              <p><strong className="text-emerald-400">4. Students pay you ¥59-128/month</strong> — they pick any model, you pay wholesale</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-lg">All Available Models</CardTitle>
              <CardDescription>Students see these in the model selector. All same price. You pay wholesale, they pay retail.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                {ALL_MODELS.map(m => (
                  <div key={m.name} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <span className="text-lg">{m.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-[10px] text-zinc-500">{m.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}