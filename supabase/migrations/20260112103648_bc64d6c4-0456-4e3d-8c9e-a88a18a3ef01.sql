-- Fix #1: Remove vulnerable policies that allow ALL authenticated users to access admin data

-- Drop ALL vulnerable policies on contact_messages
DROP POLICY IF EXISTS "Admin can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can read contact messages" ON public.contact_messages;

-- Drop vulnerable policy on newsletter_subscriptions  
DROP POLICY IF EXISTS "Admins can read newsletter subscribers" ON public.newsletter_subscriptions;

-- Add proper admin-only policy for contact_messages
CREATE POLICY "Admins only can read contact messages"
ON public.contact_messages FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));


-- Fix #2: Fix cart_items table RLS policies

-- Drop the insecure policy
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.cart_items;

-- Add complete user-scoped policies for cart_items
CREATE POLICY "Users can view their own cart items"
ON public.cart_items FOR SELECT
USING ("user" = auth.uid()::text);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items FOR INSERT
WITH CHECK ("user" = auth.uid()::text);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items FOR UPDATE
USING ("user" = auth.uid()::text)
WITH CHECK ("user" = auth.uid()::text);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items FOR DELETE
USING ("user" = auth.uid()::text);