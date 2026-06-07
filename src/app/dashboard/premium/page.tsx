"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Crown, QrCode, X } from "lucide-react"

const PRICING = {
  pro: { monthly: 59, yearly: 299, monthlyEquivalent: 25 },
  premium: { monthly: 128, yearly: 699, monthlyEquivalent: 58 },
}

const PLANS = [
  {
    name: "免费",
    price: 0,
    color: "zinc",
    features: ["AI Coach 3次/小时", "IA Editor", "Data Analysis", "Topic Generator", "Exemplar Library"],
    cta: "当前方案",
  },
  {
    name: "Pro",
    monthly: PRICING.pro.monthly,
    yearly: PRICING.pro.yearly,
    monthlyEquivalent: PRICING.pro.monthlyEquivalent,
    color: "emerald",
    features: ["全部 8 款 AI 模型", "AI Coach 50次/小时", "Draft Review 无限", "Data Analysis", "Exemplar 全库开放"],
    cta: "立即开通",
    popular: true,
  },
  {
    name: "Premium",
    monthly: PRICING.premium.monthly,
    yearly: PRICING.premium.yearly,
    monthlyEquivalent: PRICING.premium.monthlyEquivalent,
    color: "amber",
    features: ["Pro 全部功能", "AI Coach 200次/小时", "Devil 深度评审", "版本对比", "弱点分析"],
    cta: "立即开通",
  },
]

export default function PremiumPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const [selected, setSelected] = useState<{ plan: string; amount: number; period: string } | null>(null)

  const getPrice = (plan: typeof PLANS[number]): number => {
    if (plan.name === "免费") return 0
    const p = plan as any
    return billing === "monthly" ? p.monthly : p.yearly
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">充值界面</h1>
        <p className="text-zinc-400 mt-1">解锁无限 AI 辅导和高级评审工具。</p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="inline-flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billing === "monthly" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            月付
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              billing === "yearly" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            年付
            <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] h-5 border-0">省 58%</Badge>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid sm:grid-cols-3 gap-4">
        {PLANS.map(plan => {
          const price = getPrice(plan)
          const isFree = plan.name === "免费"
          return (
            <Card key={plan.name} className={`border-zinc-800 bg-zinc-900/50 relative ${
              plan.popular ? "ring-1 ring-emerald-500/50" : ""
            }`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs">推荐</Badge>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-3">
                  {isFree ? (
                    <span className="text-3xl font-bold">¥0</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">¥{price}</span>
                      <span className="text-zinc-400 text-sm">/{billing === "monthly" ? "月" : "年"}</span>
                    </>
                  )}
                </div>
                {!isFree && billing === "yearly" && (
                  <p className="text-xs text-emerald-400 mt-1">
                    约 ¥{plan.monthlyEquivalent}/月
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    isFree ? "bg-zinc-800 text-zinc-400" :
                    plan.color === "emerald" ? "bg-emerald-500 hover:bg-emerald-400 text-black" :
                    "bg-amber-500 hover:bg-amber-400 text-black"
                  }`}
                  disabled={isFree}
                  onClick={() => setSelected({
                    plan: plan.name,
                    amount: price,
                    period: billing === "monthly" ? "月付" : "年付"
                  })}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* QR Code Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelected(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">微信扫码支付</h2>
              <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-emerald-400">¥{selected.amount}</p>
              <p className="text-sm text-zinc-400">{selected.plan} · {selected.period}</p>
            </div>
            <div className="bg-white rounded-xl p-3 mb-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qr.png" alt="微信收款码" className="w-48 h-48 object-contain" />
            </div>
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-medium">支付后操作：</p>
              <ol className="space-y-1 text-zinc-400">
                <li>1. 扫码支付 ¥{selected.amount}</li>
                <li>2. 截图发给微信 <span className="text-emerald-400 font-medium">yly20-17</span></li>
                <li>3. 告知注册邮箱</li>
                <li>4. 1小时内开通</li>
              </ol>
            </div>
            <p className="text-xs text-zinc-500 mt-4 text-center">有问题联系微信 yly20-17</p>
          </div>
        </div>
      )}

      {/* Auto-upgrade info */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-lg">自动到账说明</CardTitle>
          <CardDescription>
            微信个人收款码无法自动回调。如需用户付款后自动开通，需要：
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>• 微信支付商户号（需营业执照）</li>
            <li>• 或第三方支付平台：<a href="https://payjs.cn" target="_blank" className="text-emerald-400 hover:underline">PayJS</a>（个人可用）、<a href="https://xorpay.com" target="_blank" className="text-emerald-400 hover:underline">xorpay</a></li>
            <li className="text-zinc-500 mt-2">目前请用 Admin 面板手动升级，点一下就行。</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
