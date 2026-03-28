

# SahyogAI — Multi-Page Volunteer & Public Dashboards + Enhanced Features

## Architecture

Both dashboards will be converted from single-page scrolling layouts to sidebar-based multi-section layouts (same pattern used in Admin and NGO dashboards — React state switching between sections).

---

## Volunteer Dashboard — 7 Sections

**Sidebar nav:** Overview | Tasks | Nearby Issues | Map | Messages | Profile | Alerts

### 1. Overview
Current metrics, AI recommendation card, badges display — moved from existing top section.

### 2. Tasks (My Tasks)
- Assigned/accepted tasks with status, accept/reject/complete actions
- **Delete report** button on self-reported issues (with confirmation)
- Proof upload placeholder
- Full task detail via `IssueDetailDialog`

### 3. Nearby Issues
- FilterBar with **Location**, **Urgency**, **Category** filters (currently only urgency)
- Issue cards with accept/view actions
- Report Issue button

### 4. Map & Navigation
- `HeatmapPlaceholder` with route to nearest issue (already exists, just isolated to its own section)

### 5. Messages
- Full message view from connected NGOs (currently truncated inline)
- **Reply** input for each message (simulated — adds to local state)
- Show NGO name, message text, timestamp
- Link to view connected NGO details via `NGODetailDialog`

### 6. Profile
- **Editable skill profile**: add/remove skills from a predefined list
- Performance stats (tasks done, response rate, reliability, ranking)
- Availability toggle
- Badges & rewards (`BadgeDisplay`)
- **Activity history** — full detail view of past activities (expand each entry to show description, date, associated issue)
- **Connected NGO details** — show NGO info (name, focus area, contact, issues handled) for NGOs the volunteer is linked to

### 7. Alerts
- Full alert cards with `AlertDetailDialog` on click (reports, photos/videos)
- Notification list

---

## Public Dashboard — 5 Sections

**Sidebar nav:** Home | Issues | Alerts | Map | Profile

### 1. Home (Overview)
- Metric cards, live alerts horizontal scroll, safety tips accordion

### 2. Issues
- FilterBar with **Location**, **Urgency**, **Category** filters (already has urgency/status/category — add location)
- Issue cards with full detail on click
- Report Issue + Emergency buttons
- **Delete own reports** button (issues where `reportedBy === "You"`)

### 3. Alerts
- Full alert list with `AlertDetailDialog` showing complete details, photos/videos

### 4. Map
- Community heatmap (already exists, isolated to own section)

### 5. Profile (Enhanced)
- **Redesigned profile section** with:
  - Avatar with initials, name, "Active Reporter" badge
  - Stats grid: Issues Reported, Issues Resolved (by community), Upvotes Received, Trust Score, Community Rank, Contribution Points
  - Progress bar for trust score (0-10)
  - "Your Reports" list — issues reported by the user with status tracking
  - Emergency reports count
  - Achievement badges (e.g., "First Report", "10 Upvotes", "Emergency Reporter")
  - Member since date

---

## Files to Create/Edit

| Action | File |
|--------|------|
| Rewrite | `src/pages/DashboardVolunteer.tsx` — sidebar nav, 7 sections |
| Rewrite | `src/pages/DashboardPublic.tsx` — sidebar nav, 5 sections |

No new components needed — reuses existing `AlertDetailDialog`, `NGODetailDialog`, `IssueDetailDialog`, `FilterBar`, `BadgeDisplay`, `AvailabilityToggle`, `ActivityLog`, `HeatmapPlaceholder`, `NotificationBell`.

