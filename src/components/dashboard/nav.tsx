"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Lightbulb, MessageCircle, FileSearch, BarChart3, BookOpen, Settings, Edit3, TrendingUp, Crown, Key } from "lucide-react"

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/editor", label: "IA Editor", icon: Edit3 },
  { href: "/dashboard/topics", label: "Topic Generator", icon: Lightbulb },
  { href: "/dashboard/coach", label: "AI Coach", icon: MessageCircle },
  { href: "/dashboard/review", label: "Draft Review", icon: FileSearch },
  { href: "/dashboard/analysis", label: "Data Analysis", icon: BarChart3 },
  { href: "/dashboard/exemplars", label: "Exemplar Library", icon: BookOpen },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/premium", label: "Premium", icon: Crown },
  { href: "/dashboard/relay", label: "Relay Station", icon: Key },
]

export function DashboardNav() {
  const pathname = usePathname()
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 border-r border-zinc-800 bg-zinc-950/50 hidden lg:block overflow-y-auto">
      <nav className="p-4 space-y-1">
        {links.map(l => {
          const active = pathname === l.href || pathname.startsWith(l.href + "/")
          return (
            <Link key={l.href} href={l.href} className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}>
              <l.icon className="w-4 h-4" /> {l.label}
            </Link>
          )
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
        <Link href="/dashboard/settings" className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors",
          pathname === "/dashboard/settings" && "bg-zinc-800 text-white"
        )}>
          <Settings className="w-4 h-4" /> Settings
        </Link>
      </div>
    </aside>
  )
}