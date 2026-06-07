export const AI_MODELS = [
  { id: "gpt-5.4-mini",              name: "GPT-5.4 Mini",        desc: "Fast, cheap. Best for simple tasks.",          icon: "⚡", provider: "worldbase" },
  { id: "gpt-5.4",                   name: "GPT-5.4",             desc: "Balanced. Great all-rounder for IA work.",     icon: "✨", provider: "worldbase" },
  { id: "gpt-5.5",                   name: "GPT-5.5",             desc: "Flagship. Maximum quality analysis.",           icon: "✅", provider: "worldbase" },
  { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5",    desc: "Anthropic fast. Crisp, concise.",               icon: "📝", provider: "worldbase" },
  { id: "claude-sonnet-4-6",         name: "Claude Sonnet 4.6",   desc: "Anthropic balanced. Best for writing.",         icon: "🖋️", provider: "worldbase" },
  { id: "claude-opus-4-6",           name: "Claude Opus 4.6",     desc: "Anthropic flagship. Deep reasoning.",           icon: "🧵", provider: "worldbase" },
  { id: "claude-opus-4-7",           name: "Claude Opus 4.7",     desc: "Anthropic v4.7. Maximum intelligence.",         icon: "🧠", provider: "worldbase" },
  { id: "claude-opus-4-8",           name: "Claude Opus 4.8",     desc: "Anthropic latest. Best of the best.",           icon: "👑", provider: "worldbase" },
] as const

export type ModelId = (typeof AI_MODELS)[number]["id"]

export function getModelConfig(modelId: ModelId) {
  return AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0]
}
