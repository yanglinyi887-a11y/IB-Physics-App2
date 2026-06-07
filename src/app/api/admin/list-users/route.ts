import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "users.json");
    if (!fs.existsSync(filePath)) return NextResponse.json({ users: [] })
    const raw = fs.readFileSync(filePath, "utf-8")
    const users = JSON.parse(raw)
    const safe = users.map((u: any) => ({ id: u.id, name: u.name, email: u.email, tier: u.tier, createdAt: u.createdAt }))
    return NextResponse.json({ users: safe })
  } catch {
    return NextResponse.json({ users: [] })
  }
}