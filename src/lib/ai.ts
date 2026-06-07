import { createOpenAI } from "@ai-sdk/openai"
import type { ModelId } from "@/lib/models"

const relayURL = process.env.RELAY_BASE_URL
const relayKey = process.env.RELAY_KEY

let relayClient: ReturnType<typeof createOpenAI> | null = null
if (relayURL && relayKey) {
  relayClient = createOpenAI({ apiKey: relayKey, baseURL: relayURL } as any)
}

export function getModel(modelId: ModelId) {
  if (relayClient) {
    return relayClient(modelId)
  }

  // Fallback: try DeepSeek with OPENAI_API_KEY
  const dsKey = process.env.OPENAI_API_KEY
  if (dsKey) {
    const ds = createOpenAI({ apiKey: dsKey, baseURL: "https://api.deepseek.com/v1" } as any)
    return ds("deepseek-chat")
  }

  throw new Error("No API key configured. Set RELAY_KEY or OPENAI_API_KEY in env.")
}
