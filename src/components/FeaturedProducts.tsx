import ProductCard from "./ProductCard";
import leatherJacket1 from "@/assets/leather-jacket-1.jpg";
import leatherJacket2 from "@/assets/leather-jacket-2.jpg";
import leatherWallet1 from "@/assets/leather-wallet-1.jpg";
import leatherWallet2 from "@/assets/leather-wallet-2.jpg";

const products = [
  {
    id: 1,
    image: leatherJacket1,
    name: "Classic Brown Leather Jacket",
    price: 349.99,
    category: "Jackets",
  },
  {
    id: 2,
    image: leatherJacket2,
    name: "Black Biker Jacket",
    price: 429.99,
    category: "Jackets",
  },
  {
    id: 3,
    image: leatherWallet1,
    name: "Bifold Leather Wallet",
    price: 89.99,
    category: "Wallets",
  },
  {
    id: 4,
    image: leatherWallet2,
    name: "Slim Cardholder",
    price: 59.99,
    category: "Wallets",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm text-accent-foreground font-medium tracking-widest uppercase mb-2">
            Curated Selection
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Featured Products
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              category={product.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
