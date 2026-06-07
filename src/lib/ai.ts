import { createOpenAI } from "@ai-sdk/openai"
import type { ModelId } from "@/lib/models"

const deepseekConfig = {
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://api.deepseek.com/v1",
  compatibility: "strict" as const,
}

export const openai = createOpenAI(deepseekConfig)

export function getModel(modelId: ModelId) {
  return openai(modelId)
}