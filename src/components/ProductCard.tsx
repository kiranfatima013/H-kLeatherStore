import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/data/products";
import { usePendingCartItem } from "@/hooks/usePendingCartItem";

interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
}

const ProductCard = ({ id, image, name, price, category }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { setPendingItem } = usePendingCartItem();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const item = { id, image, name, price, category };

    if (!user) {
      // Store pending item and redirect to login
      setPendingItem(item);
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
      });
      navigate("/auth");
      return;
    }

    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-[3/4]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
        <Button
          size="sm"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
        <h3 className="font-medium text-foreground">{name}</h3>
        <p className="text-primary font-semibold">{formatPrice(price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
