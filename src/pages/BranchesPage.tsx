import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Phone,
  GitBranch,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  Building2,
  ChevronUp,
  Plus
} from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { TableColumn } from '../types/table';
import type { Branch } from '../types/branch';
import { BRANCHES_LIST } from '../data/mockData';

export const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>(BRANCHES_LIST);

  // Inline Form Toggle Visibility States
  const [showBranchForm, setShowBranchForm] = useState(false);

  // Branch Form Edit & Fields State
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchForm, setBranchForm] = useState({
    name: '',
    location: '',
    manager: '',
    contactNumber: '',
    activeCounters: 4,
    rating: 4.5,
    avgWaitTime: '15 min',
    status: 'On Time' as Branch['status']
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Branch Inline Form Handlers
  const handleToggleAddBranch = () => {
    if (showBranchForm && !editingBranch) {
      setShowBranchForm(false);
      return;
    }
    setEditingBranch(null);
    setBranchForm({
      name: '',
      location: '',
      manager: '',
      contactNumber: '',
      activeCounters: 4,
      rating: 4.5,
      avgWaitTime: '15 min',
      status: 'On Time'
    });
    setShowBranchForm(true);
  };

  const handleOpenEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name,
      location: branch.location,
      manager: branch.manager,
      contactNumber: branch.contactNumber,
      activeCounters: branch.activeCounters,
      rating: branch.rating,
      avgWaitTime: branch.avgWaitTime,
      status: branch.status
    });
    setShowBranchForm(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim()) return;

    if (editingBranch) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranch.id
            ? { ...b, ...branchForm }
            : b
        )
      );
      showToast(`Branch "${branchForm.name}" updated successfully!`);
    } else {
      const newBranch: Branch = {
        id: `br-${Date.now()}`,
        ...branchForm,
        todayTotalBookings: 0
      };
      setBranches((prev) => [newBranch, ...prev]);
      showToast(`New Branch "${branchForm.name}" created successfully!`);
    }
    setShowBranchForm(false);
    setEditingBranch(null);
  };

  const handleDeleteBranch = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      setBranches((prev) => prev.filter((b) => b.id !== id));
      showToast(`Branch "${name}" deleted.`);
    }
  };

  // Branch Table Columns
  const branchColumns: TableColumn<Branch>[] = [
    {
      key: 'name',
      header: 'Branch Name & Location',
      sortable: true,
      accessor: (row) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 13 }}>{row.name}</span>
          <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} color="#2563eb" /> {row.location}
          </span>
        </div>
      )
    },
    {
      key: 'manager',
      header: 'Manager In-Charge',
      sortable: true,
      accessor: (row) => <span style={{ fontWeight: 600, color: '#334155' }}>{row.manager}</span>
    },
    {
      key: 'contactNumber',
      header: 'Contact',
      accessor: (row) => (
        <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Phone size={12} color="#64748b" /> {row.contactNumber}
        </span>
      )
    },
    {
      key: 'activeCounters',
      header: 'Active Counters',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span style={{ fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '3px 10px', borderRadius: 999, display: 'inline-block' }}>
          {row.activeCounters} Counters
        </span>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span style={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
          {row.rating} <Star size={13} fill="#f59e0b" color="#f59e0b" />
        </span>
      )
    },
    {
      key: 'avgWaitTime',
      header: 'Avg Wait Time',
      sortable: true,
      accessor: (row) => <span style={{ color: '#475569', fontWeight: 600 }}>{row.avgWaitTime}</span>
    },
    {
      key: 'status',
      header: 'Operational Status',
      sortable: true,
      accessor: (row) => <Badge label={row.status} />
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={() => handleOpenEditBranch(row)}
            style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#2563eb', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Edit Branch Form"
          >
            <Edit size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteBranch(row.id, row.name)}
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Delete Branch"
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
              <Building2 size={20} color="#2563eb" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Branch Management
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2, margin: 0 }}>
                Configure branch locations, active counter capacities, and entry forms.
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Inline Branch Form Button */}
        <Button
          variant={showBranchForm ? 'secondary' : 'primary'}
          icon={showBranchForm ? <ChevronUp size={15} /> : <Plus size={15} />}
          onClick={handleToggleAddBranch}
        >
          {showBranchForm ? 'Hide Branch Form' : '+ Add Branch Form'}
        </Button>
      </div>

      {/* INLINE BRANCH FORM CARD (EXACTLY LIKE BOOKINGS PAGE INLINE FORM) */}
      {showBranchForm && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <GitBranch size={16} color="#2563eb" />
              {editingBranch ? `Edit Branch Details: ${editingBranch.name}` : 'Create New Branch Entry Form'}
            </h3>
            <button
              onClick={() => { setShowBranchForm(false); setEditingBranch(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 2 }}
              title="Hide Form"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveBranch} style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: '1 1 170px', minWidth: 140 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Branch Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kolkata Central Branch"
                value={branchForm.name}
                onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 170px', minWidth: 140 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Location <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Park Street, Kolkata"
                value={branchForm.location}
                onChange={(e) => setBranchForm({ ...branchForm, location: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 150px', minWidth: 130 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Manager In-Charge
              </label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={branchForm.manager}
                onChange={(e) => setBranchForm({ ...branchForm, manager: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 140px', minWidth: 120 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+91 98300 12345"
                value={branchForm.contactNumber}
                onChange={(e) => setBranchForm({ ...branchForm, contactNumber: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 110px', minWidth: 100 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Active Counters
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={branchForm.activeCounters}
                onChange={(e) => setBranchForm({ ...branchForm, activeCounters: parseInt(e.target.value) || 1 })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 110px', minWidth: 100 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Avg Wait Time
              </label>
              <input
                type="text"
                placeholder="e.g. 15 min"
                value={branchForm.avgWaitTime}
                onChange={(e) => setBranchForm({ ...branchForm, avgWaitTime: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 130px', minWidth: 110 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Operational Status
              </label>
              <select
                value={branchForm.status}
                onChange={(e) => setBranchForm({ ...branchForm, status: e.target.value as Branch['status'] })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', backgroundColor: '#ffffff' }}
              >
                <option value="On Time">On Time</option>
                <option value="Slight Delay">Slight Delay</option>
                <option value="Busy">Busy</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Button type="button" variant="secondary" onClick={() => { setShowBranchForm(false); setEditingBranch(null); }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<CheckCircle2 size={15} />}>
                {editingBranch ? 'Update Branch' : 'Confirm Branch'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Branch Management Table */}
      <GlobalTable<Branch>
        data={branches}
        columns={branchColumns}
        keyExtractor={(row) => row.id}
        title="Configured Healthcare & Financial Branch Network"
        searchPlaceholder="Search by branch name, location, or manager..."
        enableSearch={true}
        enablePagination={true}
      />
    </div>
  );
};
