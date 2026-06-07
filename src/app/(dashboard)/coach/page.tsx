import { CoachChat } from "@/components/dashboard/coach-chat"
export default function CoachPage() {
  return (
    <div className="max-w-3xl mx-auto h-full">
      <h1 className="text-2xl font-bold mb-2">AI Coach</h1>
      <p className="text-zinc-400 text-sm mb-6">Your IB Physics IA writing coach. Ask anything — I will guide, not write for you.</p>
      <CoachChat />
    </div>
  )
}