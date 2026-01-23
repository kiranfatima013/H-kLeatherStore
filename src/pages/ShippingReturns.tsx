import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Truck, RotateCcw, Package, Clock, Shield, CreditCard, Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ShippingReturns = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{
    id: string;
    status: string;
    created_at: string;
    shipping_city: string;
  } | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      toast({
        title: "Please enter an order ID",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to track your orders.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setOrderStatus(null);

    const { data, error } = await supabase
      .from("orders")
      .select("id, status, created_at, shipping_city")
      .eq("id", orderId.trim())
      .eq("user_id", user.id)
      .single();

    setIsSearching(false);

    if (error || !data) {
      toast({
        title: "Order not found",
        description: "Please check your order ID and try again.",
        variant: "destructive",
      });
      return;
    }

    setOrderStatus(data);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-orange-600 bg-orange-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Shipping & Returns
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Everything you need to know about delivery and returns.
            </p>
          </div>
        </section>

        {/* Order Tracking Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-serif">Track Your Order</CardTitle>
                  <CardDescription>
                    Enter your order ID to check the current status of your delivery.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTrackOrder} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderId">Order ID</Label>
                      <Input
                        id="orderId"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="e.g., a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSearching}>
                      {isSearching ? "Searching..." : "Track Order"}
                    </Button>
                  </form>

                  {orderStatus && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Order Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(orderStatus.status)}`}>
                          {orderStatus.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>Shipping to: {orderStatus.shipping_city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Ordered: {new Date(orderStatus.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <Link to="/my-orders">
                        <Button variant="outline" size="sm" className="w-full">
                          View Full Order Details
                        </Button>
                      </Link>
                    </div>
                  )}

                  {!user && (
                    <p className="mt-4 text-sm text-muted-foreground text-center">
                      <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to track your orders.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Shipping Information */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Shipping Information
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We deliver across Pakistan and internationally to select countries.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Standard Delivery</CardTitle>
                  <CardDescription>Within Pakistan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Time</span>
                    <span className="font-medium">3-5 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-medium">PKR 250</span>
                  </div>
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    Free shipping on orders above PKR 10,000
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Express Delivery</CardTitle>
                  <CardDescription>Priority Shipping</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Time</span>
                    <span className="font-medium">1-2 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-medium">PKR 500</span>
                  </div>
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    Available for major cities only
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>International</CardTitle>
                  <CardDescription>Worldwide Shipping</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Time</span>
                    <span className="font-medium">7-14 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-medium">Varies by location</span>
                  </div>
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    Contact us for international rates
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Details */}
            <div className="max-w-3xl mx-auto mt-12 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Important Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Order Processing</h4>
                    <p>Orders are processed within 1-2 business days. Custom orders may take 2-3 weeks to prepare before shipping.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Tracking</h4>
                    <p>Once your order ships, you'll receive an email with tracking information. You can also track orders using the form above.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Delivery Attempts</h4>
                    <p>Our courier will make up to 3 delivery attempts. If unsuccessful, the package will be held at the nearest courier office for 7 days.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Returns Policy */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Returns & Exchanges
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your satisfaction is our priority. Here's our hassle-free return policy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <RotateCcw className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Return Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Returns accepted within <strong className="text-foreground">14 days</strong> of delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Items must be <strong className="text-foreground">unused</strong> and in original packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Original tags and dust bags must be attached</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Custom/personalized items are <strong className="text-foreground">non-returnable</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sale items are final sale unless defective</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Exchange Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Exchanges within <strong className="text-foreground">7 days</strong> of delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong className="text-foreground">Free size exchanges</strong> (subject to availability)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>We'll arrange pickup at no extra cost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>New item shipped once original is received</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Color exchanges treated as returns + new order</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Refund Information */}
            <div className="max-w-3xl mx-auto mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Refund Process</CardTitle>
                      <CardDescription>How we handle your refunds</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-1">1</div>
                      <div className="font-medium text-foreground">Request</div>
                      <p className="text-sm text-muted-foreground mt-1">Contact us via email or phone to initiate return</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-1">2</div>
                      <div className="font-medium text-foreground">Inspect</div>
                      <p className="text-sm text-muted-foreground mt-1">We inspect the returned item within 2 business days</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-1">3</div>
                      <div className="font-medium text-foreground">Refund</div>
                      <p className="text-sm text-muted-foreground mt-1">Refund processed within 5-7 business days</p>
                    </div>
                  </div>
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    Refunds are credited to the original payment method. Bank processing may take additional 3-5 business days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              Need Help?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our customer service team is here to assist you with any questions about shipping or returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
              <a href="mailto:support@hkleathercrafts.pk">
                <Button variant="outline" size="lg">
                  support@hkleathercrafts.pk
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingReturns;