

# SahyogAI — Hero Redesign, Dashboard Refactor, Skeletons & AI Integration

## 1. Hero Section Redesign

Replace the current `ImageCarouselHero` with a new `HeroSection` component using **framer-motion** for polished animations.

**New file:** `src/components/ui/hero-section.tsx`
- Adapted from the provided `hero-section-9.tsx` (no Next.js dependencies)
- Two-column layout: left text content with staggered animations, right image collage with floating/parallax effects
- Stats bar with icons (lucide-react: `Users`, `Building2`, `Heart`)
- Two CTA buttons: "Get Started" (primary) + "Learn More" (outline, scrolls to features)

**Edit:** `src/pages/Index.tsx`
- Replace `ImageCarouselHero` import with new `HeroSection`
- Pass SahyogAI-themed props: community volunteer images from Unsplash, stats (15K+ volunteers, 200+ NGOs, 50K+ issues resolved)

**Install:** `framer-motion`

---

## 2. DashboardShell Refactor for Volunteer & Public Dashboards

Both dashboards currently use the `SidebarProvider`/`Sidebar` pattern from shadcn. Refactor to use the shared `DashboardShell` component (already used by Admin and NGO dashboards).

**Edit:** `src/pages/DashboardVolunteer.tsx`
- Remove `VolunteerSidebar` component and `SidebarProvider` wrapper
- Convert `sidebarItems` to `DashboardShell` format (`{ id, label, icon }`)
- Wrap content in `<DashboardShell>` with notifications, panel label

**Edit:** `src/pages/DashboardPublic.tsx`
- Same refactor: remove `PublicSidebar`, use `DashboardShell`

---

## 3. Loading Skeletons & Empty States

**New file:** `src/components/dashboard/DashboardSkeleton.tsx`
- Reusable skeleton components: `MetricCardSkeleton`, `IssueCardSkeleton`, `TableRowSkeleton`, `SectionSkeleton`
- Uses existing `Skeleton` component from `src/components/ui/skeleton.tsx`

**New file:** `src/components/dashboard/EmptyState.tsx`
- Generic empty state with icon, title, description, optional action button
- Used when filtered lists return zero results or sections have no data

**Edit:** All 4 dashboard pages — wrap section content with skeleton fallbacks and empty states for filtered lists.

---

## 4. Gemini AI Integration via Lovable AI Gateway

The project already has `LOVABLE_API_KEY` configured, which provides access to Google Gemini models through the Lovable AI Gateway. No separate Google API key is needed.

**New file:** `supabase/functions/chat/index.ts`
- Edge function calling Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`)
- Model: `google/gemini-3-flash-preview`
- Streaming SSE support
- Handles 429/402 errors

**New file:** `supabase/functions/analyze-issue/index.ts`
- Non-streaming edge function for issue analysis
- Takes issue title/description/category, returns priority score, suggested category, recommended responder type
- Uses tool-calling for structured JSON output

**New file:** `src/components/dashboard/AIChatWidget.tsx`
- Floating chat button (bottom-right corner) available on all dashboards
- Expandable chat panel with streaming message display
- Uses `react-markdown` (already installed) for AI response rendering

**New file:** `src/lib/ai.ts`
- `streamChat()` helper for SSE streaming from the chat edge function
- `analyzeIssue()` helper for structured issue analysis

**Edit:** `supabase/config.toml` — add function entries with `verify_jwt = false`

**Edit:** Dashboard pages — integrate AI chat widget and issue analysis into report forms

---

## 5. Landing Page UI Polish

**Edit:** `src/components/landing/FeaturesSection.tsx` — add scroll-reveal animations
**Edit:** `src/components/landing/Navbar.tsx` — add nav links (Features, How It Works, Map) with smooth scroll
**Edit:** `src/pages/Index.tsx` — add section IDs for anchor navigation, enhance footer with social links

---

## Technical Details

| Area | Details |
|------|---------|
| New dependency | `framer-motion` |
| Edge functions | `chat`, `analyze-issue` — auto-deployed |
| AI model | `google/gemini-3-flash-preview` via Lovable AI Gateway |
| Auth for AI | `LOVABLE_API_KEY` (already configured) |
| Skeleton pattern | Reuses `@/components/ui/skeleton` with dashboard-specific compositions |

**Files to create:** 6 new files
**Files to edit:** 7 existing files

