import { api, getAuthToken, tryRefreshToken } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  expiresIn?: number;
  requiresMfa?: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    userType: string;
    isSuperAdmin: boolean;
    tenants?: Array<{
      tenantId: string;
      adminRole?: string;
      name?: string;
      slug?: string;
    }>;
  };
}

export interface AuthUserInfo {
  email: string;
  name?: string;
  avatar?: string;
  role: string;
  userType?: string;
  isSuperAdmin: boolean;
  loginTime: string;
  tenants?: any[];
}

const TOKEN_KEY = 'queflow_token';
const USER_KEY = 'queflow_user';

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<any> => {
    return await api.post('/auth/register', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
      role: credentials.role || 'USER',
    });
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });

    if (response?.accessToken) {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem('access_token', response.accessToken);

      let tokenRole = '';
      try {
        const payloadBase64 = response.accessToken.split('.')[1];
        if (payloadBase64) {
          const payload = JSON.parse(atob(payloadBase64));
          tokenRole = payload.role || '';
        }
      } catch {
        // ignore
      }

      // Security: Authority is strictly server-verified from DB and JWT claims.
      // Never use email strings (such as @gmail or 'superadmin') for authorization.
      const isSuper =
        response.user?.isSuperAdmin === true ||
        response.user?.userType === 'PLATFORM_SUPER_ADMIN' ||
        tokenRole === 'SUPER_ADMIN' ||
        tokenRole === 'PLATFORM_OWNER' ||
        tokenRole === 'PLATFORM_ADMIN';

      const userRole = isSuper
        ? 'SUPER_ADMIN'
        : (response.user?.userType === 'TENANT_ADMIN' ||
           tokenRole === 'ADMIN' ||
           tokenRole === 'TENANT_ADMIN' ||
           tokenRole === 'TENANT_OWNER')
        ? 'TENANT_ADMIN'
        : (response.user?.role || tokenRole || 'USER');

      const user: AuthUserInfo = {
        email: response.user?.email || credentials.email.toLowerCase().trim(),
        role: userRole,
        userType: response.user?.userType || (isSuper ? 'PLATFORM_SUPER_ADMIN' : 'USER'),
        isSuperAdmin: isSuper,
        loginTime: new Date().toISOString(),
        tenants: response.user?.tenants || [],
      };

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (user.tenants && user.tenants.length > 0) {
        localStorage.setItem('queflow_active_tenant', user.tenants[0].tenantId || user.tenants[0].id);
      }
      window.dispatchEvent(new CustomEvent('auth:login'));
    }

    return response;
  },

  refreshToken: async (): Promise<string | null> => {
    return await tryRefreshToken();
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
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  },

  getProfile: async (): Promise<AuthUserInfo> => {
    try {
      const res = await api.get<{ success: boolean; user: any }>('/auth/me');
      const u = (res as any)?.user || res;
      if (u) {
        const current = authApi.getCurrentUser() || ({} as AuthUserInfo);
        const merged: AuthUserInfo = {
          ...current,
          email: u.email || current.email,
          name: u.name || current.name,
          avatar: u.avatar || current.avatar,
          role: u.role || current.role,
          userType: u.userType || current.userType,
          isSuperAdmin: u.isSuperAdmin ?? current.isSuperAdmin,
          loginTime: current.loginTime || new Date().toISOString(),
          tenants: u.tenants || current.tenants || [],
        };
        localStorage.setItem(USER_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('auth:profile-updated', { detail: merged }));
        return merged;
      }
    } catch {
      // fallback
    }
    return authApi.getCurrentUser()!;
  },

  updateProfile: async (data: { name?: string; email?: string; avatar?: string }): Promise<AuthUserInfo> => {
    const res = await api.patch<{ success: boolean; user: any }>('/auth/profile', data);
    const u = (res as any)?.user || res;
    const current = authApi.getCurrentUser() || ({} as AuthUserInfo);
    const merged: AuthUserInfo = {
      ...current,
      email: data.email || u?.email || current.email,
      name: data.name !== undefined ? data.name : (u?.name || current.name),
      avatar: data.avatar !== undefined ? data.avatar : (u?.avatar || current.avatar),
      role: u?.role || current.role,
      userType: u?.userType || current.userType,
      isSuperAdmin: u?.isSuperAdmin ?? current.isSuperAdmin,
      loginTime: current.loginTime || new Date().toISOString(),
      tenants: u?.tenants || current.tenants || [],
    };
    localStorage.setItem(USER_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('auth:profile-updated', { detail: merged }));
    return merged;
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
    return Boolean(getAuthToken());
  },

  isSuperAdmin: (): boolean => {
    if (!authApi.isAuthenticated()) return false;
    const token = getAuthToken();
    let tokenRole = '';
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const payload = JSON.parse(atob(payloadBase64));
          tokenRole = payload.role || '';
        }
      } catch {
        // ignore
      }
    }
    const user = authApi.getCurrentUser();
    if (!user && !tokenRole) {
      return false;
    }
    return Boolean(
      user?.isSuperAdmin ||
      user?.role === 'SUPER_ADMIN' ||
      user?.role === 'PLATFORM_OWNER' ||
      user?.role === 'PLATFORM_ADMIN' ||
      user?.userType === 'PLATFORM_SUPER_ADMIN' ||
      tokenRole === 'PLATFORM_OWNER' ||
      tokenRole === 'PLATFORM_ADMIN' ||
      tokenRole === 'SUPER_ADMIN'
    );
  },

  isTenantAdmin: (): boolean => {
    if (!authApi.isAuthenticated()) return false;
    const user = authApi.getCurrentUser();
    if (!user) return false;
    if (authApi.isSuperAdmin()) return true;
    return Boolean(
      user.role === 'TENANT_ADMIN' ||
      user.role === 'ADMIN' ||
      user.role === 'STAFF' ||
      user.userType === 'TENANT_ADMIN' ||
      user.role === 'TENANT_OWNER' ||
      (user.tenants && Array.isArray(user.tenants) && user.tenants.length > 0 && user.tenants.some((t: any) => t.adminRole))
    );
  },

  isNormalUser: (): boolean => {
    if (!authApi.isAuthenticated()) return false;
    return !authApi.isSuperAdmin() && !authApi.isTenantAdmin();
  },
};


