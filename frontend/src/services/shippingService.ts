import apiService from './api';

export interface ShippingCost {
    baseCost: number;
    distanceSurcharge: number;
    totalCost: number;
    weight: number;
    serviceType: string;
    breakdown: {
        weightCategory: string;
        baseRate: number;
        distanceCharge: number;
        total: number;
    };
}

export interface TotalPrice {
    basePrice: number;
    shippingCost: number;
    commission?: number;
    totalPrice: number;
    breakdown: {
        productPrice: number;
        shipping: ShippingCost;
        total: number;
    };
}

export interface ShippingRates {
    domestic: {
        description: string;
        rates: Record<string, number>;
    };
    express: {
        description: string;
        rates: Record<string, number>;
    };
}

class ShippingService {
    /**
     * Calculate shipping cost for a product
     */
    async calculateShippingCost(
        weight: number,
        location?: any,
        serviceType: string = 'domestic'
    ): Promise<ShippingCost> {
        try {
            const response = await apiService.post('/shipping/calculate', {
                weight,
                location,
                serviceType
            });
            return response.shippingCost;
        } catch (error) {
            console.error('Error calculating shipping cost:', error);
            throw error;
        }
    }

    /**
     * Calculate total price including shipping
     */
    async calculateTotalPrice(
        basePrice: number,
        weight: number,
        location?: any,
        serviceType: string = 'domestic'
    ): Promise<TotalPrice> {
        try {
            const response = await apiService.post('/shipping/total-price', {
                basePrice,
                weight,
                location,
                serviceType
            });
            return response.totalPrice;
        } catch (error) {
            console.error('Error calculating total price:', error);
            throw error;
        }
    }

    /**
     * Calculate customer-facing price (hub -> customer delivery)
     */
    async calculateCustomerPrice(
        basePrice: number,
        weight: number,
        customerLocationOrPostal: any,
        serviceType: string = 'domestic'
    ): Promise<TotalPrice> {
        try {
            // If the caller passed a string, treat it as a postal code; otherwise send as location
            const body: any = { basePrice, weight, serviceType };
            if (typeof customerLocationOrPostal === 'string') {
                body.customerPostalCode = customerLocationOrPostal;
            } else if (customerLocationOrPostal) {
                body.customerLocation = customerLocationOrPostal;
            }

            const response = await apiService.post('/shipping/customer-total-price', body);
            return response.totalPrice;
        } catch (error) {
            console.error('Error calculating customer total price:', error);
            throw error;
        }
    }

    /**
     * Get shipping rates information
     */
    async getShippingRates(): Promise<ShippingRates> {
        try {
            const response = await apiService.get('/shipping/rates');
            return response.rates;
        } catch (error) {
            console.error('Error fetching shipping rates:', error);
            throw error;
        }
    }

    /**
     * Format price for display
     */
    formatPrice(price: number): string {
        return `₹${price.toLocaleString('en-IN')}`;
    }

    /**
     * Get weight category description
     */
    getWeightCategory(weight: number): string {
        if (weight <= 50) return 'Up to 50g';
        if (weight <= 100) return '51g to 100g';
        if (weight <= 250) return '101g to 250g';
        if (weight <= 500) return '251g to 500g';
        if (weight <= 1000) return '501g to 1kg';
        if (weight <= 2000) return '1kg to 2kg';
        if (weight <= 3000) return '2kg to 3kg';
        if (weight <= 4000) return '3kg to 4kg';
        return '4kg to 5kg';
    }
}

export const shippingService = new ShippingService();
export default shippingService;
