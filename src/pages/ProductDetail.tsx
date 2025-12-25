import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getProductById, getRelatedProducts, formatPrice } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = id ? getProductById(parseInt(id)) : undefined;
  const relatedProducts = id ? getRelatedProducts(parseInt(id), 4) : [];

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <Link to="/">
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      image: product.image,
      name: product.name,
      price: product.price,
      category: product.category,
    });

    toast({
      title: "Added to cart",
      description: `${product.name}${selectedSize ? ` (${selectedSize})` : ""} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shop
          </Link>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <p className="text-sm text-accent-foreground font-medium tracking-widest uppercase mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-2xl text-primary font-semibold mb-6">
                {formatPrice(product.price)}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selection */}
              {product.sizes && (
                <div className="mb-8">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              {/* Product Details */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-4">Product Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Premium quality leather</li>
                  <li>• Handcrafted with attention to detail</li>
                  <li>• Free shipping on orders over PKR 10,000</li>
                  <li>• 30-day return policy</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    image={relatedProduct.image}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    category={relatedProduct.category}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
