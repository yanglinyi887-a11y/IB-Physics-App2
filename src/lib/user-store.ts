import fs from "node:fs"
import path from "node:path"

const IS_VERCEL = !!process.env.VERCEL;

// On Vercel, try /tmp first, then fall back to deployed data/users.json
// Writes go to /tmp, reads check both
const DATA_FILE = IS_VERCEL ? "/tmp/users.json" : path.join(process.cwd(), "data", "users.json");
const DEPLOYED_FILE = IS_VERCEL ? path.join(process.cwd(), "data", "users.json") : null;

export interface StoredUser {
  id: string
  name: string | null
  email: string
  passwordHash: string
  tier: string
  createdAt: string
}

function readUsers(): StoredUser[] {
  const tmpUsers = readFile(DATA_FILE);
  // On Vercel, also check deployed file for users that were committed via git
  if (IS_VERCEL && DEPLOYED_FILE) {
    const deployedUsers = readFile(DEPLOYED_FILE);
    if (deployedUsers.length > 0) {
      // Merge: tmp users take precedence (newer)
      const merged = [...deployedUsers];
      for (const tu of tmpUsers) {
        const idx = merged.findIndex(u => u.email === tu.email);
        if (idx >= 0) merged[idx] = tu;
        else merged.push(tu);
      }
      return merged;
    }
  }
  return tmpUsers;
}

function readFile(filePath: string): StoredUser[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as StoredUser[];
  } catch {
    return [];
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
