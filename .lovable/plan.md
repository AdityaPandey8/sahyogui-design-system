

# SahyogAI — Enhanced Map, AI Insights, Notifications & UI Polish

## Overview

The app already has a `HeatmapPlaceholder` component, `AIPriorityCard`, toast notifications via Sonner, and a solid design system. The request covers four areas — most of which are already partially implemented. This plan focuses on upgrading what exists and filling gaps.

---

## 1. Enhanced Map Component

**Current state:** `HeatmapPlaceholder` is a plain div with grid lines and colored dots. It works but looks flat.

**Upgrade approach** (no API key needed — keep simulated):

- **Replace the plain grid background** with a styled SVG-based map aesthetic: curved "road" lines, region outlines, subtle topographic texture using CSS gradients and SVG paths
- **Improve markers**: Add pulsing animation on High urgency dots, tooltip on hover showing issue title, size dots proportionally to `affectedPeople`
- **Add interactive click** on markers to open `IssueDetailDialog`
- **Volunteer Dashboard**: Add a dashed SVG line from volunteer position to nearest issue (simulated route/navigation)
- **Admin Dashboard**: Already has volunteers on map — add a count badge overlay ("12 issues, 7 volunteers")

**Files:** Edit `src/components/dashboard/HeatmapPlaceholder.tsx`

---

## 2. AI Insights Panels

**Current state:** `AIPriorityCard` exists and is used on Admin and NGO dashboards. Volunteer dashboard has a "best match" recommendation.

**Enhancements:**

- **NGO Dashboard — Issue Detail View**: Add AI insights inline inside `IssueDetailDialog` when opened from NGO dashboard (pass a prop `showAIInsights`). Show priority score bar, response prediction, and suggested action text
- **Admin Dashboard**: Already has `AIPriorityCard` — enhance with a color-coded progress bar for priority score and a blinking "AI" indicator
- **Volunteer Dashboard**: Enhance the existing "AI RECOMMENDED" card with a match percentage score and reasoning text ("Your First Aid skill matches this Health emergency")

**Files:** Edit `AIPriorityCard.tsx`, `IssueDetailDialog.tsx`, `DashboardVolunteer.tsx`

---

## 3. Notification System

**Current state:** Sonner toasts are already used throughout for button actions. No auto-triggered notifications.

**Enhancements:**

- **Auto-trigger notifications on mount**: Each dashboard shows 1-2 simulated notifications after a delay (e.g., 3s after page load)
  - Volunteer: "New task assigned to you" 
  - NGO: "New issue reported in your area"
  - Admin: "Issue pending verification"
  - Public: "Flood warning in your area"
- **Notification bell icon in header** with unread count badge — clicking shows a dropdown panel of recent notifications
- **Use existing Sonner** for the auto-dismiss toasts, plus a persistent notification panel component

**Files:** Create `src/components/dashboard/NotificationBell.tsx`, edit all 4 dashboard headers

---

## 4. UI/UX Polish

**Enhancements across all pages:**

### Animations
- Add `transition-all duration-200` and `hover:shadow-md hover:-translate-y-0.5` to all card components (IssueCard, MetricCard, NGOCard, VolunteerCard, AlertCard)
- Add `active:scale-[0.98]` to all buttons
- Add smooth `transition-colors` to theme toggle
- Stagger fade-in animations on dashboard metric cards using `animation-delay`

### Spacing & Layout
- Increase section spacing from `space-y-6` to `space-y-8` on dashboards
- Add consistent `p-5` (up from `p-3/p-4`) on issue cards in management panels
- Ensure header heights are consistent (h-16 with good vertical centering)

### Typography
- Section headings: upgrade from `text-sm font-bold` to `text-base font-bold` with a subtle bottom border or accent line
- Add `text-xs uppercase tracking-wider text-muted-foreground` for section labels

### Card Components
- Add `hover:shadow-lg` transition to all cards
- Ensure all cards use `rounded-xl` (up from `rounded-lg`) for a more modern feel
- Add subtle gradient overlays on metric cards
- Add ring highlight on the "Crisis Mode" active state

### Color Consistency
- Verify urgency colors are consistent: danger for High, warning for Medium, success for Low (already done — just audit)
- Add colored left-border accent on issue cards matching urgency

**Files:** Edit `MetricCard.tsx`, `IssueCard.tsx`, `AlertCard.tsx`, `HeatmapPlaceholder.tsx`, all 4 dashboards, `Index.tsx`, `tailwind.config.ts` (add any missing keyframes)

---

## File Summary

| Action | File |
|--------|------|
| Edit | `src/components/dashboard/HeatmapPlaceholder.tsx` — enhanced visuals, click, route line |
| Edit | `src/components/dashboard/AIPriorityCard.tsx` — progress bar, blinking indicator |
| Edit | `src/components/dashboard/IssueDetailDialog.tsx` — optional AI insights section |
| Edit | `src/components/dashboard/MetricCard.tsx` — hover effects, stagger animation |
| Edit | `src/components/dashboard/AlertCard.tsx` — hover transitions |
| Edit | `src/components/IssueCard.tsx` — urgency border accent, hover effects |
| Create | `src/components/dashboard/NotificationBell.tsx` — bell icon with dropdown |
| Edit | `src/pages/DashboardPublic.tsx` — notifications, spacing, typography |
| Edit | `src/pages/DashboardAdmin.tsx` — notifications, spacing, typography |
| Edit | `src/pages/DashboardNGO.tsx` — notifications, spacing, typography |
| Edit | `src/pages/DashboardVolunteer.tsx` — enhanced AI card, notifications, spacing |
| Edit | `src/pages/Index.tsx` — minor hover/animation polish |
| Edit | `tailwind.config.ts` — pulse-dot keyframe if needed |

