-- Add phone column to contact_messages
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS phone text;

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public inserts to contact_messages
CREATE POLICY "Allow public inserts to contact_messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Enable RLS on newsletter_subscriptions
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts to newsletter_subscriptions
CREATE POLICY "Allow public inserts to newsletter_subscriptions"
ON public.newsletter_subscriptions
FOR INSERT
WITH CHECK (true);

-- Add unique constraint on email to prevent duplicates
ALTER TABLE public.newsletter_subscriptions 
ADD CONSTRAINT newsletter_subscriptions_email_unique UNIQUE (email);