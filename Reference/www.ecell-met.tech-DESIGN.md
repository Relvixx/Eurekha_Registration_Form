# Design System Inspired by E-Cell MET

## 1. Visual Theme & Atmosphere

The E-Cell MET design system embodies a bold, forward-thinking entrepreneurial identity rooted in innovation and youth empowerment. With a sophisticated dark theme as its foundation, the system employs a striking contrast between deep charcoals and vibrant accent colors—particularly a vivid red (`#FF1744`) that signals energy, opportunity, and decisive action. The aesthetic balances minimalism with purposeful depth, using subtle glassmorphic elements (frosted overlays with low opacity) to create a sense of layering and progression. Typography is deliberately bold and confident, reflecting the ambitious spirit of emerging leaders and startups. The overall mood is aspirational yet grounded, modern yet accessible—designed to inspire creativity while maintaining professional credibility in an educational and entrepreneurial context.

**Key Characteristics**
- Dark, high-contrast color palette with strategic red accents for CTAs
- Bold, geometric typography hierarchy with confident sans-serif choices
- Glassmorphic card designs with subtle borders and soft shadows
- Minimalist navigation with spacious, breathing layouts
- Accessible color contrast ratios supporting readability
- Smooth transitions and layered depth via shadow elevation
- Emphasis on community, transparency, and forward momentum

## 2. Color Palette & Roles

### Primary
- **Primary Brand Red** (`#FF1744`): Primary call-to-action buttons, accent underlines, highlights, and active states signaling energy and urgency
- **Dark Charcoal** (`#0A0A0A`): Primary background color for the entire interface, establishing visual foundation
- **Pure Black** (`#000000`): Text on light surfaces; secondary dark depth layer

### Accent Colors
- **Cyan/Turquoise** (`#00E5FF`): Secondary accent for highlights, hover states, and supportive visual elements; tech-forward aesthetic
- **Success Green** (`#25D366`): Positive actions, success confirmations, and community growth indicators
- **Instagram Pink** (`#E1306C`): Social media integration and community platform links
- **LinkedIn Blue** (`#0077B5`): Professional network integration and secondary brand associations

### Interactive
- **Error Red Primary** (`#DC2626`): Error states, warnings, and destructive actions with high visibility
- **Error Red Intense** (`#EF4444`): Lighter error state for secondary warnings and validation feedback
- **Warning Gold** (`#FFD700`): Caution states and informational alerts requiring user attention

### Neutral Scale
- **Pure White** (`#FFFFFF`): Primary text on dark backgrounds, high-contrast content, and fill for interactive elements
- **Light Gray** (`#E5E7EB`): Secondary text, subtle dividers, and reduced-emphasis content
- **Medium Gray** (`#9CA3AF`): Tertiary text, disabled states, and muted information
- **Dark Gray** (`#D1D5DB`): Borders and subtle separators on light backgrounds
- **Charcoal Gray** (`#374151`): Secondary UI text and form labels

### Surface & Borders
- **Glass White 5%** (`rgba(255, 255, 255, 0.05)`): Subtle card and input backgrounds with transparency
- **Glass White 10%** (`rgba(255, 255, 255, 0.1)`): Border and subtle hover states on dark surfaces
- **Glass Black 60%** (`rgba(20, 20, 20, 0.6)`): Elevated card backgrounds with depth
- **Glass White 3%** (`rgba(255, 255, 255, 0.03)`): Ultra-subtle card surface for minimal emphasis
- **Translucent Red 1%** (`rgba(255, 23, 68, 0.01)`): Danger state borders and accents

### Semantic / Status
- **Danger** (`#FF1744`): Critical errors, destructive actions, and urgent alerts
- **Error Secondary** (`#DC2626`): Error message text and related UI elements
- **Warning** (`#FFD700`): Non-critical alerts requiring attention
- **Success** (`#25D366`): Confirmation messages, completed actions, and positive feedback

## 3. Typography Rules

### Font Family
**Primary Font:** `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`  
A modern, system-optimized sans-serif stack ensuring consistency across devices and excellent legibility in both light and dark modes.

**Secondary Font (if needed):** Same as primary; no secondary typeface is required in this system.

**Code Font (if applicable):** `"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display 1 (H1) | ui-sans-serif | 96px | 900 | 105.6px | -0.02em | Hero headlines, page titles; maximum impact and presence |
| Display 2 (H2) | ui-sans-serif | 56px | 700 | 84px | -0.015em | Section headings and major content dividers |
| Display 3 (H3) | ui-sans-serif | 28px | 700 | 42px | 0px | Subsection titles and prominent labels |
| Heading 4 (H4) | ui-sans-serif | 20px | 700 | 30px | 0px | Card titles, module headings |
| Body | ui-sans-serif | 17.6px | 400 | 28.16px | 0px | Primary content, paragraphs, and body text |
| Body Small | ui-sans-serif | 16px | 500 | 24px | 0px | Input fields, button text, and compact descriptions |
| Link | ui-sans-serif | 16px | 400 | 24px | 0px | Inline and standalone hyperlinks |
| Label | ui-sans-serif | 10.4px | 700 | 15.6px | 0px | Form labels, badges, and mini-text |
| Micro Label | ui-sans-serif | 12.8px | 700 | 19.2px | 0px | Error messages, small captions, and micro interactions |

### Principles
- **Contrast-Driven:** Bold weights (700–900) for headings ensure hierarchy clarity on dark backgrounds
- **Metric-Aligned:** All line heights maintain 1.4x–1.5x multipliers of font size for optimal readability
- **System-Native:** Use `ui-sans-serif` stack to leverage system fonts, reducing payload and improving performance
- **Accessibility:** Minimum 16px for interactive elements; headings maintain sufficient contrast with dark backgrounds
- **Spatial Harmony:** Typography scales follow a deliberate 1.4× progression, creating visual balance across all text sizes

## 4. Component Stylings

### Buttons

**Primary CTA Button**
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Border:** `1px solid rgb(0, 0, 0)` with fallback to `rgba(255, 255, 255, 0.1)`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `16px 32px`
- **Font Size:** `16px`
- **Font Weight:** `600`
- **Line Height:** `24px`
- **Border Radius:** `99px`
- **Width:** `auto` (min 160px)
- **Height:** `56px`
- **Box Shadow:** `rgba(255, 255, 255, 0.4) 0px 0px 20px 0px` (glow effect)
- **Hover State:** Border opacity increases to `0.2`, shadow intensifies to `rgba(255, 255, 255, 0.6) 0px 0px 30px 0px`
- **Active State:** Opacity reduces to `0.8`, shadow fades slightly

**Secondary Outline Button**
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `16px 32px`
- **Font Size:** `16px`
- **Font Weight:** `600`
- **Line Height:** `24px`
- **Border Radius:** `99px`
- **Width:** `auto` (min 220px)
- **Height:** `58px`
- **Box Shadow:** `none`
- **Hover State:** Background becomes `rgba(255, 255, 255, 0.08)`, border becomes `rgba(255, 255, 255, 0.2)`
- **Active State:** Background `rgba(255, 255, 255, 0.12)`, border `rgba(255, 255, 255, 0.3)`

**Ghost/Tertiary Button**
- **Background:** `rgba(255, 255, 255, 0.1)`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `8px 8px`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Line Height:** `24px`
- **Border Radius:** `9999px`
- **Width:** `auto`
- **Height:** `auto` (min 40px)
- **Box Shadow:** `rgba(0, 0, 0, 0.5) 0px 0px 15px 0px`
- **Hover State:** Background `rgba(255, 255, 255, 0.15)`, shadow `rgba(0, 0, 0, 0.7) 0px 0px 20px 0px`
- **Active State:** Background `rgba(255, 255, 255, 0.2)`

**Danger/Error Button**
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Border:** `1px solid rgb(255, 23, 68)`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `8px 20px`
- **Font Size:** `12px`
- **Font Weight:** `700`
- **Line Height:** `18px`
- **Border Radius:** `9999px`
- **Width:** `auto` (min 160px)
- **Height:** `36px`
- **Box Shadow:** `none`
- **Hover State:** Background becomes `rgba(255, 23, 68, 0.15)`, border becomes `rgb(255, 23, 68)` at opacity `1`
- **Active State:** Background `rgba(255, 23, 68, 0.25)`, border opacity reduces to `0.9`

**Text/Link Button**
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Border:** `0px none`
- **Text Color:** `rgb(220, 38, 38)`
- **Padding:** `0px`
- **Font Size:** `12.8px`
- **Font Weight:** `700`
- **Line Height:** `19.2px`
- **Border Radius:** `0px`
- **Width:** `auto`
- **Height:** `auto`
- **Box Shadow:** `none`
- **Hover State:** Text color becomes `rgb(239, 68, 68)`, text decoration underline appears
- **Active State:** Text color `rgb(220, 38, 38)` at opacity `0.8`

### Cards & Containers

**Glass Card / Content Container**
- **Background:** `rgba(255, 255, 255, 0.03)`
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `32px`
- **Border Radius:** `20px`
- **Box Shadow:** `rgba(0, 0, 0, 0.1) 0px 4px 30px 0px`
- **Width:** `auto` (typical 572px)
- **Min Height:** `189px`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Line Height:** `24px`
- **Hover State:** Background becomes `rgba(255, 255, 255, 0.05)`, shadow becomes `rgba(0, 0, 0, 0.15) 0px 6px 40px 0px`

**Navigation Header Card**
- **Background:** `rgba(20, 20, 20, 0.6)` (semi-transparent dark glass)
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `6.4px 24px`
- **Border Radius:** `99px`
- **Box Shadow:** `rgba(0, 0, 0, 0.4) 0px 4px 20px 0px`
- **Width:** `auto` (max 1368px)
- **Height:** `auto` (min 54.78px)
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Line Height:** `24px`

**Elevated Card (High Emphasis)**
- **Background:** `rgba(0, 0, 0, 0.3)`
- **Border:** `1px solid rgba(255, 23, 68, 0.2)`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `24px 32px`
- **Border Radius:** `20px`
- **Box Shadow:** `rgba(0, 0, 0, 0.4) 0px 4px 20px 0px`
- **Accent Left Border:** `4px solid rgb(255, 23, 68)` (optional for red-emphasized cards)

### Inputs & Forms

**Text Input Field**
- **Background:** `rgba(255, 255, 255, 0.05)`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Text Color:** `rgb(255, 255, 255)`
- **Placeholder Color:** `rgba(255, 255, 255, 0.5)`
- **Padding:** `0px 20px`
- **Font Size:** `16px`
- **Font Weight:** `500`
- **Line Height:** `24px`
- **Border Radius:** `12px`
- **Width:** `auto` (typical 197px or full)
- **Height:** `56px`
- **Box Shadow:** `none`
- **Focus State:** Border becomes `rgba(0, 225, 255, 0.5)`, background becomes `rgba(255, 255, 255, 0.08)`, box shadow becomes `rgba(0, 225, 255, 0.3) 0px 0px 12px 0px`
- **Error State:** Border becomes `rgba(255, 23, 68, 0.6)`, background `rgba(255, 23, 68, 0.05)`
- **Disabled State:** Opacity `0.5`, cursor `not-allowed`, background `rgba(255, 255, 255, 0.02)`

**Textarea**
- Same as Text Input Field but with variable height (`min-height: 120px`)
- **Padding:** `12px 20px`

**Select/Dropdown**
- **Background:** `rgba(255, 255, 255, 0.05)`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `0px 20px`
- **Font Size:** `16px`
- **Border Radius:** `12px`
- **Height:** `56px`
- **Width:** `auto`
- **Box Shadow:** `none`
- **Focus State:** Same as text input focus
- **Hover State:** Border becomes `rgba(255, 255, 255, 0.15)`

**Form Label**
- **Text Color:** `rgb(255, 255, 255)`
- **Font Size:** `10.4px`
- **Font Weight:** `700`
- **Line Height:** `15.6px`
- **Margin Bottom:** `8px`
- **Letter Spacing:** `0.05em`

### Navigation

**Main Navigation Bar**
- **Background:** `transparent` or `rgba(0, 0, 0, 0)` (blends with page background)
- **Border:** `0px solid`
- **Text Color:** `rgb(255, 255, 255)`
- **Padding:** `0px` (height determined by child elements)
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Line Height:** `24px`
- **Border Radius:** `0px`
- **Width:** `full` (100%)
- **Height:** `auto` (typically 64–80px with padding)
- **Box Shadow:** `none` or subtle elevation shadow

**Navigation Link (Active)**
- **Text Color:** `rgb(255, 255, 255)`
- **Font Weight:** `500`
- **Border Bottom:** `2px solid rgb(255, 23, 68)`
- **Padding Bottom:** `4px`

**Navigation Link (Inactive)**
- **Text Color:** `rgb(209, 213, 219)`
- **Font Weight:** `400`
- **Padding:** `8px 0px`
- **Transition:** `color 200ms ease, border-color 200ms ease`

**Navigation Link (Hover)**
- **Text Color:** `rgb(255, 255, 255)`
- **Border Bottom:** `2px solid rgba(255, 23, 68, 0.5)`

### Badges & Micro Elements

**Badge**
- **Background:** `rgba(255, 23, 68, 0.15)`
- **Border:** `1px solid rgba(255, 23, 68, 0.4)`
- **Text Color:** `rgb(255, 23, 68)`
- **Padding:** `4px 12px`
- **Font Size:** `10.4px`
- **Font Weight:** `700`
- **Border Radius:** `50%` or `9999px` (fully rounded)
- **Display:** `inline-block`
- **Line Height:** `15.6px`

**Icon Button**
- **Background:** `rgba(255, 255, 255, 0.08)`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Icon Color:** `rgb(255, 255, 255)`
- **Padding:** `8px`
- **Border Radius:** `12px`
- **Width:** `40px`
- **Height:** `40px`
- **Hover State:** Background `rgba(255, 255, 255, 0.12)`, icon color remains white
- **Active State:** Background `rgba(255, 23, 68, 0.2)`, icon color `rgb(255, 23, 68)`

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px`

**Spacing Scale:** Multiples of 4px for consistent rhythm

- `4px` — Gap between inline elements, micro-margins
- `8px` — Tight padding, small component spacing
- `12px` — Default input/button vertical padding
- `16px` — Standard padding for cards and containers, section gaps
- `20px` — Horizontal form input padding
- `24px` — Card padding, generous component spacing
- `32px` — Large card padding, section modules
- `36px` — Extra-large spacing between major sections
- `40px` — Hero section padding, top/bottom margins
- `48px` — Wide section gaps, prominent module separation
- `60px` — Major section margins (desktop)
- `64px` — Hero section top/bottom margins, page padding

**Usage Context:**
- Buttons: `8px 20px` to `16px 32px`
- Cards: `24px` to `32px` padding
- Form fields: `12px` vertical, `20px` horizontal
- Section gaps: `48px` to `64px`
- Component clusters: `16px` to `24px`

### Grid & Container

**Max Width:** `1368px` (matches extracted component widths)

**Column Strategy:** 12-column fluid grid on desktop; adapts to 4-column on tablet, 2-column on mobile

**Section Patterns:**
- Hero Section: Full-width with centered content container (max `1368px`), padding `60px 40px`
- Content Section: Centered container with `32px` side padding on desktop
- Card Grid: 2-column layout on desktop, 1-column on tablet/mobile
- Navigation: Full-width sticky or fixed header with content max-width internal constraint

**Gutters:** `32px` between grid columns on desktop; `24px` on tablet; `16px` on mobile

### Whitespace Philosophy

E-Cell MET embraces **generous breathing room** throughout the interface. Whitespace is not merely empty space but an active design element that guides attention, establishes hierarchy, and creates a sense of premium, forward-thinking simplicity. Key principles:

- **Section Separation:** Major sections are divided by `48px–64px` vertical spacing, creating clear visual chapters
- **Component Clustering:** Related components (buttons, form fields) nest within `16px–24px` zones
- **Text Breathing:** Headings receive `20px–32px` margin below; body text flows with natural line spacing of `1.4x–1.5x`
- **Card Rhythm:** Cards maintain `32px` internal padding; gaps between cards are `24px–32px`
- **Negative Space:** Empty space around focal points (hero image, CTA buttons) is preserved; no cramped layouts

### Border Radius Scale

All radius values maintain a cohesive, modern aesthetic:

- `0px` — Text links, flat UI elements with no roundness
- `12px` — Input fields, smaller buttons, subtle softness
- `20px` — Cards, containers, prominent component softness
- `50px` — Large buttons (specific use case)
- `99px` — Pill-shaped buttons, navigation elements (maximum roundness within use)
- `9999px` — Fully circular badges, button states (mathematically infinite radius)
- `50%` — Perfect circles for avatar badges, icon containers

### Border Widths

- **Thin (`1px`):** Default for inputs, buttons (outlines), card borders, most UI dividers
- **Medium (`2px`):** Active navigation indicators, emphasis borders, strong visual separators
- **Thick (`4px`):** Accent left borders on highlighted cards, focus indicators on critical elements
- **None (`0px`):** Flat button backgrounds, text elements, transparent overlays

## 6. Depth & Elevation

Shadows create layering and hierarchy in the dark E-Cell MET interface. Each elevation level signifies functional or visual importance:

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (L0) | `none` | Background surfaces, flat text buttons, inactive states |
| Raised (L1) | `rgba(0, 0, 0, 0.1) 0px 4px 30px 0px` | Standard cards, containers, secondary emphasis |
| Elevated (L2) | `rgba(0, 0, 0, 0.4) 0px 4px 20px 0px` | Navigation headers, medium-importance cards |
| Prominent (L3) | `rgba(0, 0, 0, 0.9) 0px 25px 60px 0px` | Modals, overlays, maximum depth |
| Focus Glow (Special) | `rgba(255, 255, 255, 0.4) 0px 0px 20px 0px` or `rgba(0, 225, 255, 0.3) 0px 0px 12px 0px` | Active button states, focus indicators, interactive focus |

**Shadow Philosophy:** Shadows in dark mode serve not to imply physical depth but to create subtle visual separation. Layering is achieved through a combination of shadow softness and opacity manipulation. Warmer/red-tinted glows indicate interactive states (CTAs, focus); cooler cyan glows indicate system feedback (focus rings, attention).

### Opacity Levels

The design system employs opacity strategically for state, emphasis, and feedback:

- **20% (`0.20`)** — Minimal emphasis, disabled/inactive states, very subtle overlays
- **33% (`0.33`)** — Moderate reduction, hover states on secondary elements
- **40% (`0.40`)** — Strong reduction, significant disabled states, background overlays
- **50% (`0.50`)** — Half transparency, secondary content, balanced emphasis reduction
- **70% (`0.70`)** — Strong presence with slight transparency, semi-transparent cards
- **80% (`0.80`)** — Active but slightly reduced, temporary focus states, transitional states

**Usage:**
- Disabled text: `opacity: 0.5` or `0.33`
- Hover overlays: `rgba(255, 255, 255, 0.08–0.15)`
- Focus glows: `opacity: 0.3–0.4`
- Background modals: `rgba(0, 0, 0, 0.5–0.8)`
- Subtle borders: `rgba(255, 255, 255, 0.03–0.1)`

### Z-index / Layering

A structured z-index scale ensures predictable stacking behavior:

- **Base Layer:** `z-index: 1` — Main content, cards, default component depth
- **Raised Layer:** `z-index: 2–3` — Hover cards, slightly elevated containers
- **Navigation Layer:** `z-index: 4–10` — Sticky headers, local dropdowns
- **Dropdown/Popover Layer:** `z-index: 10–20` — Floating menus, select dropdowns, tooltips
- **Modal Layer:** `z-index: 25–30` — Modal overlays, dialog backdrops
- **Top Layer:** `z-index: 40–50` — Toast notifications, alerts, topmost popovers
- **System Layer:** `z-index: 9999` — Full-screen overlays, critical system notifications

**Specific Values in Use:**
- Sticky navigation: `z-index: 10`
- Dropdown menus: `z-index: 15`
- Modals: `z-index: 25`
- Modal backdrop: `z-index: 24`
- Toasts: `z-index: 35`

## 7. Do's and Don'ts

### Do

- **Use bold, confident typography** — Leverage 700–900 font weights for headings; they reinforce E-Cell's ambitious brand voice and maintain clarity on dark backgrounds
- **Apply glowing accents sparingly** — Reserve shadow glows (`box-shadow: rgba(255, 255, 255, 0.4) 0px 0px 20px 0px`) for primary CTAs and high-priority interactions; overuse dilutes impact
- **Maintain the dark background ecosystem** — Keep background colors between `#0A0A0A` and `#1E1E1E`; avoid mid-gray or light backgrounds unless explicitly designing light mode
- **Embrace generous spacing** — Allocate `48px–64px` between major sections; white space elevates the premium feel and supports scanning
- **Use red (`#FF1744`) intentionally** — Reserve for CTAs, danger states, and moments requiring immediate attention; it's a power color in this system
- **Implement layered glass effects** — Stack `background: rgba(X, X, X, 0.03–0.05)` + `border: 1px solid rgba(255, 255, 255, 0.08)` for cards; it creates sophisticated depth
- **Respect the input/button radius hierarchy** — Use `12px` for inputs (slightly rounded), `99px–9999px` for buttons (pill-shaped), `20px` for cards (moderate roundness)
- **Provide clear focus states** — Every interactive element must have a visible focus ring (border color change + optional glow) for accessibility

### Don't

- **Don't mix light and dark backgrounds without clear intention** — Avoid inserting light gray or white card backgrounds into the dark system; it fragments the visual language
- **Don't overuse cyan or accent colors** — These should highlight, not dominate; limit to hover states, secondary accents, and loading indicators
- **Don't create buttons without rounded corners** — Flat, square buttons conflict with the modern, forward-thinking aesthetic; always apply at least `12px` radius
- **Don't stack more than two shadow levels on a single component** — Excessive shadows create muddiness; choose one shadow treatment per element
- **Don't reduce typography below `10px`** — Micro labels are an exception at `10.4px`, but body text must remain `16px+` for readability in dark mode
- **Don't use placeholder text as instruction** — Always pair form fields with visible labels (`font-size: 10.4px`, `font-weight: 700`) above inputs
- **Don't apply opacity changes to text color directly** — Use `color: rgba(255, 255, 255, X)` instead of `opacity: X` on text to avoid affecting child elements
- **Don't place interactive elements in low-contrast areas** — Buttons, links, and form fields must contrast at least 4.5:1 with their backgrounds
- **Don't animate too quickly** — Use transitions of `200ms–300ms` for state changes; faster feels jarring, slower feels sluggish
- **Don't ignore touch targets on mobile** — Ensure all tappable elements meet a minimum `44px × 44px` hit area on touch devices

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | `320px–479px` | Single-column layout, full-width cards, `16px` padding, stacked navigation, `12px` font sizes reduced to `14px` for body |
| Mobile | `480px–767px` | Single-column grid, `20px` padding, reduced section spacing (`36px`), simplified component sizes |
| Tablet | `768px–1023px` | 2-column card grid, `24px` padding, `48px` section spacing, navigation transitions to horizontal tab view |
| Tablet Large | `1024px–1279px` | 2-column grid with wider container, `32px` padding, standard spacing restored |
| Desktop | `1280px–∞px` | Full-width max `1368px`, 2–3 column layouts, `64px` section spacing, all typography sizes apply, full navigation menu |

### Touch Targets

- **Minimum Height:** `44px × 44px` (WCAG Level AAA compliance for mobile)
- **Recommended:** `48px × 48px` for primary actions (buttons, form fields)
- **Padding:** `12px` minimum internal padding around touch-active areas
- **Spacing:** `8px` minimum gap between adjacent touch targets to prevent accidental activations
- **Icon Buttons:** `40px × 40px` minimum size
- **Text Links:** `44px` line height at minimum; padding `8px 0px` vertically to expand hit area

### Collapsing Strategy

**Mobile (< 768px)**
- **Navigation:** Collapse horizontal menu into hamburger (`≡`) icon; drawer menu slides in from left with `z-index: 50`
- **Cards:** Switch from 2-column to single-column; apply `100% - 32px` width with `16px` side margins
- **Typography:** H1 reduces from `96px` to `48px`; H2 from `56px` to `36px`; body remains `16px` for legibility
- **Spacing:** Reduce section margins from `64px` to `36px–48px`; card padding from `32px` to `24px`
- **Buttons:** Full-width CTAs at `100% - 32px` with `16px` side margins; stack vertically if multiple buttons

**Tablet (768px–1023px)**
- **Navigation:** Horizontal tab-based menu below logo; drawer optional
- **Cards:** 2-column grid with `24px` gutters; adjust last card in odd-count rows
- **Typography:** H1 reduces to `64px`; H2 to `42px`; body stable at `17.6px`
- **Spacing:** Section margins `48px`; card padding `24px`
- **Layout:** Container max-width `768px` (non-full-width)

**Desktop (≥ 1280px)**
- **Navigation:** Full horizontal menu display
- **Cards:** 2–3 column layout with `32px` gutters
- **Typography:** Full sizes from hierarchy table
- **Spacing:** `64px` section spacing; `32px` card padding
- **Layout:** Max-width container `1368px` centered

## 9. Agent Prompt Guide

### Quick Color Reference

Use this mapping when implementing UI components:

- **Primary CTA:** Brand Red (`#FF1744`) — buttons, highlights, active states
- **Background (Primary):** Dark Charcoal (`#0A0A0A`) — page background
- **Background (Elevated):** Glass Black 60% (`rgba(20, 20, 20, 0.6)`) — cards, containers
- **Text (Primary):** Pure White (`#FFFFFF`) — body text, headings
- **Text (Secondary):** Light Gray (`#E5E7EB`) — reduced emphasis, muted info
- **Text (Tertiary):** Medium Gray (`#9CA3AF`) — disabled, very subtle text
- **Border (Default):** Glass White 10% (`rgba(255, 255, 255, 0.1)`) — input, card, button borders
- **Success:** Success Green (`#25D366`) — confirmations, positive feedback
- **Error:** Error Red (`#DC2626`) — error states, validation failures
- **Warning:** Warning Gold (`#FFD700`) — caution alerts, non-critical warnings
- **Accent (Secondary):** Cyan (`#00E5FF`) — hover states, secondary highlights

### Iteration Guide

Follow these 10 core rules to maintain system fidelity:

1. **Every interactive element must be `44px` minimum height on mobile; use `padding: 12px 20px` as baseline for touch targets**

2. **All heading text must use `font-weight: 700` or higher; body text locked at `font-weight: 400` for clarity**

3. **Card backgrounds follow the glass formula: `background: rgba(255, 255, 255, 0.03–0.05)` + `border: 1px solid rgba(255, 255, 255, 0.08)` + `box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 30px 0px`**

4. **Button border-radius must be `99px` or `9999px` (pill-shaped); inputs use `12px`; cards use `20px`—no square buttons or inputs**

5. **Red (`#FF1744`) is reserved for primary CTAs and danger states; use sparingly (< 10% of interface) to maintain visual impact**

6. **All forms require visible labels (`font-size: 10.4px, font-weight: 700`) positioned above fields; never rely on placeholder-only labeling**

7. **Section spacing on desktop must be `60px–64px`; on mobile `36px–48px`—maintain breathing room to support scannability**

8. **Focus states on all interactive elements: `border-color` changes + optional glow (`box-shadow: rgba(0, 225, 255, 0.3) 0px 0px 12px 0px`)—never remove focus indicators**

9. **Images and hero content sit on dark backgrounds; ensure `4.5:1` contrast minimum for overlaid text; use `rgba(0, 0, 0, 0.3–0.5)` overlay if needed**

10. **Responsive breakpoint behavior: stack cards vertically on mobile (< 768px), 2-column on tablet/desktop; hide desktop-only nav items behind hamburger menu on mobile; scale hero H1 from `96px` (desktop) → `48px` (mobile)**