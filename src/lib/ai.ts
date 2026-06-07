import { createOpenAI } from "@ai-sdk/openai"

const deepseekConfig = {
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://api.deepseek.com/v1",
  compatibility: "strict" as const,
}

export const openai = createOpenAI(deepseekConfig)

export const aiModels = {
  mini: openai("deepseek-chat"),
  full: openai("deepseek-chat"),
} as const