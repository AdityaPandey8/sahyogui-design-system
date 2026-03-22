

# SahyogAI — Full Frontend Build Plan

## 1. Design System Setup
- Define CSS custom properties for the color palette: primary blue, success green, warning yellow, danger red
- Typography scale for headings (h1–h4) and body text
- Button variants: Primary (blue), Outline, Danger (red)
- Card component with consistent padding, shadow, and border radius
- Status badges: Pending (yellow), Verified (blue), In Progress (orange), Solved (green)
- Urgency badges: High (red), Medium (yellow), Low (green)

## 2. Homepage
- **Hero section**: App name "SahyogAI", tagline "Connecting Communities with NGOs and Volunteers using AI", gradient background, centered layout with "Get Started" CTA
- **About section**: Brief mission statement with icons
- **Features section**: Card grid highlighting key capabilities (AI matching, real-time tracking, community engagement, etc.)
- **How It Works**: Step flow (1→2→3→4) with icons and descriptions
- **Map preview**: Static placeholder image/div simulating a map
- **Role selection modal**: Smooth animated modal with 4 role buttons (Admin, NGO, Volunteer, Public) — each navigates to a placeholder dashboard route

## 3. Reusable Components
- **IssueCard**: Displays title, urgency badge, status badge, location
- **VolunteerCard**: Name, skills, availability indicator
- **NGOCard**: Name, focus area, active issues count
- **Modal**: Animated overlay with backdrop, reusable for any content
- **Form inputs**: Styled text input, select, textarea using the design system
- **Notification toast**: Already available via Sonner, will integrate with design tokens

## 4. Mock Data & Simulated State
- `src/data/mockData.ts` with 10 issues, 3 NGOs, 10 volunteers
- React state in dashboard pages to simulate status/urgency updates

## 5. Routing
- `/` — Homepage
- `/dashboard/admin` — Admin dashboard (placeholder with issue list)
- `/dashboard/ngo` — NGO dashboard (placeholder)
- `/dashboard/volunteer` — Volunteer dashboard (placeholder)
- `/dashboard/public` — Public dashboard (placeholder)

All dashboards will display relevant mock data using the reusable card components.

