import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldCheck,
  Check,
  Minus,
  Sparkles,
  Save,
  RotateCcw,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Users,
  ChevronDown,
  Search,
  Building,
  BadgeCheck
} from 'lucide-react';
import { authApi } from '../api/auth.api';
import { roleApi } from '../api/role.api';
import { useRoles } from '../api/hooks/roleHooks';
import { useEmployees } from '../api/hooks/employeeHooks';
import type { ModulePermissionRow } from '../lib/permissions';
import {
  DEFAULT_MODULE_PERMISSIONS,
  RECEPTIONIST_MODULE_PERMISSIONS,
  getStoredPermissions,
  savePermissions,
  isAuthorizedDecider,
  PERMISSIONS_UPDATED_EVENT,
} from '../lib/permissions';

export const PermissionsMatrixPage: React.FC = () => {
  const currentUser = authApi.getCurrentUser();
  const isAuthorized = isAuthorizedDecider();
  const { data: configuredRoles = [] } = useRoles();
  const { data: dbEmployees = [] } = useEmployees();

  const [activeRoleTab, setActiveRoleTab] = useState<'Default role' | 'Custom role'>('Custom role');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('custom');

  // Combobox & Employee Selection State
  const [isEmployeeComboboxOpen, setIsEmployeeComboboxOpen] = useState<boolean>(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('emp-current');
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Close combobox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsEmployeeComboboxOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Aggregated Employees List (DB Employees + Current User + Real Organization Staff)
  const allEmployees = useMemo(() => {
    const list: Array<{
      id: string;
      employeeId: string;
      name: string;
      role: string;
      department: string;
      status: string;
      avatarUrl?: string;
    }> = [];

    // Current logged in user / admin
    const currentName =
      currentUser?.name ||
      (currentUser?.email ? currentUser.email.split('@')[0].replace(/[._-]/g, ' ') : 'Barun Bhowmick');
    const currentRole = currentUser?.role || 'Tenant Admin';
    list.push({
      id: 'emp-current',
      employeeId: 'EMP-001',
      name: currentName,
      role: currentRole,
      department: 'Executive Administration',
      status: 'Active',
      avatarUrl: currentUser?.avatar || undefined,
    });

    // Add employees from database if available
    if (dbEmployees && dbEmployees.length > 0) {
      dbEmployees.forEach((emp) => {
        if (!list.some((e) => e.name.toLowerCase() === emp.name.toLowerCase())) {
          list.push({
            id: emp.id || emp.employeeId,
            employeeId: emp.employeeId || `EMP-${emp.id.slice(0, 4)}`,
            name: emp.name,
            role: emp.role || 'Staff',
            department: emp.department || 'Operations',
            status: emp.status || 'Active',
            avatarUrl: emp.avatarUrl,
          });
        }
      });
    }

    // Default sample staff for immediate rich selection
    const sampleStaff = [
      {
        id: 'emp-pooja',
        employeeId: 'EMP-REC-01',
        name: 'Pooja Verma',
        role: 'Receptionist',
        department: 'Front Desk & Reception',
        status: 'Active',
      },
      {
        id: 'emp-andy',
        employeeId: 'EMP-1002',
        name: 'Andy Worchen',
        role: 'Branch Manager',
        department: 'Regional Operations',
        status: 'Active',
      },
      {
        id: 'emp-sarah',
        employeeId: 'EMP-1003',
        name: 'Sarah Jenkins',
        role: 'Counter Operator',
        department: 'Customer Front Desk',
        status: 'Active',
      },
      {
        id: 'emp-rajesh',
        employeeId: 'EMP-1004',
        name: 'Rajesh Kumar',
        role: 'Queue Supervisor',
        department: 'Queue Operations',
        status: 'Active',
      },
      {
        id: 'emp-priya',
        employeeId: 'EMP-1005',
        name: 'Priya Sharma',
        role: 'Officer',
        department: 'Verification & Compliance',
        status: 'Active',
      },
    ];

    sampleStaff.forEach((staff) => {
      if (!list.some((e) => e.name.toLowerCase() === staff.name.toLowerCase())) {
        list.push(staff);
      }
    });

    return list;
  }, [currentUser, dbEmployees]);

  const selectedEmployee = useMemo(() => {
    return allEmployees.find((e) => e.id === selectedEmployeeId) || allEmployees[0];
  }, [allEmployees, selectedEmployeeId]);

  const filteredEmployees = useMemo(() => {
    if (!employeeSearchQuery.trim()) return allEmployees;
    const q = employeeSearchQuery.toLowerCase();
    return allEmployees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }, [allEmployees, employeeSearchQuery]);

  const getRoleBadgeColor = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('admin') || r.includes('owner')) {
      return 'bg-purple-50 text-purple-700 border-purple-200/80';
    }
    if (r.includes('manager') || r.includes('director')) {
      return 'bg-blue-50 text-blue-700 border-blue-200/80';
    }
    if (r.includes('operator') || r.includes('counter')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    }
    if (r.includes('supervisor') || r.includes('lead')) {
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    }
    if (r.includes('receptionist') || r.includes('front desk')) {
      return 'bg-teal-50 text-teal-700 border-teal-200/80';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200/80';
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const [modules, setModules] = useState<ModulePermissionRow[]>(() => getStoredPermissions());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load matrix from backend on mount or when selectedRoleId changes
  useEffect(() => {
    let isMounted = true;
    if (selectedRoleId === 'default') {
      setModules(DEFAULT_MODULE_PERMISSIONS);
      return;
    }

    roleApi.getPermissionsMatrix(selectedRoleId).then((backendModules) => {
      if (isMounted && backendModules && backendModules.length > 0) {
        setModules(backendModules);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedRoleId]);

  // Load permissions when switching role target
  const handleRoleSelection = async (roleId: string) => {
    setSelectedRoleId(roleId);
    if (roleId === 'default') {
      setActiveRoleTab('Default role');
      setModules(DEFAULT_MODULE_PERMISSIONS);
      return;
    }

    setActiveRoleTab('Custom role');
    try {
      const backendModules = await roleApi.getPermissionsMatrix(roleId);
      if (backendModules && backendModules.length > 0) {
        setModules(backendModules);
        return;
      }
    } catch {
      // ignore
    }
    setModules(getStoredPermissions());
  };

  const handleSelectEmployee = (emp: typeof allEmployees[0]) => {
    setSelectedEmployeeId(emp.id);
    setIsEmployeeComboboxOpen(false);

    if (emp.role.toLowerCase() === 'receptionist') {
      const matchedRole = configuredRoles.find(
        (r) => r.roleName.toLowerCase() === 'receptionist' || r.roleCode.toLowerCase() === 'receptionist'
      );
      if (matchedRole) {
        setSelectedRoleId(matchedRole.id);
      } else {
        setSelectedRoleId('role-receptionist');
      }
      setActiveRoleTab('Custom role');
      setModules(RECEPTIONIST_MODULE_PERMISSIONS);
      showToast(`Loaded Receptionist role permissions for ${emp.name}`);
      return;
    }

    const matchedRole = configuredRoles.find(
      (r) =>
        r.roleName.toLowerCase() === emp.role.toLowerCase() ||
        r.roleCode.toLowerCase() === emp.role.toLowerCase()
    );
    if (matchedRole) {
      handleRoleSelection(matchedRole.id);
    } else {
      handleRoleSelection('custom');
    }
    showToast(`Loaded permission matrix for ${emp.name} (${emp.role})`);
  };

  // Sync state if external changes happen
  useEffect(() => {
    const handleSync = () => {
      setModules(getStoredPermissions());
    };
    window.addEventListener(PERMISSIONS_UPDATED_EVENT, handleSync);
    return () => window.removeEventListener(PERMISSIONS_UPDATED_EVENT, handleSync);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Toggle single action for a row
  const togglePermission = (rowId: string, action: 'create' | 'read' | 'update' | 'delete') => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === rowId) {
          return { ...m, [action]: !m[action] };
        }
        return m;
      })
    );
  };

  // Toggle all permissions for an entire row
  const toggleEntireRow = (rowId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === rowId) {
          const allSelected = m.create && m.read && m.update && m.delete;
          return {
            ...m,
            create: !allSelected,
            read: !allSelected,
            update: !allSelected,
            delete: !allSelected,
          };
        }
        return m;
      })
    );
  };

  // Toggle column-wide across all modules
  const toggleEntireColumn = (action: 'create' | 'read' | 'update' | 'delete') => {
    const allSelected = modules.every((m) => m[action]);
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        [action]: !allSelected,
      }))
    );
  };

  // Toggle export task permission for a row
  const toggleExportPerm = (rowId: string, task: 'copy' | 'excel' | 'print' | 'pdf') => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === rowId) {
          return { ...m, [task]: !m[task] };
        }
        return m;
      })
    );
  };

  const handleSaveMatrix = async () => {
    setIsSaving(true);
    try {
      // 1. Persist directly in MySQL backend TenantSetting via REST API
      await roleApi.savePermissionsMatrix(modules, selectedRoleId);

      // 2. Persist locally for immediate reactive responsiveness
      try {
        localStorage.setItem(`qf_perm_role_${selectedRoleId}`, JSON.stringify(modules));
      } catch {
        // ignore
      }
      savePermissions(modules);
      showToast('Permissions saved successfully to backend database! Revoked modules are immediately hidden from navigation and URL access.');
    } catch (err) {
      console.error('Failed to save to backend:', err);
      savePermissions(modules);
      showToast('Permissions saved locally! Revoked modules are immediately hidden from navigation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setIsSaving(true);
    try {
      await roleApi.savePermissionsMatrix(DEFAULT_MODULE_PERMISSIONS, selectedRoleId);
      setModules(DEFAULT_MODULE_PERMISSIONS);
      savePermissions(DEFAULT_MODULE_PERMISSIONS);
      showToast('Reset to system default permissions in backend and locally. All navigation items restored.');
    } catch {
      setModules(DEFAULT_MODULE_PERMISSIONS);
      savePermissions(DEFAULT_MODULE_PERMISSIONS);
      showToast('Reset to system default permissions locally. All navigation items restored.');
    } finally {
      setIsSaving(false);
    }
  };

  // Compute column header states (checked, partial, unchecked)
  const getColHeaderState = (action: 'create' | 'read' | 'update' | 'delete') => {
    const checkedCount = modules.filter((m) => m[action]).length;
    if (checkedCount === modules.length) return 'all';
    if (checkedCount > 0) return 'partial';
    return 'none';
  };

  // Guard: if non-authorized, display informational notice
  if (!isAuthorized) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto mt-12 shadow-xs">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-2xs">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-base font-bold text-slate-900">Administrator Privileges Required</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The Permissions & Access Control matrix is restricted. Only verified Tenant Administrators or Super Admins who have the authority to grant and revoke access powers can view this page.
        </p>
      </div>
    );
  }

  const revokedCount = modules.filter((m) => !m.read).length;

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-[12px] font-bold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border-l-4 border-emerald-500 animate-in fade-in">
          <Sparkles size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Authorized Person / Decider Power Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-indigo-900/60 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13.5px] font-extrabold tracking-tight text-white">
                Authorized Permission Decider: {currentUser?.email || 'Tenant Administrator'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Grant / Revoke Authority
              </span>
              {revokedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                  <EyeOff size={11} /> {revokedCount} Module{revokedCount > 1 ? 's' : ''} Revoked from Nav
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
              You hold the administrative authority to configure operational privileges. When you revoke <strong>Read</strong> for any module and save, that module will be <strong>hidden from the sidebar navigation bar</strong> and users will be <strong>blocked from accessing the page</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg border-0 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSaveMatrix}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11.5px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg border-0 transition-all shadow-md cursor-pointer"
          >
            <Save size={13} /> {isSaving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>

      {/* Main Form Card matching image layout */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        {/* Section: Employee & Role Access */}
        <div className="pb-2 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-[14px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Users size={16} className="text-indigo-600" />
                Employee & Role Designation
              </h2>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Select an employee from the combobox to configure their dynamic system permissions matrix and action capabilities.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
              <UserCheck size={12} />
              {allEmployees.length} Staff Available
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Employee Combobox (7 Cols) */}
            <div className="lg:col-span-7 relative" ref={comboboxRef}>
              <label className="block text-[11.5px] font-semibold text-slate-700 mb-1.5">
                Select Employee <span className="text-red-500">*</span>
              </label>

              {/* Combobox Trigger Button */}
              <button
                type="button"
                onClick={() => setIsEmployeeComboboxOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {selectedEmployee.avatarUrl ? (
                    <img
                      src={selectedEmployee.avatarUrl}
                      alt={selectedEmployee.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-[11.5px] shadow-2xs shrink-0">
                      {getInitials(selectedEmployee.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-slate-900 truncate">
                        {selectedEmployee.name}
                      </span>
                      <span className="text-[10.5px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {selectedEmployee.employeeId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className={`inline-flex items-center px-2 py-0.2 rounded-full font-semibold border text-[10.5px] ${getRoleBadgeColor(selectedEmployee.role)}`}>
                        {selectedEmployee.role}
                      </span>
                      <span>•</span>
                      <span className="truncate">{selectedEmployee.department}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform shrink-0 ml-2 ${
                    isEmployeeComboboxOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Combobox Floating Options Dropdown */}
              {isEmployeeComboboxOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Search bar inside combobox */}
                  <div className="p-2 border-b border-slate-100 bg-slate-50/80">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={employeeSearchQuery}
                        onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                        placeholder="Search by name, role, department or ID..."
                        className="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100/80">
                    {filteredEmployees.length === 0 ? (
                      <div className="py-6 text-center text-[12px] text-slate-400">
                        No employees found matching "{employeeSearchQuery}"
                      </div>
                    ) : (
                      filteredEmployees.map((emp) => {
                        const isSelected = emp.id === selectedEmployee.id;
                        return (
                          <div
                            key={emp.id}
                            onClick={() => handleSelectEmployee(emp)}
                            className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {emp.avatarUrl ? (
                                <img
                                  src={emp.avatarUrl}
                                  alt={emp.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 border border-slate-200">
                                  {getInitials(emp.name)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[12.5px] truncate ${isSelected ? 'font-bold text-indigo-900' : 'font-medium text-slate-800'}`}>
                                    {emp.name}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {emp.employeeId}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 mt-0.5">
                                  <span className={`px-1.5 py-0.2 rounded font-semibold border ${getRoleBadgeColor(emp.role)}`}>
                                    {emp.role}
                                  </span>
                                  <span>•</span>
                                  <span className="truncate">{emp.department}</span>
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <Check size={16} className="text-indigo-600 shrink-0 ml-2" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Employee Role & Department Info (5 Cols) */}
            <div className="lg:col-span-5">
              <label className="block text-[11.5px] font-semibold text-slate-700 mb-1.5">
                Assigned Role & Department
              </label>
              <div className="px-3.5 py-2.5 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-[58px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck size={15} className="text-indigo-600 shrink-0" />
                    <span className="text-[12px] font-bold text-slate-800 truncate">
                      {selectedEmployee.role}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <BadgeCheck size={11} /> {selectedEmployee.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 mt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1 truncate">
                    <Building size={12} className="text-slate-400 shrink-0" />
                    {selectedEmployee.department}
                  </span>
                  <span className="font-mono text-slate-400 text-[10.5px] shrink-0">
                    {selectedEmployee.employeeId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Role & access */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[14px] font-bold text-slate-900 tracking-tight">
              Role & access
            </h2>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border-0 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} /> Reset
              </button>
              <button
                type="button"
                onClick={handleSaveMatrix}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11.5px] font-bold text-white bg-slate-900 hover:bg-black disabled:opacity-50 rounded-lg border-0 transition-all shadow-xs cursor-pointer"
              >
                <Save size={13} /> {isSaving ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>

          {/* Role Pill Switcher & Dynamic Role Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg gap-1 border border-slate-200/60">
              <button
                type="button"
                onClick={() => handleRoleSelection('default')}
                className={`px-3.5 py-1.5 rounded-md text-[11.5px] font-semibold transition-all border-0 cursor-pointer ${
                  activeRoleTab === 'Default role'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'bg-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Default role
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelection('custom')}
                className={`px-3.5 py-1.5 rounded-md text-[11.5px] font-semibold transition-all border-0 cursor-pointer ${
                  activeRoleTab === 'Custom role' && selectedRoleId === 'custom'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'bg-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Custom role
              </button>
            </div>

            {/* Configured System Roles Selector */}
            {configuredRoles.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <UserCheck size={13} className="text-indigo-600" />
                  Target Role:
                </span>
                <select
                  value={selectedRoleId}
                  onChange={(e) => handleRoleSelection(e.target.value)}
                  className="px-2.5 py-1.5 text-[11.5px] font-bold text-slate-800 bg-white border border-slate-200 rounded-lg shadow-2xs outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="custom">Custom Tenant Role</option>
                  <option value="default">Default System Policy</option>
                  {configuredRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName} ({role.roleCode})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Exact Matrix Table as requested in image */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[12px]">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700">
                    {/* Module Column */}
                    <th className="py-3 px-4 font-bold w-72">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">
                          <Minus size={11} strokeWidth={3} />
                        </span>
                        <span className="text-[12px] font-bold text-slate-800">Module</span>
                      </div>
                    </th>

                    {/* Create Column */}
                    <th className="py-3 px-4 font-bold text-center w-28">
                      <button
                        type="button"
                        onClick={() => toggleEntireColumn('create')}
                        className="inline-flex items-center gap-1.5 text-slate-800 hover:text-blue-600 border-0 bg-transparent cursor-pointer font-bold"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                            getColHeaderState('create') === 'all'
                              ? 'bg-slate-900 text-white'
                              : getColHeaderState('create') === 'partial'
                              ? 'bg-slate-900 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {getColHeaderState('create') === 'all' ? (
                            <Check size={11} strokeWidth={3} />
                          ) : getColHeaderState('create') === 'partial' ? (
                            <Minus size={11} strokeWidth={3} />
                          ) : null}
                        </span>
                        <span>Create</span>
                      </button>
                    </th>

                    {/* Read Column */}
                    <th className="py-3 px-4 font-bold text-center w-36">
                      <button
                        type="button"
                        onClick={() => toggleEntireColumn('read')}
                        className="inline-flex items-center gap-1.5 text-slate-800 hover:text-blue-600 border-0 bg-transparent cursor-pointer font-bold"
                        title="Toggling Read controls whether this module appears in the sidebar navigation"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                            getColHeaderState('read') === 'all'
                              ? 'bg-slate-900 text-white'
                              : getColHeaderState('read') === 'partial'
                              ? 'bg-slate-900 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {getColHeaderState('read') === 'all' ? (
                            <Check size={11} strokeWidth={3} />
                          ) : getColHeaderState('read') === 'partial' ? (
                            <Minus size={11} strokeWidth={3} />
                          ) : null}
                        </span>
                        <span>Read (Nav Bar)</span>
                      </button>
                    </th>

                    {/* Update Column */}
                    <th className="py-3 px-4 font-bold text-center w-28">
                      <button
                        type="button"
                        onClick={() => toggleEntireColumn('update')}
                        className="inline-flex items-center gap-1.5 text-slate-800 hover:text-blue-600 border-0 bg-transparent cursor-pointer font-bold"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                            getColHeaderState('update') === 'all'
                              ? 'bg-slate-900 text-white'
                              : getColHeaderState('update') === 'partial'
                              ? 'bg-slate-900 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {getColHeaderState('update') === 'all' ? (
                            <Check size={11} strokeWidth={3} />
                          ) : getColHeaderState('update') === 'partial' ? (
                            <Minus size={11} strokeWidth={3} />
                          ) : null}
                        </span>
                        <span>Update</span>
                      </button>
                    </th>

                    {/* Delete Column */}
                    <th className="py-3 px-4 font-bold text-center w-28">
                      <button
                        type="button"
                        onClick={() => toggleEntireColumn('delete')}
                        className="inline-flex items-center gap-1.5 text-slate-800 hover:text-blue-600 border-0 bg-transparent cursor-pointer font-bold"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                            getColHeaderState('delete') === 'all'
                              ? 'bg-slate-900 text-white'
                              : getColHeaderState('delete') === 'partial'
                              ? 'bg-slate-900 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {getColHeaderState('delete') === 'all' ? (
                            <Check size={11} strokeWidth={3} />
                          ) : getColHeaderState('delete') === 'partial' ? (
                            <Minus size={11} strokeWidth={3} />
                          ) : null}
                        </span>
                        <span>Delete</span>
                      </button>
                    </th>

                    {/* Dedicated Particular Task Grants: Print, PDF, Excel, Copy */}
                    <th className="py-3 px-4 font-bold text-center">
                      <span className="text-[11.5px] font-bold text-indigo-700">
                        Export & Task Privileges (Print / PDF / Excel / Copy)
                      </span>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {modules.map((m) => {
                    const rowSelected = m.create || m.read || m.update || m.delete;

                    return (
                      <tr
                        key={m.id}
                        className={`transition-colors ${
                          !m.read ? 'bg-rose-50/20' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Module Name + Row Toggle */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleEntireRow(m.id)}
                            className="flex items-center gap-2.5 text-left border-0 bg-transparent cursor-pointer group"
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-colors ${
                                rowSelected
                                  ? 'bg-slate-900 text-white'
                                  : 'border border-slate-300 bg-white group-hover:border-slate-400'
                              }`}
                            >
                              {rowSelected ? <Check size={11} strokeWidth={3} /> : null}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-[12.5px] text-slate-800 group-hover:text-blue-600 transition-colors m-0">
                                  {m.module}
                                </p>
                                {m.read ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <Eye size={10} /> Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                                    <EyeOff size={10} /> Nav Revoked
                                  </span>
                                )}
                              </div>
                              <p className="text-[10.5px] text-slate-400 m-0">
                                {m.description}
                              </p>
                            </div>
                          </button>
                        </td>

                        {/* Create Checkbox */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(m.id, 'create')}
                            aria-label={`Toggle create for ${m.module}`}
                            className="inline-flex items-center justify-center border-0 bg-transparent cursor-pointer p-1"
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-colors ${
                                m.create
                                  ? 'bg-slate-900 text-white shadow-2xs'
                                  : 'border border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              {m.create ? <Check size={11} strokeWidth={3} /> : null}
                            </span>
                          </button>
                        </td>

                        {/* Read Checkbox (Controls page access and sidebar navigation visibility) */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(m.id, 'read')}
                            aria-label={`Toggle read for ${m.module}`}
                            title={m.read ? 'Click to revoke navigation and page access' : 'Click to grant navigation and page access'}
                            className="inline-flex items-center justify-center border-0 bg-transparent cursor-pointer p-1"
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-colors ${
                                m.read
                                  ? 'bg-slate-900 text-white shadow-2xs'
                                  : 'border-2 border-rose-400 bg-rose-50/50 hover:border-rose-500'
                              }`}
                            >
                              {m.read ? <Check size={11} strokeWidth={3} /> : null}
                            </span>
                          </button>
                        </td>

                        {/* Update Checkbox */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(m.id, 'update')}
                            aria-label={`Toggle update for ${m.module}`}
                            className="inline-flex items-center justify-center border-0 bg-transparent cursor-pointer p-1"
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-colors ${
                                m.update
                                  ? 'bg-slate-900 text-white shadow-2xs'
                                  : 'border border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              {m.update ? <Check size={11} strokeWidth={3} /> : null}
                            </span>
                          </button>
                        </td>

                        {/* Delete Checkbox */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(m.id, 'delete')}
                            aria-label={`Toggle delete for ${m.module}`}
                            className="inline-flex items-center justify-center border-0 bg-transparent cursor-pointer p-1"
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-colors ${
                                m.delete
                                  ? 'bg-slate-900 text-white shadow-2xs'
                                  : 'border border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              {m.delete ? <Check size={11} strokeWidth={3} /> : null}
                            </span>
                          </button>
                        </td>

                        {/* Export Privileges for this Module */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Copy Task Pill */}
                            <button
                              type="button"
                              onClick={() => toggleExportPerm(m.id, 'copy')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                m.copy
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60'
                              }`}
                            >
                              Copy
                            </button>

                            {/* Excel Task Pill */}
                            <button
                              type="button"
                              onClick={() => toggleExportPerm(m.id, 'excel')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                m.excel
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60'
                              }`}
                            >
                              Excel
                            </button>

                            {/* Print Task Pill */}
                            <button
                              type="button"
                              onClick={() => toggleExportPerm(m.id, 'print')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                m.print
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60'
                              }`}
                            >
                              Print
                            </button>

                            {/* PDF Task Pill */}
                            <button
                              type="button"
                              onClick={() => toggleExportPerm(m.id, 'pdf')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                m.pdf
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60'
                              }`}
                            >
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
