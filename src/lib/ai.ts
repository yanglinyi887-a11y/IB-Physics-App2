import { createOpenAI } from "@ai-sdk/openai"
import type { ModelId } from "@/lib/models"
import { getModelConfig } from "@/lib/models"

// Provider configurations - all via OpenAI-compatible relay endpoints
// Add keys in Vercel env: DEEPSEEK_KEY, OPENAI_KEY, GEMINI_KEY, ANTHROPIC_KEY

const providers: Record<string, ReturnType<typeof createOpenAI> | null> = {}

function getProvider(name: string, envKey: string, baseURL: string) {
  if (providers[name]) return providers[name]
  const key = process.env[envKey]
  if (!key) return null
  providers[name] = createOpenAI({ apiKey: key, baseURL } as any)
  return providers[name]
}

// Maps model provider to env var + base URL
// For relay stations like api2d, all models use the same base URL
const PROVIDER_MAP: Record<string, { envKey: string; baseURL: string }> = {
  DeepSeek:   { envKey: "OPENAI_API_KEY", baseURL: "https://api.deepseek.com/v1" },
  OpenAI:     { envKey: "OPENAI_KEY2",    baseURL: "https://api.openai.com/v1" },
  Google:     { envKey: "GEMINI_KEY",     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai" },
  Anthropic:  { envKey: "ANTHROPIC_KEY",  baseURL: "https://api.anthropic.com/v1" },
}

export function getModel(modelId: ModelId) {
  const config = getModelConfig(modelId)
  const pmap = PROVIDER_MAP[config.provider]
  if (!pmap) return getFallback()

  const client = getProvider(config.provider, pmap.envKey, pmap.baseURL)
  if (!client) {
    console.warn(`No key for ${config.provider}, falling back to DeepSeek`)
    return getFallback()
  }

  return client(modelId)
}

function getFallback() {
  return createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: "https://api.deepseek.com/v1",
  } as any)("deepseek-chat")
}