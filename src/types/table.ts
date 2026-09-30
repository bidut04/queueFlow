import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface ColumnSortState {
  key: string;
  direction: SortDirection;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  accessor?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface GlobalTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (row: T) => string;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  enablePagination?: boolean;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  onRowClick?: (row: T) => void;
  headerActions?: ReactNode;
  filterBar?: ReactNode;
  emptyStateMessage?: string;
  loading?: boolean;
}
