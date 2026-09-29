import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  let variantClass = 'qf-btn-primary';
  if (variant === 'secondary') variantClass = 'qf-btn-secondary';
  if (variant === 'outline') variantClass = 'qf-btn-outline';
  if (variant === 'icon') variantClass = 'qf-btn-icon';

  const sizeClass = size === 'sm' ? 'qf-btn-sm' : '';

  return (
    <button className={`qf-btn ${variantClass} ${sizeClass} ${className}`} {...props}>
      {icon && iconPosition === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </button>
  );
};
