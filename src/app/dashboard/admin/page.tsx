"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, RefreshCw, CheckCircle2, XCircle } from "lucide-react"

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/list-users")
      const data = await res.json()
      setUsers(data.users || [])
    } catch {}
  }

  useEffect(() => { loadUsers() }, [])

  const setTier = async (email: string, tier: string) => {
    setMessage("")
    try {
      const res = await fetch("/api/admin/set-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(email + ": " + data.oldTier + " -> " + data.newTier)
        loadUsers()
      } else {
        setMessage("Error: " + data.error)
      }
    } catch {
      setMessage("Network error")
    }
  }

  const filtered = search ? users.filter((u: any) => u.email.toLowerCase().includes(search.toLowerCase())) : users

  const tierColor: Record<string, string> = {
    free: "bg-zinc-500/10 text-zinc-400",
    pro: "bg-emerald-500/10 text-emerald-400",
    premium: "bg-amber-500/10 text-amber-400",
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-amber-400" /> Admin Panel</h1>
        <p className="text-zinc-400 mt-1">Manage user tiers. After someone pays, find them here and upgrade.</p>
      </div>

      <div className="flex gap-3">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="bg-zinc-900 border-zinc-700 flex-1"
        />
        <Button variant="outline" size="icon" onClick={loadUsers}><RefreshCw className="w-4 h-4" /></Button>
      </div>

      {message && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {message}
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((u: any) => (
          <Card key={u.id || u.email} className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-sm">{u.name || "No name"}</p>
                  <p className="text-xs text-zinc-400">{u.email}</p>
                </div>
                <Badge className={tierColor[u.tier] || tierColor.free + " text-xs"}>{u.tier}</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={u.tier === "free" ? "default" : "outline"} className={u.tier === "free" ? "bg-zinc-600" : ""} onClick={() => setTier(u.email, "free")}>Free</Button>
                <Button size="sm" variant={u.tier === "pro" ? "default" : "outline"} className={u.tier === "pro" ? "bg-emerald-500 text-black" : ""} onClick={() => setTier(u.email, "pro")}>Pro</Button>
                <Button size="sm" variant={u.tier === "premium" ? "default" : "outline"} className={u.tier === "premium" ? "bg-amber-500 text-black" : ""} onClick={() => setTier(u.email, "premium")}>Premium</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <Search className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}
