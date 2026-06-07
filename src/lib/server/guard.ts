import { auth } from "@/lib/auth"
import { checkUserQuota, recordUserUsage, getBestKey, recordKeyUsage } from "@/lib/server/key-pool"

interface RateLimitStore {
  [userId: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}
const LIMITS: Record<string, number> = { free: 3, pro: 50, premium: 200 }

export async function checkAuth(): Promise<{ userId: string; tier: string } | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  return { userId: session.user.id, tier: (session.user as any).tier || "free" }
}

export function checkRateLimit(userId: string, tier: string): boolean {
  const now = Date.now()
  const entry = store[userId]
  const limit = LIMITS[tier] || LIMITS.free

  if (!entry || now > entry.resetTime) {
    store[userId] = { count: 1, resetTime: now + 3600000 }
    return true
  }

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

// Route API call through the key pool
export async function routeAPI(provider: string, userId: string): Promise<string | null> {
  // First check user quota
  if (!checkUserQuota(userId)) {
    console.log(`User ${userId} quota exceeded`)
    return null
  }

  // Get the best key from pool
  const key = getBestKey(provider)
  if (!key) {
    console.log(`No active key for provider ${provider}`)
    return null
  }

  return key
}