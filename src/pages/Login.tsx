
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const Login = () => {
  const [email, setEmail] = useState('admin@crmnexus.com');
  const [password, setPassword] = useState('Admin123!');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { signIn, currentUser, bypassAuth, setBypassAuth } = useAuth();

  // Redirect if already logged in or if bypass is enabled
  useEffect(() => {
    if (currentUser || bypassAuth) {
      navigate('/');
    }
  }, [currentUser, bypassAuth, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      // Show a user-friendly error message
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleBypass = () => {
    const newValue = !bypassAuth;
    setBypassAuth(newValue);
    if (newValue) {
      toast.success('Authentication bypass enabled. Access granted to all pages.');
      setTimeout(() => navigate('/'), 1000);
    } else {
      toast.info('Authentication bypass disabled. Login required.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">CRM</span> Nexus Suite
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter credentials to access your account
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Demo version - Use one of these accounts:
              <div className="mt-2 text-xs font-medium">
                admin@crmnexus.com<br />
                manager@crmnexus.com<br />
                employee@crmnexus.com<br />
                intern@crmnexus.com<br />
                client@crmnexus.com
              </div>
              <div className="mt-1 text-xs">(Password for all: Admin123!)</div>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {/* Bypass Authentication Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="bypass-auth">Bypass Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable to skip login requirements
                  </p>
                </div>
                <Switch
                  id="bypass-auth"
                  checked={bypassAuth}
                  onCheckedChange={toggleBypass}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={bypassAuth}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={bypassAuth}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || bypassAuth}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
