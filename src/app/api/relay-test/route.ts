import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { baseUrl, key } = await req.json()
    if (!key) return NextResponse.json({ error: "API key is required" }, { status: 400 })

    const url = (baseUrl || "https://api.worldbase.ai/v1").replace(/\/$/, "") + "/chat/completions"
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "say ok" }],
        max_tokens: 5,
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return NextResponse.json({ error: "API returned " + res.status + ": " + text.slice(0, 300) }, { status: 400 })
    }

    const data = await res.json()
    const msg = data?.choices?.[0]?.message?.content || "(no content)"
    const model = data?.model || "unknown"
    return NextResponse.json({ message: "OK! Model: " + model + ", says: " + msg })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Connection failed" }, { status: 400 })
  }
}
