# Design System Inspired by E-Cell Eureka!

## 1. Visual Theme & Atmosphere

The E-Cell Eureka! design system embodies a professional yet dynamic entrepreneurial spirit. It blends corporate sophistication with bold, energetic accents that communicate innovation and opportunity. The palette emphasizes deep navy and black foundations paired with vibrant tech-forward blues, creating a premium atmosphere suited to a competitive startup platform. Typography feels modern and confident, supporting clear hierarchies that guide users through complex information. Shadows and depth effects add visual richness without sacrificing clarity, while generous whitespace ensures focused attention on key elements like call-to-action buttons and achievement statistics.

**Key Characteristics**
- Bold, high-contrast primary typography with weights up to 900
- Deep navy and black foundations with electric blue accents
- Premium card treatments with inset glow effects and subtle borders
- Clean, minimalist navigation with strong typographic contrast
- Emphasis on numbers, statistics, and achievement metrics
- Professional yet approachable tone suitable for investor and startup audiences

## 2. Color Palette & Roles

### Primary
- **Dark Navy** (`#021D48`): Primary brand color used for key UI elements and high-emphasis text
- **Deep Black** (`#000000`): Foundation color for text, backgrounds, and dominant visual anchors
- **Dark Slate** (`#1A1A2E`): Secondary dark tone for component backgrounds and subtle differentiation

### Accent Colors
- **Electric Blue** (`#1A6FF5`): Primary accent for interactive elements and focus states
- **Bright Blue** (`#2D87FF`): Lighter blue accent for secondary interactive states
- **True Blue** (`#0000EE`): Hyperlink blue for text-based navigation and inline links
- **Deep Blue** (`#000596`): Rich blue used in premium card treatments

### Interactive
- **Primary CTA Blue** (`#1A6FF5`): Buttons and primary interactive elements
- **Light Gray Button** (`#F3F4F6`): Secondary action buttons with neutral appearance

### Neutral Scale
- **White** (`#FFFFFF`): Primary surface and text on dark backgrounds
- **Light Gray** (`#D1D5DB`): Borders and subtle dividers
- **Medium Gray** (`#888888`): Secondary text and disabled states
- **Dark Gray** (`#666666`): Tertiary text hierarchy
- **Charcoal** (`#555555`): Low-emphasis text

### Surface & Borders
- **Black Surface** (`#000000`): Dark card and container backgrounds
- **Border Stroke** (`#000596` at 0.4 opacity): Subtle card borders with blue tint
- **Neutral Border** (`#D1D5DB`): Standard divider and UI borders

### Semantic / Status
- **Error** (`#FF253A`): High-priority error states and destructive actions
- **Error Secondary** (`#DC3741`): Secondary error messaging

## 3. Typography Rules

### Font Family
- **Primary:** Poppins (sans-serif, hosted via Google Fonts). Fallback: `Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Secondary:** Inter (sans-serif, hosted via Google Fonts). Fallback: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Tertiary:** Arial. Fallback: `Arial, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display XL | Poppins | 72px | 900 | normal | 0px | Hero heading, maximum emphasis |
| Display Large | Poppins | 64.8px | 900 | 68.04px | 0px | Main page heading |
| Display | Poppins | 64px | 800 | normal | 0px | Large section heading |
| Heading 4 | Poppins | 16px | 700 | normal | 0px | Small section heading, card title |
| Body | Poppins | 20px | 500 | 30px | 0px | Primary paragraph text |
| Body Small | Inter | 16px | 500 | normal | 0px | Secondary body text, labels |
| Link | Inter | 16px | 400 | normal | 0px | Navigation links, inline links |
| List Item | Poppins | 16px | 400 | normal | 0px | List content |
| Button | Arial | 13.33px | 400 | normal | 0px | Button text (system font) |

### Principles
- **Weight as Emphasis:** Use weight progression (400 → 700 → 900) to establish visual hierarchy without relying solely on size
- **Generous Line Height:** Body text uses 1.5x line height (30px on 20px) for readability and elegance
- **Poppins for UI:** Use Poppins for all user interface elements, headings, and calls-to-action
- **Inter for Secondary:** Deploy Inter for navigation, labels, and contextual text
- **Size Consistency:** Maintain discrete sizes (16px, 20px, 64px, 72px) rather than arbitrary increments
- **All Caps Sparingly:** Use uppercase only in high-emphasis contexts (buttons, labels, small headings)

## 4. Component Stylings

### Buttons

#### Primary Button (Register / CTA)
- **Background:** `#FFFFFF`
- **Text Color:** `#000000`
- **Font:** Poppins, 16px, weight 800
- **Padding:** `12px 32px`
- **Border:** `1px solid #000000`
- **Border Radius:** `8px`
- **Height:** `51px`
- **Line Height:** normal
- **Hover State:** Background darkens to `#F3F4F6`, text remains `#000000`
- **Active State:** Border becomes `#1A6FF5`, text becomes `#1A6FF5`

#### Secondary Button (Navigation / Text)
- **Background:** transparent
- **Text Color:** `#000000`
- **Font:** Poppins, 16px, weight 500
- **Padding:** `6.4px 8px`
- **Border:** none
- **Border Radius:** `8px`
- **Height:** `24px`
- **Line Height:** `24px`
- **Hover State:** Text color shifts to `#1A6FF5`
- **Focus State:** Underline appears in `#1A6FF5`

#### Icon Button (Circular)
- **Background:** `#F3F4F6`
- **Text Color:** `#000000`
- **Font:** Poppins, 13.33px, weight 400
- **Padding:** `0px`
- **Border:** none
- **Border Radius:** `50%`
- **Width & Height:** `28px`
- **Line Height:** normal
- **Hover State:** Background lightens to `#FFFFFF`, subtle shadow appears

#### Ghost Button
- **Background:** transparent
- **Text Color:** `#000000`
- **Font:** Arial, 13.33px, weight 400
- **Padding:** `0px`
- **Border:** none
- **Border Radius:** `0px`
- **Hover State:** Text color shifts to `#1A6FF5`

### Cards & Containers

#### Premium Stat Card (Stats Section)
- **Background:** `#000000`
- **Text Color:** `#FFFFFF`
- **Font:** Poppins, 20px, weight 600
- **Padding:** `32px 40px`
- **Border:** `1px solid rgba(0, 5, 150, 0.4)` (deep blue tint)
- **Border Radius:** `16px`
- **Box Shadow:** `rgba(0, 5, 150, 0.85) 0px 0px 50px 0px inset, rgba(0, 0, 0, 0.1) 0px 10px 25px 0px`
- **Line Height:** `19.2px`
- **Min Height:** `140px`
- **Hover State:** Inset shadow intensifies, border opacity increases to 0.6

#### Content Card
- **Background:** transparent
- **Text Color:** `#000000`
- **Font:** Times New Roman, 16px, weight 400
- **Padding:** `0px`
- **Border:** none
- **Border Radius:** `0px`
- **Box Shadow:** none

#### Text Overlay Card
- **Background:** transparent
- **Text Color:** `rgba(255, 255, 255, 0.9)`
- **Font:** Poppins, 16px, weight 600
- **Padding:** `0px`
- **Border:** none
- **Border Radius:** `0px`
- **Box Shadow:** none
- **Line Height:** `19.2px`

### Inputs & Forms

#### Text Input
- **Background:** `#FFFFFF`
- **Border:** `1px solid #D1D5DB`
- **Border Radius:** `8px`
- **Padding:** `12px 16px`
- **Font:** Poppins, 16px, weight 400
- **Text Color:** `#000000`
- **Placeholder Color:** `#888888`
- **Focus State:** Border color changes to `#1A6FF5`, box-shadow: `0 0 0 3px rgba(26, 111, 245, 0.1)`
- **Error State:** Border color `#FF253A`, text color `#FF253A`
- **Disabled State:** Background `#F3F4F6`, border `#D1D5DB`, opacity 0.5

#### Label
- **Font:** Inter, 16px, weight 500
- **Text Color:** `#000000`
- **Margin Bottom:** `8px`
- **Display:** Block

### Navigation

#### Top Navigation Bar
- **Background:** `rgba(255, 255, 255, 0.98)` (near white with slight transparency)
- **Border Bottom:** `1px solid #D1D5DB`
- **Padding:** `16px 40px`
- **Height:** Auto (minimum 60px)
- **Box Shadow:** `rgba(0, 0, 0, 0.05) 0px 4px 30px 0px`
- **Z-index:** 10

#### Navigation Link
- **Font:** Inter, 16px, weight 400
- **Text Color:** `#000000`
- **Padding:** `6.4px 3.2px`
- **Hover State:** Text color becomes `#1A6FF5`, underline appears
- **Active State (current page):** Border-bottom `2px solid #000000`

#### Navigation Link (Active Accent)
- **Text Color:** `#1A6FF5`
- **Underline:** `2px solid #1A6FF5`

### Links

#### Standard Hyperlink
- **Font:** Inter, 16px, weight 400
- **Text Color:** `#0000EE` (true blue)
- **Text Decoration:** none
- **Hover State:** Text color darkens to `#000596`, underline appears `1px solid #000596`
- **Visited State:** Color becomes `#6B7280`

#### Text Link (Dark Background)
- **Font:** Inter, 16px, weight 500
- **Text Color:** `#000000`
- **Hover State:** Color becomes `#1A6FF5`

## 5. Layout Principles

### Spacing System

Base unit: **4px**

Spacing scale and usage:
- **4px:** Micro-spacing between adjacent elements, icon-text gaps
- **8px:** Tight spacing within compact components
- **12px:** Small gap between form fields or list items
- **16px:** Standard padding within cards and containers
- **20px:** Generous gap between content sections
- **24px:** Section separator spacing
- **32px:** Card padding and horizontal container padding
- **40px:** Large container padding, main section padding
- **44px:** Extra-large spacing for major content grouping
- **48px:** Margin between major sections
- **60px:** Hero section vertical spacing
- **64px:** Large gap between distinct page regions
- **72px:** Maximum padding for full-bleed sections

### Grid & Container

- **Max Width:** 1400px for main container
- **Column Strategy:** 12-column fluid grid for desktop, adapts to single column on mobile
- **Section Patterns:** Full-bleed colored sections with internal padding of 40px–72px; alternating background colors (white, black, light gray)
- **Sidebar:** Optional 25% width sidebar for secondary navigation
- **Gutter:** 24px between columns

### Whitespace Philosophy

The design prioritizes breathing room over density. Large margins (48px–72px) separate major content sections, allowing users to process information in logical chunks. Padding within cards ranges from 32px–40px, ensuring text never feels cramped. Vertical rhythm uses the 4px scale consistently to create visual coherence without rigid constraints.

### Border Radius Scale

- **0px:** No radius (cards with flat edges, minimal UI)
- **8px:** Standard radius for buttons, input fields, small cards
- **16px:** Large card radius, premium components
- **50%:** Full radius for circular buttons and avatars

### Border Widths

- **Thin:** `1px` – Standard borders on buttons, input fields, card outlines
- **Medium:** `2px` – Active states, navigation underlines, focus rings
- **Thick:** `4px` – Strong emphasis borders (rarely used; reserved for major focus states)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base | No shadow | Flat text, icons, neutral backgrounds |
| Raised | `0px 4px 30px rgba(0, 0, 0, 0.05)` | Navigation bars, subtle lift |
| Elevated | `0px 10px 25px rgba(0, 0, 0, 0.1)` | Cards, modals, floating elements |
| Premium | `rgba(0, 5, 150, 0.85) 0px 0px 50px 0px inset, rgba(0, 0, 0, 0.1) 0px 10px 25px 0px` | Hero cards, stat boxes, premium components |
| Deep | `0px 15px 40px rgba(0, 0, 0, 0.2)` | Modals, overlays, highest emphasis |

**Shadow Philosophy:** Shadows in this system convey elevation and importance while maintaining readability. The premium inset shadow (used on stat cards) creates a glowing, enclosed feeling that communicates prestige and value. Subtle drop shadows (4–10px offset) provide just enough depth to separate components without distraction. Dark backgrounds make softer shadows necessary; lighter overlays use slightly stronger shadows.

### Opacity Levels

- **100%** (`1.0`): Default state, full visibility
- **84%** (`0.84`): Slight transparency for hover states on premium elements
- **83%** (`0.83`): Hover state variants
- **75%** (`0.75`): Disabled or low-emphasis states
- **70%** (`0.70`): Very light emphasis, background overlays
- **40%** (`0.4`): Subtle border tints (e.g., `rgba(0, 5, 150, 0.4)`)

### Z-index / Layering

- **1–3:** Base layer – Content, text, icons
- **5:** Floating elements – Cards, panels, slightly elevated components
- **10:** Dropdowns, tooltips – Hover menus, popovers
- **36–38:** Modals and overlays – Dialog boxes, full-screen overlays
- **100+:** (Reserved) Toast notifications, highest-priority alerts

## 7. Do's and Don'ts

### Do
- **Use bold typography weights (700–900)** to create immediate visual hierarchy and guide user attention
- **Apply the premium shadow treatment** to stat cards and achievement metrics to emphasize success narratives
- **Maintain high contrast** between text and backgrounds; black text on white, white text on dark navy/black
- **Pair blue accents with dark backgrounds** to create dynamic, energetic interactions
- **Use generous padding (32px–40px)** in cards and containers for premium, spacious feel
- **Employ 16px border-radius** on all major cards for consistency and polish
- **Leverage Poppins weight variations** (400, 500, 700, 800, 900) rather than size changes for hierarchy
- **Deploy inset shadows** on stat/achievement cards to create a "glowing achievement" aesthetic
- **Stack headings with 64px–72px sizes** to command attention on hero sections
- **Include clear focus states** on all interactive elements using `#1A6FF5` border or text color

### Don't
- **Don't use light shadows on dark backgrounds**—instead, use stronger, more saturated shadow colors or inset glows
- **Don't mix border-radius values arbitrarily**; stick to 0px, 8px, 16px, or 50%
- **Don't reduce font weight below 400**; it sacrifices readability
- **Don't create buttons without clear hover states**; always define `:hover` and `:focus` behavior
- **Don't place small text (under 14px) on patterned or textured backgrounds** without sufficient contrast
- **Don't nest more than 3 levels of shadow depth**; simplify complex layouts
- **Don't mix Poppins and Inter randomly**; reserve Inter for labels and secondary text, Poppins for UI and headings
- **Don't use opacity alone to indicate disabled state**; combine with color change or border adjustment
- **Don't create cards without adequate padding**; minimum 16px on small cards, 32px on larger ones
- **Don't exceed 120% line-height for large display text**; maintain tight leading for bold, confident appearance

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width | Key Changes |
|---|---|---|
| Mobile | 320px–480px | Single-column layout, full-bleed padding 16px, font sizes reduce by 10%, stacked cards, hamburger navigation |
| Tablet | 481px–768px | Two-column grid, padding 24px, font sizes reduce by 5%, condensed cards |
| Desktop | 769px–1024px | Three-column grid, padding 32px–40px, full typography scale, normal card sizing |
| Large Desktop | 1025px+ | Four-column grid, max-width 1400px, padding 40px–72px, all typography and components at full scale |

### Touch Targets

- **Minimum tap target:** 44px × 44px (including all interactive elements)
- **Button minimum:** 51px height (as designed), 145px width for primary CTAs
- **Link tap area:** Extend padding to 12px around text links to meet minimum
- **Icon buttons:** 28px × 28px minimum; larger (40px+) for primary actions
- **Form inputs:** Minimum 44px height for mobile, 40px for desktop

### Collapsing Strategy

- **Hero sections:** Full viewport height on desktop → 60% viewport height on tablet → content height on mobile with reduced padding
- **Navigation:** Horizontal nav bar on desktop → hamburger menu on tablet/mobile (36px height)
- **Card grids:** 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- **Typography:** Display (72px) → 48px (tablet) → 36px (mobile); body (20px) → 18px (tablet) → 16px (mobile)
- **Padding:** 72px (desktop) → 40px (tablet) → 16px (mobile)
- **Statistics cards:** Full 4-row layout → 2×2 grid → single column with horizontal scroll on very small devices
- **Images:** 100% container width on mobile, max-width maintained on desktop

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Electric Blue (`#1A6FF5`) for buttons and active states
- **Background (Dark):** Deep Black (`#000000`) for premium card surfaces
- **Background (Light):** White (`#FFFFFF`) for primary content areas
- **Heading Text:** Black (`#000000`) on light; White (`#FFFFFF`) on dark
- **Body Text:** Black (`#000000`) (primary), Medium Gray (`#888888`) (secondary)
- **Border:** Light Gray (`#D1D5DB`) standard; Blue-tinted (`rgba(0, 5, 150, 0.4)`) for premium cards
- **Error:** Red (`#FF253A`) for validation and destructive actions
- **Accent (Secondary):** Bright Blue (`#2D87FF`) for hover and focus states

### Iteration Guide

1. **Start with Poppins typography** at weights 400, 500, 700, 800, 900 for all headings, buttons, and primary UI; use Inter only for labels and secondary navigation
2. **Apply black (`#000000`) as the dominant text color** on light backgrounds and white (`#FFFFFF`) on dark backgrounds; never mix without high contrast verification
3. **Use `#1A6FF5` (Electric Blue)** for all primary interactive states (button hover, link focus, active navigation items)
4. **Build card components with premium shadow treatment** (`rgba(0, 5, 150, 0.85) 0px 0px 50px 0px inset, rgba(0, 0, 0, 0.1) 0px 10px 25px 0px`) on dark (`#000000`) backgrounds for stat/achievement cards; use `rgba(0, 0, 0, 0.05) 0px 4px 30px 0px` for navigation and regular containers
5. **Enforce spacing discipline:** Use only values from the scale (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 60px, 64px, 72px); avoid arbitrary spacing
6. **Set button styling uniformly:** Primary buttons 51px height, 12px vertical padding, 32px horizontal padding, 8px border-radius, 800 weight Poppins, 16px font; secondary buttons transparent with hover color shift to `#1A6FF5`
7. **Maintain typographic hierarchy rigorously:** Display (72px, 900 weight) > Heading (64px, 800 weight) > Body (20px, 500 weight) > Label (16px, 500 weight Inter)
8. **Apply responsive breakpoints without arbitrary tweaks:** Desktop (1025px+) → Tablet (481–1024px) → Mobile (320–480px); reduce font by 10% on mobile, maintain baseline spacing structure
9. **Never use opacity alone for disabled states:** Combine opacity (0.75 or 0.7) with color change or border adjustment to ensure accessibility
10. **Reserve border-radius to three values only:** `0px` (flat), `8px` (buttons/inputs), `16px` (cards), `50%` (circles); apply consistently across all similar components