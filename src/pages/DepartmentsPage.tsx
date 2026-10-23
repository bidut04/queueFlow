import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  ChevronUp,
  Users,
  GitBranch
} from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { TableColumn } from '../types/table';
import type { DepartmentItem } from '../data/mockDepartments';
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from '../api';

export const DepartmentsPage: React.FC = () => {
  const { data: departments = [] } = useDepartments();
  const createDeptMutation = useCreateDepartment();
  const updateDeptMutation = useUpdateDepartment();
  const deleteDeptMutation = useDeleteDepartment();

  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  const [deptForm, setDeptForm] = useState({
    deptCode: '',
    deptName: '',
    headOfDept: '',
    branch: 'Main Branch',
    totalStaff: 1,
    activeCounters: 1,
    status: 'Active' as DepartmentItem['status']
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleAddDept = () => {
    if (showDeptForm && !editingDept) {
      setShowDeptForm(false);
    } else {
      setEditingDept(null);
      setDeptForm({
        deptCode: `DEP-${Math.floor(100 + Math.random() * 900)}`,
        deptName: '',
        headOfDept: '',
        branch: 'Main Branch',
        totalStaff: 5,
        activeCounters: 2,
        status: 'Active'
      });
      setShowDeptForm(true);
    }
  };

  const handleEditDept = (dept: DepartmentItem) => {
    setEditingDept(dept);
    setDeptForm({
      deptCode: dept.deptCode,
      deptName: dept.deptName,
      headOfDept: dept.headOfDept,
      branch: dept.branch,
      totalStaff: dept.totalStaff,
      activeCounters: dept.activeCounters,
      status: dept.status
    });
    setShowDeptForm(true);
  };

  const handleDeleteDept = async (id: string) => {
    try {
      await deleteDeptMutation.mutateAsync(id);
      showToast('Department removed successfully!');
    } catch {
      showToast('Failed to remove department.');
    }
  };

  const handleSubmitDeptForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.deptName.trim()) {
      showToast('Department Name is required!');
      return;
    }

    if (editingDept) {
      try {
        await updateDeptMutation.mutateAsync({
          id: editingDept.id,
          deptCode: deptForm.deptCode,
          deptName: deptForm.deptName,
          headOfDept: deptForm.headOfDept,
          branch: deptForm.branch,
          totalStaff: Number(deptForm.totalStaff),
          activeCounters: Number(deptForm.activeCounters),
          status: deptForm.status,
        });
        showToast(`Department "${deptForm.deptName}" updated successfully!`);
      } catch {
        showToast(`Failed to update department.`);
      }
    } else {
      try {
        await createDeptMutation.mutateAsync({
          deptCode: deptForm.deptCode,
          deptName: deptForm.deptName,
          headOfDept: deptForm.headOfDept || 'Unassigned',
          branch: deptForm.branch,
          totalStaff: Number(deptForm.totalStaff),
          activeCounters: Number(deptForm.activeCounters),
          status: deptForm.status,
        });
        showToast(`New department "${deptForm.deptName}" created!`);
      } catch {
        showToast(`Failed to create department.`);
      }
    }

    setShowDeptForm(false);
    setEditingDept(null);
  };

  const deptColumns: TableColumn<DepartmentItem>[] = [
    {
      key: 'deptName',
      header: 'Department Name & Code',
      sortable: true,
      accessor: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="font-bold text-slate-900 text-[11.5px] flex items-center gap-1.5">
            <Building2 size={13} className="text-blue-600" />
            <span>{row.deptName}</span>
          </div>
          <code className="text-[9.5px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
            {row.deptCode}
          </code>
        </div>
      )
    },
    {
      key: 'headOfDept',
      header: 'Head of Department',
      sortable: true,
      accessor: (row) => (
        <span className="text-[11px] font-semibold text-slate-800">
          {row.headOfDept}
        </span>
      )
    },
    {
      key: 'branch',
      header: 'Branch Assignment',
      sortable: true,
      accessor: (row) => (
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
          <GitBranch size={11} className="text-slate-400" />
          <span>{row.branch}</span>
        </div>
      )
    },
    {
      key: 'totalStaff',
      header: 'Staff Count',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1">
          <Users size={12} className="text-blue-600" />
          {row.totalStaff} Members
        </span>
      )
    },
    {
      key: 'activeCounters',
      header: 'Operating Counters',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.activeCounters} Counters
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      align: 'center',
      accessor: (row) => <Badge label={row.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      accessor: (row) => (
        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleEditDept(row)}
            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 cursor-pointer"
            title="Edit Department"
          >
            <Edit size={12} />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteDept(row.id)}
            className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 cursor-pointer"
            title="Delete Department"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-[12px] font-bold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border-l-4 border-blue-500 animate-in fade-in">
          <Sparkles size={16} className="text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
              Department Structure Management
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Organize branch operational divisions, department heads, and staff allocations
            </p>
          </div>
        </div>

        <Button
          variant={showDeptForm ? 'secondary' : 'primary'}
          icon={showDeptForm ? <ChevronUp size={14} /> : <Plus size={14} />}
          onClick={handleToggleAddDept}
        >
          {showDeptForm ? 'Hide Form' : 'Create Department'}
        </Button>
      </div>

      {/* Inline Add / Edit Department Form Card */}
      {showDeptForm && (
        <form
          onSubmit={handleSubmitDeptForm}
          className="bg-white p-4 rounded-xl border border-blue-200 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-600" />
              {editingDept ? `Edit Department: ${editingDept.deptName}` : 'Create New Department'}
            </h3>
            <button
              type="button"
              onClick={() => setShowDeptForm(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Accounts & Finance"
                value={deptForm.deptName}
                onChange={(e) => setDeptForm({ ...deptForm, deptName: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Department Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="DEP-107"
                value={deptForm.deptCode}
                onChange={(e) => setDeptForm({ ...deptForm, deptCode: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Head of Department
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Nasrin Sultana"
                value={deptForm.headOfDept}
                onChange={(e) => setDeptForm({ ...deptForm, headOfDept: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Operating Branch
              </label>
              <select
                value={deptForm.branch}
                onChange={(e) => setDeptForm({ ...deptForm, branch: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Main Branch">Main Branch</option>
                <option value="Gulshan Branch">Gulshan Branch</option>
                <option value="Dhanmondi Branch">Dhanmondi Branch</option>
                <option value="Uttara Branch">Uttara Branch</option>
                <option value="Mirpur Branch">Mirpur Branch</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Staff Allocation
              </label>
              <input
                type="number"
                min={1}
                value={deptForm.totalStaff}
                onChange={(e) => setDeptForm({ ...deptForm, totalStaff: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={deptForm.status}
                onChange={(e) => setDeptForm({ ...deptForm, status: e.target.value as DepartmentItem['status'] })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setShowDeptForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<CheckCircle2 size={14} />}>
              {editingDept ? 'Update Department' : 'Save Department'}
            </Button>
          </div>
        </form>
      )}

      {/* Global Table View */}
      <GlobalTable
        data={departments}
        columns={deptColumns}
        keyExtractor={(item) => item.id}
        title="Active Organizational Departments"
        subtitle={`Total ${departments.length} departments registered across branches`}
        searchPlaceholder="Search department name or code..."
        defaultItemsPerPage={10}
      />
    </div>
  );
};
