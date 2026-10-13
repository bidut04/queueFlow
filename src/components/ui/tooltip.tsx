import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  className?: string;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'right',
  delayDuration = 80,
  className = '',
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    transform: string;
    arrowSide: 'top' | 'right' | 'bottom' | 'left';
  } | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const offset = 9;
    let top = 0;
    let left = 0;
    let transform = '';

    switch (side) {
      case 'top':
        top = rect.top - offset;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, 0)';
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - offset;
        transform = 'translate(-100%, -50%)';
        break;
      case 'right':
      default:
        top = rect.top + rect.height / 2;
        left = rect.right + offset;
        transform = 'translate(0, -50%)';
        break;
    }

    setCoords({ top, left, transform, arrowSide: side });
  }, [side]);

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  // Close on scroll or resize so it doesn't detach
  useEffect(() => {
    if (!isVisible) return;
    const handleDismiss = () => setIsVisible(false);
    window.addEventListener('scroll', handleDismiss, { capture: true, passive: true });
    window.addEventListener('resize', handleDismiss, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleDismiss, { capture: true });
      window.removeEventListener('resize', handleDismiss);
    };
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (disabled && isVisible) {
      setIsVisible(false);
    }
  }, [disabled, isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className="qf-tooltip-trigger"
        style={{ display: 'inline-flex' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onClick={handleMouseLeave}
      >
        {children}
      </div>

      {isVisible && content && !disabled && coords && typeof document !== 'undefined' &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
              zIndex: 99999,
              pointerEvents: 'none'
            }}
          >
            <div
              className={`qf-shadcn-tooltip ${className}`}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#090d16',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: 7,
                padding: '5px 10px',
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: '0.01em',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.25)',
                whiteSpace: 'nowrap',
                animation: 'qfTooltipEnter 0.14s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                willChange: 'transform, opacity'
              }}
            >
              {/* Arrow pointer */}
              {coords.arrowSide === 'right' && (
                <div
                  style={{
                    position: 'absolute',
                    left: -4,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(45deg)',
                    width: 7,
                    height: 7,
                    backgroundColor: '#090d16',
                    borderLeft: '1px solid #334155',
                    borderBottom: '1px solid #334155'
                  }}
                />
              )}
              {coords.arrowSide === 'left' && (
                <div
                  style={{
                    position: 'absolute',
                    right: -4,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(45deg)',
                    width: 7,
                    height: 7,
                    backgroundColor: '#090d16',
                    borderRight: '1px solid #334155',
                    borderTop: '1px solid #334155'
                  }}
                />
              )}
              {coords.arrowSide === 'top' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: 7,
                    height: 7,
                    backgroundColor: '#090d16',
                    borderRight: '1px solid #334155',
                    borderBottom: '1px solid #334155'
                  }}
                />
              )}
              {coords.arrowSide === 'bottom' && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: 7,
                    height: 7,
                    backgroundColor: '#090d16',
                    borderLeft: '1px solid #334155',
                    borderTop: '1px solid #334155'
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{content}</span>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
