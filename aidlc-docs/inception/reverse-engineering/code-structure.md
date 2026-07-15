# Code Structure

```text
seo-interpreter/
├── .cursor/rules/ai-dlc-workflow.mdc
├── .aidlc-rule-details/          # AI-DLC stage detail rules
├── aidlc-docs/                   # Persistent AI-DLC artifacts
├── design/stitch-v2/             # Stitch mockups + DESIGN.md
└── web/                          # Next.js application (code root)
    ├── app/
    │   ├── page.tsx              # Main client UI (~800+ lines)
    │   ├── layout.tsx
    │   └── globals.css
    ├── src/lib/
    │   ├── lighthouse.ts         # Domain / parsing
    │   └── pptx.ts               # Export
    └── public/                   # Static assets
```

## Conventions
- Client components use `"use client"` where needed (`page.tsx`)
- Domain types and pure functions live in `src/lib/`
- Print-only markup lives in `#print-root` hidden unless `@media print`
- Path alias `@/` → `web/` (see tsconfig)
