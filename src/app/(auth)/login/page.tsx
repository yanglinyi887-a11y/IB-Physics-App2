"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ParticleBackground } from "@/components/ui/particle-background"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Step 1: Get CSRF token
      const csrfRes = await fetch("/api/auth/csrf")
      const csrfData = await csrfRes.json()
      const csrfToken = csrfData.csrfToken

      if (!csrfToken) {
        setError("????????????????")
        setLoading(false)
        return
      }

      // Step 2: Submit credentials
      const formData = new URLSearchParams()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("csrfToken", csrfToken)
      formData.append("callbackUrl", "/dashboard")
      formData.append("json", "true")

      const loginRes = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      })

      if (loginRes.ok) {
        router.push("/dashboard")
      } else if (loginRes.status === 302 || loginRes.redirected) {
        router.push("/dashboard")
      } else {
        const data = await loginRes.json().catch(() => ({}))
        setError(data.url ? "?????????..." : "???????")
        if (data.url) router.push(data.url)
      }
    } catch {
      setError("????????")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 relative">
      <ParticleBackground />
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/80 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to Physics IA Coach</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-3">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.edu" required /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required /></div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
          </form>
          <p className="text-center text-sm text-zinc-400">Don&apos;t have an account? <Link href="/register" className="text-emerald-400 hover:underline">Sign up</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
