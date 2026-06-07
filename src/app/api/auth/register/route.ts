import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { findUserByEmail, addUser } from "@/lib/user-store"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: "Email and password (min 8 chars) required" }, { status: 400 })
    }
    const existing = findUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    addUser({ id: crypto.randomUUID(), name, email, passwordHash, tier: "free", createdAt: new Date() })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
