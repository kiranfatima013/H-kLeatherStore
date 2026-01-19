import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { Package, Clock, CheckCircle, XCircle, Truck, ChevronRight, ShoppingBag } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  payment_method: string;
  item_count?: number;
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  pending: { icon: Clock, label: "Pending", className: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200" },
  confirmed: { icon: CheckCircle, label: "Confirmed", className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" },
  shipped: { icon: Truck, label: "Shipped", className: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" },
  delivered: { icon: CheckCircle, label: "Delivered", className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" },
  cancelled: { icon: XCircle, label: "Cancelled", className: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200" },
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, created_at, status, total_amount, payment_method")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) {
        // Get item counts for each order
        const ordersWithCounts = await Promise.all(
          ordersData.map(async (order) => {
            const { count } = await supabase
              .from("order_items")
              .select("*", { count: "exact", head: true })
              .eq("order_id", order.id);
            
            return { ...order, item_count: count || 0 };
          })
        );
        setOrders(ordersWithCounts);
      }

      setLoading(false);
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              My Orders
            </h1>
            <Button variant="outline" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                No Orders Yet
              </h2>
              <p className="text-muted-foreground mb-8">
                You haven't placed any orders yet. Start shopping now!
              </p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <Link
                    key={order.id}
                    to={`/order-confirmation?order=${order.id}`}
                    className="block bg-card rounded-lg border border-border p-4 md:p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono text-sm text-muted-foreground mb-1">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="font-semibold text-foreground mb-1">
                            {formatPrice(order.total_amount)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.item_count} item{order.item_count !== 1 ? "s" : ""} •{" "}
                            {new Date(order.created_at).toLocaleDateString("en-PK", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${status.className}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;