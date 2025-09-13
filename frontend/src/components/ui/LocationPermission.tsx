import React, { useState, useEffect } from 'react';
import { MapPin, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationPermissionProps {
    onPermissionGranted: () => void;
    onPermissionDenied: () => void;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({
    onPermissionGranted,
    onPermissionDenied
}) => {
    const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied' | 'unavailable'>('checking');

    useEffect(() => {
        checkLocationPermission();
    }, []);

    const checkLocationPermission = async () => {
        if (!navigator.geolocation) {
            setPermissionStatus('unavailable');
            return;
        }

        try {
            // Check if we can get the current position
            await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve(true),
                    (error) => reject(error),
                    { timeout: 1000 }
                );
            });
            setPermissionStatus('granted');
            onPermissionGranted();
        } catch (error: any) {
            if (error.code === error.PERMISSION_DENIED) {
                setPermissionStatus('denied');
            } else {
                setPermissionStatus('denied');
            }
        }
    };

    const requestLocationPermission = async () => {
        try {
            setPermissionStatus('checking');
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                });
            });

            setPermissionStatus('granted');
            onPermissionGranted();
        } catch (error: any) {
            setPermissionStatus('denied');
            onPermissionDenied();
        }
    };

    if (permissionStatus === 'checking') {
        return (
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="font-poppins text-blue-800">Checking location permissions...</p>
                </CardContent>
            </Card>
        );
    }

    if (permissionStatus === 'granted') {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
                    <p className="font-poppins text-green-800">Location access granted!</p>
                </CardContent>
            </Card>
        );
    }

    if (permissionStatus === 'unavailable') {
        return (
            <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
                        <div>
                            <h3 className="font-poppins font-semibold text-yellow-800 mb-2">
                                Location Not Available
                            </h3>
                            <p className="font-poppins text-yellow-700 text-sm mb-4">
                                Your browser doesn't support location services. You can still fill in your address manually.
                            </p>
                            <Button
                                variant="outline"
                                onClick={onPermissionDenied}
                                className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                            >
                                Continue Manually
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-orange-600 mt-1" />
                    <div className="flex-1">
                        <h3 className="font-poppins font-semibold text-orange-800 mb-2">
                            Location Access Required
                        </h3>
                        <p className="font-poppins text-orange-700 text-sm mb-4">
                            We need access to your location to provide accurate delivery estimates and auto-fill your address.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm text-orange-700">
                                <Shield className="h-4 w-4" />
                                <span>Your location data is secure and only used for delivery purposes</span>
                            </div>

                            <div className="flex space-x-3">
                                <Button
                                    onClick={requestLocationPermission}
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Allow Location Access
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={onPermissionDenied}
                                    className="text-orange-800 border-orange-300 hover:bg-orange-100"
                                >
                                    Enter Address Manually
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LocationPermission;
