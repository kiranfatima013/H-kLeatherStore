import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { CheckCircle, Package, Truck, Clock, ArrowLeft } from "lucide-react";

interface OrderItem {
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string | null;
  payment_method: string;
  notes: string | null;
}

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) {
        setLoading(false);
        return;
      }

      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();

      if (orderData) {
        setOrder(orderData);

        const { data: itemsData } = await supabase
          .from("order_items")
          .select("product_name, product_image, quantity, unit_price")
          .eq("order_id", orderId);

        if (itemsData) {
          setOrderItems(itemsData);
        }
      }

      setLoading(false);
    };

    if (!authLoading) {
      fetchOrder();
    }
  }, [user, orderId, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <Package className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
              Order Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find this order. Please check your order history.
            </p>
            <Button asChild>
              <Link to="/my-orders">View My Orders</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Banner */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-6 mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your order. We'll contact you shortly to confirm.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Order Details
              </h2>
              <span className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("en-PK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono text-sm text-foreground">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <span className="inline-flex items-center gap-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded text-sm">
                  <Clock className="w-4 h-4" />
                  Pending Confirmation
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="text-foreground capitalize">{order.payment_method === "cod" ? "Cash on Delivery" : "Bank Transfer"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-lg font-semibold text-primary">{formatPrice(order.total_amount)}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                  <p className="text-foreground">
                    {order.shipping_address}<br />
                    {order.shipping_city}
                    {order.shipping_postal_code && `, ${order.shipping_postal_code}`}
                  </p>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="border-t border-border pt-4 mt-4">
                <p className="text-sm text-muted-foreground mb-1">Order Notes</p>
                <p className="text-foreground">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Items Ordered
            </h2>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="flex gap-4">
                  {item.product_image && (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/my-orders">View All Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;