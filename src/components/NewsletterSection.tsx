import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { newsletterSchema } from "@/lib/validations";

const NewsletterSection = forwardRef<HTMLElement>((_, ref) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid email");
      return;
    }

    setIsSubmitting(true);

    const { error: dbError } = await supabase
      .from("newsletter_subscriptions")
      .insert({ email: result.data.email });

    setIsSubmitting(false);

    if (dbError) {
      if (dbError.code === "23505") {
        // Unique constraint violation
        toast({
          title: "Already subscribed",
          description: "This email is already on our mailing list.",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Welcome to our community!",
      description: "You'll receive exclusive offers and updates.",
    });
    setEmail("");
  };

  return (
    <section ref={ref} className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Subscribe to receive exclusive offers, early access to new collections, 
            and stories from our workshop.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              {error && <p className="text-sm mt-1 text-destructive-foreground opacity-90">{error}</p>}
            </div>
            <Button 
              type="submit" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
});

NewsletterSection.displayName = "NewsletterSection";

export default NewsletterSection;
