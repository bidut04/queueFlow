import type { ReactNode } from 'react';
import type { Row } from '@tanstack/react-table';
import type { TableColumn } from '../../types/table';

export interface TableGridViewProps<T> {
  rows: Row<T>[];
  columns: TableColumn<T>[];
  keyExtractor?: (row: T) => string;
  selectedRows: Record<string, boolean>;
  onToggleSelectRow: (key: string) => void;
}

export function TableGridView<T>({
  rows,
  columns,
  keyExtractor,
  selectedRows,
  onToggleSelectRow
}: TableGridViewProps<T>): ReactNode {
  if (rows.length === 0) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc' }}>
        No records to show in Grid View
      </div>
    );
  }

  return (
    <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, backgroundColor: '#f8fafc' }}>
      {rows.map((row: Row<T>) => {
        const rowKey = keyExtractor ? keyExtractor(row.original) : row.id;
        const rec = row.original as Record<string, unknown>;
        return (
          <div
            key={rowKey}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: '#0f172a' }}>
                {String(rec['name'] || rec['ticketNumber'] || rowKey)}
              </span>
              <input
                type="checkbox"
                checked={!!selectedRows[rowKey]}
                onChange={() => onToggleSelectRow(rowKey)}
                style={{ accentColor: '#2563eb', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
              {columns.slice(1, 5).map((col) => (
                <div key={col.key} style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span style={{ fontWeight: 600 }}>{col.header}:</span>
                  <span style={{ color: '#1e293b' }}>
                    {col.accessor ? col.accessor(row.original) : String(rec[col.key] ?? '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
