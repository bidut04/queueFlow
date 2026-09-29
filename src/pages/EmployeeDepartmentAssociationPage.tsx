import React, { useState } from 'react';
import {
  GitMerge,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  ChevronUp,
  Building2,
  GitBranch
} from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { TableColumn } from '../types/table';
import { INITIAL_ASSOCIATIONS, type EmployeeDepartmentAssociation } from '../data/mockAssociations';

export const EmployeeDepartmentAssociationPage: React.FC = () => {
  const [associations, setAssociations] = useState<EmployeeDepartmentAssociation[]>(INITIAL_ASSOCIATIONS);
  const [showForm, setShowForm] = useState(false);
  const [editingAssoc, setEditingAssoc] = useState<EmployeeDepartmentAssociation | null>(null);

  const [formState, setFormState] = useState({
    assocCode: '',
    employeeId: 'EMP-1001',
    employeeName: 'Rahul Amin',
    deptId: 'DEP-101',
    deptName: 'Executive Operations',
    designationRole: 'Super Admin',
    associationType: 'Primary' as EmployeeDepartmentAssociation['associationType'],
    branch: 'Main Branch',
    status: 'Active' as EmployeeDepartmentAssociation['status']
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleAddAssoc = () => {
    if (showForm && !editingAssoc) {
      setShowForm(false);
    } else {
      setEditingAssoc(null);
      setFormState({
        assocCode: `EDA-${Math.floor(2000 + Math.random() * 900)}`,
        employeeId: 'EMP-1001',
        employeeName: 'Rahul Amin',
        deptId: 'DEP-101',
        deptName: 'Executive Operations',
        designationRole: 'Super Admin',
        associationType: 'Primary',
        branch: 'Main Branch',
        status: 'Active'
      });
      setShowForm(true);
    }
  };

  const handleEditAssoc = (assoc: EmployeeDepartmentAssociation) => {
    setEditingAssoc(assoc);
    setFormState({
      assocCode: assoc.assocCode,
      employeeId: assoc.employeeId,
      employeeName: assoc.employeeName,
      deptId: assoc.deptId,
      deptName: assoc.deptName,
      designationRole: assoc.designationRole,
      associationType: assoc.associationType,
      branch: assoc.branch,
      status: assoc.status
    });
    setShowForm(true);
  };

  const handleDeleteAssoc = (id: string) => {
    const updated = associations.filter((a) => a.id !== id);
    setAssociations(updated);
    showToast('Employee Department association removed!');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.employeeName.trim()) {
      showToast('Employee Name is required!');
      return;
    }

    if (editingAssoc) {
      const updated = associations.map((a) =>
        a.id === editingAssoc.id
          ? {
              ...a,
              assocCode: formState.assocCode,
              employeeId: formState.employeeId,
              employeeName: formState.employeeName,
              deptId: formState.deptId,
              deptName: formState.deptName,
              designationRole: formState.designationRole,
              associationType: formState.associationType,
              branch: formState.branch,
              status: formState.status
            }
          : a
      );
      setAssociations(updated);
      showToast(`Association updated for ${formState.employeeName}!`);
    } else {
      const newAssoc: EmployeeDepartmentAssociation = {
        id: `assoc_${Date.now()}`,
        assocCode: formState.assocCode,
        employeeId: formState.employeeId,
        employeeName: formState.employeeName,
        deptId: formState.deptId,
        deptName: formState.deptName,
        designationRole: formState.designationRole,
        associationType: formState.associationType,
        branch: formState.branch,
        assignedDate: new Date().toISOString().split('T')[0],
        status: formState.status
      };
      setAssociations([newAssoc, ...associations]);
      showToast(`New department association mapped for ${formState.employeeName}!`);
    }

    setShowForm(false);
    setEditingAssoc(null);
  };

  const assocColumns: TableColumn<EmployeeDepartmentAssociation>[] = [
    {
      key: 'employeeName',
      header: 'Employee Info',
      sortable: true,
      accessor: (row) => (
        <div className="flex items-center gap-2.5">
          {row.employeeAvatar ? (
            <img
              src={row.employeeAvatar}
              alt={row.employeeName}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] flex items-center justify-center border border-blue-200">
              {row.employeeName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-[11.5px]">{row.employeeName}</span>
            <code className="text-[9px] font-mono text-slate-500">{row.employeeId}</code>
          </div>
        </div>
      )
    },
    {
      key: 'deptName',
      header: 'Assigned Department',
      sortable: true,
      accessor: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="font-semibold text-slate-800 text-[11px] flex items-center gap-1">
            <Building2 size={12} className="text-blue-600" />
            <span>{row.deptName}</span>
          </div>
          <code className="text-[9px] font-mono text-slate-500">{row.deptId}</code>
        </div>
      )
    },
    {
      key: 'designationRole',
      header: 'Designation Role',
      sortable: true,
      accessor: (row) => (
        <span className="text-[11px] font-medium text-slate-700">{row.designationRole}</span>
      )
    },
    {
      key: 'associationType',
      header: 'Mapping Type',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            row.associationType === 'Primary'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {row.associationType} Dept
        </span>
      )
    },
    {
      key: 'branch',
      header: 'Branch',
      sortable: true,
      accessor: (row) => (
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
          <GitBranch size={11} className="text-slate-400" />
          <span>{row.branch}</span>
        </div>
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
            onClick={() => handleEditAssoc(row)}
            className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 cursor-pointer"
            title="Edit Association"
          >
            <Edit size={12} />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteAssoc(row.id)}
            className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 cursor-pointer"
            title="Delete Association"
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
            <GitMerge size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
              Employee Department Associations
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Map employees to organizational departments, designations, and primary/secondary roles
            </p>
          </div>
        </div>

        <Button
          variant={showForm ? 'secondary' : 'primary'}
          icon={showForm ? <ChevronUp size={14} /> : <Plus size={14} />}
          onClick={handleToggleAddAssoc}
        >
          {showForm ? 'Hide Form' : 'Map Association'}
        </Button>
      </div>

      {/* Inline Form Card */}
      {showForm && (
        <form
          onSubmit={handleSubmitForm}
          className="bg-white p-4 rounded-xl border border-blue-200 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
              <GitMerge size={14} className="text-blue-600" />
              {editingAssoc ? `Edit Mapping: ${editingAssoc.assocCode}` : 'Create New Employee Department Mapping'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Select Employee <span className="text-red-500">*</span>
              </label>
              <select
                value={formState.employeeName}
                onChange={(e) => {
                  const val = e.target.value;
                  const empCodeMap: Record<string, string> = {
                    'Rahul Amin': 'EMP-1001',
                    'Dr. Nasrin Sultana': 'EMP-1002',
                    'Tanvir Hossain': 'EMP-1003',
                    'Farzana Karim': 'EMP-1004',
                    'Shahadat Hossain': 'EMP-1005',
                    'Sabrina Khan': 'EMP-1006',
                    'Zubair Ahmed': 'EMP-1007'
                  };
                  setFormState({
                    ...formState,
                    employeeName: val,
                    employeeId: empCodeMap[val] || 'EMP-1008'
                  });
                }}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Rahul Amin">Rahul Amin (EMP-1001)</option>
                <option value="Dr. Nasrin Sultana">Dr. Nasrin Sultana (EMP-1002)</option>
                <option value="Tanvir Hossain">Tanvir Hossain (EMP-1003)</option>
                <option value="Farzana Karim">Farzana Karim (EMP-1004)</option>
                <option value="Shahadat Hossain">Shahadat Hossain (EMP-1005)</option>
                <option value="Sabrina Khan">Sabrina Khan (EMP-1006)</option>
                <option value="Zubair Ahmed">Zubair Ahmed (EMP-1007)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Target Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formState.deptName}
                onChange={(e) => {
                  const dName = e.target.value;
                  const deptCodeMap: Record<string, string> = {
                    'Executive Operations': 'DEP-101',
                    'Medical & Healthcare': 'DEP-102',
                    'KYC & Verification': 'DEP-103',
                    'Cash & Teller Operations': 'DEP-104',
                    'Loan & Credit Services': 'DEP-105',
                    'Customer Helpdesk & Service': 'DEP-106'
                  };
                  setFormState({
                    ...formState,
                    deptName: dName,
                    deptId: deptCodeMap[dName] || 'DEP-107'
                  });
                }}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Executive Operations">Executive Operations (DEP-101)</option>
                <option value="Medical & Healthcare">Medical & Healthcare (DEP-102)</option>
                <option value="KYC & Verification">KYC & Verification (DEP-103)</option>
                <option value="Cash & Teller Operations">Cash & Teller Operations (DEP-104)</option>
                <option value="Loan & Credit Services">Loan & Credit Services (DEP-105)</option>
                <option value="Customer Helpdesk & Service">Customer Helpdesk & Service (DEP-106)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Designation / Role
              </label>
              <select
                value={formState.designationRole}
                onChange={(e) => setFormState({ ...formState, designationRole: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Branch Manager">Branch Manager</option>
                <option value="Counter Staff">Counter Staff</option>
                <option value="KYC Officer">KYC Officer</option>
                <option value="Loan Specialist">Loan Specialist</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Mapping Type
              </label>
              <select
                value={formState.associationType}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    associationType: e.target.value as EmployeeDepartmentAssociation['associationType']
                  })
                }
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Primary">Primary Department</option>
                <option value="Secondary">Secondary Department</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Branch
              </label>
              <select
                value={formState.branch}
                onChange={(e) => setFormState({ ...formState, branch: e.target.value })}
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
                Status
              </label>
              <select
                value={formState.status}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    status: e.target.value as EmployeeDepartmentAssociation['status']
                  })
                }
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<CheckCircle2 size={14} />}>
              {editingAssoc ? 'Update Mapping' : 'Save Association'}
            </Button>
          </div>
        </form>
      )}

      {/* Global Table View */}
      <GlobalTable
        data={associations}
        columns={assocColumns}
        keyExtractor={(item) => item.id}
        title="Employee & Department Associations"
        subtitle={`Total ${associations.length} active department mappings registered`}
        searchPlaceholder="Search employee, department, or role..."
        defaultItemsPerPage={10}
      />
    </div>
  );
};
