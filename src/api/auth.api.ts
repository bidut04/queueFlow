import { api } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  expiresIn?: number;
  requiresMfa?: boolean;
  message?: string;
}

export interface AuthUserInfo {
  email: string;
  role: string;
  isSuperAdmin: boolean;
  loginTime: string;
}

const TOKEN_KEY = 'queflow_token';
const USER_KEY = 'queflow_user';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });

    if (response?.accessToken) {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem('access_token', response.accessToken);

      const isSuper =
        credentials.email.toLowerCase().includes('admin') ||
        credentials.email.toLowerCase() === 'admin@gmail.com';

      const user: AuthUserInfo = {
        email: credentials.email.toLowerCase().trim(),
        role: isSuper ? 'SUPER_ADMIN' : 'STAFF',
        isSuperAdmin: isSuper,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return response;
  },

  saveLocalMockSession: (email: string, role: string = 'TENANT_ADMIN'): void => {
    const isSuper = email.toLowerCase().trim() === 'admin@gmail.com';
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem('access_token', mockToken);
    const user: AuthUserInfo = {
      email: email.toLowerCase().trim(),
      role: isSuper ? 'SUPER_ADMIN' : role,
      isSuperAdmin: isSuper,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Continue cleanup on network error
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('qf_org_admin_user');
    }
  },

  getCurrentUser: (): AuthUserInfo | null => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AuthUserInfo;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const token =
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('token');
    return Boolean(token);
  },

  isSuperAdmin: (): boolean => {
    if (!authApi.isAuthenticated()) return false;
    const user = authApi.getCurrentUser();
    if (!user) {
      // If token exists but no user stored, check if token exists
      return false;
    }
    return user.isSuperAdmin || user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.email === 'admin@gmail.com';
  },
};
