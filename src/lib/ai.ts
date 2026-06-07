import { createOpenAI } from "@ai-sdk/openai"

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const aiModels = {
  mini: openai("gpt-4o-mini"),
  full: openai("gpt-4o"),
} as const