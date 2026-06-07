const fs = require("fs");

let dash = fs.readFileSync("src/app/dashboard/page.tsx", "utf8");

// Add Link import if not present
if (!dash.includes("import Link")) {
  dash = dash.replace('"use client"', '"use client"\nimport Link from "next/link"');
}

// Fix the 3 top cards - wrap in Link
dash = dash.replace(
  /<Card className="border-zinc-800 bg-zinc-900\/50 hover:border-zinc-700 transition-colors cursor-pointer">\s*<CardContent className="p-6 flex items-center gap-4">\s*<div className="w-10 h-10 rounded-lg bg-emerald-500\/10 flex items-center justify-center"><PlusCircle className="w-5 h-5 text-emerald-400" \/><\/div>\s*<div><p className="font-medium">New IA Project<\/p><p className="text-sm text-zinc-400">Start from scratch<\/p><\/div>\s*<\/CardContent>\s*<\/Card>/,
  '<Link href="/dashboard/editor"><Card className="border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors cursor-pointer"><CardContent className="p-6 flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><PlusCircle className="w-5 h-5 text-emerald-400" /></div><div><p className="font-medium">New IA Project</p><p className="text-sm text-zinc-400">Start from scratch</p></div></CardContent></Card></Link>'
);

dash = dash.replace(
  /<Card className="border-zinc-800 bg-zinc-900\/50 hover:border-zinc-700 transition-colors cursor-pointer">\s*<CardContent className="p-6 flex items-center gap-4">\s*<div className="w-10 h-10 rounded-lg bg-blue-500\/10 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-400" \/><\/div>\s*<div><p className="font-medium">Review Draft<\/p><p className="text-sm text-zinc-400">Upload .docx for AI feedback<\/p><\/div>\s*<\/CardContent>\s*<\/Card>/,
  '<Link href="/dashboard/review"><Card className="border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors cursor-pointer"><CardContent className="p-6 flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-400" /></div><div><p className="font-medium">Review Draft</p><p className="text-sm text-zinc-400">Upload .docx for AI feedback</p></div></CardContent></Card></Link>'
);

dash = dash.replace(
  /<Card className="border-zinc-800 bg-zinc-900\/50 hover:border-zinc-700 transition-colors cursor-pointer">\s*<CardContent className="p-6 flex items-center gap-4">\s*<div className="w-10 h-10 rounded-lg bg-purple-500\/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-purple-400" \/><\/div>\s*<div><p className="font-medium">Exemplar Library<\/p><p className="text-sm text-zinc-400">Annotated 7-point IAs<\/p><\/div>\s*<\/CardContent>\s*<\/Card>/,
  '<Link href="/dashboard/exemplars"><Card className="border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors cursor-pointer"><CardContent className="p-6 flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-purple-400" /></div><div><p className="font-medium">Exemplar Library</p><p className="text-sm text-zinc-400">Annotated 7-point IAs</p></div></CardContent></Card></Link>'
);

// Fix the "Available Tools" Open buttons - add links
const toolRoutes = {
  "Topic Generator": "/dashboard/topics",
  "AI Coach": "/dashboard/coach",
  "Data Analysis": "/dashboard/analysis",
  "Exemplar Reader": "/dashboard/exemplars",
  "Devil Examiner": "/dashboard/premium",
  "Version Compare": "/dashboard/progress",
};

for (const [title, href] of Object.entries(toolRoutes)) {
  dash = dash.replace(
    new RegExp(`(<p className="font-medium">${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</p>[\\s\\S]*?)(<Button variant="ghost" size="sm" className="text-emerald-400 h-7 px-0 hover:bg-transparent hover:text-emerald-300">\\s*Open <ArrowRight)`, 'g'),
    `$1<Link href="${href}"><Button variant="ghost" size="sm" className="text-emerald-400 h-7 px-0 hover:bg-transparent hover:text-emerald-300">\n                  Open <ArrowRight`
  );
  dash = dash.replace(
    new RegExp(`(<p className="font-medium">${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</p>[\\s\\S]*?Open <ArrowRight className="w-3 h-3 ml-1" />\\s*</Button>)`, 'g'),
    (match) => match + '</Link>'
  );
}

fs.writeFileSync("src/app/dashboard/page.tsx", dash, "utf8");
console.log("dashboard done");
