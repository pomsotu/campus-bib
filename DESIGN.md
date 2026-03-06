# Design System: CampusBIB Dashboard

## 1. Visual Theme & Atmosphere

**Mood:** Premium dark-mode SaaS dashboard — confident, spacious, and data-rich without feeling cluttered. The overall aesthetic is "enterprise-grade midnight" with warm accent punches. Think Linear meets Stripe Dashboard.

**Density:** Medium — generous whitespace between sections, compact data rows within cards. The UI should breathe without wasting screen real estate.

**Philosophy:** Dark-first with glass-morphism card surfaces floating above a deep navy canvas. Subtle gradients create depth. Interactive elements glow on hover. Everything feels intentional and polished.

## 2. Color Palette & Roles

| Descriptive Name     | Hex                      | Role                                                       |
| -------------------- | ------------------------ | ---------------------------------------------------------- |
| **Midnight Canvas**  | `#020617` (slate-950)    | Primary page background — the deepest layer                |
| **Obsidian Surface** | `rgba(255,255,255,0.03)` | Card/panel backgrounds — barely-there frosted glass        |
| **Ghost Border**     | `rgba(255,255,255,0.06)` | Card borders, dividers — whisper-thin separation           |
| **Hover Frost**      | `rgba(255,255,255,0.04)` | Interactive hover states on surfaces                       |
| **Ember Orange**     | `#EA580C` (orange-600)   | Primary accent — CTAs, active nav, key metrics             |
| **Warm Amber**       | `#F97316` (orange-500)   | Brighter orange variant — gradient endpoints, hover states |
| **Ocean Teal**       | `#14B8A6` (teal-500)     | Secondary accent — secondary metrics, session-related      |
| **Deep Teal**        | `#0D9488` (teal-600)     | Darker teal — gradient starts                              |
| **Pure White**       | `#FFFFFF`                | Primary text — headings, values, active labels             |
| **Mist Gray**        | `#94A3B8` (slate-400)    | Secondary text — labels, descriptions, nav items           |
| **Ash Gray**         | `#64748B` (slate-500)    | Tertiary text — timestamps, hints, placeholders            |
| **Shadow Gray**      | `#475569` (slate-600)    | Faintest text — disabled, decorative                       |
| **Success Green**    | `#10B981` (emerald-500)  | Completed states, positive indicators                      |
| **Warning Amber**    | `#F59E0B` (amber-500)    | Pending states, attention needed                           |
| **Danger Red**       | `#EF4444` (red-500)      | Errors, destructive actions, overdue                       |
| **Info Blue**        | `#3B82F6` (blue-500)     | New items, informational badges                            |

## 3. Typography Rules

- **Font Family:** System font stack (-apple-system, system-ui, sans-serif) — clean and native-feeling
- **Headings:** Font-weight 600 (semibold), tracking-tight, white text. Page titles at ~24px, section headers at ~16px
- **Body / Labels:** Font-weight 400-500, slate-400 for labels, slate-500 for secondary info
- **Metric Values:** Font-weight 700 (bold), large size (32-48px), white text with tight tracking
- **Micro Text:** 10-11px, slate-500/600, used for timestamps and badges

## 4. Component Stylings

### Buttons

- **Primary:** Gradient background from Ember Orange to Warm Amber (`from-orange-600 to-orange-500`), white text, gently rounded corners (rounded-xl ~12px), subtle orange glow shadow, scales up 1% on hover
- **Secondary:** Ghost style — transparent background, ghost border, white/slate-400 text, hover fills with Hover Frost
- **Destructive:** Red-500 background, white text, same rounded-xl shape

### Cards / Containers

- **Standard Card:** Obsidian Surface background with Ghost Border, generously rounded corners (rounded-2xl ~16px), no shadow or very faint black/20 shadow
- **Metric Card:** Gradient fill (e.g., orange-600→orange-500), white text, decorative oversized circle in top-right corner at 10% opacity, rounded-2xl
- **Glass Card:** `backdrop-blur-xl`, Obsidian Surface background — used for overlays and floating panels

### Inputs / Forms

- **Text Inputs:** Obsidian Surface background, Ghost Border, rounded-xl, slate-600 placeholder text, white value text. On focus: orange-500/30 ring glow with orange-500/40 border
- **Labels:** 12px, font-medium, slate-400, slight margin below

### Badges / Status Pills

- **Shape:** Pill-shaped (rounded-full), tiny padding, 10-11px text
- **Variants by color:** Blue for "new", Emerald for "qualified/completed", Orange for "booked", Red for "cold/overdue", Teal for "scheduled", Amber for "pending"

### Navigation Sidebar

- **Background:** Slightly elevated from canvas (slate-900/950 tone)
- **Active Item:** Orange-500/10 background tint, orange-400 text, left accent bar
- **Inactive Item:** slate-400 text, hover brightens to white with Hover Frost bg
- **Brand Area:** Logo icon PNG + "CampusBIB" wordmark, separated from nav by Ghost Border

## 5. Layout Principles

- **Sidebar:** Fixed 240px wide on desktop, collapsible overlay on mobile
- **Header:** Sticky top bar with page title, description, notification bell with badge, user avatar
- **Content Grid:** 8px base spacing unit. Section gaps of 24-32px. Card internal padding of 20-24px
- **Responsive breakpoints:** Single column on mobile, 2-column on tablet, 3-4 column stat grid on desktop
- **Max content width:** None — content fills available space in the main area
- **Whitespace philosophy:** Spacious between major sections, compact within data-dense areas (tables, lists)

## 6. Design System Notes for Stitch Generation

When generating screens in Stitch, use these guidelines:

**Background:** Deep dark navy background (#020617). All content sits on this midnight canvas.

**Cards:** Semi-transparent cards with very subtle white borders. Use `background: rgba(255,255,255,0.03)` with `border: 1px solid rgba(255,255,255,0.06)`. Corners are generously rounded (16px).

**Accent Colors:** Primary orange (#EA580C / #F97316) for CTAs, active states, and key metrics. Secondary teal (#14B8A6) for secondary data points and session-related UI.

**Text Hierarchy:** White (#FFFFFF) for headings and key values. Light gray (#94A3B8) for labels and descriptions. Darker gray (#64748B) for timestamps and hints.

**Interactive Elements:** Buttons use orange gradient fills with subtle glow shadows. Hover states slightly brighten surfaces. Cards may have a subtle scale transform on hover.

**Status Colors:** Green (#10B981) = success/completed, Blue (#3B82F6) = new, Orange (#F97316) = attention/booked, Red (#EF4444) = error/cold, Teal (#14B8A6) = scheduled, Amber (#F59E0B) = pending.

**Typography:** Clean sans-serif font. Bold weights for metrics and headings. Regular weight for body text. Tight letter-spacing on large numbers.

**Overall Feel:** Premium, polished, professional SaaS dashboard. Think Linear or Vercel dashboard quality. Not generic or template-like. Every element should feel intentional and refined.
