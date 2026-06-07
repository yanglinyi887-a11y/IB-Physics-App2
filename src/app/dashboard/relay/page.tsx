"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Zap, Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function RelayPage() {
  const [relayUrl, setRelayUrl] = useState("http://api.worldbase.ai/v1")
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
      setTestResult({ ok: false, msg: "网络错误，请检查服务器是否运行" })
    }
    setTesting(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Key className="w-6 h-6 text-emerald-400" /> API 中转站</h1>
        <p className="text-zinc-400 mt-1">
          这里负责连接 AI 模型。<br />
          你在 worldbase.ai 买的 API Key 填在这里，所有 AI 功能（Coach、Review、Topic生成）就能用了。
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-lg">步骤 1：获取 API Key</CardTitle>
          <CardDescription>去 worldbase.ai 注册、充值、复制你的 API Key。一个 Key 通用所有 8 款模型。</CardDescription>
        </CardHeader>
        <CardContent>
          <a href="https://worldbase.ai" target="_blank" className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
            打开 worldbase.ai 买 Key →
          </a>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-lg">步骤 2：输入你的 Key</CardTitle>
          <CardDescription>粘贴 API Key，点击测试。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">中转地址</label>
            <Input value={relayUrl} onChange={e => setRelayUrl(e.target.value)}
              className="bg-zinc-900 border-zinc-700 font-mono text-sm" />
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">API Key</label>
            <Input value={relayKey} onChange={e => setRelayKey(e.target.value)}
              placeholder="sk-..." type="password"
              className="bg-zinc-900 border-zinc-700 font-mono text-sm" />
          </div>
          <Button onClick={handleTest} disabled={!relayKey || testing}
            className="bg-emerald-500 hover:bg-emerald-400 text-black">
            {testing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Zap className="w-4 h-4 mr-1" />}
            {testing ? "测试中..." : "测试连接"}
          </Button>

          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              testResult.ok ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}>
              {testResult.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {testResult.msg}
            </div>
          )}

          {testResult?.ok && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-300">
              <strong>连接成功！</strong> 为了永久保存，请在 Vercel 项目设置中添加环境变量：<br />
              <code className="text-white">RELAY_BASE_URL</code> = <code className="text-zinc-300">{relayUrl}</code><br />
              <code className="text-white">RELAY_KEY</code> = <code className="text-zinc-300">{relayKey.slice(0, 8)}...</code>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-lg">步骤 3：保存到 Vercel</CardTitle>
          <CardDescription>在 Vercel 项目设置中添加环境变量，重新部署即可。</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
            <li>打开 <a href="https://vercel.com/dashboard" target="_blank" className="text-emerald-400 hover:underline">Vercel Dashboard</a></li>
            <li>项目 → Settings → Environment Variables</li>
            <li>添加 <code className="text-white bg-zinc-800 px-1 rounded">RELAY_BASE_URL</code> = {relayUrl}</li>
            <li>添加 <code className="text-white bg-zinc-800 px-1 rounded">RELAY_KEY</code> = 你的 Key</li>
            <li>Redeploy（或 push 到 GitHub 自动部署）</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
