"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Loader2 } from "lucide-react"
import { ModelSelector } from "@/components/dashboard/model-selector"
import type { ModelId } from "@/lib/models"

interface Message { role: "user" | "assistant"; content: string }

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I am your IB Physics IA coach. Tell me where you are in your IA journey — need a topic? Stuck on data analysis? Want me to review a section? I will guide you step by step.",
}

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState<ModelId>("gpt-5.4-mini")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })), model }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const reader = res.body?.getReader()
      if (!reader) throw new Error("No reader")
      const decoder = new TextDecoder()
      let assistantContent = ""
      setMessages(prev => [...prev, { role: "assistant", content: "" }])
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value, { stream: true })
        setMessages(prev => { const copy = [...prev]; copy[copy.length - 1] = { role: "assistant", content: assistantContent }; return copy })
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: e.message || "Sorry, something went wrong." }])
    } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Model selector toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <ModelSelector value={model} onChange={setModel} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-2 mt-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs">AI</AvatarFallback></Avatar>
            )}
            <Card className={`max-w-[80%] ${m.role === "user" ? "bg-emerald-500/10 border-emerald-500/30" : "border-zinc-800 bg-zinc-900/50"}`}>
              <CardContent className="p-3 text-sm whitespace-pre-wrap">{m.content || (loading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}</CardContent>
            </Card>
            {m.role === "user" && (
              <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-zinc-700 text-xs">You</AvatarFallback></Avatar>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-zinc-800 pt-4 flex gap-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Ask about your IA... (e.g. How should I structure my Research Design?)"
          className="min-h-[60px] resize-none bg-zinc-900 border-zinc-700" disabled={loading} />
        <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="h-[60px] w-[60px] shrink-0">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  )
}