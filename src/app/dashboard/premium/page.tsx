"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, QrCode, X } from "lucide-react"

const PLANS = [
  {
    name: "免费",
    price: "0",
    icon: Zap,
    color: "zinc",
    features: ["AI Coach 3次/小时", "IA Editor", "Data Analysis", "Topic Generator", "Exemplar Library"],
    cta: "当前方案",
  },
  {
    name: "Pro",
    price: "59",
    icon: Crown,
    color: "emerald",
    features: ["全部 8 款 AI 模型", "AI Coach 50次/小时", "Draft Review 无限", "Data Analysis", "Exemplar 全库开放"],
    cta: "立即开通",
    popular: true,
  },
  {
    name: "Premium",
    price: "128",
    icon: Crown,
    color: "amber",
    features: ["Pro 全部功能", "AI Coach 200次/小时", "Devil 深度评审", "版本对比", "弱点分析"],
    cta: "立即开通",
  },
]

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">充值界面</h1>
        <p className="text-zinc-400 mt-1">解锁无限 AI 辅导和高级评审工具。</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {PLANS.map(plan => {
          const Icon = plan.icon
          return (
            <Card key={plan.name} className={`border-zinc-800 bg-zinc-900/50 relative ${
              plan.popular ? "ring-1 ring-emerald-500/50" : ""
            }`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs">推荐</Badge>
              )}
              <CardHeader className="text-center pb-2">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${
                  plan.color === "emerald" ? "text-emerald-400" :
                  plan.color === "amber" ? "text-amber-400" : "text-zinc-400"
                }`} />
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">¥{plan.price}</span>
                  {plan.price !== "0" && <span className="text-zinc-400 text-sm">/月</span>}
                </div>
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
                    plan.name === "免费" ? "bg-zinc-800 text-zinc-400" :
                    plan.color === "emerald" ? "bg-emerald-500 hover:bg-emerald-400 text-black" :
                    "bg-amber-500 hover:bg-amber-400 text-black"
                  }`}
                  disabled={plan.name === "免费"}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* QR Code Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelectedPlan(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">微信扫码支付</h2>
              <button onClick={() => setSelectedPlan(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              {selectedPlan} · ¥{PLANS.find(p => p.name === selectedPlan)?.price}/月
            </p>
            <div className="bg-white rounded-xl p-3 mb-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qr.png" alt="微信收款码" className="w-48 h-48 object-contain" />
            </div>
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-medium">支付后操作：</p>
              <ol className="space-y-1 text-zinc-400">
                <li>1. 截图付款记录</li>
                <li>2. 微信发给 <span className="text-emerald-400 font-medium">yly20-17</span></li>
                <li>3. 告知你的注册邮箱</li>
                <li>4. 1小时内开通会员</li>
              </ol>
            </div>
            <p className="text-xs text-zinc-500 mt-4 text-center">有问题联系微信 yly20-17</p>
          </div>
        </div>
      )}
    </div>
  )
}
