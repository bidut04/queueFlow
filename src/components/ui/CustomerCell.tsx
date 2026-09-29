import React, { useState } from 'react';

export interface CustomerCellProps {
  name: string;
  avatarUrl?: string;
  phone?: string;
  size?: number;
}

export const getInitials = (name: string): string => {
  if (!name) return 'CU';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

export const CustomerCell: React.FC<CustomerCellProps> = ({
  name,
  avatarUrl,
  phone,
  size = 32
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const showImage = avatarUrl && !imageError;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {showImage ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImageError(true)}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1.5px solid #bfdbfe',
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            flexShrink: 0
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            border: '1.5px solid #bfdbfe',
            color: '#2563eb',
            fontSize: size * 0.36,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {initials}
        </div>
      )}
      <div>
        <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{name}</p>
        {phone && (
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 1, margin: 0 }}>{phone}</p>
        )}
      </div>
    </div>
  );
};
