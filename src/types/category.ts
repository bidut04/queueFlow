export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  color?: string;
  totalServices?: number;
  createdAt?: string;
}

export interface CreateCategoryInput {
  code?: string;
  name: string;
  description?: string;
  status?: 'Active' | 'Inactive';
  color?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

