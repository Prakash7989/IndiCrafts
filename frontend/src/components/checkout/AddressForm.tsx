import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { locationService, AddressData, LocationData } from '@/services/locationService';
import LocationPermission from '@/components/ui/LocationPermission';

interface AddressFormProps {
    onAddressSubmit: (address: AddressData) => void;
    initialAddress?: Partial<AddressData>;
    isLoading?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
    onAddressSubmit,
    initialAddress,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<Partial<AddressData>>({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        landmark: '',
        ...initialAddress
    });

    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [showLocationPermission, setShowLocationPermission] = useState(true);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

    useEffect(() => {
        // Check if location permission is already granted
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
                if (result.state === 'granted') {
                    setLocationPermissionGranted(true);
                    setShowLocationPermission(false);
                    getCurrentLocation();
                } else if (result.state === 'denied') {
                    setShowLocationPermission(false);
                }
            });
        } else {
            // Fallback for browsers that don't support permissions API
            getCurrentLocation();
        }
    }, []);

    const getCurrentLocation = async () => {
        try {
            setIsGettingLocation(true);
            setLocationError(null);
            const location = await locationService.getCurrentLocation();
            setCurrentLocation(location);
            setLocationPermissionGranted(true);
            setShowLocationPermission(false);

            // Auto-fill form with location data
            setFormData(prev => ({
                ...prev,
                city: location.city || prev.city,
                state: location.state || prev.state,
                country: location.country || prev.country || 'India',
                postalCode: location.postalCode || prev.postalCode,
                addressLine1: location.address || prev.addressLine1
            }));

            toast.success('Location detected successfully!');
        } catch (error: any) {
            setLocationError(error.message);
            toast.error(error.message);
        } finally {
            setIsGettingLocation(false);
        }
    };

    const handleLocationPermissionGranted = () => {
        setLocationPermissionGranted(true);
        setShowLocationPermission(false);
        getCurrentLocation();
    };

    const handleLocationPermissionDenied = () => {
        setShowLocationPermission(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Get coordinates for major Indian cities
    const getCityCoordinates = (city: string, state: string) => {
        const cityCoords: Record<string, { latitude: number; longitude: number }> = {
            'Chennai': { latitude: 13.0827, longitude: 80.2707 },
            'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
            'Delhi': { latitude: 28.7041, longitude: 77.1025 },
            'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
            'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
            'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
            'Pune': { latitude: 18.5204, longitude: 73.8567 },
            'Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
            'Jaipur': { latitude: 26.9124, longitude: 75.7873 },
            'Surat': { latitude: 21.1702, longitude: 72.8311 },
        };

        const normalizedCity = city?.toLowerCase().trim();
        for (const [key, coords] of Object.entries(cityCoords)) {
            if (normalizedCity?.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedCity || '')) {
                return coords;
            }
        }
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = locationService.validateAddress(formData);
        if (!validation.isValid) {
            validation.errors.forEach(error => toast.error(error));
            return;
        }

        // If no GPS location, try to get coordinates from city/state
        let location = currentLocation;
        if (!location && formData.city && formData.state) {
            const coords = getCityCoordinates(formData.city, formData.state);
            if (coords) {
                location = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    address: `${formData.city}, ${formData.state}`,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country || 'India'
                };
            }
        }

        const addressData: AddressData = {
            ...formData as AddressData,
            location: location || undefined
        };

        onAddressSubmit(addressData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-merriweather text-xl flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Delivery Address
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Location Permission Request */}
                {showLocationPermission && (
                    <div className="mb-6">
                        <LocationPermission
                            onPermissionGranted={handleLocationPermissionGranted}
                            onPermissionDenied={handleLocationPermissionDenied}
                        />
                    </div>
                )}

                {/* Location Detection Section */}
                {locationPermissionGranted && (
                    <div className="mb-6 p-4 bg-secondary/20 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-poppins font-medium">Auto-detect Location</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={getCurrentLocation}
                                disabled={isGettingLocation}
                                className="text-primary border-primary hover:bg-primary hover:text-white"
                            >
                                {isGettingLocation ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Detecting...
                                    </>
                                ) : (
                                    <>
                                        <Navigation className="h-4 w-4 mr-2" />
                                        Get Location
                                    </>
                                )}
                            </Button>
                        </div>

                        {currentLocation && (
                            <div className="text-sm text-muted-foreground">
                                <p><strong>Detected:</strong> {currentLocation.address}</p>
                                <p><strong>Coordinates:</strong> {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}</p>
                            </div>
                        )}

                        {locationError && (
                            <div className="text-sm text-red-600 mt-2">
                                <p><strong>Location Error:</strong> {locationError}</p>
                                <p className="text-xs">You can still fill the form manually.</p>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="fullName" className="font-poppins">Full Name *</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName || ''}
                                onChange={handleChange}
                                required
                                className="mt-1"
                                disabled={isLoading}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="font-poppins">Phone Number *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                required
                                className="mt-1"
                                disabled={isLoading}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="addressLine1" className="font-poppins">Address Line 1 *</Label>
                        <Input
                            id="addressLine1"
                            name="addressLine1"
                            type="text"
                            value={formData.addressLine1 || ''}
                            onChange={handleChange}
                            required
                            className="mt-1"
                            disabled={isLoading}
                            placeholder="House number, street name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="addressLine2" className="font-poppins">Address Line 2</Label>
                        <Input
                            id="addressLine2"
                            name="addressLine2"
                            type="text"
                            value={formData.addressLine2 || ''}
                            onChange={handleChange}
                            className="mt-1"
                            disabled={isLoading}
                            placeholder="Apartment, suite, unit, building (optional)"
                        />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="city" className="font-poppins">City *</Label>
                            <Input
                                id="city"
                                name="city"
                                type="text"
                                value={formData.city || ''}
                                onChange={handleChange}
                                required
                                className="mt-1"
                                disabled={isLoading}
                                placeholder="Enter city"
                            />
                        </div>
                        <div>
                            <Label htmlFor="state" className="font-poppins">State *</Label>
                            <Input
                                id="state"
                                name="state"
                                type="text"
                                value={formData.state || ''}
                                onChange={handleChange}
                                required
                                className="mt-1"
                                disabled={isLoading}
                                placeholder="Enter state"
                            />
                        </div>
                        <div>
                            <Label htmlFor="postalCode" className="font-poppins">Postal Code *</Label>
                            <Input
                                id="postalCode"
                                name="postalCode"
                                type="text"
                                value={formData.postalCode || ''}
                                onChange={handleChange}
                                required
                                className="mt-1"
                                disabled={isLoading}
                                placeholder="Enter postal code"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="country" className="font-poppins">Country *</Label>
                            <Input
                                id="country"
                                name="country"
                                type="text"
                                value={formData.country || ''}
                                onChange={handleChange}
                                required
                                className="mt-1"
                                disabled={isLoading}
                                placeholder="Enter country"
                            />
                        </div>
                        <div>
                            <Label htmlFor="landmark" className="font-poppins">Landmark</Label>
                            <Input
                                id="landmark"
                                name="landmark"
                                type="text"
                                value={formData.landmark || ''}
                                onChange={handleChange}
                                className="mt-1"
                                disabled={isLoading}
                                placeholder="Nearby landmark (optional)"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white font-poppins"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Save Address & Continue
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddressForm;
