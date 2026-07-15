# Component Inventory

| Component | Path | Role |
|-----------|------|------|
| Page shell | `web/app/page.tsx` | Import, scores, Top 10, Diagnostics, exports, print |
| Layout | `web/app/layout.tsx` | Geist fonts, html/body |
| Global styles | `web/app/globals.css` | Brand tokens, body background, print rules |
| Lighthouse domain | `web/src/lib/lighthouse.ts` | Parse, scores, Top N, diagnostics |
| PPTX export | `web/src/lib/pptx.ts` | Slide deck generation |
| Logo assets | `web/public/logo.svg`, `logo.webp` | Branding |
| Stitch v2 refs | `design/stitch-v2/` | Design system + 3 screens (not runtime) |
| AI-DLC docs | `aidlc-docs/` | Methodology artifacts only |

## Notable UI building blocks (inside page.tsx)
- `ScoreRing`, `CategoryScoreCards`
- `PriorityBadge`, `EvidenceBlock`
- `VirtualIssueList` (@tanstack/react-virtual)
- `PrintableReport`
