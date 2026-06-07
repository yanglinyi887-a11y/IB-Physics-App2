const fs = require("fs");
const dir = "src/app/api/relay-test";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/route.ts", `import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { baseUrl, key } = await req.json()
    if (!key) return NextResponse.json({ error: "API key is required" }, { status: 400 })

    const url = (baseUrl || "https://api.api2d.com/v1").replace(/\/$/, "") + "/models"
    const res = await fetch(url, {
      headers: { Authorization: \`Bearer \${key}\` },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return NextResponse.json({ error: \`API returned \${res.status}: \${text.slice(0, 200)}\` }, { status: 400 })
    }

    const data = await res.json()
    const modelCount = Array.isArray(data?.data) ? data.data.length : "unknown"
    return NextResponse.json({ message: \`Connected! Found \${modelCount} models available.\` })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Connection failed" }, { status: 400 })
  }
}
`);
console.log("done");
