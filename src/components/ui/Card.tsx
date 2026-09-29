import React from 'react';
import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  padding = '20px',
  onClick
}) => {
  return (
    <div
      className={`qf-card ${hoverable ? 'qf-card-hover' : ''} ${className}`}
      style={{ padding, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
