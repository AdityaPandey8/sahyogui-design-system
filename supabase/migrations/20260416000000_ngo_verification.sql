
-- Add verification status to app_role or just use a separate column
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Add NGO verification fields to profiles or a separate table
CREATE TABLE public.ngo_details (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    ngo_name text NOT NULL,
    registration_number text NOT NULL,
    darpan_id text,
    pan_tax_id text NOT NULL,
    document_url text,
    video_url text,
    verification_status verification_status DEFAULT 'pending',
    verified_at timestamptz,
    verified_by uuid REFERENCES public.profiles(id),
    rejection_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ngo_details ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "NGOs can view their own details"
    ON public.ngo_details FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "NGOs can insert their own details"
    ON public.ngo_details FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all NGO details"
    ON public.ngo_details FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update NGO details"
    ON public.ngo_details FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
