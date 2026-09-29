import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ManageBannerProps {
  onGoToSettings?: () => void;
}

export const ManageBanner: React.FC<ManageBannerProps> = ({ onGoToSettings }) => {
  return (
    <div className="relative overflow-hidden p-3.5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-xs flex flex-col justify-between min-h-[135px]">
      <div className="max-w-[70%] z-10">
        <h3 className="text-sm font-extrabold text-blue-950 leading-snug">
          Manage Your Branches & Queue Easily
        </h3>
        <p className="text-[11px] text-blue-600 mt-1 leading-normal font-medium">
          Control and scale your queue system from one powerful dashboard.
        </p>
      </div>

      <div className="mt-3 z-10">
        <Button variant="primary" size="sm" icon={<ArrowRight size={12} />} iconPosition="right" onClick={onGoToSettings}>
          Go to Settings
        </Button>
      </div>

      {/* Decorative Floating Sparkle Graphic */}
     
    </div>
  );
};
