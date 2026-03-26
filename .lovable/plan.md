

# SahyogAI — Multi-Page Admin & NGO Dashboards + Enhanced Features

## Summary

Split both Admin and NGO dashboards from single long pages into multi-page layouts with sidebar/tab navigation. Add detailed views for NGOs, volunteers, issues, alerts, and past crises. Add management controls (block/unblock, delete, unclaim). Add location filter to issue search.

---

## Architecture: Multi-Page via Internal Tabs

Instead of adding many new routes, use a **sidebar navigation within each dashboard** that switches between sections using React state (simulated pages). This keeps routing simple while giving a multi-page feel.

### Admin Dashboard Sections (sidebar nav):
1. **Overview** — metrics, AI panel, crisis map (current top section)
2. **Issues** — priority queue with location/urgency/category filters, full detail view with photos/videos, verify/reject/delete actions
3. **NGOs** — full NGO list with complete details (volunteers, issues solved, success rate, domain), block/unblock, assign tasks, coordinate joint ops
4. **Volunteers** — full volunteer list with details (location, skills, tasks, reliability), block/unblock, assign tasks
5. **Alerts** — active alerts with full details, reports, photos/videos
6. **History** — past crises with complete detail (which NGO/volunteer solved, response time, lives impacted, photos/videos)
7. **Settings** — broadcast, fraud detection, resource allocation

### NGO Dashboard Sections (sidebar nav):
1. **Overview** — metrics, AI panel, crisis map
2. **Issues** — issue list with location/urgency/category filters, claim/unclaim, status updates, full detail with photos/videos
3. **Volunteers** — full volunteer details (location, skills, assigned tasks), assign/unassign tasks, block/unblock
4. **Other NGOs** — view NGO details (volunteers, issues solved, domain) before collaboration
5. **Alerts** — active alerts/notifications with full details, reports, photos/videos
6. **Communication** — broadcast, activity log

---

## New Mock Data Additions

In `mockData.ts`:
- Add `pastCrises[]` array with fields: id, title, resolvedBy (NGO/volunteer names), responseTime, livesImpacted, date, photos[], description
- Add `blocked` field to `Volunteer` and `NGO` interfaces (boolean, default false)
- Add `assignedVolunteers` field to `Issue` (string[] of volunteer IDs)
- Add mock photo URLs (placeholder image paths) to issues and alerts

---

## Key New Features

### Admin — Issue Management
- Add **location filter** to FilterBar (extract unique locations from issues)
- Add **category filter** alongside urgency/status
- **Delete issue** button (available after verification too, with confirmation)
- **Full issue detail** dialog: description, location, urgency, affected population, reporter, photos/videos section (placeholder images), comments, AI insights

### Admin — NGO Management Page
- Table/card list of all NGOs with: name, focus area, issues handled, success rate, avg response time, active volunteers count, status (active/blocked)
- **View Details** → expanded card/dialog showing full info
- **Block/Unblock** toggle button
- **Assign Task** button → opens TaskAssignDialog adapted for NGOs
- **Coordinate Joint Ops** → select multiple NGOs, describe joint operation

### Admin — Volunteer Management Page
- Table of all volunteers: name, skills, tasks completed, response rate, reliability, availability, status (active/blocked)
- **View Details** → full profile dialog
- **Block/Unblock** toggle
- **Assign Task** button

### Admin — Past Crises Page
- List of past crisis cards with: title, date, resolving NGO, volunteers involved, response time, lives impacted, photos/videos, full description

### Admin — Alerts Page
- Full alert cards with expanded details, severity, photos/videos placeholders

### NGO — Unclaim Issue
- Add "Unclaim" button on claimed issues (sets assignedNgo back to null)

### NGO — Volunteer Management
- Full volunteer details view (location, skills, assigned tasks, reliability)
- Assign/unassign tasks to specific volunteers
- Block/unblock volunteers

### NGO — Other NGOs View
- See other NGOs' volunteer counts, issues solved, domain/skills before requesting collaboration

### NGO — Alert Details
- Full alert details with reports and photos/videos

---

## File Summary

| Action | File |
|--------|------|
| Edit | `src/data/mockData.ts` — add pastCrises, blocked fields, assignedVolunteers, photo placeholders |
| Rewrite | `src/pages/DashboardAdmin.tsx` — sidebar nav with 7 sections |
| Rewrite | `src/pages/DashboardNGO.tsx` — sidebar nav with 6 sections |
| Edit | `src/components/dashboard/FilterBar.tsx` — add location filter support |
| Edit | `src/components/dashboard/IssueDetailDialog.tsx` — add photos/videos section, delete button |
| Create | `src/components/dashboard/NGODetailDialog.tsx` — full NGO profile view |
| Create | `src/components/dashboard/VolunteerDetailDialog.tsx` — full volunteer profile view |
| Create | `src/components/dashboard/CrisisDetailDialog.tsx` — past crisis detail view |
| Create | `src/components/dashboard/AlertDetailDialog.tsx` — full alert detail view |

All frontend-only with React state. Uses Shadcn Sidebar component for multi-page navigation within each dashboard.

