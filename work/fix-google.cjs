const fs = require("fs");

// 1. Remove Google from auth.ts
let auth = fs.readFileSync("src/lib/auth.ts", "utf8");
auth = auth.replace(`import Google from "next-auth/providers/google"\n`, "");
auth = auth.replace(/Google\(\{[^}]+}\),?\s*/s, "");
fs.writeFileSync("src/lib/auth.ts", auth, "utf8");

// 2. Remove Google button from login.tsx
let login = fs.readFileSync("src/app/(auth)/login/page.tsx", "utf8");
login = login.replace(`import { Separator } from "@/components/ui/separator"\n`, "");
login = login.replace(/<Button variant="outline"[\s\S]*?Continue with Google[\s\S]*?<\/Button>/m, "");
login = login.replace(/<div className="relative">[\s\S]*?<\/div>/m, "");
fs.writeFileSync("src/app/(auth)/login/page.tsx", login, "utf8");

// 3. Remove Google button from register.tsx
let reg = fs.readFileSync("src/app/(auth)/register/page.tsx", "utf8");
reg = reg.replace(`import { Separator } from "@/components/ui/separator"\n`, "");
reg = reg.replace(/<Button variant="outline"[\s\S]*?Continue with Google[\s\S]*?<\/Button>/m, "");
reg = reg.replace(/<div className="relative">[\s\S]*?<\/div>/m, "");
fs.writeFileSync("src/app/(auth)/register/page.tsx", reg, "utf8");

console.log("all done");
