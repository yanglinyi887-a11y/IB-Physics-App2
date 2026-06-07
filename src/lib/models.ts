export const AI_MODELS = [
  {
    id: "deepseek-chat",
    name: "DeepSeek-V3",
    desc: "Fast, accurate. Best for dialogue and quick reviews.",
    icon: "⚡",
    provider: "DeepSeek",
    costPer1k: 0.001,
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek-R1",
    desc: "Deep chain-of-thought reasoning. Best for complex analysis.",
    icon: "🧠",
    provider: "DeepSeek",
    costPer1k: 0.004,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    desc: "OpenAI fast model. Great all-rounder.",
    icon: "🔮",
    provider: "OpenAI",
    costPer1k: 0.002,
    baseURL: "https://api.openai.com/v1",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    desc: "OpenAI flagship. Maximum quality analysis.",
    icon: "💎",
    provider: "OpenAI",
    costPer1k: 0.015,
    baseURL: "https://api.openai.com/v1",
  },
] as const

export type ModelId = (typeof AI_MODELS)[number]["id"]

export function getModelConfig(modelId: ModelId) {
  return AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0]
}