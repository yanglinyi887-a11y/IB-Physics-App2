import fs from "node:fs"
import path from "node:path"

const DATA_FILE = process.env.VERCEL ? "/tmp/users.json" : path.join(process.cwd(), "data", "users.json")

export interface StoredUser {
  id: string
  name: string | null
  email: string
  passwordHash: string
  tier: string
  createdAt: string
}

function seedFromDeploy(): void {
  const deployFile = path.join(process.cwd(), "data", "users.json");
  if (!fs.existsSync(DATA_FILE) && fs.existsSync(deployFile)) {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(deployFile, DATA_FILE);
    } catch {}
  }
}

function readUsers(): StoredUser[] {
  seedFromDeploy();
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const raw = fs.readFileSync(DATA_FILE, "utf-8")
    return JSON.parse(raw) as StoredUser[]
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]): void {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf-8")
}

export function findUserByEmail(email: string): StoredUser | null {
  const users = readUsers()
  return users.find(u => u.email === email) ?? null
}



export function addUser(user: {
  id: string
  name: string | null
  email: string
  passwordHash: string
  tier: string
  createdAt: Date | string
}): StoredUser {
  const users = readUsers()
  const newUser: StoredUser = {
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    passwordHash: user.passwordHash,
    tier: user.tier,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
  }
  users.push(newUser)
  writeUsers(users)
  return newUser
}
