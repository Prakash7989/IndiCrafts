import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { TribalDivider } from '@/components/ui/tribal-pattern';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-earth py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-merriweather text-3xl md:text-4xl font-bold text-off-white text-center mb-4">
            Get in Touch
          </h1>
          <p className="font-poppins text-lg text-off-white/90 text-center">
            We'd love to hear from you
          </p>
        </div>
      </section>

      <TribalDivider className="text-primary -mt-px" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h2 className="font-merriweather text-2xl font-bold text-primary mb-6">
              Contact Information
            </h2>
            <p className="font-poppins text-muted-foreground mb-8">
              Have questions about our platform? Want to partner with us? Or interested in
              becoming a seller? We're here to help!
            </p>

            <div className="space-y-6">
              <Card>
                <CardContent className="flex items-start p-6">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-merriweather font-semibold mb-1">Email</h3>
                    <p className="font-poppins text-sm text-muted-foreground">
                      support@artisanmarket.com
                    </p>
                    <p className="font-poppins text-sm text-muted-foreground">
                      partners@artisanmarket.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start p-6">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-merriweather font-semibold mb-1">Phone</h3>
                    <p className="font-poppins text-sm text-muted-foreground">
                      +91 98765 43210
                    </p>
                    <p className="font-poppins text-sm text-muted-foreground">
                      Mon-Sat: 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start p-6">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-merriweather font-semibold mb-1">Office</h3>
                    <p className="font-poppins text-sm text-muted-foreground">
                      123, Craft Avenue,<br />
                      Connaught Place,<br />
                      New Delhi - 110001,<br />
                      India
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-merriweather text-2xl font-bold text-primary mb-6">
              Send us a Message
            </h2>
            
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
                <Label htmlFor="email" className="font-poppins">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="font-poppins">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message" className="font-poppins">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;