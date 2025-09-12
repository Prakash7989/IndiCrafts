import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
            <h1 className="font-merriweather text-3xl font-bold text-primary mb-4">
              Your Cart is Empty
            </h1>
            <p className="font-poppins text-muted-foreground mb-8">
              Discover authentic handmade products from rural artisans
            </p>
            <Link to="/products">
              <Button className="bg-burnt-orange hover:bg-burnt-orange/90 text-white">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-merriweather text-3xl font-bold text-primary mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-merriweather text-lg font-semibold mb-1">
                        {item.name}
                      </h3>
                      <p className="font-poppins text-sm text-muted-foreground mb-2">
                        By {item.producer.name} • {item.producer.location}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="font-poppins px-3">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="font-merriweather text-xl font-bold text-primary">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-between">
              <Link to="/products">
                <Button variant="outline">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="font-merriweather text-xl font-bold mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-poppins">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-poppins">
                    <span>Shipping</span>
                    <span>₹99</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-merriweather text-lg font-semibold">Total</span>
                      <span className="font-merriweather text-xl font-bold text-primary">
                        ₹{(totalPrice + 99).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <p className="font-poppins text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by trusted payment partners
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;