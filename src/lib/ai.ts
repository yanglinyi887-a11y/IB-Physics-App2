import { createOpenAI } from "@ai-sdk/openai"

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://api.deepseek.com",
})

export const aiModels = {
  mini: openai("deepseek-chat"),
  full: openai("deepseek-chat"),
} as const