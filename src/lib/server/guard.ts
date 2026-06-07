import { auth } from "@/lib/auth"

interface RateLimitStore {
  [userId: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

const LIMITS: Record<string, number> = {
  free: 3,
  pro: 50,
  premium: 200,
}

export async function checkAuth(): Promise<{ userId: string; tier: string } | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  return { userId: session.user.id, tier: (session.user as any).tier || "free" }
}

export function checkRateLimit(userId: string, tier: string): boolean {
  const now = Date.now()
  const entry = store[userId]
  
  if (!entry || now > entry.resetTime) {
    store[userId] = { count: 1, resetTime: now + 3600000 }
    return true
  }
  
  const limit = LIMITS[tier] || LIMITS.free
  if (entry.count >= limit) return false
  
  entry.count++
  return true
}

export function getRemainingQuota(userId: string, tier: string): number {
  const now = Date.now()
  const entry = store[userId]
  if (!entry || now > entry.resetTime) return LIMITS[tier] || LIMITS.free
  return Math.max(0, (LIMITS[tier] || LIMITS.free) - entry.count)
}