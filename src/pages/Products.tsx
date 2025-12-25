import { useState, useMemo } from "react";
import { products, Product, formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["all", ...cats];
  }, []);

  // Get price bounds
  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesPrice;
    });
  }, [selectedCategory, priceRange]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([priceBounds.min, priceBounds.max]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            Our Collection
          </h1>
          <p className="text-muted-foreground">
            Discover our handcrafted leather goods
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 space-y-6 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-foreground">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              {/* Category Filter */}
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all"
                          ? "All Categories"
                          : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="px-1">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No products match your filters.
                </p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-2 text-primary"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
