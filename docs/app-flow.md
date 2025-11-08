# App Flow Spec — 10,000hours.com

This section documents the end-to-end user journeys, screens, states, and data exchanged between front-end and API.

⸻

## Entities & Concepts
- **Category:** user-defined label with color + type. Some categories are flagged Counts Toward Mastery.
- **Session (Log):** contiguous time block with `start`, `end`, `durationMin`, `categoryId`, `title`, optional quality 1–5, `tags`, `noteId?`.
- **Note:** free text, optionally linked to one or more sessions.
- **Summary:** precomputed day/week/month totals for fast Insights.
- **Skill Pace:** projection toward 10,000 quality-weighted hours for categories marked as “skill.”

⸻

## Route Map (Next.js)
- `/` (Landing)
- `/app` (Authenticated shell)
- `/app/now` (Timer / Quick Log)
- `/app/timeline` (Day/Week views)
- `/app/insights` (Analytics)
- `/app/notes` (Notes list + editor)
- `/app/categories` (Manage categories)
- `/app/settings` (Profile, preferences, data)

⸻

## Onboarding (First Run)
1. Welcome → CTA “create my space”.
2. Timezone detected; allow change.
3. Starter Categories
   - Preload suggestions (Sleep, Food, Coding, CS Girlies, Friends, God, Exercise, Social Media Posts).
   - User adds/edits colors; sets Type and Counts Toward Mastery.
4. Targets (optional): weekly targets for chosen skills.
5. Import (optional): CSV (sleep), ICS (calendar) preview screen.
6. Finish → lands on Timer with a short guided tooltip tour.

**Edge Cases**
- Skip creates minimal set (Sleep, Food, General).
- If import creates overlaps, queue “resolve overlaps” banner linking to Timeline.

⸻

## Logging Time

### A) Live Log (Timer)
- **Inputs:** category (default last used), title, tags.
- **Start Logging:** creates a running session (`start=now`, `end=null`).
- **In-progress actions:**
  - add note (auto-link to running session)
  - adjust time ±1/5 min
  - pause / resume
- **Stop (Finish Log):**
  - fills `end=now`, computes `durationMin`
  - mini-review: quality (1–5, optional; hidden for life-maintenance)
  - save & close
- **Discard Log:** confirm, then delete the in-progress session.

**Error/Offline**
- If offline, persist to IndexedDB with `clientId`; sync later.
- If tab closes, autosave every 5s.

### B) Manual Entry (from Timeline or Quick Add)
1. Select range (drag on timeline or pick start/end).
2. Choose category; enter title; optional note; optional quality.
3. Save → creates a fixed session; timeline updates.

### C) Edit / Split / Merge
- **Edit:** opens Session Editor Sheet (time pickers, category select, note, quality).
- **Split:** choose split point; confirm → creates two sessions.
- **Merge:** select adjacent sessions with same category; confirm → single session.

⸻

## Timeline (Day & Week)
- **Day View**
  - 24h vertical grid; current time marker.
  - Unassigned gaps display shaded background with “log this time”.
  - Dragging creates a new block with start/end prefilled.
- **Week View**
  - Seven columns; blocks stacked per day.
  - Drag across days; resize on either side.
- **Conflict Resolution**
  - If overlap happens (via import or edit), show outline and “resolve” pill → choose which to trim or split.

⸻

## Insights

### Overview Cards (top)
- Total Logged (range)
- Average per Day
- Most-Time Category
- Unassigned Minutes

### Visualizations
1. **Daily Distribution (Stacked Bars)**
   - X = day; Y = minutes; stacks = categories.
   - Tooltip shows exact minutes and percentage per category.
2. **Mastery Progress (Radial per Skill)**
   - current quality-weighted hours / 10,000
   - projected mastery date using last 8-week rolling average.
3. **Hour × Category Heatmap**
   - 0–23 hours vs. categories; intensity = minutes.
4. **Streaks**
   - days achieving category weekly target.

### Filters & Controls
- Range picker (week, month, quarter, custom).
- Category multi-select w/ chips.
- Skills-only toggle.
- Include/Exclude Sleep & Food.

### AI Insight Tiles (optional, when enabled)
- “you spent 12h (+30%) on coding vs last week”
- “+4.3h/week on ML → mastery pulls into Aug 2029”

⸻

## Notes
- **Composer:** big textarea; link picker for related sessions.
- **Auto-link:** notes written during a running log link on save.
- **List:** reverse chrono; left color spine; duration badges; copy button.
- **Search:** full-text + filters (category, date range, tags).
- **Summaries:** AI generates day/week TL;DR and action items (optional).

⸻

## Categories
- **List Screen:**
  - row = dot + name + type badge + mastery toggle + Edit
- **Add / Edit Modal:**
  - name (text)
  - Type: skill, life-maintenance, admin, social/spiritual, other
  - Counts Toward Mastery (toggle)
  - color grid (stable mapping)
  - default weekly target (optional)
- **Archive:** archived categories hidden by default; can be restored.

⸻

## Settings
- **Account (Clerk):** name, photo, email.
- **Preferences:** timezone, rounding (1/5/15), week start day, default log duration.
- **Targets:** per skill weekly targets.
- **AI:** enable summaries; show data usage note.
- **Data:** export CSV/JSON; import; delete account; backup snapshots.

⸻

## State & Error Handling
- Autosave notes and running logs every 5s.
- Offline Mode: banner + local queue; reconcile on reconnect (idempotent using `clientId`).
- Session Integrity: no zero or negative durations; guard with validation before save.
- Timezones: store UTC; render with user timezone; use date truncation with TZ in all aggregations.
- DST: display true local times; do not silently shift past entries.

⸻

## Analytics (Product Telemetry — optional)
- `session_started`, `session_finished`, `session_split`, `session_edited`
- `note_created`, `note_summarized`
- `category_created`, `category_toggled_mastery`
- `insights_viewed`, `filter_changed`

Include only anonymous, per-user metrics; never send note text without explicit AI opt-in.

⸻

## Data Contracts (Frontend ⇄ API)

### Session (POST `/api/session`)
```json
{
  "categoryId": "string",
  "title": "string",
  "start": "2025-04-26T14:05:00Z",
  "end": "2025-04-26T15:00:00Z",      // omit if live
  "durationMin": 55,                  // server recalculates
  "quality": 4,
  "tags": ["coding", "web"],
  "clientId": "uuid"                  // for offline sync
}
```

### Note (POST `/api/notes`)
```json
{
  "body": "string",
  "sessionIds": ["..."]               // optional
}
```

### Insights (GET `/api/insights/summary`)

Query: `granularity=day|week|month&from&to&categoryIds[]&skillsOnly&includeLife=true|false`

Response includes totals by category, unassigned minutes, rolling pace, and mastery projections.

⸻

## Keyboard Shortcuts (Global)
- S start/stop log
- P pause/resume
- N add note
- [ / ] decrease/increase 1 minute
- ⌘K quick add anywhere

Provide a help modal (?) listing these.

⸻

## Empty, Loading, and Error States
- **Timer empty:** “no active log. press start logging or open the timeline.”
- **Timeline empty day:** “no logs yet — drag to create your first block.”
- **Insights empty:** “log at least one day to see trends.”
- **Notes empty:** “write it down while it’s fresh.”
- **Loading:** skeleton bars/blocks; avoid spinners where skeletons work.
- **Errors:** inline message + retry button; never block navigation.

⸻

## Review Checklist Before Ship
- Sleep & Food can be logged without “focus” wording anywhere.
- 24h day view can be filled entirely; gaps are obvious and loggable.
- Category color mapping is consistent across list, timeline, notes, insights.
- Charts use flat fills; legends filter correctly.
- Keyboard shortcuts work; accessible numeric fallback for the dial.
- Autosave + offline retains logs on refresh or tab close.
- Export CSV reflects the same durations as charts.
- No gradients, glass, or soft blurs anywhere.

⸻

Use these two docs together: the Front-End Guidelines lock the visual language; the App Flow Spec locks the journeys and states. Drop them into `/docs/ui-guidelines.md` and `/docs/app-flow.md` and you’re ready to ticket out components and routes.
