-- Create app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for role-based access control
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Now secure newsletter_subscriptions: Only admins can SELECT
CREATE POLICY "Only admins can read newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add UPDATE restriction (only admins)
CREATE POLICY "Only admins can update newsletter subscriptions"
ON public.newsletter_subscriptions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add DELETE restriction (only admins)
CREATE POLICY "Only admins can delete newsletter subscriptions"
ON public.newsletter_subscriptions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));