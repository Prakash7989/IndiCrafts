import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, CreditCard, CheckCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import AddressForm from '@/components/checkout/AddressForm';
import { AddressData } from '@/services/locationService';

const Checkout: React.FC = () => {
    const { items, totalItems, totalPrice, deliveryAddress, setDeliveryAddress, clearCart, setCheckoutComplete } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<'address' | 'payment' | 'confirmation'>('address');
    const [isProcessing, setIsProcessing] = useState(false);

    // Check authentication on component mount
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('Please login to continue with checkout');
            navigate('/login?redirect=/checkout');
            return;
        }
    }, [isAuthenticated, navigate]);

    // Show loading if checking authentication
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <Card>
                        <CardContent className="py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="font-poppins text-muted-foreground">Redirecting to login...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Redirect if cart is empty
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <Card>
                        <CardContent className="py-12">
                            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="font-merriweather text-2xl font-bold mb-4">Your cart is empty</h2>
                            <p className="font-poppins text-muted-foreground mb-6">
                                Add some products to your cart before checkout
                            </p>
                            <Button onClick={() => navigate('/')} className="bg-burnt-orange hover:bg-burnt-orange/90">
                                Continue Shopping
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const handleAddressSubmit = (address: AddressData) => {
        setDeliveryAddress(address);
        setCurrentStep('payment');
        toast.success('Address saved successfully!');
    };

    const handlePayment = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setCheckoutComplete(true);
        setCurrentStep('confirmation');
        clearCart();
        toast.success('Order placed successfully!');
        setIsProcessing(false);
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    const renderAddressStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="font-merriweather text-2xl font-bold mb-2">Delivery Address</h2>
                <p className="font-poppins text-muted-foreground">
                    Please provide your delivery address to continue
                </p>
            </div>

            <AddressForm
                onAddressSubmit={handleAddressSubmit}
                initialAddress={deliveryAddress || undefined}
                isLoading={isProcessing}
            />
        </div>
    );

    const renderPaymentStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="font-merriweather text-2xl font-bold mb-2">Payment Details</h2>
                <p className="font-poppins text-muted-foreground">
                    Review your order and complete payment
                </p>
            </div>

            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-merriweather flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Order Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <h4 className="font-poppins font-medium">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-poppins font-medium">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}

                        <Separator />

                        <div className="flex justify-between items-center">
                            <span className="font-poppins font-medium">Total ({totalItems} items)</span>
                            <span className="font-merriweather text-xl font-bold text-primary">
                                ₹{totalPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Address Display */}
            {deliveryAddress && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-merriweather flex items-center text-lg">
                            <MapPin className="h-5 w-5 mr-2" />
                            Delivery Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="font-poppins text-sm space-y-1">
                            <p><strong>{deliveryAddress.fullName}</strong></p>
                            <p>{deliveryAddress.phone}</p>
                            <p>{deliveryAddress.addressLine1}</p>
                            {deliveryAddress.addressLine2 && <p>{deliveryAddress.addressLine2}</p>}
                            <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.postalCode}</p>
                            <p>{deliveryAddress.country}</p>
                            {deliveryAddress.landmark && <p>Landmark: {deliveryAddress.landmark}</p>}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentStep('address')}
                            className="mt-3"
                        >
                            Change Address
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-merriweather flex items-center text-lg">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Method
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <input type="radio" id="cod" name="payment" value="cod" defaultChecked />
                            <label htmlFor="cod" className="font-poppins">Cash on Delivery (COD)</label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-50">
                            <input type="radio" id="online" name="payment" value="online" disabled />
                            <label htmlFor="online" className="font-poppins">Online Payment (Coming Soon)</label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex space-x-4">
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep('address')}
                    className="flex-1"
                >
                    Back to Address
                </Button>
                <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 bg-burnt-orange hover:bg-burnt-orange/90"
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Place Order
                        </>
                    )}
                </Button>
            </div>
        </div>
    );

    const renderConfirmationStep = () => (
        <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
                <h2 className="font-merriweather text-2xl font-bold mb-2">Order Confirmed!</h2>
                <p className="font-poppins text-muted-foreground">
                    Thank you for your order. We'll send you a confirmation email shortly.
                </p>
            </div>

            <Card>
                <CardContent className="py-6">
                    <div className="space-y-2">
                        <p className="font-poppins"><strong>Order Total:</strong> ₹{totalPrice.toLocaleString()}</p>
                        <p className="font-poppins"><strong>Payment Method:</strong> Cash on Delivery</p>
                        <p className="font-poppins"><strong>Estimated Delivery:</strong> 3-5 business days</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex space-x-4">
                <Button
                    variant="outline"
                    onClick={handleContinueShopping}
                    className="flex-1"
                >
                    Continue Shopping
                </Button>
                <Button
                    onClick={() => navigate('/orders')}
                    className="flex-1 bg-burnt-orange hover:bg-burnt-orange/90"
                >
                    View Orders
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        <div className={`flex items-center ${currentStep === 'address' ? 'text-primary' : currentStep === 'payment' || currentStep === 'confirmation' ? 'text-green-600' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'address' ? 'bg-primary text-white' : currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-muted'}`}>
                                1
                            </div>
                            <span className="ml-2 font-poppins font-medium">Address</span>
                        </div>

                        <div className={`w-8 h-1 ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-primary' : 'bg-muted'}`}></div>

                        <div className={`flex items-center ${currentStep === 'payment' ? 'text-primary' : currentStep === 'confirmation' ? 'text-green-600' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-primary text-white' : currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-muted'}`}>
                                2
                            </div>
                            <span className="ml-2 font-poppins font-medium">Payment</span>
                        </div>

                        <div className={`w-8 h-1 ${currentStep === 'confirmation' ? 'bg-primary' : 'bg-muted'}`}></div>

                        <div className={`flex items-center ${currentStep === 'confirmation' ? 'text-green-600' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-muted'}`}>
                                3
                            </div>
                            <span className="ml-2 font-poppins font-medium">Confirmation</span>
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                {currentStep === 'address' && renderAddressStep()}
                {currentStep === 'payment' && renderPaymentStep()}
                {currentStep === 'confirmation' && renderConfirmationStep()}
            </div>
        </div>
    );
};

export default Checkout;
