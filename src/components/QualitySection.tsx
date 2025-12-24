import { Shield, Leaf, Award, Heart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Only the finest full-grain leather sourced from ethical suppliers.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Sustainable practices and vegetable-tanned leathers.",
  },
  {
    icon: Award,
    title: "Lifetime Warranty",
    description: "We stand behind every product with our lifetime guarantee.",
  },
  {
    icon: Heart,
    title: "Handcrafted",
    description: "Each piece is carefully made by skilled artisans.",
  },
];

const QualitySection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm text-accent-foreground font-medium tracking-widest uppercase mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-foreground">
            Crafted With Care
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-card/50 hover:bg-card transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
