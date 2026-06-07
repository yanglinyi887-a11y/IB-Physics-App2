export const AI_MODELS = [
  { id: "deepseek-chat", name: "DeepSeek-V3", desc: "Fast, accurate. Best for dialogue.", icon: "⚡", provider: "DeepSeek" },
  { id: "deepseek-reasoner", name: "DeepSeek-R1", desc: "Deep reasoning. Complex analysis.", icon: "🧠", provider: "DeepSeek" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", desc: "Google fast model. Great for quick tasks.", icon: "🌐", provider: "Google" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", desc: "Google flagship. Long context, deep reasoning.", icon: "🌟", provider: "Google" },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", desc: "Anthropic fast model. Crisp, concise.", icon: "📝", provider: "Anthropic" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", desc: "Anthropic balanced. Best all-around for writing.", icon: "🎯", provider: "Anthropic" },
  { id: "claude-4-opus", name: "Claude 4 Opus", desc: "Anthropic flagship. Maximum intelligence.", icon: "💎", provider: "Anthropic" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", desc: "OpenAI fast. Great all-rounder.", icon: "🔮", provider: "OpenAI" },
  { id: "gpt-4o", name: "GPT-4o", desc: "OpenAI flagship. Max quality analysis.", icon: "✨", provider: "OpenAI" },
] as const

export type ModelId = (typeof AI_MODELS)[number]["id"]

export function getModelConfig(modelId: ModelId) {
  return AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0]
}