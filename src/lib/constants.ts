export const PRICING = {
  pro: {
    original: 99,
    current: 59,
    yearly: 299,
    monthlyEquivalent: 25,
  },
  premium: {
    original: 199,
    current: 128,
    yearly: 699,
    monthlyEquivalent: 58,
  },
} as const

export const IA_STAGES = [
  { id: "stage0", label: "Topic Discovery", number: 0 },
  { id: "stage1", label: "Research Design", number: 1 },
  { id: "stage2", label: "Data Analysis", number: 2 },
  { id: "stage3", label: "Conclusion", number: 3 },
  { id: "stage4", label: "Evaluation", number: 4 },
] as const

export const TIERS = {
  free: { name: "Free", price: 0 },
  pro: { name: "Pro", price: PRICING.pro.current },
  premium: { name: "Premium", price: PRICING.premium.current },
} as const