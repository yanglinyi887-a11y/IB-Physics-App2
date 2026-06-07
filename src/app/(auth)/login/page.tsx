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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) { setError("Invalid email or password"); setLoading(false) }
    else { router.push("/dashboard") }
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
          
          
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.edu" required /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required /></div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
          </form>
          <p className="text-center text-sm text-zinc-400">Don&apos;t have an account? <Link href="/register" className="text-emerald-400 hover:underline">Sign up</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}