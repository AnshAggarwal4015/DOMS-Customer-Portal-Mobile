// app/services/httpClient.ts
import { getAccessToken  } from '@/stores/auth';
import { API_BASE_URL } from '@/constants/api';

interface HttpClientOptions {
  baseURL: string;
  headers?: Record<string, string>;
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(options: HttpClientOptions) {
    this.baseURL = options.baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = getAccessToken ();
    return {
      ...this.defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      // You can customize error handling based on status codes
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };
    }

    return response.json();
  }

  // Helper function to build query string
  private buildQueryString(params?: QueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async get(endpoint: string, params?: QueryParams, customHeaders = {}) {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseURL}${endpoint}${queryString}`;

    const headers = {
      ...this.getAuthHeaders(),
      ...customHeaders,
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  async post(
    endpoint: string,
    data: any,
    params?: QueryParams,
    customHeaders = {}
  ) {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseURL}${endpoint}${queryString}`;

    const headers = {
      ...this.getAuthHeaders(),
      ...customHeaders,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  async put(
    endpoint: string,
    data: any,
    params?: QueryParams,
    customHeaders = {}
  ) {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseURL}${endpoint}${queryString}`;

    const headers = {
      ...this.getAuthHeaders(),
      ...customHeaders,
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  async delete(endpoint: string, params?: QueryParams, customHeaders = {}) {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseURL}${endpoint}${queryString}`;

    const headers = {
      ...this.getAuthHeaders(),
      ...customHeaders,
    };

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
}

// Create and export an instance with the API base URL
export const httpClient = new HttpClient({
  baseURL: API_BASE_URL,
});

export default httpClient;
