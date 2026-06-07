"use client"
import { AI_MODELS, type ModelId } from "@/lib/models"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  value: ModelId
  onChange: (model: ModelId) => void
}

export function ModelSelector({ value, onChange }: Props) {
  const selected = AI_MODELS.find(m => m.id === value)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500">Model:</span>
      <Select value={value} onValueChange={(v) => onChange(v as ModelId)}>
        <SelectTrigger className="h-7 text-xs border-zinc-700 bg-zinc-900 w-[200px]">
          <SelectValue>
            {selected && <span>{selected.icon} {selected.name}</span>}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="border-zinc-700 bg-zinc-900">
          {AI_MODELS.map(m => (
            <SelectItem key={m.id} value={m.id} className="text-xs">
              <div className="flex items-center gap-2">
                <span>{m.icon}</span>
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-[10px] text-zinc-400">{m.desc}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}