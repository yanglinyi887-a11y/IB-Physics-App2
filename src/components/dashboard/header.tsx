"use client"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Props { user: { name?: string | null; email?: string | null; image?: string | null; tier?: string } }

export function DashboardHeader({ user }: Props) {
  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"

  return (
    <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="h-14 px-6 flex items-center justify-between">
        <Link href="" className="font-bold text-lg tracking-tight">Physics IA</Link>
        <div className="flex items-center gap-3">
          {user.tier && user.tier !== "free" ? (
            <Badge className={user.tier === "pro" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}>{user.tier}</Badge>
          ) : (
            <Badge variant="outline" className="text-zinc-500 border-zinc-700">Free</Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 cursor-pointer"><AvatarFallback className="bg-zinc-700 text-xs">{initials}</AvatarFallback></Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm text-zinc-400 truncate">{user.email}</div>
              <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
