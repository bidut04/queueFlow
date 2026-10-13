import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

export interface ResizableHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  isDragging?: boolean;
  title?: string;
  className?: string;
}

export const ResizableHandle: React.FC<ResizableHandleProps> = ({
  onMouseDown,
  onDoubleClick,
  isDragging = false,
  title = 'Drag to resize sidebar • Double-click to toggle collapse',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      role="separator"
      tabIndex={0}
      title={title}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`qf-resizable-handle ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        right: -3,
        width: 8,
        height: '100%',
        cursor: 'col-resize',
        zIndex: 55,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* Background track line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: isHovered || isDragging ? 3 : 1,
          backgroundColor: isDragging ? '#3b82f6' : isHovered ? '#60a5fa' : 'transparent',
          borderRadius: 2,
          transition: 'all 0.15s ease'
        }}
      />

      {/* Center Grip pill */}
      {(isHovered || isDragging) && (
        <div
          style={{
            zIndex: 2,
            width: 14,
            height: 28,
            borderRadius: 6,
            backgroundColor: isDragging ? '#2563eb' : '#1e293b',
            border: `1px solid ${isDragging ? '#60a5fa' : '#334155'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.15s ease'
          }}
        >
          <GripVertical size={10} color="#cbd5e1" />
        </div>
      )}
    </div>
  );
};
