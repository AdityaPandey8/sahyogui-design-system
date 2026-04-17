
-- Enums for Volunteer System
CREATE TYPE public.volunteer_type AS ENUM ('basic', 'verified', 'ngo_verified');

-- Volunteer Details Table
CREATE TABLE public.volunteer_details (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    skills text[] DEFAULT '{}',
    type volunteer_type DEFAULT 'basic',
    verification_status verification_status DEFAULT 'pending',
    trust_score integer DEFAULT 50,
    reliability_score numeric(3,2) DEFAULT 4.5,
    tasks_completed integer DEFAULT 0,
    availability boolean DEFAULT true,
    location_text text,
    latitude numeric,
    longitude numeric,
    document_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- NGO-Volunteer Relations (For "NGO Verified" status)
CREATE TABLE public.ngo_volunteer_relations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    volunteer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at timestamptz DEFAULT now(),
    UNIQUE(ngo_id, volunteer_id)
);

-- Join Requests (Volunteer -> NGO)
CREATE TABLE public.volunteer_join_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    ngo_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    status verification_status DEFAULT 'pending',
    message text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(volunteer_id, ngo_id)
);

-- Enable RLS
ALTER TABLE public.volunteer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_volunteer_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_join_requests ENABLE ROW LEVEL SECURITY;

-- Policies for volunteer_details
CREATE POLICY "Public can view basic volunteer info" 
    ON public.volunteer_details FOR SELECT 
    USING (true);

CREATE POLICY "Volunteers can update their own details" 
    ON public.volunteer_details FOR UPDATE 
    USING (auth.uid() = id);

-- Policies for ngo_volunteer_relations
CREATE POLICY "NGOs can view their own volunteers" 
    ON public.ngo_volunteer_relations FOR SELECT 
    USING (ngo_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Add trigger for NGO-Volunteer relation to update volunteer type
CREATE OR REPLACE FUNCTION public.handle_ngo_volunteer_relation()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.volunteer_details 
        SET type = 'ngo_verified' 
        WHERE id = NEW.volunteer_id;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Revert to verified or basic (simplified logic: revert to verified)
        UPDATE public.volunteer_details 
        SET type = 'verified' 
        WHERE id = OLD.volunteer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_ngo_volunteer_relation_change
AFTER INSERT OR DELETE ON public.ngo_volunteer_relations
FOR EACH ROW EXECUTE FUNCTION public.handle_ngo_volunteer_relation();
