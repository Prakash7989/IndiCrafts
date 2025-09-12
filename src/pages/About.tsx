import React from 'react';
import { Award, Heart, Users, Target } from 'lucide-react';
import { TribalDivider } from '@/components/ui/tribal-pattern';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-earth py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-merriweather text-3xl md:text-4xl font-bold text-off-white text-center mb-4">
            About Artisan Marketplace
          </h1>
          <p className="font-poppins text-lg text-off-white/90 text-center max-w-3xl mx-auto">
            Bridging the gap between traditional artisans and modern consumers
          </p>
        </div>
      </section>

      <TribalDivider className="text-primary -mt-px" />

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-merriweather text-3xl font-bold text-primary mb-6">Our Story</h2>
            <div className="space-y-4 font-poppins text-muted-foreground">
              <p>
                Artisan Marketplace was born from a simple yet powerful vision: to create a sustainable
                ecosystem where traditional artisans from rural and tribal communities can showcase
                their authentic handmade products to a global audience.
              </p>
              <p>
                We recognized that countless skilled craftspeople in remote areas possess extraordinary
                talents passed down through generations, yet lack access to markets beyond their local
                communities. Meanwhile, conscious consumers worldwide seek authentic, handmade products
                with real stories behind them.
              </p>
              <p>
                Our platform bridges this gap, providing artisans with the tools and reach they need
                to build sustainable livelihoods while preserving their traditional art forms. Every
                purchase on our platform directly supports these communities and helps keep ancient
                crafts alive for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TribalDivider className="text-accent" />

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="text-center md:text-left">
              <div className="w-16 h-16 mx-auto md:mx-0 mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-merriweather text-2xl font-bold text-primary mb-4">Our Mission</h3>
              <p className="font-poppins text-muted-foreground">
                To empower rural and tribal artisans by providing them with a digital platform to
                showcase and sell their authentic handmade products, ensuring fair prices and
                sustainable livelihoods while preserving traditional craftsmanship.
              </p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="w-16 h-16 mx-auto md:mx-0 mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-merriweather text-2xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="font-poppins text-muted-foreground">
                To become the leading marketplace for authentic artisan products, creating a world
                where traditional crafts thrive, artisan communities prosper, and consumers have
                access to unique, meaningful products that tell stories of heritage and culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TribalDivider className="text-primary" />

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-merriweather text-3xl font-bold text-primary text-center mb-12">
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-warm rounded-full flex items-center justify-center">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-merriweather text-xl font-semibold mb-3">Authenticity</h3>
              <p className="font-poppins text-sm text-muted-foreground">
                We ensure every product is genuinely handmade by verified artisans, maintaining
                the highest standards of authenticity and quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-nature rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-merriweather text-xl font-semibold mb-3">Fair Trade</h3>
              <p className="font-poppins text-sm text-muted-foreground">
                We believe in fair pricing that respects the skill and effort of artisans while
                providing value to customers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-earth rounded-full flex items-center justify-center">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-merriweather text-xl font-semibold mb-3">Sustainability</h3>
              <p className="font-poppins text-sm text-muted-foreground">
                We promote eco-friendly practices and sustainable materials, supporting both
                artisan communities and the environment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;