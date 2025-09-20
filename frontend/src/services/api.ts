const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  message: string;
  user?: any;
  token?: string;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'customer' | 'producer';
    phone?: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getProfile(): Promise<ApiResponse> {
    return this.request('/auth/profile');
  }

  async updateProfile(userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Contact endpoints
  async submitContact(contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse> {
    return this.request('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getContacts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return this.request(`/contact${queryString ? `?${queryString}` : ''}`);
  }

  async getContactById(id: string): Promise<ApiResponse> {
    return this.request(`/contact/${id}`);
  }

  async updateContactStatus(id: string, data: {
    status?: string;
    priority?: string;
    response?: string;
  }): Promise<ApiResponse> {
    return this.request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContact(id: string): Promise<ApiResponse> {
    return this.request(`/contact/${id}`, {
      method: 'DELETE',
    });
  }

  async getContactStats(): Promise<ApiResponse> {
    return this.request('/contact/stats');
  }

  // Products
  async listProducts(): Promise<ApiResponse<{ products: any[] }>> {
    return this.request('/products');
  }

  async getProductById(id: string): Promise<ApiResponse<{ product: any }>> {
    return this.request(`/products/${id}`);
  }

  async createProduct(formData: FormData): Promise<ApiResponse<{ product: any }>> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/products`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }
    return data;
  }

  async listMyProducts(): Promise<ApiResponse<{ products: any[] }>> {
    return this.request('/products/mine');
  }

  async updateProduct(id: string, payload: FormData | Record<string, any>): Promise<ApiResponse<{ product: any }>> {
    const token = localStorage.getItem('token');
    let response: Response;
    if (payload instanceof FormData) {
      response = await fetch(`${this.baseURL}/products/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: payload,
      });
    } else {
      response = await fetch(`${this.baseURL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
export default apiService;
