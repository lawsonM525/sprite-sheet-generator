# Front-End Guidelines — 10,000hours.com

This document defines the visual system, components, and interaction rules for a flat, dark, minimal time-tracking app with bright, category-based accents. It should let anyone rebuild the UI consistently without guessing.

⸻

## 1) Brand & Visual Principles
- **Purpose:** truth-first time accounting. Log the full 24 hours; reveal where time actually goes.
- **Look:** dark surfaces, crisp typography, no gradients, no glass, no neumorphism. Flat color blocks only.
- **Color logic:** neutral greys for chrome; vivid, flat accents for categories and a single primary CTA color.
- **Motion:** fast and subtle (150–200ms), used to confirm actions. No parallax; respect prefers-reduced-motion.
- **Density:** compact but breathable. 8px spacing system, 10–12px corner radii.
- **Accessibility:** WCAG AA contrast minimum; keyboard-first flows; logical reading order.

⸻

## 2) Design Tokens

### 2.1 Colors (Dark Theme Only)
```
// Neutrals
bg/base        #0B0D10
bg/surface     #111418
bg/elevated    #151A1F
border/subtle  #1D232B
text/primary   #E9EDF1
text/secondary #B2BCC9
text/muted     #6B7684

// Brand/CTA
cta/pink       #F11D75   // primary buttons, toggles, selection

// Category Accent Pool (flat; assign per-category)
accent/pink    #F11D75
accent/teal    #16C7A8
accent/blue    #3A8DFF
accent/violet  #8B5CF6
accent/lime    #45E06F
accent/amber   #FFB020
accent/red     #FF5C5C
accent/cyan    #22D3EE

// State
success        #26D07C
warning        #FFB020
danger         #FF5C5C
```

**Rules**
- Category color = dot, pill, timeline block, and chart segment for that category.
- CTA uses cta/pink only. Do not recolor the primary button to a category color.

### 2.2 Typography
- **Family:** Inter (system fallback: ui-sans-serif, system-ui, -apple-system).
- **Weights:** 400, 500, 600.
- **Scale (rem):** 32/24/20/16/14/12 for h1/h2/h3/body/label/caps.
- **Letter-spacing:** default; for overlines/caps use +2%.

### 2.3 Spacing, Radius, Elevation
- **Spacing:** 8px grid. Common paddings: 12, 16, 20, 24.
- **Radius:** component 10px; chips 16px; pills 999px.
- **Elevation:** use bg/elevated + 1px border/subtle. Optional subtle shadow 0 4px 16px rgba(0,0,0,.3) for modals only.

### 2.4 Iconography
- 1.5px rounded stroke; filled variant when active.
- Color: inherit text color or category accent.

⸻

## 3) Layout & Navigation

### 3.1 Breakpoints
- **xs (≤480):** bottom tab bar
- **sm (481–768)**
- **md (769–1200)**
- **lg (≥1201)**

### 3.2 App Shell
- **Mobile:** bottom nav (Timer • Timeline • Insights • Notes • Settings)
- **Desktop:** left sidebar (same order), content to the right.
- **Top bar:** sticky with page title, search/quick add, and date controls (where relevant).

⸻

## 4) Global Copy & Tone
- Timer input label: “what are you doing?”
- CTA (start): “start logging”
- Pause dialog: “pause log”
- Stop dialog: “finish log”
- Discard: “discard log”
- Notes placeholder: “write what happened… wins, blockers, context.”
- Insights header: “truth over vibes. here’s where your time went.”

Keep copy short, sentence-case, friendly. No exclamation marks in system UI.

⸻

## 5) Core Components

All components should ship as composable React/TSX with Tailwind (or shadcn/ui primitives), using the design tokens above.

### 5.1 Button
- **Variants:** primary (cta/pink), secondary (surface with border), ghost (transparent).
- **States:** hover (5% lighten), active (press down), focus ring 2px cta/pink at 50% opacity.
- **Sizes:** md (40px), lg (48px).

### 5.2 Category Chip
- Dot + label, pill shape, background = bg/surface, border = accent at 30% opacity.
- Active state fills with the accent at 15% opacity; text remains text/primary.

### 5.3 Color Picker Grid
- 8×6 swatches, circular 28px, selected with 2px text/primary ring.

### 5.4 Timer Dial
- SVG/CANVAS donut with a single flat accent fill for elapsed.
- Center knob (drag to set duration), minute ticks at 5-min intervals.
- Fallback numeric fields (hh:mm) for accessibility.

### 5.5 Session Card (List)
- Left spine = category color, 4px.
- Title, timestamp range, duration, small chip for category.
- Icons: edit, split, delete.

### 5.6 Timeline Block
- Rounded rectangle filled with category accent at 80–90% saturation; text white.
- Multi-line truncation. Resize handles (top/bottom), drag to move.
- Conflict shows thin outline only; do not stack with opacity.

### 5.7 Sheet / Drawer
- Right-side panel for editing a session; 480px desktop, full-height mobile.

### 5.8 Chart Card
- Title, range selector, legend chips that map to category colors.
- Gridlines subtle (border/subtle); labels text/secondary.

### 5.9 Form Fields
- Filled dark input, 1px border on focus.
- Placeholder text/muted. Error text in danger.

### 5.10 Toast
- Surface on elevated background; left accent bar uses action color.

⸻

## 6) Page-Level UI Guidelines

### 6.1 Timer (Now)
- **Header:** Category chip dropdown; Activity input; optional tags.
- **Dial:** shows configured duration or live elapsed.
- **Controls Row:** start/pause/stop, add note, more (split/duplicate/clear).
- **Suggestions:** list of recent activities with their category pill and typical duration.
- **Empty state:** “press start logging or pick a time on the timeline.”

### 6.2 Timeline
- **Views:** Day (24h column), Week (7 columns).
- **Add:** tap/drag on empty area opens New Log with the range prefilled.
- **Unassigned time:** zebra shading with an inline “log this time” button.
- **Sleep visual:** thicker block with rounded “pill” corners to stand out.

### 6.3 Insights
- **Top summary:** total logged, average/day, most-time category, unassigned minutes.
- **Charts:**
  - Stacked bars (daily distribution)
  - Radial progress per skill → % toward 10,000 hours
  - Hour-of-day × category heatmap
  - Streaks (days hitting target)
- **Filters:** date range, categories multi-select, “skills only”, include/exclude life-maintenance (sleep/eat).

### 6.4 Notes
- Large editor; session link chips when opened from a session.
- List view with left color spine; quick copy button; search with full-text.

### 6.5 Categories
- **Table:** dot, name, type (skill / life-maintenance / admin / social / other), “counts toward mastery” toggle, Edit.
- **Add Category:** modal with name + color grid + type + mastery toggle.

### 6.6 Settings
- Account (Clerk), timezone, rounding (1/5/15min), week start, targets.
- Data export/import, delete account.
- AI summaries toggle + clear disclosure.

⸻

## 7) Interactions & Input
- **Keyboard:**
  - S start/stop log, P pause/resume, N note, [ ] −/+ 1 min, ⌘K quick add.
- **Gestures (mobile):** long-press block to edit; drag edges to resize.
- **Drag & Drop:** within a day, same category retains color; cross-day allowed only in Week view.
- **Split:** choose a timestamp; UI preview shows two blocks before committing.
- **Undo/Redo:** last 10 changes within the page lifetime.

⸻

## 8) Charts Style
- **Library:** ECharts (or Recharts) with flat fills only. No drop shadows, no gradients.
- **Category color mapping** must be stable across all charts.
- **Legend chips** filter series on click; transition animates within 150ms.
- **Axis labels:** text/secondary; **gridlines:** border/subtle; 8px radius on bars.
- Provide color-blind alternative palette (e.g., add patterns/stripes for conflicting colors).

⸻

## 9) Accessibility
- All interactive elements have visible focus rings.
- Timer dial has ARIA live region that announces elapsed time changes when active.
- Provide numeric time input alongside the dial.
- Non-color indicators for category (icon/initial) in legends for color-blind users.
- Test all flows with keyboard only.

⸻

## 10) Performance
- Lazy-load charts and timeline.
- Virtualize long notes lists.
- Do not ship heavy fonts (>2 variants).
- Cache recent queries (TanStack Query); debounce text search.

⸻

## 11) QA Checklist (per page)
- Contrast meets AA.
- All actions reachable by keyboard.
- Start/pause/stop flows never lose data on refresh (autosave).
- Category color is consistent across list, timeline, notes, charts.
- No gradients anywhere.

⸻

Use this guide with the App Flow Spec to lock the visual language while implementing journeys and states.
