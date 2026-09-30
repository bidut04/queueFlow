import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  TrendingUp,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  ChevronUp,
  Plus
} from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { TableColumn } from '../types/table';
import type { Service } from '../types/service';
import { SERVICES_LIST } from '../data/mockData';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(SERVICES_LIST);

  // Inline Form Toggle Visibility States
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Service Form Edit & Fields State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Medical',
    durationMinutes: 15,
    price: '$30',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Service Inline Form Handlers
  const handleToggleAddService = () => {
    if (showServiceForm && !editingService) {
      setShowServiceForm(false);
      return;
    }
    setEditingService(null);
    setServiceForm({
      name: '',
      category: 'Medical',
      durationMinutes: 15,
      price: '$30',
      status: 'Active'
    });
    setShowServiceForm(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      durationMinutes: service.durationMinutes,
      price: service.price,
      status: service.status === 'Active' ? 'Active' : 'Inactive'
    });
    setShowServiceForm(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, ...serviceForm }
            : s
        )
      );
      showToast(`Service "${serviceForm.name}" updated successfully!`);
    } else {
      const newService: Service = {
        id: `srv-${Date.now()}`,
        ...serviceForm,
        totalBookingsThisMonth: 0,
        growthRate: 5
      };
      setServices((prev) => [newService, ...prev]);
      showToast(`New Service "${serviceForm.name}" created successfully!`);
    }
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove service "${name}"?`)) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast(`Service "${name}" deleted.`);
    }
  };

  // Service Table Columns
  const serviceColumns: TableColumn<Service>[] = [
    {
      key: 'name',
      header: 'Service Name',
      sortable: true,
      accessor: (row) => <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 10.5 }}>{row.name}</span>
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      accessor: (row) => <span style={{ color: '#475569', fontWeight: 600 }}>{row.category}</span>
    },
    {
      key: 'durationMinutes',
      header: 'Avg Duration',
      sortable: true,
      accessor: (row) => (
        <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={13} color="#2563eb" /> {row.durationMinutes} mins
        </span>
      )
    },
    {
      key: 'price',
      header: 'Fee / Price',
      sortable: true,
      accessor: (row) => <span style={{ fontWeight: 600, color: '#059669', fontSize: 10.5 }}>{row.price}</span>
    },
    {
      key: 'totalBookingsThisMonth',
      header: 'Monthly Bookings',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: 6 }}>
          {row.totalBookingsThisMonth}
        </span>
      )
    },
    {
      key: 'growthRate',
      header: 'Growth Rate',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
          <TrendingUp size={13} /> +{row.growthRate}%
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
      key: 'id',
      header: 'Actions',
      align: 'center',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={() => handleOpenEditService(row)}
            style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, color: '#2563eb', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Edit Service Form"
          >
            <Edit size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteService(row.id, row.name)}
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Delete Service"
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
              <Briefcase size={20} color="#2563eb" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Service Management
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2, margin: 0 }}>
                Configure available queue services, consultation categories, and pricing forms.
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Inline Service Form Button */}
        <Button
          variant={showServiceForm ? 'secondary' : 'primary'}
          icon={showServiceForm ? <ChevronUp size={15} /> : <Plus size={15} />}
          onClick={handleToggleAddService}
        >
          {showServiceForm ? 'Hide Service Form' : '+ Add Service Form'}
        </Button>
      </div>

      {/* INLINE SERVICE FORM CARD (EXACTLY LIKE BOOKINGS PAGE INLINE FORM) */}
      {showServiceForm && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Briefcase size={16} color="#2563eb" />
              {editingService ? `Edit Service Details: ${editingService.name}` : 'Create New Service Form Entry'}
            </h3>
            <button
              onClick={() => { setShowServiceForm(false); setEditingService(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 2 }}
              title="Hide Form"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveService} style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: '1 1 180px', minWidth: 150 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Service Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KYC Verification"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 160px', minWidth: 140 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', backgroundColor: '#ffffff' }}
              >
                <option value="Medical">Medical</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Account & Identity">Account & Identity</option>
                <option value="Banking & Cash">Banking & Cash</option>
                <option value="Specialist">Specialist</option>
                <option value="Therapy">Therapy</option>
              </select>
            </div>

            <div style={{ flex: '1 1 140px', minWidth: 120 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Est Duration (Mins)
              </label>
              <input
                type="number"
                min={5}
                max={240}
                value={serviceForm.durationMinutes}
                onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: parseInt(e.target.value) || 15 })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 130px', minWidth: 110 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Price / Fee
              </label>
              <input
                type="text"
                placeholder="e.g. Free or $30"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ flex: '1 1 120px', minWidth: 100 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                Status
              </label>
              <select
                value={serviceForm.status}
                onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value as 'Active' | 'Inactive' })}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none', backgroundColor: '#ffffff' }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Button type="button" variant="secondary" onClick={() => { setShowServiceForm(false); setEditingService(null); }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<CheckCircle2 size={15} />}>
                {editingService ? 'Update Service' : 'Confirm Service'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Service Catalog Table */}
      <GlobalTable<Service>
        data={services}
        columns={serviceColumns}
        keyExtractor={(row) => row.id}
        title="Configured Queue Services & Treatment Types"
        searchPlaceholder="Search by service name or category..."
        enableSearch={true}
        enablePagination={true}
      />
    </div>
  );
};
