import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return <footer ref={ref} className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-serif font-bold">H & K</span>
              <span className="text-sm font-light tracking-widest opacity-80">LEATHER CRAFTS</span>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Handcrafted leather goods made with passion and precision. 
              Each piece tells a story of timeless craftsmanship.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/products?category=Jackets" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Jackets
                </Link>
              </li>
              <li>
                <Link to="/products?category=Wallets" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Wallets
                </Link>
              </li>
              <li>
                <Link to="/products?category=Bags" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Bags
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm opacity-80">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Garden East, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm opacity-80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3 text-sm opacity-80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@hkleathercrafts.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm opacity-60">
            © 2026 H & K Leather Crafts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
});

Footer.displayName = "Footer";

export default Footer;