// API Key Pool - the heart of the relay station
// In production, this will be in a database.
// For now, it is a runtime store that resets on each deploy.

interface KeyPoolEntry {
  key: string
  provider: string
  totalCost: number
  usedCost: number
  active: boolean
}

interface UserQuota {
  userId: string
  totalQuota: number  // total tokens/quota purchased
  usedQuota: number   // tokens used
  resetAt: number     // timestamp
}

const keyPool: KeyPoolEntry[] = []
const userQuotas: Record<string, UserQuota> = {}

// Add a key to the pool (called when admin purchases from relay station)
export function addKeyToPool(key: string, provider: string) {
  keyPool.push({ key, provider, totalCost: 0, usedCost: 0, active: true })
}

// Get the least-used active key for a provider
export function getBestKey(provider: string): string | null {
  const keys = keyPool.filter(k => k.active && k.provider === provider)
  if (keys.length === 0) return null
  keys.sort((a, b) => a.usedCost - b.usedCost)
  return keys[0].key
}

// Track usage against a key
export function recordKeyUsage(key: string, cost: number) {
  const entry = keyPool.find(k => k.key === key)
  if (entry) entry.usedCost += cost
}

// User quota management
export function setUserQuota(userId: string, totalQuota: number) {
  userQuotas[userId] = { userId, totalQuota, usedQuota: 0, resetAt: Date.now() + 30 * 86400000 }
}

export function checkUserQuota(userId: string): boolean {
  const quota = userQuotas[userId]
  if (!quota) return false
  if (Date.now() > quota.resetAt) {
    quota.usedQuota = 0
    quota.resetAt = Date.now() + 30 * 86400000
  }
  return quota.usedQuota < quota.totalQuota
}

export function recordUserUsage(userId: string, cost: number) {
  const quota = userQuotas[userId]
  if (quota) quota.usedQuota += cost
}

export function getUserQuota(userId: string) {
  return userQuotas[userId] || null
}

export function getPoolStats() {
  return keyPool.map(k => ({
    provider: k.provider,
    active: k.active,
    usedCost: k.usedCost,
    keyPreview: k.key.slice(0, 8) + "...",
  }))
}