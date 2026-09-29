import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Column } from '@tanstack/react-table';
import { Columns, X, Check, CheckSquare, Square } from 'lucide-react';
import type { TableColumn } from '../../types/table';

export interface ColumnSelectionModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  allLeafColumns: Column<T, unknown>[];
  tableColumns: TableColumn<T>[];
  onSelectAll: () => void;
  onSelectNone: () => void;
  onApply: () => void;
}

export function ColumnSelectionModal<T>({
  isOpen,
  onClose,
  allLeafColumns,
  tableColumns,
  onSelectAll,
  onSelectNone,
  onApply
}: ColumnSelectionModalProps<T>): ReactNode {
  if (!isOpen) return null;

  const selectedColCount = allLeafColumns.filter((c) => c.getIsVisible()).length;
  const totalColCount = allLeafColumns.length;

  return createPortal(
    <div className="qf-modal-overlay" onClick={onClose}>
      <div className="qf-modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24 }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Columns size={18} color="#2563eb" />
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '0.01em' }}>
                COLUMN SELECTION OPTIONS
              </h3>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>
                TOGGLE VISIBILITY FOR TABLE COLUMNS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selection Stats Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            {selectedColCount} OF {totalColCount} COLUMNS SELECTED
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, fontWeight: 800, color: '#475569' }}>
            <button
              type="button"
              onClick={onSelectAll}
              style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <CheckSquare size={13} /> ALL
            </button>
            <button
              type="button"
              onClick={onSelectNone}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Square size={13} /> NONE
            </button>
          </div>
        </div>

        {/* Column Pill Grid in QueueFlow Blue Theme */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {allLeafColumns.map((column) => {
            const isVisible = column.getIsVisible();
            const colLabel = tableColumns.find((c) => c.key === column.id)?.header || column.id;

            return (
              <div
                key={column.id}
                onClick={() => column.toggleVisibility()}
                className={`column-select-pill ${isVisible ? 'column-select-pill-selected' : ''}`}
              >
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: isVisible ? '#2563eb' : '#ffffff',
                  border: isVisible ? 'none' : '1.5px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isVisible && <Check size={11} color="#ffffff" strokeWidth={3} />}
                </div>
                <span>{colLabel}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={onApply}
            style={{
              padding: '8px 22px',
              borderRadius: 999,
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: 11.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Check size={14} /> APPLY COLUMNS
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
