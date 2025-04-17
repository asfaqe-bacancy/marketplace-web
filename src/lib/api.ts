import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3131',
});

// Initialize headers from localStorage on load
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  
  if (token) {

    console.log('Token found in localStorage:', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  else {
    console.log('Token not found in localStorage');
  }
}

// Add request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    // For browser environments only
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  // Base API methods
  get: api.get,
  post: api.post,
  put: api.put,
  patch: api.patch,
  delete: api.delete,

  // Form data methods
  async  uploadProductWithImage(formData: FormData) {
    // Token is automatically added by the interceptor
    console.log('Uploading product with image...');
    try {
      // Use the correct endpoint based on your API
      const response = await api.post('/products/create-with-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product upload response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in uploadProductWithImage:', error);
      throw error;
    }
  },

  async updateProductWithImage(productId: string, formData: FormData) {
    // Token is automatically added by the interceptor
    const response = await api.patch(`/products/${productId}/with-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProduct(productId: string) {
    // Token is automatically added by the interceptor
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  }
};

export default apiService;