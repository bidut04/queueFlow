import React from 'react';
import {
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Lock,
  Calendar,
  Clock,
  ListOrdered,
  CheckSquare,
  Radio,
  Upload,
  ToggleLeft,
  Plus
} from 'lucide-react';
import type { FieldType } from '../../types/formBuilder';

export interface FieldPaletteItem {
  type: FieldType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const PALETTE_ITEMS: FieldPaletteItem[] = [
  { type: 'TEXT', label: 'Single Line Text', description: 'Names, titles & short text', icon: <Type size={16} color="#2563eb" /> },
  { type: 'TEXTAREA', label: 'Multi-line Text', description: 'Comments & descriptions', icon: <AlignLeft size={16} color="#0284c7" /> },
  { type: 'NUMBER', label: 'Numeric Input', description: 'Age, amounts & integers', icon: <Hash size={16} color="#059669" /> },
  { type: 'EMAIL', label: 'Email Address', description: 'Validated email format', icon: <Mail size={16} color="#7c3aed" /> },
  { type: 'PHONE', label: 'Phone Number', description: 'Mobile & telephone numbers', icon: <Phone size={16} color="#d97706" /> },
  { type: 'PASSWORD', label: 'Password Field', description: 'Masked secret input', icon: <Lock size={16} color="#dc2626" /> },
  { type: 'DATE', label: 'Date Picker', description: 'Calendar date selection', icon: <Calendar size={16} color="#2563eb" /> },
  { type: 'TIME', label: 'Time Slot', description: 'Clock time selection', icon: <Clock size={16} color="#4f46e5" /> },
  { type: 'DROPDOWN', label: 'Dropdown List', description: 'Single selection combobox', icon: <ListOrdered size={16} color="#0891b2" /> },
  { type: 'RADIO', label: 'Radio Group', description: 'Single choice radio buttons', icon: <Radio size={16} color="#ea580c" /> },
  { type: 'CHECKBOX', label: 'Checkbox Group', description: 'Multi-choice selection', icon: <CheckSquare size={16} color="#16a34a" /> },
  { type: 'FILE', label: 'File Attachment', description: 'Document & image uploads', icon: <Upload size={16} color="#65a30d" /> },
  { type: 'BOOLEAN', label: 'Toggle Switch', description: 'Yes / No boolean switch', icon: <ToggleLeft size={16} color="#9333ea" /> }
];

export interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

export const FieldPalette: React.FC<FieldPaletteProps> = ({ onAddField }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <div>
        <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Available Field Types
        </h4>
        <p style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
          Click or drag a field to add it to your form configuration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6, maxHeight: 520, overflowY: 'auto' }}>
        {PALETTE_ITEMS.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onAddField(item.type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.borderColor = '#bfdbfe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#f1f5f9';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 9.5, color: '#94a3b8', margin: 0 }}>
                  {item.description}
                </p>
              </div>
            </div>

            <Plus size={14} color="#2563eb" />
          </button>
        ))}
      </div>
    </div>
  );
};
