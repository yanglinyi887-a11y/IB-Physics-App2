export const AI_MODELS = [
  {
    id: "deepseek-chat",
    name: "DeepSeek-V3",
    desc: "Fast & accurate. Best for dialogue and quick reviews.",
    icon: "⚡",
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek-R1",
    desc: "Deep reasoning. Best for complex analysis and Devil Examiner.",
    icon: "🧠",
  },
] as const

export type ModelId = (typeof AI_MODELS)[number]["id"]