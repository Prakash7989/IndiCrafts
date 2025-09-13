import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Heart, Leaf, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts, categories } from '@/lib/data';
import { TribalDivider } from '@/components/ui/tribal-pattern';
import heroImage from '@/assets/hero-artisan.jpg';

const Home: React.FC = () => {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Artisan at work"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="font-merriweather text-4xl md:text-5xl lg:text-6xl font-bold text-off-white mb-4">
              Authentic Handicrafts from Rural Artisans
            </h1>
            <p className="font-poppins text-lg md:text-xl text-off-white/90 mb-8">
              Discover unique handmade treasures while empowering traditional craftspeople
              and preserving ancient art forms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register/producer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-off-white text-off-white hover:bg-off-white/10 font-poppins"
                >
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TribalDivider className="text-primary -mt-px" />

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-merriweather text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Why Choose Artisan Marketplace
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-merriweather text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="font-poppins text-sm text-muted-foreground">
                100% genuine handmade products directly from artisans
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-merriweather text-xl font-semibold mb-2">Empower Communities</h3>
              <p className="font-poppins text-sm text-muted-foreground">
                Support rural livelihoods and preserve traditional crafts
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-merriweather text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="font-poppins text-sm text-muted-foreground">
                Sustainable products made with natural materials
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-merriweather text-xl font-semibold mb-2">Made with Love</h3>
              <p className="font-poppins text-sm text-muted-foreground">
                Each piece tells a story of tradition and craftsmanship
              </p>
            </div>
          </div>
        </div>
      </section>

      <TribalDivider className="text-accent" />

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-merriweather text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="font-poppins">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <TribalDivider className="text-primary" />

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-merriweather text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg bg-gradient-earth p-6 text-center hover:shadow-warm transition-all duration-300"
              >
                <h3 className="font-merriweather text-lg font-semibold text-off-white group-hover:scale-105 transition-transform">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;