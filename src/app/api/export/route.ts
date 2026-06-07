import { NextRequest, NextResponse } from "next/server"

function markdownToDocxXml(title: string, sections: Record<string, string>): string {
  const sectionLabels: Record<string, string> = {
    stage0: "Introduction & Research Question",
    stage1: "Research Design",
    stage2: "Data Analysis",
    stage3: "Conclusion",
    stage4: "Evaluation",
  }

  let bodyXml = ""
  const keys = ["stage0", "stage1", "stage2", "stage3", "stage4"]
  
  for (const key of keys) {
    const content = sections[key] || ""
    bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${escapeXml(sectionLabels[key])}</w:t></w:r></w:p>`
    
    const paragraphs = content.split("\n")
    for (const para of paragraphs) {
      const trimmed = para.trim()
      if (!trimmed) {
        bodyXml += `<w:p><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p>`
        continue
      }
      if (trimmed.startsWith("## ")) {
        bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>${escapeXml(trimmed.slice(3))}</w:t></w:r></w:p>`
      } else if (trimmed.startsWith("### ")) {
        bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t>${escapeXml(trimmed.slice(4))}</w:t></w:r></w:p>`
      } else if (trimmed.startsWith("|")) {
        // Simple table rendering
        const cells = trimmed.split("|").filter(c => c.trim())
        if (cells.length > 0 && !trimmed.includes("---")) {
          bodyXml += `<w:p><w:r><w:t>${escapeXml(cells.join(" | "))}</w:t></w:r></w:p>`
        }
      } else if (trimmed.startsWith("- ")) {
        bodyXml += `<w:p><w:pPr><w:ind w:left="720"/></w:pPr><w:r><w:t>${escapeXml(trimmed)}</w:t></w:r></w:p>`
      } else {
        // Bold markers
        const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, '</w:t></w:r><w:r><w:rPr><w:b/></w:rPr><w:t>$1</w:t></w:r><w:r><w:t>')
        bodyXml += `<w:p><w:r><w:t xml:space="preserve">${escapeXmlKeepTags(withBold)}</w:t></w:r></w:p>`
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>${escapeXml(title)}</w:t></w:r></w:p>
    ${bodyXml}
  </w:body>
</w:document>`
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function escapeXmlKeepTags(str: string): string {
  return str.replace(/&(?!(amp|lt|gt|quot);)/g, "&amp;")
}

export async function POST(req: NextRequest) {
  try {
    const { title, sections } = await req.json()
    const xml = markdownToDocxXml(title || "Physics IA", sections || {})
    
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${(title || "ia-draft").replace(/\s+/g, "_")}.docx"`,
      },
    })
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}