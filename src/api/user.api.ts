import { api } from './client';
import type { UserItem, UserRole, AccountStatus } from '../types/user';
import { USERS_LIST } from '../data/mockData';

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  branch: string;
  country: string;
  countryFlag?: string;
  status?: AccountStatus;
  avatarUrl?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}

let localUsers: UserItem[] = [...USERS_LIST];

export const userApi = {
  getUsers: async (): Promise<UserItem[]> => {
    try {
      const result = await api.get<UserItem[]>('/users');
      if (Array.isArray(result) && result.length > 0) {
        return result;
      }
      return localUsers;
    } catch {
      return localUsers;
    }
  },

  getUserById: async (id: string): Promise<UserItem> => {
    try {
      return await api.get<UserItem>(`/users/${id}`);
    } catch {
      const found = localUsers.find((u) => u.id === id);
      if (!found) throw new Error(`User ${id} not found`);
      return found;
    }
  },

  createUser: async (input: CreateUserInput): Promise<UserItem> => {
    try {
      const created = await api.post<UserItem>('/users', input);
      localUsers = [created, ...localUsers];
      return created;
    } catch {
      const newUser: UserItem = {
        id: `user-${Date.now()}`,
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role,
        branch: input.branch,
        country: input.country,
        countryFlag: input.countryFlag || '🇺🇸',
        balance: '$0.00',
        totalInvoices: 0,
        status: input.status || 'Active',
        createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        joinedDate: new Date().toISOString().split('T')[0],
        avatarUrl: input.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      };
      localUsers = [newUser, ...localUsers];
      return newUser;
    }
  },

  updateUser: async ({ id, ...input }: UpdateUserInput): Promise<UserItem> => {
    try {
      const updated = await api.patch<UserItem>(`/users/${id}`, input);
      localUsers = localUsers.map((u) => (u.id === id ? { ...u, ...updated } : u));
      return updated;
    } catch {
      let updatedUser: UserItem | null = null;
      localUsers = localUsers.map((u) => {
        if (u.id === id) {
          updatedUser = { ...u, ...input };
          return updatedUser;
        }
        return u;
      });
      if (!updatedUser) throw new Error(`User ${id} not found`);
      return updatedUser;
    }
  },

  deleteUser: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await api.delete(`/users/${id}`);
    } catch {
      // continue for local state
    }
    localUsers = localUsers.filter((u) => u.id !== id);
    return { success: true, id };
  },
};
