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
            About IndiCrafts
          </h1>
          <p className="font-poppins text-lg text-off-white/90 text-center max-w-3xl mx-auto">
            Bridging the gap between traditional artisans and modern consumers
          </p>
        </div>
      </section>

      <TribalDivider className="text-primary -mt-px" />

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="font-merriweather text-3xl font-bold text-primary mb-4">Our Philosophy: The Story Behind Every Product</h2>
              <p className="font-poppins text-muted-foreground">
                At our marketplace, we believe that every product holds a profound story – a narrative deeply rooted in the land from which its materials came, the skilled hands that meticulously crafted it, and the timeless traditions that have nurtured its existence through generations. This intrinsic connection to heritage and environment is at the heart of everything we do.
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Target className="h-6 w-6 text-primary mr-2" />
                <h3 className="font-merriweather text-2xl font-bold text-primary">Our Mission: Bridging Worlds</h3>
              </div>
              <p className="font-poppins text-muted-foreground">
                Our core mission is to forge a meaningful bridge between the invaluable contributions of rural and tribal producers and the growing community of conscious consumers. We recognize that countless artisans and small-scale producers create items rich in cultural heritage, environmentally sustainable, and beneficial to health — yet these extraordinary products often struggle to find their place within mainstream markets.
              </p>
            </div>

            <div>
              <h3 className="font-merriweather text-2xl font-bold text-primary mb-4">Our Core Objectives: Empowerment, Sustainability, and Preservation</h3>
              <div className="space-y-6 font-poppins text-muted-foreground">
                <div>
                  <h4 className="font-semibold mb-1">Empower Producers through Direct Digital Access</h4>
                  <p>We empower producers by providing direct access to digital markets — eliminating intermediaries so they receive fair recognition and rightful income for their craft, enabling community reinvestment and continuity.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Promote Sustainability through Eco-Friendly Alternatives</h4>
                  <p>We showcase eco-friendly, handmade alternatives that respect nature’s balance. By elevating sustainable choices, we encourage consumer decisions that drive positive environmental change.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Preserve Culture and Enhance Well-being through Traditional Wisdom</h4>
                  <p>We preserve cultural wisdom and enhance well-being by bringing forward traditional practices, ancient crafts, and authentic products imbued with natural, health-giving value.</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Heart className="h-6 w-6 text-primary mr-2" />
                <h3 className="font-merriweather text-2xl font-bold text-primary">Join Our Community: Fair Trade, Authenticity, and Impact</h3>
              </div>
              <p className="font-poppins text-muted-foreground">
                Whether you join us as a dedicated producer or a discerning consumer, you become part of a community that values fair trade, authenticity, and meaningful impact. Every purchase supports livelihoods, protects cultural wisdom for future generations, and contributes to safeguarding our environment.
              </p>
            </div>

            <div>
              <h3 className="font-merriweather text-2xl font-bold text-primary mb-2">Our Shared Vision: An Inclusive, Responsible, and Rooted Marketplace</h3>
              <p className="font-poppins text-muted-foreground">
                Together, we are building a marketplace that is inclusive, responsible, and deeply rooted in tradition — a space where every product tells a story and every purchase makes a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TribalDivider className="text-accent" />

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