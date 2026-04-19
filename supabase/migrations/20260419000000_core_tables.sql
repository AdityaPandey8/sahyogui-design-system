
-- Core tables for SahyogAI

-- Issues table
CREATE TABLE IF NOT EXISTS public.issues (
    id text PRIMARY KEY DEFAULT 'ISS-' || upper(substring(gen_random_uuid()::text, 1, 8)),
    title text NOT NULL,
    description text NOT NULL,
    urgency text NOT NULL,
    status text NOT NULL DEFAULT 'Pending',
    location text NOT NULL,
    category text NOT NULL,
    reportedBy text,
    assignedNgo text,
    assignedVolunteers text[] DEFAULT '{}',
    responseTime text,
    upvotes integer DEFAULT 0,
    comments jsonb DEFAULT '[]',
    aiPriorityScore integer DEFAULT 50,
    affectedPeople integer DEFAULT 0,
    isAnonymous boolean DEFAULT false,
    isFake boolean DEFAULT false,
    coords jsonb DEFAULT '{"x": 0, "y": 0}',
    photos text[] DEFAULT '{}',
    locationRisk numeric DEFAULT 0,
    requiredResources text[] DEFAULT '{}',
    isAIVerified boolean DEFAULT false,
    createdAt timestamptz DEFAULT now(),
    updatedAt timestamptz DEFAULT now()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id text PRIMARY KEY DEFAULT 'ALT-' || upper(substring(gen_random_uuid()::text, 1, 8)),
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    severity text NOT NULL,
    details text,
    photos text[] DEFAULT '{}',
    affectedArea text,
    createdAt timestamptz DEFAULT now(),
    updatedAt timestamptz DEFAULT now()
);

-- Mock NGOs and Volunteers tables for the old service (if we want to support it)
-- Better to use profiles and details tables, but let's add these for compatibility if needed
-- or just fix the service. Let's fix the service instead of adding redundant tables.

-- Enable RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Policies for issues
CREATE POLICY "Allow public read access to issues" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert to issues" ON public.issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to issues" ON public.issues FOR UPDATE USING (true);

-- Policies for alerts
CREATE POLICY "Allow public read access to alerts" ON public.alerts FOR SELECT USING (true);
