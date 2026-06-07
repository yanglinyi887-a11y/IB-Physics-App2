"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) { const data = await res.json(); setError(data.error || "Registration failed"); setLoading(false); return }
      const signInRes = await signIn("credentials", { email, password, redirect: false })
      if (signInRes?.error) { setError("Account created but sign-in failed. Try logging in."); setLoading(false) }
      else { router.push("/dashboard") }
    } catch { setError("Something went wrong"); setLoading(false) }
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
