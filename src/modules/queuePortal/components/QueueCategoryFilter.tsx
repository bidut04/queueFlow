import React from 'react';
import {
  LayoutGrid,
  Landmark,
  Mail,
  Building2,
  PlusCircle,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import type { ServiceCategory, CategoryTabItem } from '../types/queuePortal.types';

export interface QueueCategoryFilterProps {
  categories: CategoryTabItem[];
  selectedCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  branchSearchQuery: string;
  onBranchSearchChange: (query: string) => void;
}

export const QueueCategoryFilter: React.FC<QueueCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  branchSearchQuery,
  onBranchSearchChange,
}) => {
  const renderCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'grid':
        return <LayoutGrid className="w-3 h-3" />;
      case 'bank':
        return <Landmark className="w-3 h-3" />;
      case 'mail':
        return <Mail className="w-3 h-3" />;
      case 'building':
        return <Building2 className="w-3 h-3" />;
      case 'cross':
        return <PlusCircle className="w-3 h-3" />;
      case 'dots':
      default:
        return <MoreHorizontal className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-2.5 w-full max-w-full min-w-0 overflow-hidden">
      {/* Category Filter Pills (Strictly constrained within min-w-0 to prevent horizontal viewport blowout) */}
      <div className="w-full sm:flex-1 min-w-0 max-w-full overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5 w-max">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs shadow-blue-500/30'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {renderCategoryIcon(cat.icon)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Search Bar on Right */}
      <div className="relative w-full sm:w-52 lg:w-60 shrink-0 min-w-0">
        <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={branchSearchQuery}
          onChange={(e) => onBranchSearchChange(e.target.value)}
          placeholder="Filter by branch or service..."
          className="w-full pl-7 pr-2.5 py-1 bg-white rounded-full border border-slate-200 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all shadow-2xs"
        />
      </div>
    </div>
  );
};
