import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  ChevronUp,
  BadgeCheck,
  Mail,
  Phone,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { TableColumn } from '../types/table';
import type { Employee } from '../types/employee';
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from '../api/hooks/employeeHooks';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
];

export const EmployeesPage: React.FC = () => {
  const { data: employees = [], isLoading } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  // Inline Form Toggle Visibility States
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  // Employee Form Edit & Fields State
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    role: 'Staff' as Employee['role'],
    department: 'General Operations',
    branch: 'Main Branch',
    status: 'Active' as Employee['status']
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Employee Inline Form Handlers
  const handleToggleAddEmployee = () => {
    if (showEmployeeForm && !editingEmployee) {
      setShowEmployeeForm(false);
      return;
    }
    setEditingEmployee(null);
    const nextIdNum = 1001 + employees.length;
    const randomAvatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
    setEmployeeForm({
      employeeId: `EMP-${nextIdNum}`,
      name: '',
      email: '',
      phone: '',
      avatarUrl: randomAvatar,
      role: 'Staff',
      department: 'General Operations',
      branch: 'Main Branch',
      status: 'Active'
    });
    setShowEmployeeForm(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmployeeForm({
      employeeId: emp.employeeId,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      avatarUrl: emp.avatarUrl || DEFAULT_AVATARS[0],
      role: emp.role,
      department: emp.department,
      branch: emp.branch,
      status: emp.status
    });
    setShowEmployeeForm(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.name.trim() || !employeeForm.email.trim()) return;

    if (editingEmployee) {
      updateEmployeeMutation.mutate({
        id: editingEmployee.id,
        ...employeeForm
      });
      showToast(`Employee "${employeeForm.name}" updated successfully!`);
    } else {
      createEmployeeMutation.mutate(employeeForm);
      showToast(`New Employee ID "${employeeForm.employeeId}" created successfully!`);
    }
    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove employee ${name}?`)) {
      deleteEmployeeMutation.mutate(id);
      showToast(`Employee "${name}" deleted.`);
    }
  };

  // Employee Table Columns with Avatar Image Rendering
  const columns: TableColumn<Employee>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      accessor: (row) => (
        <span style={{ fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: 6 }}>
          {row.employeeId}
        </span>
      )
    },
    {
      key: 'name',
      header: 'Full Name & Contact',
      sortable: true,
      accessor: (row) => {
        const avatarSrc = row.avatarUrl || DEFAULT_AVATARS[0];
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={avatarSrc}
              alt={row.name}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #bfdbfe',
                boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                flexShrink: 0
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 13 }}>{row.name}</span>
              <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Mail size={11} color="#64748b" /> {row.email}
                </span>
                <span>|</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Phone size={11} color="#64748b" /> {row.phone}
                </span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
          <BadgeCheck size={14} color="#2563eb" /> {row.role}
        </span>
      )
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      accessor: (row) => <span style={{ color: '#475569', fontWeight: 600 }}>{row.department}</span>
    },
    {
      key: 'branch',
      header: 'Assigned Branch',
      sortable: true,
      accessor: (row) => (
        <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Building size={13} color="#64748b" /> {row.branch}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (row) => <Badge label={row.status} />
    },
    {
      key: 'joinedDate',
      header: 'Joined Date',
      sortable: true,
      accessor: (row) => <span style={{ fontSize: 11.5, color: '#64748b' }}>{row.joinedDate}</span>
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={() => handleOpenEditEmployee(row)}
            style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#2563eb', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Edit Employee"
          >
            <Edit size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteEmployee(row.id, row.name)}
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Delete Employee"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700,
          padding: '10px 16px',
          borderRadius: 8,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Sparkles size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={20} color="#2563eb" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Employee ID & Staff Directory
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2, margin: 0 }}>
                Create employee IDs, assign roles, departments & manage branch staff avatars.
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Inline Employee Form Button */}
        <Button
          variant={showEmployeeForm ? 'secondary' : 'primary'}
          icon={showEmployeeForm ? <ChevronUp size={15} /> : <Plus size={15} />}
          onClick={handleToggleAddEmployee}
        >
          {showEmployeeForm ? 'Hide Employee Form' : '+ Add Employee Form'}
        </Button>
      </div>

      {/* INLINE EMPLOYEE FORM CARD */}
      {showEmployeeForm && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserCheck size={16} color="#2563eb" />
              {editingEmployee ? `Edit Employee ID: ${editingEmployee.employeeId}` : 'Create New Employee ID Entry'}
            </h3>
            <button
              onClick={() => { setShowEmployeeForm(false); setEditingEmployee(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 2 }}
              title="Hide Form"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveEmployee} style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: '1 1 120px', minWidth: 100 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Employee ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EMP-1006"
                value={employeeForm.employeeId}
                onChange={(e) => setEmployeeForm({ ...employeeForm, employeeId: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', backgroundColor: '#f8fafc', fontWeight: 700, color: '#2563eb' }}
              />
            </div>

            <div style={{ flex: '1 1 160px', minWidth: 130 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Nasrin Sultana"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 160px', minWidth: 130 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                required
                placeholder="staff@queflow.com"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 130px', minWidth: 110 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+880 1700 000000"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 150px', minWidth: 130 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Avatar Image URL
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={employeeForm.avatarUrl}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, avatarUrl: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const rand = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
                    setEmployeeForm({ ...employeeForm, avatarUrl: rand });
                  }}
                  style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '6px 8px', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Generate Random Avatar"
                >
                  <ImageIcon size={14} />
                </button>
              </div>
            </div>

            <div style={{ flex: '1 1 130px', minWidth: 110 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Assigned Role
              </label>
              <select
                value={employeeForm.role}
                onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value as Employee['role'] })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', backgroundColor: '#ffffff' }}
              >
                <option value="Staff">Staff</option>
                <option value="Branch Manager">Branch Manager</option>
                <option value="Doctor">Doctor</option>
                <option value="Officer">Officer</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>

            <div style={{ flex: '1 1 140px', minWidth: 120 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Department
              </label>
              <select
                value={employeeForm.department}
                onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', backgroundColor: '#ffffff' }}
              >
                <option value="General Operations">General Operations</option>
                <option value="KYC & Verification">KYC & Verification</option>
                <option value="Cash & Teller">Cash & Teller</option>
                <option value="Loan Operations">Loan Operations</option>
                <option value="Medical & Healthcare">Medical & Healthcare</option>
              </select>
            </div>

            <div style={{ flex: '1 1 130px', minWidth: 110 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Assigned Branch
              </label>
              <select
                value={employeeForm.branch}
                onChange={(e) => setEmployeeForm({ ...employeeForm, branch: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', backgroundColor: '#ffffff' }}
              >
                <option value="Main Branch">Main Branch</option>
                <option value="Gulshan Branch">Gulshan Branch</option>
                <option value="Dhanmondi Branch">Dhanmondi Branch</option>
                <option value="Uttara Branch">Uttara Branch</option>
                <option value="Mirpur Branch">Mirpur Branch</option>
              </select>
            </div>

            <div style={{ flex: '1 1 110px', minWidth: 90 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Status
              </label>
              <select
                value={employeeForm.status}
                onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value as Employee['status'] })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', backgroundColor: '#ffffff' }}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Button type="button" variant="secondary" onClick={() => { setShowEmployeeForm(false); setEditingEmployee(null); }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<CheckCircle2 size={15} />}>
                {editingEmployee ? 'Update Employee' : 'Confirm Employee ID'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Employee Directory Table */}
      <GlobalTable<Employee>
        data={employees}
        columns={columns}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        title="Registered Employee Directory & ID Catalog"
        searchPlaceholder="Search by employee ID, name, role or department..."
        enableSearch={true}
        enablePagination={true}
      />
    </div>
  );
};
