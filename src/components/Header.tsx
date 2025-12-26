import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    totalItems,
    setIsCartOpen
  } = useCart();
  const navLinks = [{
    name: "Home",
    href: "/"
  }, {
    name: "Shop",
    href: "/products"
  }, {
    name: "About",
    href: "/about"
  }, {
    name: "Contact",
    href: "/contact"
  }];
  return <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-serif font-bold text-primary">
              H & K
            </span>
            <span className="text-sm md:text-base font-light text-muted-foreground tracking-widest">
              LEATHER CRAFTS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => <Link key={link.name} to={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {link.name}
              </Link>)}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <nav className="md:hidden py-4 border-t border-border">
            {navLinks.map(link => <Link key={link.name} to={link.href} className="block py-3 text-foreground/80 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>)}
          </nav>}
      </div>
    </header>;
};
export default Header;