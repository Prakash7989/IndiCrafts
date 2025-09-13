import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [userType, setUserType] = useState<'customer' | 'producer'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      toast.success(`Logged in successfully as ${userType}!`);
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="font-merriweather text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="font-poppins text-center">
              Login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* User Type Toggle */}
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`flex-1 py-2 px-4 rounded-md font-poppins transition-colors ${userType === 'customer'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
                  }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType('producer')}
                className={`flex-1 py-2 px-4 rounded-md font-poppins transition-colors ${userType === 'producer'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
                  }`}
              >
                Producer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="font-poppins">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="font-poppins">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="font-poppins text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Login as {userType === 'customer' ? 'Customer' : 'Producer'}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-poppins text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to={userType === 'customer' ? '/register/customer' : '/register/producer'}
                  className="text-primary hover:text-primary/80"
                >
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;