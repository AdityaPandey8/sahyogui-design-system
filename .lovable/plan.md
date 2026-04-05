

# SahyogAI — AI Insights Engine + Apple-Inspired Design Refresh

## Overview

Build a deterministic, frontend-only AI insights engine with five calculation functions, a new `AIInsightsPanel` component, and integrate it across all dashboards. Simultaneously refresh the color system to match the Apple HIG-inspired palette provided.

---

## 1. AI Calculation Engine

**New file:** `src/lib/ai-insights.ts`

Five pure functions operating on issue data:

| Function | Logic |
|---|---|
| `calcPriorityScore(issue)` | Weighted formula: severity×0.3 + population×0.25 + urgency×0.25 + locationRisk×0.1 + delayImpact×0.1, normalized to 0–100 |
| `predictResponseTime(issue)` | Travel time (mock 10–30 min by category) + task time (Disaster: 30–60, Health: 20–40, other: 10–20) |
| `estimateVolunteers(issue)` | `Math.ceil(affectedPeople / 20)` |
| `estimateNGOs(issue)` | Disaster→2, Health→1, Food→1–2, Complex→3 |
| `generateSuggestion(score)` | 80+: "Immediate action — deploy X volunteers", 50–80: "Urgent — schedule within 1 hour", <50: "Low priority — next shift" |

Uses existing `Issue` type fields (`urgency`, `affectedPeople`, `category`). Add `severity` field to `Issue` interface in `mockData.ts` (default derived from `urgency` for existing data). Add `locationRisk` as an optional field (defaults to 6).

---

## 2. AI Insights Panel Component

**New file:** `src/components/dashboard/AIInsightsPanel.tsx`

A card-based panel displaying all five computed values for a given issue:

- **Priority Score** — large bold number with color-coded progress bar (red/yellow/green)
- **Urgency Label** — badge
- **Est. Response Time** — in minutes
- **Volunteers Required** — number
- **NGOs Required** — number
- **Suggested Action** — text block
- Footer label: *"AI-Powered Insights (Simulated)"*

Replaces the existing `AIPriorityCard` with richer data. Uses the same visual language (rounded-xl, shadows, color coding).

---

## 3. Dashboard Integration

### NGO Dashboard (`DashboardNGO.tsx`)
- Show `AIInsightsPanel` inside the Issue Detail Dialog when viewing an issue
- Add top AI-priority issues to the overview section

### Admin Dashboard (`DashboardAdmin.tsx`)
- Replace `AIPriorityCard` usage with `AIInsightsPanel` for top-priority issues in overview
- Show panel in issue detail view

### Volunteer Dashboard (`DashboardVolunteer.tsx`)
- Add "Recommended Tasks" section in overview using priority score sorting
- Show AI insights when viewing issue details

### Public Dashboard (`DashboardPublic.tsx`)
- Show simplified AI priority info in issue cards

---

## 4. Mock Data Updates

**Edit:** `src/data/mockData.ts`
- Add optional `severity` field to `Issue` interface (type `Urgency`, defaults to matching `urgency`)
- Add optional `locationRisk` field (number 1–10, default 6)
- Populate existing issues with varied severity/locationRisk values

---

## 5. Color System Refresh (Apple HIG)

**Edit:** `src/index.css`

Update CSS custom properties to match the provided palette:

| Token | Light | Dark |
|---|---|---|
| `--background` | `#F9FAFB` (210 20% 98%) | `#0F172A` (215 47% 11%) |
| `--card` | `#FFFFFF` | `#1E293B` |
| `--primary` | `#2563EB` | same |
| `--success` | `#22C55E` | same |
| `--warning` | `#F59E0B` | same |
| `--danger/destructive` | `#EF4444` | same |
| `--foreground` | `#0F172A` | `#F8FAFC` |
| `--muted-foreground` | `#64748B` | `#94A3B8` |

Add Apple-style elevation tokens via Tailwind config:
```
shadow-card: "0 4px 20px rgba(0,0,0,0.05)"
shadow-hover: "0 8px 30px rgba(0,0,0,0.08)"
```

---

## 6. Micro-Interactions & Polish

**Edit:** `tailwind.config.ts`
- Add `shadow-card` and `shadow-hover` custom shadows
- Existing animations (fade-in, scale-in, slide-up) already cover most needs

**Edit:** Card components across dashboards
- Apply `shadow-card hover:shadow-hover transition-shadow` pattern
- Ensure `rounded-xl` consistency

---

## Files Summary

| Action | File |
|---|---|
| Create | `src/lib/ai-insights.ts` |
| Create | `src/components/dashboard/AIInsightsPanel.tsx` |
| Edit | `src/data/mockData.ts` — add severity/locationRisk fields |
| Edit | `src/index.css` — refined color tokens |
| Edit | `tailwind.config.ts` — add shadow tokens |
| Edit | `src/pages/DashboardAdmin.tsx` — integrate AIInsightsPanel |
| Edit | `src/pages/DashboardNGO.tsx` — integrate AIInsightsPanel |
| Edit | `src/pages/DashboardVolunteer.tsx` — add recommended tasks + insights |
| Edit | `src/pages/DashboardPublic.tsx` — show priority in cards |
| Edit | `src/components/dashboard/IssueDetailDialog.tsx` — embed AIInsightsPanel |

