import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Column } from '@tanstack/react-table';
import { FileText, X, Check, CheckSquare, Square } from 'lucide-react';
import type { TableColumn } from '../../types/table';

export interface PdfExportOptions {
  orientation: string;
  paperSize: string;
  pdfFontSize: string;
  includeDate: boolean;
  includePageNo: boolean;
  includeLogo: boolean;
}

export interface PdfExportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  options: PdfExportOptions;
  onChangeOptions: (updater: (prev: PdfExportOptions) => PdfExportOptions) => void;
  allLeafColumns: Column<T, unknown>[];
  tableColumns: TableColumn<T>[];
  onSelectAll: () => void;
  onSelectNone: () => void;
  onExportPdf: () => void;
}

export function PdfExportModal<T>({
  isOpen,
  onClose,
  options,
  onChangeOptions,
  allLeafColumns,
  tableColumns,
  onSelectAll,
  onSelectNone,
  onExportPdf
}: PdfExportModalProps<T>): ReactNode {
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
              backgroundColor: '#fff1f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={18} color="#e11d48" />
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '0.01em' }}>
                EXPORT PDF OPTIONS
              </h3>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>
                SELECT COLUMNS TO INCLUDE ({options.orientation.toUpperCase()} LAYOUT)
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

        {/* Modal Controls Bar */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: 12,
          padding: 12,
          border: '1px solid #f1f5f9',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
                ORIENTATION
              </label>
              <select
                value={options.orientation}
                onChange={(e) => onChangeOptions((prev) => ({ ...prev, orientation: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 11.5,
                  fontWeight: 600,
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Landscape">Landscape</option>
                <option value="Portrait">Portrait</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
                PAPER SIZE
              </label>
              <select
                value={options.paperSize}
                onChange={(e) => onChangeOptions((prev) => ({ ...prev, paperSize: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 11.5,
                  fontWeight: 600,
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
                FONT SIZE
              </label>
              <select
                value={options.pdfFontSize}
                onChange={(e) => onChangeOptions((prev) => ({ ...prev, pdfFontSize: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 11.5,
                  fontWeight: 600,
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Medium">Medium</option>
                <option value="Small">Small</option>
                <option value="Large">Large</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.includeDate}
                  onChange={(e) => onChangeOptions((prev) => ({ ...prev, includeDate: e.target.checked }))}
                  style={{ accentColor: '#2563eb' }}
                /> Date
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.includePageNo}
                  onChange={(e) => onChangeOptions((prev) => ({ ...prev, includePageNo: e.target.checked }))}
                  style={{ accentColor: '#2563eb' }}
                /> Page No.
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.includeLogo}
                  onChange={(e) => onChangeOptions((prev) => ({ ...prev, includeLogo: e.target.checked }))}
                  style={{ accentColor: '#2563eb' }}
                /> Logo
              </label>
            </div>
          </div>
        </div>

        {/* Selection Stats Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{
            backgroundColor: '#fff1f2',
            color: '#be123c',
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

        {/* Column Pill Grid */}
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
            onClick={onExportPdf}
            style={{
              padding: '8px 22px',
              borderRadius: 999,
              border: 'none',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              fontSize: 11.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)'
            }}
          >
            <FileText size={14} /> EXPORT PDF
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
