import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import { ApiClientError } from '../../api/client';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  id?: string;
  title?: string;
  duration?: number;
  code?: string;
  errors?: Record<string, string[] | string>;
  details?: unknown;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  public subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  public show(type: ToastType, message: string, options: ToastOptions = {}): string {
    const id = options.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const duration = options.duration ?? (type === 'error' ? 6000 : 4000);

    const newToast: ToastItem = {
      ...options,
      id,
      type,
      message,
      createdAt: Date.now(),
      duration,
    };

    // Remove existing toast with the same id if present, then add new one
    this.toasts = [newToast, ...this.toasts.filter((t) => t.id !== id)].slice(0, 5);
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  public success(message: string, options?: ToastOptions): string {
    return this.show('success', message, { title: 'Success', ...options });
  }

  public error(message: string, options?: ToastOptions): string {
    return this.show('error', message, { title: 'Action Failed', ...options });
  }

  public warning(message: string, options?: ToastOptions): string {
    return this.show('warning', message, { title: 'Warning', ...options });
  }

  public info(message: string, options?: ToastOptions): string {
    return this.show('info', message, { title: 'Notice', ...options });
  }

  public dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public clearAll() {
    this.toasts = [];
    this.notify();
  }

  /**
   * Helper that extracts error messages, validation fields, and error codes from API or network errors
   */
  public fromApiError(err: unknown, fallbackMessage: string = 'An unexpected error occurred'): string {
    if (err instanceof ApiClientError) {
      const details = err.details as any;
      const errors = details?.errors || (typeof details === 'object' && details ? details : undefined);
      const isValidationError = err.code === 'VALIDATION_ERROR' || Boolean(errors && Object.keys(errors).length > 0);

      return this.error(err.message || fallbackMessage, {
        title: isValidationError ? 'Validation Failed' : 'Request Error',
        code: err.code,
        errors: isValidationError ? errors : undefined,
        details: err.details,
      });
    }

    if (err instanceof Error) {
      return this.error(err.message || fallbackMessage);
    }

    if (typeof err === 'string') {
      return this.error(err);
    }

    return this.error(fallbackMessage);
  }
}

export const toast = new ToastManager();

// Expose on window for easy debug / console access
if (typeof window !== 'undefined') {
  (window as any).toast = toast;
}

export interface ToastContainerProps {
  position?: 'top-right' | 'top-center' | 'bottom-right';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right' }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast.subscribe((updated) => setToasts(updated));
  }, []);

  if (toasts.length === 0) return null;

  const positionStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 999999,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    pointerEvents: 'none',
    maxWidth: 440,
    width: 'calc(100% - 32px)',
    ...(position === 'top-right'
      ? { top: 20, right: 20 }
      : position === 'top-center'
      ? { top: 20, left: '50%', transform: 'translateX(-50%)' }
      : { bottom: 20, right: 20 }),
  };

  return (
    <div style={positionStyles} aria-live="polite">
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => toast.dismiss(item.id)} />
      ))}
    </div>
  );
};

interface ToastCardProps {
  item: ToastItem;
  onDismiss: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ item, onDismiss }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const configByType = {
    success: {
      accentColor: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.95) 100%)',
      borderColor: '#a7f3d0',
      icon: <CheckCircle2 size={18} color="#059669" />,
      iconBg: '#d1fae5',
      badgeBg: '#ecfdf5',
      badgeColor: '#047857',
    },
    error: {
      accentColor: '#ef4444',
      bgGradient: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(254,242,242,0.95) 100%)',
      borderColor: '#fecaca',
      icon: <AlertCircle size={18} color="#dc2626" />,
      iconBg: '#fee2e2',
      badgeBg: '#fef2f2',
      badgeColor: '#b91c1c',
    },
    warning: {
      accentColor: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,251,235,0.95) 100%)',
      borderColor: '#fde68a',
      icon: <AlertTriangle size={18} color="#d97706" />,
      iconBg: '#fef3c7',
      badgeBg: '#fffbeb',
      badgeColor: '#b45309',
    },
    info: {
      accentColor: '#4f46e5',
      bgGradient: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(238,242,255,0.95) 100%)',
      borderColor: '#c7d2fe',
      icon: <Info size={18} color="#4338ca" />,
      iconBg: '#e0e7ff',
      badgeBg: '#eef2ff',
      badgeColor: '#3730a3',
    },
  }[item.type];

  const hasValidationErrors = Boolean(
    item.errors && Object.keys(item.errors).length > 0
  );

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = JSON.stringify(
      {
        message: item.message,
        code: item.code,
        errors: item.errors,
        details: item.details,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        pointerEvents: 'auto',
        position: 'relative',
        background: configByType.bgGradient,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${configByType.borderColor}`,
        borderRadius: 10,
        boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.16), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Accent Strip */}
      <div
        style={{
          height: 3,
          backgroundColor: configByType.accentColor,
          width: '100%',
        }}
      />

      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          {/* Icon Badge */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: configByType.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {configByType.icon}
          </div>

          {/* Text Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                {item.title || (item.type.charAt(0).toUpperCase() + item.type.slice(1))}
              </span>
              {item.code && (
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: '0.4px',
                    padding: '1px 6px',
                    borderRadius: 4,
                    backgroundColor: configByType.badgeBg,
                    color: configByType.badgeColor,
                    border: `1px solid ${configByType.borderColor}`,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.code}
                </span>
              )}
            </div>

            <p style={{ margin: 0, fontSize: 11.5, color: '#334155', lineHeight: 1.45, wordBreak: 'break-word' }}>
              {item.message}
            </p>

            {/* Validation Errors Breakdown */}
            {hasValidationErrors && item.errors ? (
              <div
                style={{
                  marginTop: 8,
                  padding: '8px 10px',
                  backgroundColor: 'rgba(254, 226, 226, 0.5)',
                  border: '1px solid #fecaca',
                  borderRadius: 6,
                  fontSize: 11,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: '#991b1b' }}>Validation details:</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      fontSize: 10,
                      color: '#b91c1c',
                    }}
                    title="Copy error details"
                  >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <ul style={{ margin: 0, paddingLeft: 14, color: '#7f1d1d' }}>
                  {Object.entries(item.errors).map(([field, messages]) => {
                    const msgList = Array.isArray(messages) ? messages : [messages];
                    return (
                      <li key={field} style={{ margin: '2px 0' }}>
                        <strong style={{ textTransform: 'capitalize' }}>{field}:</strong>{' '}
                        <span>{msgList.join(', ')}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {/* Expandable Technical Details */}
            {item.details && !hasValidationErrors ? (
              <div style={{ marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: configByType.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  <span>{expanded ? 'Hide details' : 'View technical details'}</span>
                </button>
                {expanded && (
                  <pre
                    style={{
                      marginTop: 4,
                      padding: 6,
                      backgroundColor: '#0f172a',
                      color: '#f8fafc',
                      borderRadius: 4,
                      fontSize: 9.5,
                      overflowX: 'auto',
                      maxHeight: 120,
                    }}
                  >
                    {JSON.stringify(item.details, null, 2)}
                  </pre>
                )}
              </div>
            ) : null}

            {/* Action button if any */}
            {item.action ? (
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    item.action?.onClick();
                    onDismiss();
                  }}
                  style={{
                    border: 'none',
                    backgroundColor: configByType.accentColor,
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 10.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {item.action.label}
                </button>
              </div>
            ) : null}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 2,
              cursor: 'pointer',
              color: '#94a3b8',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            aria-label="Dismiss toast"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
