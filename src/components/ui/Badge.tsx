import React from 'react';
import { getStatusBadgeClass } from '../../utils/formatters';

export interface BadgeProps {
  label: string;
  statusType?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  statusType,
  className = ''
}) => {
  const badgeClass = statusType ? getStatusBadgeClass(statusType) : getStatusBadgeClass(label);
  return (
    <span className={`${badgeClass} ${className}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', opacity: 0.8 }} />
      {label}
    </span>
  );
};
