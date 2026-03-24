

# SahyogAI — NGO & Volunteer Dashboard Build Plan

Both dashboards currently show minimal placeholder content. They will be rebuilt as full-featured pages reusing existing components (MetricCard, FilterBar, HeatmapPlaceholder, IssueReportForm, IssueDetailDialog, AIPriorityCard, QuickActionBar, AlertCard) plus a few new ones.

---

## NGO Dashboard (`DashboardNGO.tsx`) — Full Rewrite

### Top Bar
- Quick Action buttons: Add Issue, Claim Issue, Assign Volunteers, Activate Crisis Mode
- ThemeToggle + back button (already present)

### Metrics Overview (5 cards)
- Total Assigned, Active Issues, Completed, Avg Response Time, Active Volunteers

### Issue Management Panel
- FilterBar (urgency, status, category)
- Issue list as clickable cards — "Claim Issue" and "View Details" actions
- IssueReportForm dialog for reporting new issues
- IssueDetailDialog with additional NGO actions: assign volunteers, update status, upload proof (simulated)

### AI Insights Panel
- Reuse AIPriorityCard showing top-priority issue with suggested action

### Volunteer Management
- Filterable volunteer list (skill, availability)
- Smart matching: highlight "best fit" volunteers for selected issue
- "Auto Assign" button (simulated — assigns random available volunteers, shows toast)

### Task Assignment
- Simple dialog to assign a volunteer to an issue with deadline and task description

### Live Crisis Mode
- HeatmapPlaceholder showing issue dots + volunteer position dots
- Crisis mode toggle (changes header color, shows pulsing indicator)

### Progress Tracking
- Status update buttons on each issue (Pending → Verified → In Progress → Solved)

### Collaboration Panel
- "Request Help" button to simulate requesting assistance from other NGOs
- List other NGOs with "Share Resources" action

### Communication Panel
- Simple broadcast message input to notify volunteers
- Simulated message log

### Analytics Section
- Performance stats: issues solved, response time, volunteer efficiency, impact score

### Notifications
- Reuse AlertCard for issue alerts, volunteer responses, emergency updates

---

## Volunteer Dashboard (`DashboardVolunteer.tsx`) — Full Rewrite

### Top Bar
- Quick actions: Join Emergency, Toggle Availability
- ThemeToggle + back

### Personal Overview (5 stat cards)
- Tasks Assigned, Tasks Completed, Active Tasks, Reliability Score, Badges earned

### Nearby Issues
- Issue list sorted by simulated "distance", filtered by urgency
- Each card shows title, distance, urgency, required skills
- "Accept Task" / "View Details" CTA

### Smart Task Suggestions
- Highlighted card: "You are best suited for this task" based on skill match

### One-Tap Emergency Join
- Pulsing red button — instantly accepts nearest high-urgency issue, shows toast

### Task Management Panel
- Assigned/accepted tasks with status, deadline, actions (Accept/Reject/Complete)

### Task Detail View
- Reuse IssueDetailDialog with volunteer-specific context (instructions, NGO info)

### Progress Tracking
- Update task status: Started → In Progress → Completed

### Proof Upload
- Simulated upload area on completed tasks

### Availability Toggle
- Available / Busy / Offline switch in header area

### Communication Panel
- Simulated chat/message log with NGO

### Performance Dashboard
- Stats: tasks completed, response rate, reliability score, ranking among volunteers

### Skill Profile
- View/edit skills list, add certifications (simulated)

### History & Activity Log
- List of past completed tasks

### Rewards & Badges
- Badge cards for milestones (10 tasks, 50 tasks, first emergency, etc.)

### Notifications
- AlertCards for new tasks, emergency alerts, messages

### Search & Filter
- FilterBar for tasks by urgency, location, category

---

## New Shared Components

| Component | Purpose |
|-----------|---------|
| `TaskAssignDialog` | Dialog for NGO to assign volunteer to issue with deadline/description |
| `VolunteerMatchCard` | Shows suggested volunteer with skill match % and distance |
| `BadgeDisplay` | Renders achievement badges for volunteer dashboard |
| `AvailabilityToggle` | 3-state toggle: Available/Busy/Offline |
| `ActivityLog` | Simple timeline list of past actions |

---

## Files to Create/Edit

| Action | File |
|--------|------|
| Rewrite | `src/pages/DashboardNGO.tsx` |
| Rewrite | `src/pages/DashboardVolunteer.tsx` |
| Create | `src/components/dashboard/TaskAssignDialog.tsx` |
| Create | `src/components/dashboard/VolunteerMatchCard.tsx` |
| Create | `src/components/dashboard/BadgeDisplay.tsx` |
| Create | `src/components/dashboard/AvailabilityToggle.tsx` |
| Create | `src/components/dashboard/ActivityLog.tsx` |

All frontend-only with React state. Reuses existing mock data and components heavily.

