// Shared in-memory user store (replace with DB later)
export interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
  tier: string
  createdAt: Date
}

export const users: StoredUser[] = []

export function findUserByEmail(email: string) {
  return users.find(u => u.email === email) || null
}

export function addUser(user: StoredUser) {
  users.push(user)
  return user
}