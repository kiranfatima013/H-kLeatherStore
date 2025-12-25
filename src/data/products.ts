import leatherJacket1 from "@/assets/leather-jacket-1.jpg";
import leatherJacket2 from "@/assets/leather-jacket-2.jpg";
import leatherWallet1 from "@/assets/leather-wallet-1.jpg";
import leatherWallet2 from "@/assets/leather-wallet-2.jpg";

export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    image: leatherJacket1,
    name: "Classic Brown Leather Jacket",
    price: 349.99,
    category: "Jackets",
    description: "Crafted from premium full-grain leather, this timeless classic features a refined silhouette with subtle stitching details. The rich brown patina develops beautifully over time, making each jacket uniquely yours. Lined with soft cotton for all-day comfort.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 2,
    image: leatherJacket2,
    name: "Black Biker Jacket",
    price: 429.99,
    category: "Jackets",
    description: "An iconic biker jacket made from supple Italian leather with asymmetrical zip closure. Features include zippered cuffs, multiple pockets, and a quilted lining for warmth. The perfect blend of rebellion and sophistication.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 3,
    image: leatherWallet1,
    name: "Bifold Leather Wallet",
    price: 89.99,
    category: "Wallets",
    description: "Handcrafted from vegetable-tanned leather, this bifold wallet offers timeless elegance with practical functionality. Features 6 card slots, 2 bill compartments, and an ID window. The natural leather ages gracefully with use.",
  },
  {
    id: 4,
    image: leatherWallet2,
    name: "Slim Cardholder",
    price: 59.99,
    category: "Wallets",
    description: "Minimalist design meets premium craftsmanship in this slim cardholder. Perfect for those who carry only the essentials. Made from soft nappa leather with 4 card slots and a central pocket for folded bills.",
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getRelatedProducts = (id: number, limit = 4): Product[] => {
  const product = getProductById(id);
  if (!product) return [];
  
  return products
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, limit)
    .concat(
      products.filter((p) => p.id !== id && p.category !== product.category)
    )
    .slice(0, limit);
};
