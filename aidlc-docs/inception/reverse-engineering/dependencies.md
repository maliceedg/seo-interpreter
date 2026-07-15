# Dependencies

## Production (`web/package.json`)
- `next`, `react`, `react-dom`
- `pptxgenjs`
- `@tanstack/react-virtual`

## Dev
- `typescript`, `@types/node`, `@types/react`, `@types/react-dom`
- `tailwindcss`, `@tailwindcss/postcss`
- `eslint`, `eslint-config-next`

## External (browser-only, not npm)
- User-supplied Lighthouse JSON files
- Optional: Google Fonts for Public Sans / Courier Prime (v2)
- Optional: Material Symbols font for icons (v2 mockups use these)

## Internal coupling
- `page.tsx` → tightly coupled to lighthouse + pptx + all UI; candidate to split for v2 views
