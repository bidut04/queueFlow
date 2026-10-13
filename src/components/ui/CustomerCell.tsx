import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Tooltip } from './tooltip';

export interface CustomerCellProps {
  name: string;
  avatarUrl?: string;
  phone?: string;
  size?: number;
  initialMasked?: boolean;
  maskSymbol?: '*' | '•';
}

export const getInitials = (name: string): string => {
  if (!name) return 'CU';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

export const formatMaskedPhone = (
  phone: string,
  symbol: '*' | '•' = '*'
): string => {
  if (!phone) return '';
  const trimmed = phone.trim();
  const parts = trimmed.split(' ');

  // E.g. "+880 1712 345678" -> "+880 1712 ***678"
  if (parts.length === 3) {
    const last = parts[2];
    if (last.length >= 4) {
      const masked = symbol.repeat(last.length - 3) + last.slice(-3);
      return `${parts[0]} ${parts[1]} ${masked}`;
    }
  } else if (parts.length === 2) {
    const last = parts[1];
    if (last.length > 5) {
      const keepStart = 3;
      const keepEnd = 3;
      const maskLen = last.length - keepStart - keepEnd;
      return `${parts[0]} ${last.slice(0, keepStart)}${symbol.repeat(maskLen)}${last.slice(-keepEnd)}`;
    }
  } else if (trimmed.length > 7) {
    const keepStart = Math.min(7, Math.floor(trimmed.length * 0.5));
    const keepEnd = 3;
    const maskLen = Math.max(3, trimmed.length - keepStart - keepEnd);
    return `${trimmed.slice(0, keepStart)}${symbol.repeat(maskLen)}${trimmed.slice(-keepEnd)}`;
  }

  return trimmed;
};

export const CustomerCell: React.FC<CustomerCellProps> = ({
  name,
  avatarUrl,
  phone,
  size = 32,
  initialMasked = true,
  maskSymbol = '*'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isMasked, setIsMasked] = useState(initialMasked);
  const [activeSymbol, setActiveSymbol] = useState<'*' | '•'>(maskSymbol);
  const [copied, setCopied] = useState(false);

  const initials = getInitials(name);
  const showImage = avatarUrl && !imageError;

  const displayPhone = phone
    ? isMasked
      ? formatMaskedPhone(phone, activeSymbol)
      : phone
    : '';

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggleMask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMasked((prev) => !prev);
  };

  const handleToggleSymbol = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSymbol((prev) => (prev === '*' ? '•' : '*'));
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: '100%',
        whiteSpace: 'nowrap'
      }}
    >
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

      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <p
          style={{
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
            whiteSpace: 'nowrap',
            lineHeight: '16px'
          }}
        >
          {name}
        </p>

        {phone && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 2,
              whiteSpace: 'nowrap',
              lineHeight: '14px'
            }}
          >
            {/* Phone Number In One Line */}
            <span
              style={{
                fontSize: 11,
                color: '#64748b',
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: isMasked && activeSymbol === '*' ? '0.04em' : 'normal',
                fontFamily: isMasked ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : 'inherit',
                userSelect: 'all'
              }}
              title={isMasked ? `Masked (${activeSymbol}): click eye to reveal` : 'Full phone number'}
            >
              {displayPhone}
            </span>

            {/* Toggle Eye Button (Mask / Unmask) */}
            <Tooltip
              content={isMasked ? 'Reveal full phone number' : 'Mask phone number'}
              side="top"
              delayDuration={50}
            >
              <button
                type="button"
                onClick={handleToggleMask}
                aria-label={isMasked ? 'Reveal phone' : 'Mask phone'}
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 4,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: isMasked ? '#94a3b8' : '#2563eb',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isMasked ? '#94a3b8' : '#2563eb';
                }}
              >
                {isMasked ? <Eye size={11} /> : <EyeOff size={11} />}
              </button>
            </Tooltip>

            {/* Symbol Switch Button (* or •) when masked */}
            {isMasked && (
              <Tooltip
                content={`Switch mask symbol to ${activeSymbol === '*' ? 'dot (•)' : 'star (*)'}`}
                side="top"
                delayDuration={50}
              >
                <button
                  type="button"
                  onClick={handleToggleSymbol}
                  aria-label="Switch mask symbol"
                  style={{
                    height: 15,
                    padding: '0 4px',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    fontSize: 9.5,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    lineHeight: 1,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e2e8f0';
                    e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.color = '#64748b';
                  }}
                >
                  {activeSymbol === '*' ? '★' : '●'}
                </button>
              </Tooltip>
            )}

            {/* Quick Copy Button */}
            <Tooltip
              content={copied ? 'Copied to clipboard!' : 'Copy full phone number'}
              side="top"
              delayDuration={50}
            >
              <button
                type="button"
                onClick={handleCopyPhone}
                aria-label="Copy phone"
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 4,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: copied ? '#10b981' : '#94a3b8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.backgroundColor = '#e2e8f0';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                {copied ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
