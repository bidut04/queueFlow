import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  ChevronUp,
  KeyRound,
  Users,
  ShieldAlert
} from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { TableColumn } from '../types/table';
import { INITIAL_ROLES, type RoleItem } from '../data/mockRoles';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  const [roleForm, setRoleForm] = useState({
    roleCode: '',
    roleName: '',
    description: '',
    permissionsCount: 16,
    level: 'Standard' as RoleItem['level'],
    status: 'Active' as RoleItem['status']
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleAddRole = () => {
    if (showRoleForm && !editingRole) {
      setShowRoleForm(false);
    } else {
      setEditingRole(null);
      setRoleForm({
        roleCode: `ROLE_${Date.now().toString().slice(-4)}`,
        roleName: '',
        description: '',
        permissionsCount: 16,
        level: 'Standard',
        status: 'Active'
      });
      setShowRoleForm(true);
    }
  };

  const handleEditRole = (role: RoleItem) => {
    setEditingRole(role);
    setRoleForm({
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description,
      permissionsCount: role.permissionsCount,
      level: role.level,
      status: role.status
    });
    setShowRoleForm(true);
  };

  const handleDeleteRole = (id: string) => {
    const updated = roles.filter((r) => r.id !== id);
    setRoles(updated);
    showToast('Role deleted successfully!');
  };

  const handleSubmitRoleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.roleName.trim()) {
      showToast('Role Name is required!');
      return;
    }

    if (editingRole) {
      const updated = roles.map((r) =>
        r.id === editingRole.id
          ? {
              ...r,
              roleCode: roleForm.roleCode,
              roleName: roleForm.roleName,
              description: roleForm.description,
              permissionsCount: Number(roleForm.permissionsCount),
              level: roleForm.level,
              status: roleForm.status
            }
          : r
      );
      setRoles(updated);
      showToast(`Role "${roleForm.roleName}" updated successfully!`);
    } else {
      const newRole: RoleItem = {
        id: `role_${Date.now()}`,
        roleCode: roleForm.roleCode,
        roleName: roleForm.roleName,
        description: roleForm.description,
        permissionsCount: Number(roleForm.permissionsCount),
        assignedEmployees: 0,
        level: roleForm.level,
        status: roleForm.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRoles([newRole, ...roles]);
      showToast(`New role "${roleForm.roleName}" created!`);
    }

    setShowRoleForm(false);
    setEditingRole(null);
  };

  const roleColumns: TableColumn<RoleItem>[] = [
    {
      key: 'roleName',
      header: 'Role Name & Code',
      sortable: true,
      accessor: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="font-bold text-slate-900 text-[11.5px] flex items-center gap-1.5">
            <KeyRound size={12} className="text-blue-600" />
            <span>{row.roleName}</span>
          </div>
          <code className="text-[9.5px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
            {row.roleCode}
          </code>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description & Scope',
      accessor: (row) => (
        <span className="text-slate-600 text-[11px] max-w-[280px] truncate block">
          {row.description}
        </span>
      )
    },
    {
      key: 'permissionsCount',
      header: 'Permissions',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          {row.permissionsCount} Grants
        </span>
      )
    },
    {
      key: 'assignedEmployees',
      header: 'Assigned Staff',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span className="text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1">
          <Users size={12} className="text-slate-400" />
          {row.assignedEmployees} Users
        </span>
      )
    },
    {
      key: 'level',
      header: 'Security Level',
      sortable: true,
      align: 'center',
      accessor: (row) => {
        const isHigh = row.level === 'High';
        const isMed = row.level === 'Medium';
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
              isHigh
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : isMed
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {row.level}
          </span>
        );
      }
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
            onClick={() => handleEditRole(row)}
            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 cursor-pointer"
            title="Edit Role"
          >
            <Edit size={12} />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteRole(row.id)}
            className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 cursor-pointer"
            title="Delete Role"
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
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
              Role Designation Management
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Define operational roles, access levels, and security grants across QueueFlow
            </p>
          </div>
        </div>

        <Button
          variant={showRoleForm ? 'secondary' : 'primary'}
          icon={showRoleForm ? <ChevronUp size={14} /> : <Plus size={14} />}
          onClick={handleToggleAddRole}
        >
          {showRoleForm ? 'Hide Form' : 'Create Role'}
        </Button>
      </div>

      {/* Inline Add / Edit Role Card */}
      {showRoleForm && (
        <form
          onSubmit={handleSubmitRoleForm}
          className="bg-white p-4 rounded-xl border border-blue-200 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-blue-600" />
              {editingRole ? `Edit Role: ${editingRole.roleName}` : 'Create New System Role'}
            </h3>
            <button
              type="button"
              onClick={() => setShowRoleForm(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Branch Supervisor"
                value={roleForm.roleName}
                onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Role Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ROLE_SUPERVISOR"
                value={roleForm.roleCode}
                onChange={(e) => setRoleForm({ ...roleForm, roleCode: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Security Level
              </label>
              <select
                value={roleForm.level}
                onChange={(e) => setRoleForm({ ...roleForm, level: e.target.value as RoleItem['level'] })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Standard">Standard</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Description & Scope
              </label>
              <input
                type="text"
                placeholder="Brief description of role responsibilities..."
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={roleForm.status}
                onChange={(e) => setRoleForm({ ...roleForm, status: e.target.value as RoleItem['status'] })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setShowRoleForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<CheckCircle2 size={14} />}>
              {editingRole ? 'Update Role' : 'Save Role'}
            </Button>
          </div>
        </form>
      )}

      {/* Global Table View */}
      <GlobalTable
        data={roles}
        columns={roleColumns}
        keyExtractor={(item) => item.id}
        title="Configured System Roles"
        subtitle={`Total ${roles.length} role designations registered`}
        searchPlaceholder="Search role name or code..."
        defaultItemsPerPage={10}
      />
    </div>
  );
};
