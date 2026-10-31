export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuthRedirect?: boolean;
  _isRetry?: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const tryRefreshToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) return null;
      const json = await res.json();
      const newToken = json?.data?.accessToken || json?.accessToken;
      if (newToken) {
        localStorage.setItem('queflow_token', newToken);
        localStorage.setItem('access_token', newToken);
        return newToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
};

export const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem('queflow_token');
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) {
      localStorage.removeItem('queflow_token');
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    // Purge foreign tokens (e.g. integer userId, missing session sid)
    if (!payload || !payload.sid || typeof payload.sub !== 'string' || typeof payload.userId === 'number') {
      console.warn('[AuthClient] Detected and purged foreign/invalid token');
      localStorage.removeItem('queflow_token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      localStorage.removeItem('queflow_user');
      return null;
    }

    return token;
  } catch {
    return null;
  }
};

export const getActiveTenantId = (): string => {
  try {
    const activeTenant = localStorage.getItem('queflow_active_tenant');
    if (activeTenant) return activeTenant;

    const storedUser = localStorage.getItem('queflow_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.tenants && parsed.tenants.length > 0) {
        const tenantId = parsed.tenants[0].tenantId || parsed.tenants[0].id;
        if (tenantId) {
          localStorage.setItem('queflow_active_tenant', tenantId);
          return tenantId;
        }
      }
    }

    const legacyTenant = localStorage.getItem('tenant_id');
    if (legacyTenant) return legacyTenant;
  } catch {
    // ignore
  }
  return '';
};

export const apiClient = async <T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { params, headers: customHeaders, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const token = getAuthToken();
  const tenantId = getActiveTenantId();

  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type') && !(customConfig.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (tenantId && !headers.has('X-Tenant-ID')) {
    headers.set('X-Tenant-ID', tenantId);
  }

  try {
    const response = await fetch(url, {
      credentials: customConfig.credentials || 'include',
      ...customConfig,
      headers,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh') && !options._isRetry) {
        // Attempt silent refresh
        const refreshedToken = await tryRefreshToken();
        if (refreshedToken) {
          const retryHeaders = new Headers(customHeaders);
          retryHeaders.set('Authorization', `Bearer ${refreshedToken}`);
          return apiClient<T>(endpoint, {
            ...options,
            headers: retryHeaders,
            _isRetry: true,
          });
        }

        // If silent refresh failed and skipAuthRedirect is not enabled, redirect to login
        if (!options.skipAuthRedirect) {
          try {
            localStorage.removeItem('queflow_token');
            localStorage.removeItem('access_token');
            localStorage.removeItem('token');
            localStorage.removeItem('queflow_user');
          } catch {
            // ignore storage error
          }
          if (typeof window !== 'undefined' && !window.location.pathname.includes('login')) {
            window.location.href = '/login';
          }
        }
      }

      const errorMsg =
        (typeof data === 'object' && data && (data.message || data.error)) ||
        response.statusText ||
        'Request failed';
      const errorCode =
        (typeof data === 'object' && data && data.code) || `HTTP_${response.status}`;
      throw new ApiClientError(response.status, errorCode, errorMsg, data);
    }

    // Unwrap standardized backend envelope { success: true, data: T }
    if (data && typeof data === 'object' && 'data' in data && 'success' in data) {
      return (data as ApiResponse<T>).data;
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiClientError) {
      throw err;
    }
    // Network errors (e.g. backend server offline)
    throw new ApiClientError(0, 'NETWORK_ERROR', (err as Error).message || 'Network connection error');
  }
};

export const api = {
  get: <T = unknown>(url: string, options?: RequestOptions) =>
    apiClient<T>(url, { ...options, method: 'GET' }),
  post: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(url, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T = unknown>(url: string, options?: RequestOptions) =>
    apiClient<T>(url, { ...options, method: 'DELETE' }),
};
