const fs = require("fs");

const content = `"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Zap, Cpu, ExternalLink, CheckCircle2, XCircle, Loader2 } from "lucide-react"

const ALL_MODELS = [
  { id: "deepseek-chat", name: "DeepSeek-V3", provider: "DeepSeek", desc: "Fast, accurate. Best for dialogue." },
  { id: "deepseek-reasoner", name: "DeepSeek-R1", provider: "DeepSeek", desc: "Deep reasoning. Complex analysis." },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", desc: "Fast model for quick tasks." },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", desc: "Long context, deep reasoning." },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", desc: "Crisp, concise responses." },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", desc: "Best all-around for writing." },
  { id: "claude-4-opus", name: "Claude 4 Opus", provider: "Anthropic", desc: "Maximum intelligence." },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", desc: "Fast all-rounder." },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", desc: "Max quality analysis." },
]

export default function RelayPage() {
  const [relayUrl, setRelayUrl] = useState("https://api.api2d.com/v1")
  const [relayKey, setRelayKey] = useState("")
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/relay-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: relayUrl, key: relayKey }),
      })
      const data = await res.json()
      setTestResult({ ok: res.ok, msg: data.message || data.error || "Unknown" })
    } catch {
      setTestResult({ ok: false, msg: "Network error - is the server running?" })
    }
    setTesting(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Key className="w-6 h-6 text-emerald-400" /> API Settings</h1>
        <p className="text-zinc-400 mt-1">Connect your API key to activate AI Coach, Draft Review, and Topic Generator.</p>
      </div>

      <Tabs defaultValue="setup">
        <TabsList className="w-full bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="setup" className="flex-1"><Zap className="w-4 h-4 mr-1" /> Setup</TabsTrigger>
          <TabsTrigger value="models" className="flex-1"><Cpu className="w-4 h-4 mr-1" /> Models (9)</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4 mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-lg">Step 1: Buy an API key</CardTitle>
              <CardDescription>One key, all models. The cheapest way to access GPT-4o, Claude, Gemini, and DeepSeek.</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="https://api2d.com" target="_blank" className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                Open api2d.com <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-sm text-zinc-400 mt-3">
                Register with email, top up via WeChat/Alipay, copy your API key.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-lg">Step 2: Enter your key</CardTitle>
              <CardDescription>Paste your api2d key and base URL below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Relay URL</label>
                <Input
                  value={relayUrl}
                  onChange={e => setRelayUrl(e.target.value)}
                  placeholder="https://api.api2d.com/v1"
                  className="bg-zinc-900 border-zinc-700 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">API Key</label>
                <Input
                  value={relayKey}
                  onChange={e => setRelayKey(e.target.value)}
                  placeholder="fk..."
                  type="password"
                  className="bg-zinc-900 border-zinc-700 font-mono text-sm"
                />
              </div>
              <Button
                onClick={handleTest}
                disabled={!relayKey || testing}
                className="bg-emerald-500 hover:bg-emerald-400 text-black"
              >
                {testing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Zap className="w-4 h-4 mr-1" />}
                {testing ? "Testing..." : "Test Connection"}
              </Button>

              {testResult && (
                <div className={\`flex items-center gap-2 p-3 rounded-lg text-sm \${
                  testResult.ok ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"
                }\`}>
                  {testResult.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {testResult.msg}
                </div>
              )}

              {testResult?.ok && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-300">
                  <strong>Connection works!</strong> To make it permanent, add these to your Vercel project Environment Variables:<br />
                  <code className="text-white">RELAY_BASE_URL</code> = <code className="text-zinc-300">{relayUrl}</code><br />
                  <code className="text-white">RELAY_KEY</code> = <code className="text-zinc-300">{relayKey.slice(0, 8)}...</code>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-lg">Step 3: Deploy to Vercel</CardTitle>
              <CardDescription>Set the environment variables in Vercel and redeploy.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
                <li>Go to your <a href="https://vercel.com/dashboard" target="_blank" className="text-emerald-400 hover:underline">Vercel Dashboard</a></li>
                <li>Open your project - Settings - Environment Variables</li>
                <li>Add <code className="text-white bg-zinc-800 px-1 rounded">RELAY_BASE_URL</code> = your relay URL</li>
                <li>Add <code className="text-white bg-zinc-800 px-1 rounded">RELAY_KEY</code> = your API key</li>
                <li>Redeploy (or push to GitHub to auto-deploy)</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-lg">All Available Models</CardTitle>
              <CardDescription>Once your key is connected, all 9 models work through one api2d key.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                {ALL_MODELS.map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-[10px] text-zinc-500">{m.provider} - {m.desc}</p>
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
`;

fs.writeFileSync("src/app/dashboard/relay/page.tsx", content, "utf8");
console.log("done");
