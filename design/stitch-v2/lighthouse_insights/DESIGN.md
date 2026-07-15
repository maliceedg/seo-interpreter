---
name: Lighthouse Insights
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#5a4136'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#006e2a'
  on-secondary: '#ffffff'
  secondary-container: '#5cfd80'
  on-secondary-container: '#00732c'
  tertiary: '#825500'
  on-tertiary: '#ffffff'
  tertiary-container: '#d08b00'
  on-tertiary-container: '#462c00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#69ff87'
  secondary-fixed-dim: '#3ce36a'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#00531e'
  tertiary-fixed: '#ffddb3'
  tertiary-fixed-dim: '#ffb950'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-code:
    fontFamily: courierPrime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is built for clarity and professional reliability. It adopts a **Corporate Modern** style with a focus on data visualization and accessibility. The aesthetic is characterized by ample whitespace, soft tonal depth, and a high-contrast information hierarchy that transforms dense JSON reports into actionable executive summaries.

The brand personality is authoritative yet approachable—functioning as a "trusted advisor" that translates technical audits into human-readable insights. The interface utilizes subtle gradients and soft card elevations to create a premium, tool-like feel that encourages deep analysis without cognitive overload.

## Colors

The color palette is functionally driven by the Lighthouse scoring system. The **Primary Lighthouse Orange** is used for core brand elements and primary actions to evoke guidance and alertness. 

- **Success Green (#00C853):** Used for scores 90-100 and positive growth metrics.
- **Warning Amber (#FFAB00):** Used for scores 50-89, indicating areas needing attention.
- **Critical Red (#D50000):** Used for scores 0-49 and severe blocking issues.
- **Neutrals:** A range of cool grays (Base: #F5F7F9) is used for backgrounds and card borders to maintain a clean, laboratory-like environment. Text uses a deep slate (#1A1C1E) to ensure WCAG AAA contrast ratios.

## Typography

The typography system uses **Public Sans** across all levels to maintain a neutral, institutional clarity. It is a highly legible typeface that performs exceptionally well in data-heavy contexts.

Hierarchy is established through significant weight shifts. Headers are bold and tightly spaced, while body copy utilizes generous line heights to facilitate long-form reading of technical descriptions. A monospaced variant is reserved strictly for raw JSON data and code snippets within audits to distinguish machine-readable content from human interpretation.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for the main dashboard content. A two-pane layout is the primary model: a narrow, fixed sidebar (320px) for report uploads and global settings, and a fluid main stage for data visualization.

Spacing follows an 8px linear scale. Large components like data cards use 32px internal padding to provide "breathing room" for complex charts. On mobile devices, the two-pane layout stacks vertically, and margins reduce from 48px to 16px to maximize the horizontal space for data tables.

## Elevation & Depth

Visual hierarchy is conveyed through **Tonal Layers** and **Ambient Shadows**. 
1. **The Canvas:** The base background is the lightest neutral (#F5F7F9).
2. **The Cards:** Primary content containers are pure white (#FFFFFF) with a very soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)) and a subtle 1px border (#E0E4E8).
3. **The Interaction:** Active elements or hovered cards increase their shadow spread (0px 8px 30px rgba(0, 0, 0, 0.08)) to indicate tangibility.

This approach ensures that the "Lighthouse Orange" primary actions pop against the muted, layered background.

## Shapes

The design system uses a **Rounded** shape language to maintain its friendly and modern tone. Standard UI components like input fields and small cards use a 0.5rem (8px) radius. Larger section containers and dashboard modules utilize a 1rem (16px) radius to create a softer, more premium aesthetic. Status badges and score gauges are fully rounded (pill-shaped) to distinguish them from structural layout elements.

## Components

### Score Gauges
Circular progress indicators are the hero components. They utilize a thick 8px stroke. The center of the circle displays the numerical score in `headline-lg`. The stroke color must dynamically map to the Success, Warning, or Critical color tokens based on the value.

### Status Badges
Pill-shaped containers used for priority levels (e.g., "High Priority"). They use a 10% opacity fill of the status color with a 100% opacity text of the same hue to ensure high legibility without visual noise.

### Audit Cards
Cards are used to list individual lighthouse audits. They feature a collapsed state showing the audit title and a score icon, and an expanded state that reveals a description, code snippets, and "How to fix" instructions.

### Buttons
- **Primary:** Solid Lighthouse Orange with white text.
- **Secondary:** White background with a 1px neutral border and slate text.
- **Ghost:** No border or background, used for low-emphasis actions like "Reset" or "Clear".

### Data Tables
Tables should be borderless with subtle zebra-striping using the base neutral color. Headers should use `label-sm` with increased letter spacing for a professional, technical feel.