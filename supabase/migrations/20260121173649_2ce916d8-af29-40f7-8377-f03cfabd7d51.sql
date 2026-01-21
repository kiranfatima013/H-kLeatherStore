-- Add explicit policies to protect orders table from anonymous access
-- and allow admins to manage orders

-- Allow admins to view all orders (for order management)
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update order status
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Explicitly deny anonymous/public DELETE on orders (defense in depth)
CREATE POLICY "No public deletes on orders"
  ON public.orders FOR DELETE
  USING (false);

-- Allow admins to view all order items (for order management)
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));