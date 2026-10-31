import type { FC } from 'react';
import { Copy, FileSpreadsheet, Printer, FileText, Columns } from 'lucide-react';
import { getExportPermissionsForModule } from '../../lib/permissions';

export interface TableExportToolbarProps {
  onCopy: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  onOpenPdfModal: () => void;
  onOpenColumnsModal: () => void;
  permissions?: {
    copy?: boolean;
    excel?: boolean;
    print?: boolean;
    pdf?: boolean;
  };
}

export const TableExportToolbar: FC<TableExportToolbarProps> = ({
  onCopy,
  onExportExcel,
  onPrint,
  onOpenPdfModal,
  onOpenColumnsModal,
  permissions
}) => {
  // If not explicitly provided, resolve from active page module permissions
  const activePath = typeof window !== 'undefined' ? window.location.pathname.replace(/^\//, '') || 'dashboard' : 'dashboard';
  const effectivePermissions = permissions || getExportPermissionsForModule(activePath);

  const canCopy = effectivePermissions.copy !== false;
  const canExcel = effectivePermissions.excel !== false;
  const canPrint = effectivePermissions.print !== false;
  const canPdf = effectivePermissions.pdf !== false;

  return (
    <div className="flex flex-nowrap items-center gap-1 shrink-0 ml-auto">
      {/* Copy Pill - only rendered if permission granted */}
      {canCopy && (
        <button
          type="button"
          onClick={onCopy}
          title="Copy Table Data"
          className="inline-flex items-center gap-1 px-2 py-1 text-[10.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <Copy size={11} /> Copy
        </button>
      )}

      {/* Excel Pill - only rendered if permission granted */}
      {canExcel && (
        <button
          type="button"
          onClick={onExportExcel}
          title="Export Excel (CSV)"
          className="inline-flex items-center gap-1 px-2 py-1 text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <FileSpreadsheet size={11} /> Excel
        </button>
      )}

      {/* Print Pill - only rendered if permission granted */}
      {canPrint && (
        <button
          type="button"
          onClick={onPrint}
          title="Print Table"
          className="inline-flex items-center gap-1 px-2 py-1 text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <Printer size={11} /> Print
        </button>
      )}

      {/* PDF Pill - only rendered if permission granted */}
      {canPdf && (
        <button
          type="button"
          onClick={onOpenPdfModal}
          title="Export PDF Settings"
          className="inline-flex items-center gap-1 px-2 py-1 text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <FileText size={11} /> PDF
        </button>
      )}

      {/* Columns Pill */}
      <button
        type="button"
        onClick={onOpenColumnsModal}
        title="Custom Columns Selection"
        className="inline-flex items-center gap-1 px-2 py-1 text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
      >
        <Columns size={11} /> Columns
      </button>
    </div>
  );
};
