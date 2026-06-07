import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Placeholder - replace with Prisma
const users: Array<{ id: string; name: string; email: string; passwordHash: string; tier: string; createdAt: Date }> = []

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: "Email and password (min 8 chars) required" }, { status: 400 })
    }
    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const user = { id: crypto.randomUUID(), name, email, passwordHash, tier: "free", createdAt: new Date() }
    users.push(user)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}