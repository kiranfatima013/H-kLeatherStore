import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-leather.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Leather workshop with artisan tools"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-xl">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
            Handcrafted Excellence
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-card leading-tight mb-6">
            Timeless Leather Craftsmanship
          </h1>
          <p className="text-card/90 text-lg md:text-xl leading-relaxed mb-8">
            Discover our collection of premium leather jackets and wallets, 
            meticulously crafted by skilled artisans using traditional techniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link to="/products">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              asChild
            >
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
