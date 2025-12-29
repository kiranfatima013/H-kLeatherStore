import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Users, Loader2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

interface NewsletterSubscription {
  id: number;
  email: string | null;
  created_at: string;
}

interface ContactMessage {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data && !error);
      setCheckingRole(false);
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  // Fetch data if admin
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;

      setLoadingData(true);

      const [subscribersResult, messagesResult] = await Promise.all([
        supabase
          .from("newsletter_subscriptions")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (subscribersResult.data) {
        setSubscribers(subscribersResult.data);
      }
      if (messagesResult.data) {
        setMessages(messagesResult.data);
      }

      setLoadingData(false);
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardHeader className="text-center">
              <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access this page. Admin privileges are required.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage newsletter subscribers and contact messages
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Newsletter Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscribers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total email subscriptions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Contact Messages
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{messages.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total messages received
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Data Tables */}
          <Tabs defaultValue="subscribers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="subscribers" className="gap-2">
                <Mail className="h-4 w-4" />
                Subscribers
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscribers">
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Subscribers</CardTitle>
                  <CardDescription>
                    All users who have subscribed to your newsletter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : subscribers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No subscribers yet
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Subscribed On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium">
                              {sub.email || "N/A"}
                            </TableCell>
                            <TableCell>
                              {format(new Date(sub.created_at), "PPp")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Messages</CardTitle>
                  <CardDescription>
                    Messages submitted through the contact form
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No messages yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <Card key={msg.id} className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                              <div>
                                <p className="font-medium">{msg.name || "Anonymous"}</p>
                                <p className="text-sm text-muted-foreground">
                                  {msg.email}
                                </p>
                                {msg.phone && (
                                  <p className="text-sm text-muted-foreground">
                                    {msg.phone}
                                  </p>
                                )}
                              </div>
                              <Badge variant="outline" className="self-start">
                                {format(new Date(msg.created_at), "PP")}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
