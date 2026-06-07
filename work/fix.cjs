const fs = require('fs');
const path = 'C:/Users/yly-1/Documents/Codex/2026-06-07/https-physics-ia-ten-vercel-app/src/app/page.tsx';
let c = fs.readFileSync(path, 'utf-8');
c = c.replace(/>\\</, '>\u00A50<');
c = c.replace(/\\$\{PRICING/g, '\u00A5\u0024{PRICING');
c = c.replace(/or \\$/g, 'or \u00A5');
fs.writeFileSync(path, c);
console.log('OK');
