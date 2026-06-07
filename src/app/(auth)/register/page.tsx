"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ParticleBackground } from "@/components/ui/particle-background"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Step 1: Register
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (!regRes.ok) {
        const data = await regRes.json().catch(() => ({}))
        setError(data.error || "????")
        setLoading(false)
        return
      }

      // Step 2: Auto-login with CSRF
      const csrfRes = await fetch("/api/auth/csrf")
      const csrfData = await csrfRes.json()
      const csrfToken = csrfData.csrfToken

      if (!csrfToken) {
        // Try signIn as fallback
        const { signIn } = await import("next-auth/react")
        const si = await signIn("credentials", { email, password, redirect: false })
        if (si?.ok) { router.push("/dashboard") }
        else { setError("???????????"); setLoading(false) }
        return
      }

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

      if (loginRes.ok || loginRes.redirected) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    } catch {
      setError("????????")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 relative">
      <ParticleBackground />
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/80 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Start your 7-day free Pro trial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-3">
            <div><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.edu" required /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} /></div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Start free trial"}</Button>
          </form>
          <p className="text-center text-sm text-zinc-400">Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
