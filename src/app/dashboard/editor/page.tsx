"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Download, FileText, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { IA_STAGES } from "@/lib/constants"

const SECTION_TEMPLATES: Record<string, string> = {
  stage0: `## Research Question

[State your focused research question here]

## Introduction

[Explain the physics context and why this investigation is worth doing]`,
  stage1: `## Research Design

### Variables
- Independent Variable: [what you change]
- Dependent Variable: [what you measure]  
- Controlled Variables: [what you keep constant and how]

### Apparatus
| Instrument | Range | Uncertainty |
|-----------|-------|-------------|
| | | |

### Setup Diagram
[Describe or reference your experimental setup]

### Procedure
1. [Step-by-step in passive voice]`,
  stage2: `## Data Analysis

### Raw Data
| [Quantity] / [Symbol] / [Unit] / +/- Uncertainty |
|---|---|

### Sample Calculation
[Show one full calculation with propagation]

### Processed Data
| [X-axis quantity] | [Y-axis quantity] | Uncertainty |
|---|---|---|

### Graph
[Insert your graph with error bars, best-fit, max/min slope lines]`,
  stage3: `## Conclusion

### Quantitative Result
[State your final result with uncertainty: X +/- Y units]

### Comparison with Accepted Value
[Percentage deviation and discussion]

### Physical Interpretation
[Explain what your graph features physically mean]`,
  stage4: `## Evaluation

| Weakness | How it affects results | Type of error | Improvement |
|----------|----------------------|---------------|-------------|
| | | Random / Systematic | |

### Overall Assessment
[Summary of reliability and key improvements]`,
}

const SECTION_LABELS: Record<string, string> = {
  stage0: "Introduction & RQ",
  stage1: "Research Design",
  stage2: "Data Analysis",
  stage3: "Conclusion",
  stage4: "Evaluation",
}

export default function EditorPage() {
  const [projectTitle, setProjectTitle] = useState("My Physics IA")
  const [sections, setSections] = useState<Record<string, string>>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("ia-draft") : null
    if (saved) return JSON.parse(saved)
    return SECTION_TEMPLATES
  })
  const [activeSection, setActiveSection] = useState("stage0")
  const [saved, setSaved] = useState(false)

  const updateSection = (key: string, value: string) => {
    const next = { ...sections, [key]: value }
    setSections(next)
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem("ia-draft", JSON.stringify(sections))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = async () => {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: projectTitle, sections }),
    })
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `${projectTitle.replace(/\s+/g, "_")}.docx`
    a.click(); URL.revokeObjectURL(url)
  }

  const sectionKeys = ["stage0", "stage1", "stage2", "stage3", "stage4"]
  const currentIdx = sectionKeys.indexOf(activeSection)

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">IA Editor</h1>
          <Input
            value={projectTitle}
            onChange={e => setProjectTitle(e.target.value)}
            className="w-48 h-8 text-sm bg-transparent border-zinc-700"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" /> {saved ? "Saved!" : "Save"}
          </Button>
          <Button size="sm" onClick={handleExport} className="bg-emerald-500 hover:bg-emerald-400 text-black">
            <Download className="w-4 h-4 mr-1" /> Export .docx
          </Button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
        {sectionKeys.map((key, i) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              activeSection === key ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {i}. {SECTION_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Editor */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-0">
          <div className="flex">
            {/* Left outline */}
            <div className="w-48 border-r border-zinc-800 p-3 space-y-1 hidden lg:block">
              <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Outline</p>
              {sectionKeys.map((key, i) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                    activeSection === key ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-zinc-500 mr-1">{i}.</span>
                  {SECTION_LABELS[key]}
                  {sections[key] !== SECTION_TEMPLATES[key] && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 inline ml-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Editor area */}
            <div className="flex-1 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-sm text-zinc-300">
                  {SECTION_LABELS[activeSection]}
                </h2>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentIdx === 0}
                    onClick={() => setActiveSection(sectionKeys[currentIdx - 1])}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentIdx === sectionKeys.length - 1}
                    onClick={() => setActiveSection(sectionKeys[currentIdx + 1])}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={sections[activeSection]}
                onChange={e => updateSection(activeSection, e.target.value)}
                className="min-h-[420px] font-mono text-sm bg-zinc-950 border-zinc-800 resize-none leading-relaxed"
                placeholder="Start writing..."
              />
              <p className="text-xs text-zinc-500 mt-2">
                Markdown supported. Use ## for headings, | for tables, ** for bold.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom nav */}
      <div className="flex justify-between">
        <Button variant="ghost" disabled={currentIdx === 0} onClick={() => setActiveSection(sectionKeys[currentIdx - 1])}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous: {currentIdx > 0 ? SECTION_LABELS[sectionKeys[currentIdx - 1]] : ""}
        </Button>
        <Button variant="ghost" disabled={currentIdx === sectionKeys.length - 1} onClick={() => setActiveSection(sectionKeys[currentIdx + 1])}>
          Next: {currentIdx < sectionKeys.length - 1 ? SECTION_LABELS[sectionKeys[currentIdx + 1]] : ""} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}