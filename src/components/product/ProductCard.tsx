import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-warm transition-all duration-300 bg-card">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-merriweather text-lg font-semibold text-foreground mb-1 line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="font-poppins text-xs">{product.producer.location}</span>
          </div>
          
          <p className="font-poppins text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="font-merriweather text-xl font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-burnt-orange hover:bg-burnt-orange/90 text-white"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="mt-2">
            <span className="font-poppins text-xs text-olive">
              By {product.producer.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;