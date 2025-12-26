import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Our Story
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Crafting premium leather goods with passion and precision since 2010
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                  Handcrafted Excellence
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  At H & K Leather Crafts, we believe in the timeless beauty of genuine leather. 
                  Our journey began with a simple vision: to create leather products that combine 
                  traditional craftsmanship with contemporary design.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Every piece in our collection is meticulously handcrafted by skilled artisans 
                  who have inherited their craft through generations. We source only the finest 
                  quality leather, ensuring each product stands the test of time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  From elegant wallets to sophisticated jackets and stylish bags, our products 
                  are designed for those who appreciate quality and authenticity.
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="text-4xl font-bold text-primary mb-2">15+</p>
                    <p className="text-muted-foreground">Years Experience</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary mb-2">5000+</p>
                    <p className="text-muted-foreground">Happy Customers</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary mb-2">100%</p>
                    <p className="text-muted-foreground">Genuine Leather</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary mb-2">50+</p>
                    <p className="text-muted-foreground">Product Designs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Quality First</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Each product undergoes rigorous quality checks.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Customer Focus</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We go above and beyond to serve you.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Sustainable</h3>
                <p className="text-muted-foreground">
                  We source leather responsibly and minimize our environmental footprint.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
