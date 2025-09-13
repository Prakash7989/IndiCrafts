import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingCart, Plus, Minus, Star, MapPin, User, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { mockProducts } from '@/lib/data';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Find product by ID
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-merriweather text-2xl font-bold mb-4">Product Not Found</h1>
                    <p className="font-poppins text-muted-foreground mb-6">
                        The product you're looking for doesn't exist.
                    </p>
                    <Button onClick={() => navigate('/products')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    // Generate multiple product images for gallery
    const productImages = [
        product.image,
        product.image, // In real app, these would be different angles
        product.image,
        product.image
    ];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`Added ${quantity} ${product.name} to cart`);
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `Check out this beautiful ${product.name} from IndiCrafts`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Product link copied to clipboard');
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="bg-muted/30 py-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
                        <span>/</span>
                        <Link to="/products" className="text-muted-foreground hover:text-primary">Products</Link>
                        <span>/</span>
                        <span className="text-primary">{product.category}</span>
                        <span>/</span>
                        <span className="font-medium">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Side - Images */}
                    <div className="space-y-4">
                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        {/* Main Image */}
                        <div className="relative">
                            <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 p-8 group">
                                <img
                                    src={productImages[selectedImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-3">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 ${selectedImageIndex === index
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="space-y-6">
                        {/* Product Header */}
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <h1 className="font-merriweather text-3xl font-bold text-primary">
                                    {product.name}
                                </h1>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleWishlist}
                                        className={isWishlisted ? 'text-red-500' : 'text-gray-500'}
                                    >
                                        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleShare}>
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.floor(4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm text-muted-foreground">(4.5) • 128 reviews</span>
                                </div>
                                <Badge variant="secondary">{product.category}</Badge>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-muted/30 p-6 rounded-lg">
                            <div className="flex items-baseline space-x-3">
                                <span className="font-merriweather text-4xl font-bold text-primary">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                <span className="text-xl text-muted-foreground line-through">
                                    ₹{(product.price * 1.2).toLocaleString()}
                                </span>
                                <Badge variant="destructive" className="text-sm">
                                    17% OFF
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Inclusive of all taxes • Free shipping on orders above ₹500
                            </p>
                        </div>

                        {/* Producer Info */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-poppins font-semibold">{product.producer.name}</h3>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {product.producer.location}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quantity Selector */}
                        <div>
                            <h3 className="font-poppins font-semibold mb-3">Quantity</h3>
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-poppins px-4 py-2 border rounded min-w-[60px] text-center">{quantity}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 10}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white"
                                size="lg"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                size="lg"
                            >
                                Buy Now
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                                <p className="text-sm font-medium">Free Shipping</p>
                                <p className="text-xs text-muted-foreground">Above ₹500</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                                <p className="text-sm font-medium">7-Day Returns</p>
                                <p className="text-xs text-muted-foreground">Easy exchange</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                                <p className="text-sm font-medium">Secure Payment</p>
                                <p className="text-xs text-muted-foreground">100% safe</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="mt-16 space-y-8">
                    <Separator />

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-merriweather text-2xl font-bold mb-4">Product Description</h3>
                            <p className="font-poppins text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-merriweather text-2xl font-bold mb-4">Key Features</h3>
                            <ul className="font-poppins text-muted-foreground space-y-2">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Handcrafted by skilled artisans using traditional techniques
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Made with sustainable and eco-friendly materials
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Unique and authentic design from rural communities
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Each piece tells a story of tradition and craftsmanship
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-merriweather text-2xl font-bold mb-4">Delivery & Returns</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-poppins font-semibold mb-2">Delivery Information</h4>
                                <ul className="font-poppins text-sm text-muted-foreground space-y-1">
                                    <li>• Free shipping on orders above ₹500</li>
                                    <li>• 3-5 business days delivery</li>
                                    <li>• Secure packaging to protect your items</li>
                                    <li>• Real-time tracking available</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-poppins font-semibold mb-2">Return Policy</h4>
                                <ul className="font-poppins text-sm text-muted-foreground space-y-1">
                                    <li>• 7-day return policy</li>
                                    <li>• Easy return process</li>
                                    <li>• Full refund on returns</li>
                                    <li>• Free return shipping</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
