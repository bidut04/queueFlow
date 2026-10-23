import React, { useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Button } from '../components/ui/Button';
import type { TableColumn } from '../types/table';
import type { BranchPerformanceData } from '../types/dashboard';

export const ReportsPage: React.FC = () => {
  const [reportData] = useState<BranchPerformanceData[]>([]);
  const columns: TableColumn<BranchPerformanceData>[] = [
    {
      key: 'name',
      header: 'Branch Name',
      sortable: true,
      accessor: (row) => <span style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</span>
    },
    {
      key: 'avgWaitMinutes',
      header: 'Avg Wait (Mins)',
      sortable: true,
      align: 'center',
      accessor: (row) => <span style={{ color: '#334155' }}>{row.avgWaitMinutes} min</span>
    },
    {
      key: 'efficiencyPercent',
      header: 'Operational Efficiency',
      sortable: true,
      align: 'center',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <TrendingUp size={13} /> {row.efficiencyPercent}%
        </span>
      )
    },
    {
      key: 'rating',
      header: 'Satisfaction Rating',
      sortable: true,
      align: 'center',
      accessor: (row) => <span style={{ fontWeight: 700, color: '#f59e0b' }}>{row.rating} / 5.0</span>
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>Analytics & Reports</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Detailed efficiency reports, peak hour analysis, and satisfaction metrics.
          </p>
        </div>

        <Button variant="primary" icon={<Download size={15} />}>
          Export Executive Report
        </Button>
      </div>

      <GlobalTable<BranchPerformanceData>
        data={reportData}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="Branch Efficiency Breakdown"
        enableSearch={true}
        enablePagination={true}
      />
    </div>
  );
};
