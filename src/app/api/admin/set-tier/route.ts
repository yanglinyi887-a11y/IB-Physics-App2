import { NextRequest, NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

export async function POST(req: NextRequest) {
  try {
    const { email, tier } = await req.json()
    if (!email || !tier) return NextResponse.json({ error: "email and tier required" }, { status: 400 })
    if (!["free","pro","premium"].includes(tier)) return NextResponse.json({ error: "invalid tier" }, { status: 400 })

    const filePath = path.join(process.cwd(), "data", "users.json")
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: "no users found" }, { status: 404 })

    const raw = fs.readFileSync(filePath, "utf-8")
    const users = JSON.parse(raw)
    const idx = users.findIndex((u: any) => u.email === email)
    if (idx === -1) return NextResponse.json({ error: "user not found" }, { status: 404 })

    const oldTier = users[idx].tier
    users[idx].tier = tier
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8")

    return NextResponse.json({ success: true, email, oldTier, newTier: tier })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed" }, { status: 500 })
  }
}
