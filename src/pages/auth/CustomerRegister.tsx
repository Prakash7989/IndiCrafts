import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const CustomerRegister: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Registration successful! Please login to continue.');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="font-merriweather text-2xl text-center">
              Create Your Account
            </CardTitle>
            <CardDescription className="font-poppins text-center">
              Join us to explore authentic artisan products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="font-poppins">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="font-poppins">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="font-poppins">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="font-poppins">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="font-poppins">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="font-poppins">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-poppins text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80">
                  Login here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="font-poppins text-sm text-muted-foreground">
                Want to sell products?{' '}
                <Link to="/register/producer" className="text-primary hover:text-primary/80">
                  Register as Producer
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerRegister;