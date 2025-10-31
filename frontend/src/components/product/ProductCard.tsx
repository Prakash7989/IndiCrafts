import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to manage your wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await api.removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.addToWishlist(product.id);
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Wishlist update failed');
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <CardContent className="p-0">
        {/* Image Container with Hover Zoom */}
        <div className="relative overflow-hidden rounded-t-lg bg-gray-50">
          <div className="aspect-square relative">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
                }`}
            />

            {/* Overlay with actions */}
            <div className={`absolute inset-0 bg-black/0 transition-all duration-300 ${isHovered ? 'bg-black/20' : ''
              }`}>
              {/* Quick Actions */}
              <div className={`absolute top-2 right-2 flex flex-col space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWishlist}
                  className={`h-8 w-8 p-0 bg-white/90 hover:bg-white ${isWishlisted ? 'text-red-500' : 'text-gray-600'
                    }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewDetails}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-600"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <div className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}>
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white text-sm"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-merriweather font-semibold text-lg line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="font-poppins text-sm text-muted-foreground">
              By {product.producer.name} • {product.producer.location}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="font-merriweather text-xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ₹{(product.price * 1.2).toLocaleString()}
              </span>
            </div>
            <Badge variant="destructive" className="text-xs">
              17% OFF
            </Badge>
          </div>
          {/* Hide producer-to-hub breakdown from customers */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;