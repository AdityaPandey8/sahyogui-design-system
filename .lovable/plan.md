

# SahyogAI — Public & Admin Dashboard Build Plan

This is a large feature set. Since there's no backend, everything will be simulated with mock data and React state. No real maps (no API keys) — we'll use styled placeholder heatmaps with colored dots.

---

## Phase 1: Expand Mock Data

**File: `src/data/mockData.ts`**

Add new fields and types to support both dashboards:
- `Issue`: add `description`, `category`, `images[]`, `reportedBy`, `assignedNgo`, `responseTime`, `createdAt`, `upvotes`, `comments[]`, `aiPriorityScore`, `affectedPeople`, `isAnonymous`, `isFake`
- `NGO`: add `issuesHandled`, `successRate`, `avgResponseTime`
- `Volunteer`: add `responseRate`, `reliabilityScore`, `tasksCompleted`
- New types: `Alert`, `Comment`, `SafetyTip`
- Add mock alerts (5), safety tips (5), helpline numbers

---

## Phase 2: Public Dashboard (`DashboardPublic.tsx`)

Complete rebuild with tabbed/sectioned layout:

### Top Bar
- Search input with filter dropdowns (location, category, urgency, status)
- Emergency button (red, pulsing) — opens quick-report dialog with auto-location

### Stats Overview
- 4 small metric cards: Issues in area, Resolved, Active emergencies, Your reports

### Issue Reporting Dialog
- "Report Issue" CTA opens a form dialog with: title, description, category select, urgency select, location input, image upload placeholder, anonymous toggle
- On submit: adds to local state, shows toast

### Emergency Quick Report
- One-tap button auto-fills location ("Detected: your area"), minimal input, instant toast confirmation

### Community Heatmap
- Styled div with colored dots positioned by mock coordinates, color-coded by urgency

### Issue List
- Filterable/searchable grid of IssueCards
- Click opens Issue Detail dialog: full description, images placeholder, status, assigned NGO, progress timeline, feedback/rating form

### Live Alerts Panel
- Scrollable alert banner/cards (disaster alerts, weather warnings)

### Community Engagement
- Upvote button on issues, comment input
- State-managed counters

### Reporter Profile Section
- Small card: issues reported count, contribution score, trust score

### Awareness Section
- Accordion with safety tips, disaster guidelines, helpline numbers

---

## Phase 3: Admin Dashboard (`DashboardAdmin.tsx`)

Complete rebuild with rich panels:

### Top Bar
- Quick Action buttons: Add Issue, Assign NGO, Broadcast Alert, Activate Crisis Mode
- Search + filters

### Global Overview (Top)
- 5 metric cards with trend indicators: Total Issues, Active Crises, Resolved, Avg Response Time, Active Volunteers

### Live Crisis Map
- Same heatmap component as public but larger, with volunteer position dots

### Priority Issue Queue
- Table/list sorted by AI priority score, showing location, urgency, affected people, time
- Action buttons: Assign NGO, Escalate, View Details

### AI Decision Panel
- Highlighted card for top issue showing: Priority Score (0-100), Predicted Response Time, Suggested Action text

### Issue Verification Panel
- List of "Pending" issues with Verify/Reject buttons, source indicator

### NGO Performance
- Cards/table: NGOs with issues handled, success rate, avg response time
- Simple leaderboard ranking

### Volunteer Performance
- Cards/table: active volunteers, response rate, reliability score, top performers

### Fraud & Anomaly Detection
- List of flagged/suspicious issues with reasons

### Alert & Notification Control
- Broadcast alert form (text input + send button)

### Resource Allocation Panel
- Cards showing available volunteers, NGO capacity, resource gap warnings

### Historical Data
- Simple stat cards showing past crises count, avg response trend

### Leaderboard
- Top NGOs and volunteers by impact score

---

## Phase 4: Shared Components

New reusable components to create:
- `HeatmapPlaceholder` — styled div with colored dots
- `MetricCard` — icon, value, label, trend arrow
- `IssueReportForm` — form inside Dialog
- `IssueDetailDialog` — full issue view with timeline
- `AlertCard` — alert/notification display
- `FilterBar` — search + filter dropdowns
- `QuickActionBar` — row of action buttons
- `AIPriorityCard` — AI decision display
- `FeedbackForm` — star rating + text
- `SafetyTipsAccordion` — expandable tips

---

## File Summary

| Action | File |
|--------|------|
| Edit | `src/data/mockData.ts` — expanded types and data |
| Rewrite | `src/pages/DashboardPublic.tsx` — full public dashboard |
| Rewrite | `src/pages/DashboardAdmin.tsx` — full admin dashboard |
| Create | `src/components/dashboard/MetricCard.tsx` |
| Create | `src/components/dashboard/HeatmapPlaceholder.tsx` |
| Create | `src/components/dashboard/FilterBar.tsx` |
| Create | `src/components/dashboard/AlertCard.tsx` |
| Create | `src/components/dashboard/IssueReportForm.tsx` |
| Create | `src/components/dashboard/IssueDetailDialog.tsx` |
| Create | `src/components/dashboard/QuickActionBar.tsx` |
| Create | `src/components/dashboard/AIPriorityCard.tsx` |
| Create | `src/components/dashboard/FeedbackForm.tsx` |
| Create | `src/components/dashboard/SafetyTipsAccordion.tsx` |

All features are frontend-only with React state. No backend or external APIs required.

