import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authSchema } from "@/lib/validations";
import { useCart } from "@/contexts/CartContext";
import { usePendingCartItem } from "@/hooks/usePendingCartItem";
import { Separator } from "@/components/ui/separator";
import heroImage from "@/assets/hero-leather.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, signInWithGoogle, user, loading } = useAuth();
  const { addToCart } = useCart();
  const { pendingItem, clearPendingItem } = usePendingCartItem();

  // Redirect logged-in users away from auth page
  useEffect(() => {
    if (!loading && user) {
      // If there's a pending item, add it to cart
      if (pendingItem) {
        addToCart(pendingItem);
        toast({
          title: "Added to cart",
          description: `${pendingItem.name} has been added to your cart.`,
        });
        clearPendingItem();
      }
      navigate("/");
    }
  }, [user, loading, navigate, pendingItem, addToCart, clearPendingItem, toast]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (error) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = authSchema.pick({ email: true, password: true }).safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    // Redirect is handled by useEffect when user state changes
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = authSchema.safeParse(signupData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(
      signupData.email,
      signupData.password,
      signupData.firstName,
      signupData.lastName
    );
    setIsLoading(false);

    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
          {/* Left side - Image with overlay */}
          <div className="hidden lg:block relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
            <div className="relative z-10 flex flex-col justify-center items-start h-full p-12 xl:p-16">
              <h2 className="text-4xl xl:text-5xl font-serif font-bold text-primary-foreground mb-4 leading-tight">
                Timeless Leather.<br />
                Crafted to Last.
              </h2>
              <p className="text-primary-foreground/90 text-lg max-w-md">
                Join our community of leather enthusiasts and discover handcrafted pieces that tell your story.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">500+</p>
                  <p className="text-sm text-primary-foreground/80">Happy Customers</p>
                </div>
                <div className="w-px h-12 bg-primary-foreground/30" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">100%</p>
                  <p className="text-sm text-primary-foreground/80">Genuine Leather</p>
                </div>
                <div className="w-px h-12 bg-primary-foreground/30" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">5★</p>
                  <p className="text-sm text-primary-foreground/80">Rated Quality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-background via-background to-muted/30">
            <div className="w-full max-w-md">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger 
                    value="login" 
                    className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="animate-fade-in">
                  <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-lg">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                        Welcome Back
                      </h1>
                      <p className="text-muted-foreground">
                        Sign in to access your account
                      </p>
                    </div>

                    {/* Google Sign In Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mb-6 h-12 text-base font-medium border-border/50 bg-card hover:bg-muted/50 transition-all"
                      onClick={handleGoogleAuth}
                      disabled={isGoogleLoading}
                    >
                      <GoogleIcon />
                      {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                    </Button>

                    <div className="relative my-6">
                      <Separator className="bg-border/50" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                        or
                      </span>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-foreground font-medium">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-foreground font-medium">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Sign In"}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="animate-fade-in">
                  <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-lg">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                        Create Account
                      </h1>
                      <p className="text-muted-foreground">
                        Join us and explore premium leather
                      </p>
                    </div>

                    {/* Google Sign Up Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mb-6 h-12 text-base font-medium border-border/50 bg-card hover:bg-muted/50 transition-all"
                      onClick={handleGoogleAuth}
                      disabled={isGoogleLoading}
                    >
                      <GoogleIcon />
                      {isGoogleLoading ? "Signing up..." : "Continue with Google"}
                    </Button>

                    <div className="relative my-6">
                      <Separator className="bg-border/50" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                        or
                      </span>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-foreground font-medium">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                            value={signupData.firstName}
                            onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                          />
                          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-foreground font-medium">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                            value={signupData.lastName}
                            onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                          />
                          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-foreground font-medium">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-foreground font-medium">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        />
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
