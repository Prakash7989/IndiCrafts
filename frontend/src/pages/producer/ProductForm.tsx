import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/data';
import apiService from '@/services/api';
import { locationService } from '@/services/locationService';
import { shippingService } from '@/services/shippingService';
import { toast } from 'sonner';

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        producerLocation: '',
        weight: '',
        producerPincode: '',
        producerCity: '',
        producerState: '',
    });
    const [location, setLocation] = useState<any>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [geocoding, setGeocoding] = useState(false);
    const [shippingPreview, setShippingPreview] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!isEdit) return;
            try {
                setLoading(true);
                const res = await apiService.listMyProducts();
                const products = (res as any).products || [];
                const current = products.find((p: any) => p._id === id);
                if (!current) {
                    toast.error('Product not found');
                    navigate('/producer/dashboard');
                    return;
                }
                setFormValues({
                    name: current.name || '',
                    category: current.category || '',
                    price: String(current.price ?? ''),
                    quantity: String(current.quantity ?? ''),
                    description: current.description || '',
                    producerLocation: current.producerLocation || '',
                    weight: String(current.weight ?? ''),
                    producerPincode: current.producerPincode || (current.location?.postalCode) || '',
                    producerCity: current.location?.city || '',
                    producerState: current.location?.state || '',
                });
                if (current.location) {
                    setLocation(current.location);
                }
                setImagePreview(current.imageUrl || null);
            } catch (e: any) {
                toast.error(e?.message || 'Failed to load product');
                navigate('/producer/dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isEdit, navigate]);

    const fetchCurrentLocation = async () => {
        try {
            setLocationLoading(true);
            const locationData = await locationService.getCurrentLocation();
            setLocation(locationData);
            // populate the manual input with a readable address so producers can edit
            const addressLabel = locationData.address || `${locationData.city || ''}${locationData.city && locationData.state ? ', ' : ''}${locationData.state || ''}`;
            setFormValues((prev) => ({ ...prev, producerLocation: addressLabel }));
            toast.success('Location fetched successfully');
            // Calculate shipping preview after location is fetched
            calculateShippingPreview();
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch location');
        } finally {
            setLocationLoading(false);
        }
    };

    // Geocode by pincode (or full query). Returns location object or null.
    const geocodeByPincode = async (query: string) => {
        if (!query || !query.trim()) return null;
        setGeocoding(true);
        try {
            // Prefer searching by pincode + India to increase chances
            const q = `${query} India`;
            const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(q)}`;
            const res = await fetch(url, { headers: { 'User-Agent': 'IndiCrafts/1.0' } });
            if (!res.ok) throw new Error('Geocoding failed');
            const data = await res.json();
            if (!data || data.length === 0) return null;
            const first = data[0];
            const loc = {
                latitude: Number(first.lat),
                longitude: Number(first.lon),
                address: first.display_name,
                city: first.address?.city || first.address?.town || first.address?.village || '',
                state: first.address?.state || '',
                country: first.address?.country || '',
                postalCode: first.address?.postcode || '',
            };
            return loc;
        } catch (err) {
            console.error('Geocode error', err);
            return null;
        } finally {
            setGeocoding(false);
        }
    };

    // Called when the producer enters or blurs the pincode input
    const handlePincodeBlur = async () => {
        const p = formValues.producerPincode?.trim();
        if (!p) return;
        const loc = await geocodeByPincode(p);
        if (!loc) {
            toast.error('Could not resolve pincode to a location');
            return;
        }
        // set structured location and populate city/state/readable location
        setLocation(loc);
        setFormValues((prev) => ({ ...prev, producerCity: loc.city || prev.producerCity, producerState: loc.state || prev.producerState, producerLocation: `${loc.city || ''}${loc.city && loc.state ? ', ' : ''}${loc.state || ''} ${loc.postalCode || ''}` }));
        // Update shipping preview automatically
        await calculateShippingPreview();
    };

    const calculateShippingPreview = async () => {
        if (!formValues.price || !formValues.weight || !location) return;

        try {
            const totalPrice = await shippingService.calculateTotalPrice(
                Number(formValues.price),
                Number(formValues.weight),
                location
            );
            setShippingPreview(totalPrice);
        } catch (error) {
            console.error('Error calculating shipping preview:', error);
        }
    };

    // Calculate shipping preview when price, weight, or location changes
    useEffect(() => {
        calculateShippingPreview();
    }, [formValues.price, formValues.weight, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const fd = new FormData();
            fd.append('name', formValues.name);
            fd.append('category', formValues.category);
            fd.append('price', formValues.price);
            fd.append('quantity', formValues.quantity);
            fd.append('description', formValues.description);
            fd.append('producerLocation', formValues.producerLocation);
            if (formValues.producerPincode) fd.append('producerPincode', formValues.producerPincode);
            if (formValues.producerCity) fd.append('producerCity', formValues.producerCity);
            if (formValues.producerState) fd.append('producerState', formValues.producerState);
            if (formValues.weight) fd.append('weight', formValues.weight);
            if (location) {
                fd.append('location', JSON.stringify(location));
            }
            if (imageFile) fd.append('image', imageFile);

            if (isEdit && id) {
                await apiService.updateProduct(id, fd);
                toast.success('Product updated');
            } else {
                await apiService.createProduct(fd);
                toast.success('Product created');
            }
            navigate('/producer/dashboard');
        } catch (e: any) {
            toast.error(e?.message || 'Submit failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-merriweather">
                            {isEdit ? 'Edit Product' : 'Add Product'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" required value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} />
                            </div>

                            <div>
                                <Label>Category</Label>
                                <Select value={formValues.category} onValueChange={(v) => setFormValues({ ...formValues, category: v })}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <Input id="price" type="number" min="0" required value={formValues.price} onChange={(e) => setFormValues({ ...formValues, price: e.target.value })} />
                                </div>
                                <div>
                                    <Label htmlFor="qty">Quantity</Label>
                                    <Input id="qty" type="number" min="0" required value={formValues.quantity} onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="weight">Weight (grams)</Label>
                                    <Input id="weight" type="number" min="0" value={formValues.weight} onChange={(e) => setFormValues({ ...formValues, weight: e.target.value })} placeholder="Enter weight in grams" />
                                </div>
                                <div>
                                    <Label>Location</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={fetchCurrentLocation}
                                            disabled={locationLoading}
                                            className="flex-1"
                                        >
                                            {locationLoading ? 'Fetching...' : 'Auto-fetch Location'}
                                        </Button>
                                    </div>
                                    {location && (
                                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                                            <p><strong>Address:</strong> {location.address || 'N/A'}</p>
                                            <p><strong>City:</strong> {location.city || 'N/A'}</p>
                                            <p><strong>State:</strong> {location.state || 'N/A'}</p>
                                            <p><strong>Country:</strong> {location.country || 'N/A'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="desc">Description</Label>
                                <Textarea id="desc" rows={3} required value={formValues.description} onChange={(e) => setFormValues({ ...formValues, description: e.target.value })} />
                            </div>

                            {/* Manual location inputs: pincode, city, state. Geocoding runs automatically on pincode blur or when auto-fetch fills location. */}
                            <div>
                                <Label>Location (pincode / city / state)</Label>
                                <div className="grid sm:grid-cols-3 gap-2 mt-2">
                                    <div>
                                        <Label htmlFor="producerPincode">Pincode</Label>
                                        <Input id="producerPincode" value={formValues.producerPincode} onChange={(e) => setFormValues({ ...formValues, producerPincode: e.target.value })} onBlur={handlePincodeBlur} placeholder="e.g. 560001" />
                                    </div>
                                    <div>
                                        <Label htmlFor="producerCity">City</Label>
                                        <Input id="producerCity" value={formValues.producerCity} onChange={(e) => setFormValues({ ...formValues, producerCity: e.target.value })} placeholder="City" />
                                    </div>
                                    <div>
                                        <Label htmlFor="producerState">State</Label>
                                        <Input id="producerState" value={formValues.producerState} onChange={(e) => setFormValues({ ...formValues, producerState: e.target.value })} placeholder="State" />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">You can auto-fetch your precise location or enter pincode, city and state manually. Shipping cost (including IIT KGP distance surcharge) will be computed automatically when pincode is provided or when you auto-fetch.</p>
                            </div>

                            <div>
                                <Label htmlFor="image">Product Image {isEdit ? '(leave empty to keep current)' : ''}</Label>
                                <Input id="image" type="file" accept="image/*" className="mt-1" onChange={(e) => {
                                    const f = e.target.files?.[0] || null;
                                    setImageFile(f);
                                    if (f) {
                                        const url = URL.createObjectURL(f);
                                        setImagePreview(url);
                                    }
                                }} />
                            </div>

                            {imagePreview && (
                                <div>
                                    <Label>Preview</Label>
                                    <div className="mt-2 w-full h-56 bg-muted rounded overflow-hidden flex items-center justify-center">
                                        <img src={imagePreview} alt="Preview" className="max-h-full object-contain" />
                                    </div>
                                </div>
                            )}

                            {/* Shipping Preview */}
                            {shippingPreview && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-3">Customer Price Preview</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Your Price:</span>
                                            <span>₹{shippingPreview.basePrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping Cost:</span>
                                            <span>₹{shippingPreview.shippingCost.toLocaleString()}</span>
                                        </div>
                                        {/* Split shipping into weight rate + distance */}
                                        {shippingPreview.breakdown?.shipping?.breakdown && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                <span className="block">Weight rate: ₹{shippingPreview.breakdown.shipping.breakdown.baseRate} + Distance: ₹{shippingPreview.breakdown.shipping.breakdown.distanceCharge}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-semibold text-blue-900 border-t pt-2">
                                            <span>Total Customer Price:</span>
                                            <span>₹{shippingPreview.totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-blue-800">
                                            <span>Admin Commission (5% of base):</span>
                                            <span>₹{(shippingPreview.commission ?? Math.round((Number(formValues.price || 0) * 5) / 100)).toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-blue-800">
                                            5% of the original base price (excluding shipping) will be retained by the website owner as admin commission.
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-700 mt-2">
                                        This is what customers will see as the total price including shipping.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => navigate('/producer/dashboard')}>Cancel</Button>
                                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Product')}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductForm;


