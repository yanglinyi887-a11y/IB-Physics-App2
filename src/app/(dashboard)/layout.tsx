import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen bg-zinc-950">
      <DashboardHeader user={session.user} />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6 pt-20 lg:pl-64">
          {children}
        </main>
      </div>
    </div>
  )
}