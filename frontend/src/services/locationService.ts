export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface AddressData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  location?: LocationData;
}

class LocationService {
  private watchId: number | null = null;

  // Get current location using Geolocation API
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get address details
            const addressData = await this.reverseGeocode(latitude, longitude);
            resolve({
              latitude,
              longitude,
              ...addressData
            });
          } catch (error) {
            // If reverse geocoding fails, return just coordinates
            resolve({
              latitude,
              longitude
            });
          }
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Watch location changes
  watchLocation(callback: (location: LocationData) => void, errorCallback?: (error: Error) => void): void {
    if (!navigator.geolocation) {
      errorCallback?.(new Error('Geolocation is not supported by this browser'));
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const addressData = await this.reverseGeocode(latitude, longitude);
          callback({
            latitude,
            longitude,
            ...addressData
          });
        } catch (error) {
          callback({
            latitude,
            longitude
          });
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        errorCallback?.(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }

  // Stop watching location
  stopWatchingLocation(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Reverse geocoding using OpenStreetMap Nominatim API
  private async reverseGeocode(latitude: number, longitude: number): Promise<Partial<LocationData>> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }
      
      const data = await response.json();
      
      return {
        address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postalCode: data.address?.postcode
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Calculate distance between two coordinates (in kilometers)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Validate address data
  validateAddress(address: Partial<AddressData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.fullName?.trim()) {
      errors.push('Full name is required');
    }

    if (!address.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(address.phone)) {
      errors.push('Please enter a valid phone number');
    }

    if (!address.addressLine1?.trim()) {
      errors.push('Address line 1 is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.state?.trim()) {
      errors.push('State is required');
    }

    if (!address.postalCode?.trim()) {
      errors.push('Postal code is required');
    }

    if (!address.country?.trim()) {
      errors.push('Country is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const locationService = new LocationService();
export default locationService;
