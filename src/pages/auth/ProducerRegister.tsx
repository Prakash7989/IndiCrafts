import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const ProducerRegister: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Registration successful! Please login to continue.');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-merriweather text-2xl text-center">
              Become an Artisan Seller
            </CardTitle>
            <CardDescription className="font-poppins text-center">
              Join our community of rural and tribal artisans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="businessName" className="font-poppins">Business/Artisan Name</Label>
                <Input
                  id="businessName"
                  type="text"
                  required
                  className="mt-1"
                />
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
                <Label htmlFor="phone" className="font-poppins">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location" className="font-poppins">Location (Village/City, State)</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Bastar, Chhattisgarh"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="craftType" className="font-poppins">Type of Craft/Products</Label>
                <Input
                  id="craftType"
                  type="text"
                  placeholder="e.g., Pottery, Weaving, Jewelry Making"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="experience" className="font-poppins">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="story" className="font-poppins">Your Story (Optional)</Label>
                <Textarea
                  id="story"
                  rows={4}
                  placeholder="Tell us about your craft, tradition, and what makes your products special..."
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
                <Store className="h-5 w-5 mr-2" />
                Register as Producer
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProducerRegister;