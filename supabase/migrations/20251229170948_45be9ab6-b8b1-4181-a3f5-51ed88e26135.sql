-- Fix the check_rate_limit function by adding search_path
CREATE OR REPLACE FUNCTION public.check_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- Check if the same IP or User ID has submitted in the last 5 minutes
  IF EXISTS (
    SELECT 1 FROM contact_messages 
    WHERE (ip_address = current_setting('request.headers')::json->>'x-real-ip')
    AND created_at > (now() - interval '5 minutes')
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait 5 minutes.';
  END IF;
  RETURN NEW;
END;
$function$;