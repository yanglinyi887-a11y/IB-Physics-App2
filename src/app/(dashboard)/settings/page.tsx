import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader><CardTitle>Account</CardTitle><CardDescription>Manage your account settings and subscription.</CardDescription></CardHeader>
      </Card>
    </div>
  )
}