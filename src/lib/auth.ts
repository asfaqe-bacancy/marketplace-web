import api from './api';
import Cookies from 'js-cookie';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  deviceToken?: string;
}

export interface LoginData {
  email: string;
  password: string;
  deviceToken?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post<AuthResponse>('/auth/register', data);
    this.setSession(response.data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await api.post<AuthResponse>('/auth/login', data);
    this.setSession(response.data);
    return response.data;
  },

  logout() {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/auth/login';
  },

  setSession(authData: AuthResponse) {
    Cookies.set(TOKEN_KEY, authData.access_token, { expires: 7 });
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  },

  getToken() {
    return Cookies.get(TOKEN_KEY);
  },

  getUser() {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      // If there's an error parsing, clear the invalid data
      localStorage.removeItem('user');
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};