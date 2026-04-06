# SahyogAI — Sidebar Auto-Collapse, Notification Cleanup & Auth, charts

## 1. Sidebar Auto-Collapse on Section Select

**Edit:** `src/components/dashboard/DashboardShell.tsx`

When a sidebar item is clicked, auto-collapse the sidebar (set `sidebarOpen = false`). Modify `onSectionChange` handler inside the shell to call both the parent's section change callback AND collapse the sidebar via `onSidebarToggle`. Add a new prop `autoCollapse?: boolean` (default `true`) or simply always collapse on click.

Concretely: in the sidebar button `onClick`, after calling `onSectionChange(item.id)`, also call `onSidebarToggle()` if sidebar is open. This applies to all four dashboards since they all use `DashboardShell`.

## 2. Notification System Cleanup

**Edit:** `src/components/dashboard/NotificationBell.tsx`

- Remove the `autoToast` prop and the `useEffect` that fires `toast()` on mount
- Notifications only appear in the bell dropdown — no random toast popups

**Edit:** `src/components/dashboard/DashboardShell.tsx`

- Remove `autoToast` from `DashboardShellProps` and stop passing it to `NotificationBell`

**Edit:** All four dashboards (`DashboardAdmin.tsx`, `DashboardNGO.tsx`, `DashboardVolunteer.tsx`, `DashboardPublic.tsx`)

- Remove the `autoToast` prop from each `DashboardShell` usage

## 3. Authentication with Supabase Auth

### 3a. Database Migration

Create a `profiles` table to store user role:

```sql
create type public.app_role as enum ('admin', 'ngo', 'volunteer', 'public');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role app_role not null default 'public',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::app_role, 'public')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 3b. Auth Page

**Create:** `src/pages/Auth.tsx`

A full-screen login/signup page with:

- Toggle between Login and Sign Up modes
- Email + password fields (any email allowed — development mode)
- Role selector (Admin / NGO / Volunteer / Public) shown only on Sign Up
- On sign up: pass `role` in `options.data` metadata so the trigger stores it
- On login: fetch profile to get role, then redirect to `/dashboard/{role}`
- Apple HIG styling consistent with the rest of the app

### 3c. Auth Context

**Create:** `src/hooks/useAuth.tsx`

A React context provider wrapping the app:

- `useAuth()` hook returning `{ user, profile, loading, signOut }`
- Uses `onAuthStateChange` listener (set up BEFORE `getSession`)
- Fetches profile from `profiles` table after auth state resolves
- Provides `signOut` function

### 3d. Protected Route Component

**Create:** `src/components/ProtectedRoute.tsx`

A wrapper component that:

- Shows loading spinner while auth is resolving
- Redirects to `/auth` if not authenticated
- Optionally checks `requiredRole` prop against user's profile role
- Redirects to correct dashboard if role doesn't match

### 3e. Route Updates

**Edit:** `src/App.tsx`

- Wrap routes with `AuthProvider`
- Add `/auth` route pointing to `Auth.tsx`
- Wrap each `/dashboard/*` route with `<ProtectedRoute requiredRole="admin">` etc.

### 3f. Role Selection Flow Update

**Edit:** `src/components/landing/RoleSelectionDialog.tsx`

- Instead of navigating directly to dashboard, navigate to `/auth?role=admin` (or whichever role)
- The Auth page reads the `role` query param to pre-select the role on sign up

### 3g. Dashboard Logout

**Edit:** `src/components/dashboard/DashboardShell.tsx`

- Wire the existing LogOut button to call `signOut()` from `useAuth()`

&nbsp;

4. Add animated charts using Recharts to visualize AI priority score distribution and response time trends across issues

## Files Summary


| Action    | File                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------ |
| Edit      | `src/components/dashboard/DashboardShell.tsx` — auto-collapse sidebar + remove autoToast + wire logout |
| Edit      | `src/components/dashboard/NotificationBell.tsx` — remove autoToast                                     |
| Edit      | `src/pages/DashboardAdmin.tsx` — remove autoToast prop                                                 |
| Edit      | `src/pages/DashboardNGO.tsx` — remove autoToast prop                                                   |
| Edit      | `src/pages/DashboardVolunteer.tsx` — remove autoToast prop                                             |
| Edit      | `src/pages/DashboardPublic.tsx` — remove autoToast prop                                                |
| Create    | `src/pages/Auth.tsx` — full-screen login/signup                                                        |
| Create    | `src/hooks/useAuth.tsx` — auth context + hook                                                          |
| Create    | `src/components/ProtectedRoute.tsx` — route guard                                                      |
| Edit      | `src/App.tsx` — add AuthProvider, /auth route, protect dashboard routes                                |
| Edit      | `src/components/landing/RoleSelectionDialog.tsx` — redirect to /auth?role=X                            |
| Migration | Create profiles table + trigger                                                                        |
