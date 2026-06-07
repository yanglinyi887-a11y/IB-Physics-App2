import { createOpenAI } from "@ai-sdk/openai"
import type { ModelId } from "@/lib/models"
import { getModelConfig } from "@/lib/models"

// Universal Relay Mode: set RELAY_BASE_URL + RELAY_KEY in env
// Points to a single relay station (api2d, openai-hk, etc.)
// All 9 models route through this one endpoint
const relayURL = process.env.RELAY_BASE_URL
const relayKey = process.env.RELAY_KEY

let relayClient: ReturnType<typeof createOpenAI> | null = null
if (relayURL && relayKey) {
  relayClient = createOpenAI({ apiKey: relayKey, baseURL: relayURL } as any)
}

// Individual provider keys (fallback if no relay)
const providerClients: Record<string, ReturnType<typeof createOpenAI> | null> = {}

const PROVIDER_MAP: Record<string, { envKey: string; baseURL: string }> = {
  DeepSeek:   { envKey: "OPENAI_API_KEY", baseURL: "https://api.deepseek.com/v1" },
  OpenAI:     { envKey: "OPENAI_KEY2",    baseURL: "https://api.openai.com/v1" },
  Google:     { envKey: "GEMINI_KEY",     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai" },
  Anthropic:  { envKey: "ANTHROPIC_KEY",  baseURL: "https://api.anthropic.com/v1" },
}

function getProviderClient(provider: string) {
  // Universal relay takes priority
  if (relayClient) return relayClient

  // Check individual provider
  if (providerClients[provider]) return providerClients[provider]
  const pmap = PROVIDER_MAP[provider]
  if (!pmap) return null
  const key = process.env[pmap.envKey]
  if (!key) return null
  providerClients[provider] = createOpenAI({ apiKey: key, baseURL: pmap.baseURL } as any)
  return providerClients[provider]
}

export function getModel(modelId: ModelId) {
  const config = getModelConfig(modelId)
  const client = getProviderClient(config.provider)
  if (!client) {
    // Fallback chain: DeepSeek -> error
    const ds = getProviderClient("DeepSeek")
    if (ds) return ds("deepseek-chat")
    throw new Error("No API key configured. Add keys in Relay Station or set RELAY_KEY env.")
  }
  return client(modelId)
}