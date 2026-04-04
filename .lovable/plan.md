

# SahyogAI — Google Gemini API Key Integration, Codebase Enhancements & Testing

## 1. Add Your Own Google Gemini API Key

The current edge functions (`chat` and `analyze-issue`) route through the Lovable AI Gateway. We will modify them to call Google's Gemini API directly using your own API key.

**Steps:**
- Use the secrets tool to request your `GOOGLE_GEMINI_API_KEY` — you get this from [Google AI Studio](https://aistudio.google.com/apikey)
- Update `supabase/functions/chat/index.ts` to call `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent` with your key
- Update `supabase/functions/analyze-issue/index.ts` to call the same Google endpoint (non-streaming, with structured output)
- Both functions will fall back gracefully with clear error messages if the key is missing

**No changes needed on the frontend** — `src/lib/ai.ts` and `AIChatWidget.tsx` already consume these edge functions correctly.

---

## 2. Codebase Enhancements

### 2a. Missing AIChatWidget on Admin & NGO Dashboards
- Add `<AIChatWidget />` to `DashboardAdmin.tsx` and `DashboardNGO.tsx` (currently only on Volunteer and Public dashboards)

### 2b. AI-Powered Issue Analysis in Report Form
- Update `IssueReportForm.tsx` to call `analyzeIssue()` after submission, showing AI-suggested priority and category before finalizing

### 2c. DashboardAdmin Missing DashboardShell Props
- `DashboardAdmin.tsx` already uses `DashboardShell` but verify it passes `sidebarOpen`/`onSidebarToggle` correctly (it does)

### 2d. Minor UI Fixes
- Ensure `EmptyState` is used in Admin dashboard filtered views (issues table when empty)
- Add `DashboardSkeleton` usage in overview sections with a brief simulated loading state

---

## 3. Testing

After deploying the edge functions:
- Call the `chat` edge function with a test message to verify streaming works
- Call the `analyze-issue` edge function with a sample issue to verify structured output
- Check edge function logs for any errors

---

## Technical Details

| Area | Change |
|------|--------|
| New secret | `GOOGLE_GEMINI_API_KEY` (user provides from Google AI Studio) |
| Edge function: `chat` | Switch from Lovable Gateway to `generativelanguage.googleapis.com`, SSE streaming |
| Edge function: `analyze-issue` | Switch to Google Gemini with `responseSchema` for structured JSON |
| Frontend | No URL/auth changes needed — edge function URLs unchanged |
| Files modified | 4 edge function files, 2-3 dashboard files |

