import { useState, useMemo, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import type { ColumnDef, SortingState, HeaderGroup, Header, Row, Cell, VisibilityState, ColumnSizingState } from '@tanstack/react-table';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Users,
  Check,
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
  GripVertical
} from 'lucide-react';
import type { GlobalTableProps, TableColumn } from '../../types/table';
import { TableExportToolbar } from './TableExportToolbar';
import { ColumnSelectionModal } from './ColumnSelectionModal';
import { PdfExportModal, type PdfExportOptions } from './PdfExportModal';
import { TableGridView } from './TableGridView';

export type TableDensityMode = 'normal' | 'compact' | 'ultra';
export type TableViewMode = 'table' | 'grid';

export function GlobalTable<T>({
  data,
  columns,
  keyExtractor,
  title,
  subtitle,
  searchPlaceholder = 'Search customer...',
  enableSearch = true,
  enablePagination = true,
  defaultItemsPerPage = 10,
  onRowClick,
  headerActions,
  filterBar,
  emptyStateMessage = 'No records found',
  loading = false
}: GlobalTableProps<T>): ReactNode {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [branchFilter, setBranchFilter] = useState<string>('All Branches');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Density & View Mode States
  const [densityMode, setDensityMode] = useState<TableDensityMode>('compact');
  const [viewMode, setViewMode] = useState<TableViewMode>('table');

  // Modal States
  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // PDF Export Modal Options State
  const [pdfOptions, setPdfOptions] = useState<PdfExportOptions>({
    orientation: 'Landscape',
    paperSize: 'A4',
    pdfFontSize: 'Medium',
    includeDate: true,
    includePageNo: true,
    includeLogo: true
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultItemsPerPage
  });

  // Drag & Drop Column Reordering Handlers
  const handleDragStart = (e: React.DragEvent, colId: string) => {
    e.dataTransfer.setData('text/plain', colId);
    setDraggedColumnId(colId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    if (!draggedColumnId || draggedColumnId === targetColId) return;
    const currentOrder = columnOrder.length ? [...columnOrder] : columns.map((c) => c.key);
    const dragIdx = currentOrder.indexOf(draggedColumnId);
    const dropIdx = currentOrder.indexOf(targetColId);
    if (dragIdx !== -1 && dropIdx !== -1) {
      currentOrder.splice(dragIdx, 1);
      currentOrder.splice(dropIdx, 0, draggedColumnId);
      setColumnOrder(currentOrder);
      showToast(`Column reordered: ${draggedColumnId} → ${targetColId}`);
    }
    setDraggedColumnId(null);
  };

  // Convert custom TableColumn definition to TanStack ColumnDef
  const tanstackColumns = useMemo<ColumnDef<T, unknown>[]>(() => {
    return columns.map((col: TableColumn<T>) => {
      const colDef: ColumnDef<T, unknown> = {
        id: col.key,
        header: col.header,
        size: col.width ? parseInt(String(col.width).replace('px', ''), 10) : undefined,
        enableSorting: col.sortable ?? true,
        accessorFn: (row: T) => {
          const record = row as Record<string, unknown>;
          const val = record[col.key];
          if (val === null || val === undefined) return '';
          return val;
        },
        cell: (info) => {
          if (col.accessor) {
            return col.accessor(info.row.original);
          }
          const record = info.row.original as Record<string, unknown>;
          return (record[col.key] as ReactNode) ?? null;
        }
      };
      return colDef;
    });
  }, [columns]);

  const table = useReactTable<T>({
    data,
    columns: tanstackColumns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      globalFilter,
      sorting,
      pagination,
      columnVisibility,
      columnOrder,
      columnSizing
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1. Copy Action
  const handleCopy = () => {
    const visibleCols = table.getVisibleFlatColumns();
    const headers = visibleCols.map((c) => columns.find((col) => col.key === c.id)?.header || c.id).join('\t');
    const rowsText = data.map((row) => {
      const rec = row as Record<string, unknown>;
      return visibleCols.map((c) => String(rec[c.id] ?? '')).join('\t');
    }).join('\n');

    const fullText = `${headers}\n${rowsText}`;
    navigator.clipboard.writeText(fullText);
    showToast('Table copied to clipboard!');
  };

  // 2. Excel (CSV) Export
  const handleExportExcel = () => {
    const visibleCols = table.getVisibleFlatColumns();
    const headers = visibleCols.map((c) => `"${columns.find((col) => col.key === c.id)?.header || c.id}"`).join(',');
    const rowsCsv = data.map((row) => {
      const rec = row as Record<string, unknown>;
      return visibleCols.map((c) => `"${String(rec[c.id] ?? '').replace(/"/g, '""')}"`).join(',');
    }).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rowsCsv}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(title || 'export').toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Excel CSV downloaded!');
  };

  // 3. Print Action
  const handlePrint = () => {
    window.print();
  };

  // 4. PDF Action (Triggers Print Window with custom settings)
  const executePDFExport = () => {
    setIsPdfModalOpen(false);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const visibleCols = table.getVisibleFlatColumns();
    const headersHtml = visibleCols.map((c) => `<th>${columns.find((col) => col.key === c.id)?.header || c.id}</th>`).join('');
    const rowsHtml = data.map((row) => {
      const rec = row as Record<string, unknown>;
      return `<tr>${visibleCols.map((c) => `<td>${String(rec[c.id] ?? '')}</td>`).join('')}</tr>`;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${title || 'Export PDF Report'}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #1e293b; }
            .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; }
            h2 { font-size: 20px; color: #0f172a; margin: 0; }
            table { width: 100%; border-collapse: collapse; font-size: ${pdfOptions.pdfFontSize === 'Small' ? '10px' : pdfOptions.pdfFontSize === 'Large' ? '14px' : '12px'}; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { background-color: #f1f5f9; color: #334155; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <h2>${title || 'Data Report'}</h2>
              ${pdfOptions.includeDate ? `<p style="font-size:11px;color:#64748b;margin-top:4px;">Generated on: ${new Date().toLocaleString()}</p>` : ''}
            </div>
            ${pdfOptions.includeLogo ? `<div style="font-weight:800;font-size:18px;color:#2563eb;">QueueFlow</div>` : ''}
          </div>
          <table>
            <thead><tr>${headersHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          ${pdfOptions.includePageNo ? `<p style="text-align:right;font-size:10px;color:#94a3b8;margin-top:16px;">Page 1 of 1</p>` : ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const pageRows = table.getRowModel().rows;
  const pageRowKeys = useMemo(() => {
    return pageRows.map((r) => (keyExtractor ? keyExtractor(r.original) : r.id));
  }, [pageRows, keyExtractor]);

  const selectedCountOnPage = pageRowKeys.filter((k) => selectedRows[k]).length;
  const isAllPageSelected = pageRowKeys.length > 0 && selectedCountOnPage === pageRowKeys.length;
  const isIndeterminate = selectedCountOnPage > 0 && !isAllPageSelected;

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const toggleSelectAll = (checked: boolean) => {
    const next = { ...selectedRows };
    pageRowKeys.forEach((key) => {
      if (checked) {
        next[key] = true;
      } else {
        delete next[key];
      }
    });
    setSelectedRows(next);
  };

  const toggleSelectRow = (key: string) => {
    setSelectedRows((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden relative w-full flex flex-col max-h-[calc(100vh-175px)]">
      {/* Toast notification */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 16,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          fontSize: 10.5,
          fontWeight: 600,
          padding: '5px 10px',
          borderRadius: 6,
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <Check size={12} color="#10b981" /> {toastMessage}
        </div>
      )}

      {/* Embedded Dynamic Filter Bar */}
      {filterBar && (
        <div className="p-2 border-b border-slate-100 bg-slate-50/30">
          {filterBar}
        </div>
      )}

      {/* Title Bar (Top Row) */}
      {(title || subtitle) && (
        <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            {title && (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={12} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{title}</h3>
              </div>
            )}
            {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
          </div>
          {headerActions}
        </div>
      )}

      {/* Single-Line Controls & Export Toolbar (Bottom Row directly under Title) */}
      <div className="p-2 sm:p-2.5 border-b border-slate-100 flex flex-nowrap items-center justify-between gap-2 bg-white overflow-x-auto no-scrollbar">
        {/* Left Controls: Search, Branch Filter, Sort ASC/DESC Pill, Density, View Mode */}
        <div className="flex flex-nowrap items-center gap-1.5 sm:gap-2 shrink-0">
          {enableSearch && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full focus-within:ring-1 focus-within:ring-blue-500 shrink-0">
              <Search size={12} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-[10.5px] text-slate-700 w-24 sm:w-32 focus:w-40 transition-all placeholder:text-slate-400 p-0"
              />
            </div>
          )}

          {/* Branch Filter Dropdown Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full shrink-0">
            <Filter size={11} className="text-slate-500 shrink-0" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-[10.5px] font-semibold text-slate-600 cursor-pointer pr-1 p-0"
            >
              <option value="All Branches">All Branches</option>
              <option value="Main Branch">Main Branch</option>
              <option value="Gulshan Branch">Gulshan Branch</option>
            </select>
          </div>

          {/* Ascending / Descending Order Sort Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full shrink-0">
            <ArrowUpDown size={11} className="text-slate-500 shrink-0" />
            <select
              value={sorting[0]?.id || ''}
              onChange={(e) => {
                const colId = e.target.value;
                if (!colId) {
                  setSorting([]);
                } else {
                  setSorting([{ id: colId, desc: sorting[0]?.desc ?? false }]);
                }
              }}
              className="bg-transparent border-none outline-none text-[10.5px] font-semibold text-slate-600 cursor-pointer pr-1 p-0"
            >
              <option value="">Sort Column...</option>
              {columns.filter((c) => c.sortable !== false).map((c) => (
                <option key={c.key} value={c.key}>{c.header}</option>
              ))}
            </select>

            {sorting.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const currentDesc = sorting[0]?.desc ?? false;
                  setSorting([{ id: sorting[0].id, desc: !currentDesc }]);
                }}
                title={sorting[0]?.desc ? 'Descending (Click for Ascending)' : 'Ascending (Click for Descending)'}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer border-0 transition-colors"
              >
                {sorting[0]?.desc ? (
                  <>
                    <ArrowDown size={11} className="text-red-500" />
                    <span>DESC</span>
                  </>
                ) : (
                  <>
                    <ArrowUp size={11} className="text-emerald-600" />
                    <span>ASC</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* 3 Table Density Modes Switcher */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md shrink-0">
            <SlidersHorizontal size={11} className="text-blue-600 shrink-0" />
            <select
              value={densityMode}
              onChange={(e) => setDensityMode(e.target.value as TableDensityMode)}
              className="bg-transparent border-none outline-none text-[10.5px] font-bold text-blue-700 cursor-pointer pr-1 p-0"
            >
              <option value="normal">Normal</option>
              <option value="compact">Compact</option>
              <option value="ultra">Ultra Compact</option>
            </select>
          </div>

          {/* View Mode Toggle (Table View vs. Grid Cards View) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1 rounded border-0 cursor-pointer ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'bg-transparent text-slate-500'
                }`}
            >
              <TableIcon size={12} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
              className={`p-1 rounded border-0 cursor-pointer ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'bg-transparent text-slate-500'
                }`}
            >
              <LayoutGrid size={12} />
            </button>
          </div>
        </div>

        {/* Right Export Toolbar (Copy, Excel, Print, PDF, Columns) */}
        <TableExportToolbar
          onCopy={handleCopy}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
          onOpenColumnsModal={() => setIsColumnModalOpen(true)}
        />
      </div>

      {/* Main Content Area: Table View vs. Grid Cards View */}
      {viewMode === 'table' ? (
        <div className="qf-table-container">
          <table className={`qf-table qf-table-density-${densityMode}`}>
            <thead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                <tr key={headerGroup.id}>
                  <th
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 20,
                      backgroundColor: '#f8fafc',
                      width: 38,
                      minWidth: 38,
                      textAlign: 'center',
                      padding: '8px 10px',
                      borderBottom: '1.5px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)'
                    }}
                  >
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#2563eb' }}
                      title={isAllPageSelected ? 'Deselect all rows' : 'Select all rows on this page'}
                    />
                  </th>

                  {headerGroup.headers.map((header: Header<T, unknown>) => {
                    const customCol = columns.find((c) => c.key === header.id);
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();
                    const isDragging = draggedColumnId === header.id;

                    return (
                      <th
                        key={header.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, header.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, header.id)}
                        onClick={header.column.getToggleSortingHandler()}
                        title={canSort ? `Click to sort • Drag to reorder column` : 'Drag to reorder column'}
                        style={{
                          position: 'sticky',
                          top: 0,
                          zIndex: 10,
                          cursor: canSort ? 'pointer' : 'grab',
                          textAlign: customCol?.align || 'left',
                          width: header.getSize() || customCol?.width,
                          color: isSorted ? '#2563eb' : '#475569',
                          backgroundColor: isDragging ? '#e0e7ff' : isSorted ? '#eff6ff' : '#f8fafc',
                          borderBottom: '1.5px solid #e2e8f0',
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
                          fontWeight: isSorted ? 700 : 600,
                          opacity: isDragging ? 0.6 : 1,
                          userSelect: 'none'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            justifyContent:
                              customCol?.align === 'right'
                                ? 'flex-end'
                                : customCol?.align === 'center'
                                  ? 'center'
                                  : 'flex-start'
                          }}
                        >
                          <GripVertical size={11} className="text-slate-300 hover:text-slate-500 cursor-grab shrink-0" />
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          {canSort && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                                padding: '1px 4px',
                                borderRadius: 4,
                                backgroundColor: isSorted ? '#dbeafe' : 'transparent',
                                color: isSorted ? '#1d4ed8' : '#94a3b8',
                                fontSize: 9.5,
                                fontWeight: 700
                              }}
                            >
                              {isSorted === 'asc' ? (
                                <>
                                  <ArrowUp size={11} color="#059669" />
                                  <span style={{ fontSize: 9, color: '#059669' }}>ASC</span>
                                </>
                              ) : isSorted === 'desc' ? (
                                <>
                                  <ArrowDown size={11} color="#dc2626" />
                                  <span style={{ fontSize: 9, color: '#dc2626' }}>DESC</span>
                                </>
                              ) : (
                                <ArrowUpDown size={10} />
                              )}
                            </span>
                          )}
                        </div>

                        {/* Column Resizer Handle */}
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            height: '100%',
                            width: 5,
                            cursor: 'col-resize',
                            userSelect: 'none',
                            touchAction: 'none',
                            zIndex: 10,
                            backgroundColor: header.column.getIsResizing() ? '#2563eb' : 'transparent'
                          }}
                          title="Drag to resize column width"
                        />
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '24px 16px', color: '#64748b' }}>
                    Loading records...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '24px 16px', color: '#64748b' }}>
                    {emptyStateMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row: Row<T>) => {
                  const rowKey = keyExtractor ? keyExtractor(row.original) : row.id;
                  const isChecked = !!selectedRows[rowKey];

                  return (
                    <tr
                      key={rowKey}
                      onClick={() => onRowClick && onRowClick(row.original)}
                      style={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        backgroundColor: isChecked ? '#f0f9ff' : 'transparent'
                      }}
                    >
                      <td style={{ width: 38, textAlign: 'center', padding: '8px 10px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelectRow(rowKey);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#2563eb' }}
                        />
                      </td>

                      {row.getVisibleCells().map((cell: Cell<T, unknown>) => {
                        const customCol = columns.find((c) => c.key === cell.column.id);
                        return (
                          <td
                            key={cell.id}
                            style={{
                              textAlign: customCol?.align || 'left',
                              width: cell.column.getSize() || customCol?.width
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Standalone Grid Cards View Component */
        <TableGridView
          rows={table.getRowModel().rows}
          columns={columns}
          keyExtractor={keyExtractor}
          selectedRows={selectedRows}
          onToggleSelectRow={toggleSelectRow}
        />
      )}
      {/* Dynamic Numeric Pagination Footer */}
      {enablePagination && table.getFilteredRowModel().rows.length > 0 && (
        <div className="px-3 py-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 bg-white shrink-0 sticky bottom-0 z-10 shadow-xs">
          <div>
            Showing <strong className="text-slate-900 font-bold">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </strong> of <strong className="text-slate-900 font-bold">{table.getFilteredRowModel().rows.length}</strong> records
          </div>

          <div className="flex items-center gap-4">
            {/* Rows / Items per Page Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">Rows per page:</span>
              <div className="inline-flex items-center p-0.5 bg-slate-100/90 rounded-lg border border-slate-200/80 gap-0.5 shadow-2xs">
                {[5, 10, 20, 50, 'ALL'].map((val) => {
                  const isSelected =
                    val === 'ALL'
                      ? table.getState().pagination.pageSize >= 9999
                      : table.getState().pagination.pageSize === val;
                  return (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => {
                        if (val === 'ALL') {
                          table.setPageSize(99999);
                        } else {
                          table.setPageSize(Number(val));
                        }
                        table.setPageIndex(0);
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="inline-flex items-center justify-center w-6 h-6 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft size={12} />
              </button>

              {Array.from({ length: table.getPageCount() || 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`w-6 h-6 rounded text-[10.5px] font-bold transition-colors cursor-pointer border ${table.getState().pagination.pageIndex === i
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="inline-flex items-center justify-center w-6 h-6 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modular Column Selection Options Modal */}
      <ColumnSelectionModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        allLeafColumns={table.getAllLeafColumns()}
        tableColumns={columns}
        onSelectAll={() => table.toggleAllColumnsVisible(true)}
        onSelectNone={() => table.toggleAllColumnsVisible(false)}
        onApply={() => {
          setIsColumnModalOpen(false);
          showToast('Custom column layout applied!');
        }}
      />

      {/* Modular PDF Export Options Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        options={pdfOptions}
        onChangeOptions={setPdfOptions}
        allLeafColumns={table.getAllLeafColumns()}
        tableColumns={columns}
        onSelectAll={() => table.toggleAllColumnsVisible(true)}
        onSelectNone={() => table.toggleAllColumnsVisible(false)}
        onExportPdf={executePDFExport}
      />
    </div>
  );
}
