import React, { useState, useMemo } from 'react';
import {
  Layers3,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  ChevronUp,
  Briefcase,
  Search
} from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { TableColumn } from '../types/table';
import type { Category } from '../types/category';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../api';

const PRESET_COLORS = [
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Cyan', value: '#06b6d4' },
];

export const CategoriesPage: React.FC = () => {
  const { data: categories = [], isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const [categoryForm, setCategoryForm] = useState({
    code: '',
    name: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
    color: '#3b82f6',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleAdd = () => {
    if (showCategoryForm && !editingCategory) {
      setShowCategoryForm(false);
    } else {
      setEditingCategory(null);
      setCategoryForm({
        code: `CAT-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        description: '',
        status: 'Active',
        color: '#3b82f6',
      });
      setShowCategoryForm(true);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      code: category.code,
      name: category.name,
      description: category.description || '',
      status: category.status,
      color: category.color || '#3b82f6',
    });
    setShowCategoryForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove category "${name}"?`)) {
      try {
        await deleteCategoryMutation.mutateAsync(id);
        showToast(`Category "${name}" removed successfully!`);
      } catch {
        showToast('Failed to remove category.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Category Name is required!');
      return;
    }

    if (editingCategory) {
      try {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          ...categoryForm,
        });
        showToast(`Category "${categoryForm.name}" updated successfully!`);
      } catch {
        showToast('Failed to update category.');
      }
    } else {
      try {
        await createCategoryMutation.mutateAsync(categoryForm);
        showToast(`New Category "${categoryForm.name}" created successfully!`);
      } catch {
        showToast('Failed to create category.');
      }
    }

    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'All' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const activeCount = useMemo(() => categories.filter((c) => c.status === 'Active').length, [categories]);
  const totalServices = useMemo(() => categories.reduce((acc, c) => acc + (c.totalServices || 0), 0), [categories]);

  const categoryColumns: TableColumn<Category>[] = [
    {
      key: 'name',
      header: 'Category Name',
      sortable: true,
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: row.color || '#3b82f6',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{row.name}</span>
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Category Code',
      sortable: true,
      accessor: (row) => (
        <span
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#f1f5f9',
            padding: '3px 8px',
            borderRadius: 4,
            color: '#475569',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {row.code}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      sortable: true,
      accessor: (row) => (
        <span style={{ color: '#64748b', fontSize: 12 }}>
          {row.description || '—'}
        </span>
      ),
    },
    {
      key: 'totalServices',
      header: 'Linked Services',
      sortable: true,
      accessor: (row) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: 600,
            color: '#2563eb',
            backgroundColor: '#eff6ff',
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: 12,
          }}
        >
          <Briefcase size={12} /> {row.totalServices ?? 0}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (row) => (
        <Badge label={row.status} />
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      sortable: false,
      accessor: (row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 transition"
            title="Edit Category"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition"
            title="Delete Category"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-50 text-violet-600 rounded-lg border border-violet-100">
            <Layers3 size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Service Categories & Taxonomies</h1>
            <p className="text-xs text-slate-500">
              Classify and organize consultation queues, appointments, and counter service types.
            </p>
          </div>
        </div>

        <Button
          onClick={handleToggleAdd}
          variant="primary"
          className="gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-xs"
        >
          {showCategoryForm && !editingCategory ? (
            <>
              <ChevronUp size={16} /> Hide Form
            </>
          ) : (
            <>
              <Plus size={16} /> Add Category
            </>
          )}
        </Button>
      </div>

      {/* Quick KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Categories</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{categories.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Categories</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inactive Categories</div>
          <div className="text-2xl font-black text-slate-400 mt-1">{categories.length - activeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Linked Services</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{totalServices}</div>
        </div>
      </div>

      {/* Add / Edit Category Inline Form */}
      {showCategoryForm && (
        <div className="bg-white p-6 rounded-xl border border-violet-200 shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-violet-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
              </h3>
            </div>
            <button
              onClick={() => {
                setShowCategoryForm(false);
                setEditingCategory(null);
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Consultation, Dental, VIP"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Code</label>
                <input
                  type="text"
                  placeholder="e.g. CAT-101"
                  value={categoryForm.code}
                  onChange={(e) => setCategoryForm({ ...categoryForm, code: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Theme Color</label>
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: categoryForm.color }}
                    className="w-7 h-7 rounded-lg border border-slate-300 shrink-0"
                  />
                  <div className="flex items-center gap-1 flex-wrap">
                    {PRESET_COLORS.map((col) => (
                      <button
                        key={col.value}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, color: col.value })}
                        style={{ backgroundColor: col.value }}
                        title={col.label}
                        className={`w-5 h-5 rounded-full border transition ${
                          categoryForm.color === col.value ? 'scale-125 ring-2 ring-violet-400' : 'opacity-80 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={categoryForm.status}
                  onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value as 'Active' | 'Inactive' })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Optional description of this service category..."
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCategoryForm(false);
                  setEditingCategory(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {editingCategory ? 'Update Category' : 'Save Category'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          {(['All', 'Active', 'Inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === st
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <GlobalTable<Category>
          data={filteredCategories}
          columns={categoryColumns}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          defaultItemsPerPage={10}
        />
      </div>
    </div>
  );
};
