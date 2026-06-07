import { createOpenAI } from "@ai-sdk/openai"
import type { ModelId } from "@/lib/models"
import { getModelConfig } from "@/lib/models"

const deepseekClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://api.deepseek.com/v1",
} as any)

const openaiClient = process.env.OPENAI_API_KEY2
  ? createOpenAI({
      apiKey: process.env.OPENAI_API_KEY2,
      baseURL: "https://api.openai.com/v1",
    } as any)
  : null

export function getModel(modelId: ModelId) {
  const config = getModelConfig(modelId)
  if (config.provider === "OpenAI") {
    if (!openaiClient) return deepseekClient("deepseek-chat")
    return openaiClient(modelId)
  }
  return deepseekClient(modelId)
}