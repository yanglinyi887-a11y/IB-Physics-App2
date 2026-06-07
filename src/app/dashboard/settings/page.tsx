import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Shield } from "lucide-react"
import Link from "next/link"
import { SignOutButton } from "./signout-btn"

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user as any
  const tier = user?.tier || "free"
  const email = user?.email || ""

  const tierColor: Record<string, string> = {
    free: "text-zinc-400 border-zinc-700",
    pro: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    premium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-zinc-400" /> Account</CardTitle>
          <CardDescription>Your account information and subscription.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-400">Email</p>
                <p className="font-medium">{email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800">
            <div>
              <p className="text-sm text-zinc-400">Current Plan</p>
              <Badge className={"mt-1 " + tierColor[tier]}>
                {tier === "free" ? "Free" : tier === "pro" ? "Pro" : "Premium"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950 border border-zinc-800">
            <div>
              <p className="text-sm text-zinc-400">Usage Limit</p>
              <p className="font-medium">
                {tier === "free" ? "3 AI requests / hour" : tier === "pro" ? "50 AI requests / hour" : "200 AI requests / hour"}
              </p>
            </div>
          </div>

          {tier !== "premium" && (
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm text-emerald-400 font-medium mb-2">Want more?</p>
              <p className="text-xs text-zinc-400 mb-3">
                {tier === "free"
                  ? "Upgrade to Pro for 50 requests/hour + all 8 AI models."
                  : "Upgrade to Premium for 200 requests/hour + Devil Deep Review."}
              </p>
              <Link href="/dashboard/premium">
                <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-black h-9 px-4 py-2">
                  Upgrade
                </span>
              </Link>
            </div>
          )}

          <SignOutButton />
        </CardContent>
      </Card>
    </div>
  )
}
